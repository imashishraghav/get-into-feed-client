<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use League\MimeTypeDetection\FinfoMimeTypeDetector;

class MediaService
{
    /**
     * Allowed upload MIME types mapped to safe extensions.
     *
     * @var array<string, array<int, string>>
     */
    private const ALLOWED_MIME_MAP = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
        'image/webp' => ['webp'],
        'image/avif' => ['avif'],
        'image/gif' => ['gif'],
        'image/svg+xml' => ['svg'],
        'application/pdf' => ['pdf'],
    ];

    /**
     * Process, validate, strip EXIF, optimize to WebP, and generate responsive thumbnails.
     *
     * @param  array<string, mixed>  $options
     */
    public function processUpload(UploadedFile $file, array $options = [], ?User $actor = null): Media
    {
        $diskName = (string) ($options['disk'] ?? 'public');
        $directory = trim((string) ($options['directory'] ?? 'media'), '/');
        $maxWidth = (int) ($options['max_width'] ?? 1400);
        $quality = (int) ($options['quality'] ?? config('cms.media.webp_quality', 82));
        $generateVariants = (bool) ($options['variants'] ?? true);
        $preferWebpPrimary = (bool) ($options['prefer_webp_primary'] ?? false);

        $realPath = $file->getRealPath();
        if (! $realPath || ! is_readable($realPath)) {
            throw ValidationException::withMessages(['file' => 'Uploaded file could not be read.']);
        }

        $detectedMime = $this->detectRealMimeType($realPath, $file->getClientOriginalName());
        if (! array_key_exists($detectedMime, self::ALLOWED_MIME_MAP)) {
            throw ValidationException::withMessages([
                'file' => "Unsupported or unsafe file MIME type detected: {$detectedMime}.",
            ]);
        }

        $clientExt = strtolower($file->getClientOriginalExtension());
        if (! in_array($clientExt, self::ALLOWED_MIME_MAP[$detectedMime], true)) {
            throw ValidationException::withMessages([
                'file' => 'File extension does not match verified binary file contents.',
            ]);
        }

        $isRaster = in_array($detectedMime, ['image/jpeg', 'image/png', 'image/webp'], true);
        $disk = Storage::disk($diskName);
        $disk->makeDirectory($directory);

        $originalName = $file->getClientOriginalName();
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeSlug = Str::limit(Str::slug($baseName) ?: 'media-asset', 60, '');
        $uniqueSuffix = Str::lower(Str::random(10));

        $width = null;
        $height = null;
        $exifStrippedAt = null;
        $storedPath = null;
        $storedFileName = null;
        $finalMime = $detectedMime;
        $webpPath = null;
        $optimizedSize = null;
        $variants = [];

        if ($detectedMime === 'image/svg+xml') {
            $svgRaw = file_get_contents($realPath) ?: '';
            $sanitizedSvg = self::sanitizeSvgString($svgRaw);
            $storedFileName = "{$safeSlug}-{$uniqueSuffix}.svg";
            $storedPath = "{$directory}/{$storedFileName}";
            $disk->put($storedPath, $sanitizedSvg);
        } elseif ($isRaster && function_exists('imagecreatefromstring')) {
            $rawBytes = file_get_contents($realPath);
            $gdImage = $rawBytes ? @imagecreatefromstring($rawBytes) : false;

            if ($gdImage === false) {
                throw ValidationException::withMessages(['file' => 'Corrupted or invalid image binary data.']);
            }

            // Fix orientation before GD re-encoding (which drops all EXIF segments completely)
            if ($detectedMime === 'image/jpeg' && function_exists('exif_read_data')) {
                $exif = @exif_read_data($realPath);
                $orientation = is_array($exif) ? (int) ($exif['Orientation'] ?? 1) : 1;
                $gdImage = match ($orientation) {
                    3 => imagerotate($gdImage, 180, 0) ?: $gdImage,
                    6 => imagerotate($gdImage, -90, 0) ?: $gdImage,
                    8 => imagerotate($gdImage, 90, 0) ?: $gdImage,
                    default => $gdImage,
                };
            }

            $origW = imagesx($gdImage);
            $origH = imagesy($gdImage);

            if ($maxWidth > 0 && $origW > $maxWidth) {
                $gdImage = $this->resizeGdImage($gdImage, $maxWidth);
                $width = imagesx($gdImage);
                $height = imagesy($gdImage);
            } else {
                $width = $origW;
                $height = $origH;
            }

            if ($preferWebpPrimary && function_exists('imagewebp')) {
                $storedFileName = "{$safeSlug}-{$uniqueSuffix}.webp";
                $storedPath = "{$directory}/{$storedFileName}";
                $this->writeGdAsWebp($gdImage, $disk->path($storedPath), $quality);
                $finalMime = 'image/webp';
                $webpPath = $storedPath;
                $optimizedSize = filesize($disk->path($storedPath)) ?: null;
            } else {
                $ext = self::ALLOWED_MIME_MAP[$detectedMime][0];
                $storedFileName = "{$safeSlug}-{$uniqueSuffix}.{$ext}";
                $storedPath = "{$directory}/{$storedFileName}";
                $this->writeCleanGdImage($gdImage, $disk->path($storedPath), $detectedMime, $quality);

                if (function_exists('imagewebp')) {
                    $webpDir = 'media/webp';
                    $disk->makeDirectory($webpDir);
                    $webpPath = "{$webpDir}/{$safeSlug}-{$uniqueSuffix}.webp";
                    $this->writeGdAsWebp($gdImage, $disk->path($webpPath), $quality);
                    if (file_exists($disk->path($webpPath))) {
                        $optimizedSize = filesize($disk->path($webpPath)) ?: null;
                    }
                }
            }

            if ($generateVariants && function_exists('imagewebp')) {
                $variants = $this->generateWebpVariants($gdImage, $disk, $directory, $safeSlug, $uniqueSuffix, $quality);
            }

            imagedestroy($gdImage);
            $exifStrippedAt = now();
        } else {
            $storedFileName = "{$safeSlug}-{$uniqueSuffix}.{$clientExt}";
            $storedPath = $file->storeAs($directory, $storedFileName, $diskName);
            $fullPath = $disk->path($storedPath);
            $imgInfo = @getimagesize($fullPath);
            if (is_array($imgInfo)) {
                $width = $imgInfo[0] ?? null;
                $height = $imgInfo[1] ?? null;
            }
        }

        $fullDiskPath = $disk->path($storedPath);
        $size = file_exists($fullDiskPath) ? (int) filesize($fullDiskPath) : (int) $file->getSize();
        $fileHash = file_exists($fullDiskPath) ? hash_file('sha256', $fullDiskPath) : null;

        $altText = trim((string) ($options['alt_text'] ?? ''));
        $title = trim((string) ($options['title'] ?? ucwords(str_replace(['-', '_'], ' ', $baseName))));

        return Media::create([
            'folder_id' => $options['folder_id'] ?? null,
            'disk' => $diskName,
            'file_name' => $storedFileName,
            'file_path' => $storedPath,
            'webp_path' => $webpPath,
            'variants' => $variants !== [] ? $variants : null,
            'file_size' => $size,
            'optimized_size' => $optimizedSize,
            'exif_stripped_at' => $exifStrippedAt,
            'file_hash' => $fileHash,
            'mime_type' => $finalMime,
            'width' => $width,
            'height' => $height,
            'title' => $title,
            'alt_text' => $altText,
            'caption' => $options['caption'] ?? null,
            'description' => $options['description'] ?? null,
            'uploaded_by_user_id' => $actor?->id,
        ]);
    }

    /**
     * Strip EXIF & generate responsive WebP variants for an already-stored Media model.
     */
    public function optimizeStoredMedia(Media $media, int $quality = 82): bool
    {
        if (! function_exists('imagewebp') || ! function_exists('imagecreatefromstring')) {
            return false;
        }

        $disk = Storage::disk($media->disk ?: 'public');
        $rawContent = null;
        $isRemote = str_starts_with($media->file_path, 'http://') || str_starts_with($media->file_path, 'https://');

        if ($isRemote) {
            $ctx = stream_context_create(['http' => ['timeout' => 8]]);
            $rawContent = @file_get_contents($media->file_path, false, $ctx);
        } elseif ($disk->exists($media->file_path)) {
            $rawContent = $disk->get($media->file_path);
        }

        if (! $rawContent) {
            return false;
        }

        $image = @imagecreatefromstring($rawContent);
        if ($image === false) {
            return false;
        }

        $safeSlug = Str::slug(pathinfo($media->file_name, PATHINFO_FILENAME)) ?: 'asset';
        $suffix = Str::lower(Str::random(6));
        $directory = trim(dirname($media->file_path), './');
        if ($directory === '' || $isRemote) {
            $directory = 'media';
        }

        $exifStrippedAt = $media->exif_stripped_at;
        if (! $isRemote && in_array($media->mime_type, ['image/jpeg', 'image/png', 'image/webp'], true)) {
            $this->writeCleanGdImage($image, $disk->path($media->file_path), $media->mime_type, $quality);
            $exifStrippedAt = now();
        }

        $webpDir = 'media/webp';
        $disk->makeDirectory($webpDir);
        $webpPath = "{$webpDir}/{$safeSlug}-{$suffix}.webp";
        $this->writeGdAsWebp($image, $disk->path($webpPath), $quality);

        $variants = $this->generateWebpVariants($image, $disk, $directory, $safeSlug, $suffix, $quality);
        imagedestroy($image);

        if (file_exists($disk->path($webpPath))) {
            $media->update([
                'webp_path' => $webpPath,
                'optimized_size' => filesize($disk->path($webpPath)) ?: null,
                'variants' => $variants !== [] ? $variants : $media->variants,
                'exif_stripped_at' => $exifStrippedAt,
            ]);

            return true;
        }

        return false;
    }

    private function detectRealMimeType(string $path, string $originalName): string
    {
        $detector = new FinfoMimeTypeDetector;
        $detected = $detector->detectMimeTypeFromFile($path);

        // Some minimal SVGs are detected as text/plain or application/xml by finfo
        if (str_ends_with(strtolower($originalName), '.svg') && in_array($detected, ['text/plain', 'text/xml', 'application/xml', 'image/svg+xml'], true)) {
            $snippet = strtolower((string) file_get_contents($path, false, null, 0, 512));
            if (str_contains($snippet, '<svg')) {
                return 'image/svg+xml';
            }
        }

        if (in_array($detected, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) {
            $info = @getimagesize($path);
            if ($info === false || empty($info['mime'])) {
                return 'application/octet-stream';
            }

            return $info['mime'];
        }

        return $detected ?: 'application/octet-stream';
    }

    private function resizeGdImage(\GdImage $source, int $targetWidth): \GdImage
    {
        $origW = imagesx($source);
        $origH = imagesy($source);
        $targetH = max(1, (int) round(($origH * $targetWidth) / max(1, $origW)));

        $canvas = imagecreatetruecolor($targetWidth, $targetH);
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);
        $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
        imagefilledrectangle($canvas, 0, 0, $targetWidth, $targetH, $transparent);
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $targetWidth, $targetH, $origW, $origH);
        imagedestroy($source);

        return $canvas;
    }

    private function writeGdAsWebp(\GdImage $image, string $targetFullPath, int $quality): void
    {
        $dir = dirname($targetFullPath);
        if (! is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        if (function_exists('imagepalettetotruecolor')) {
            @imagepalettetotruecolor($image);
        }
        imagealphablending($image, true);
        imagesavealpha($image, true);
        @imagewebp($image, $targetFullPath, $quality);
    }

    private function writeCleanGdImage(\GdImage $image, string $targetFullPath, string $mime, int $quality): void
    {
        $dir = dirname($targetFullPath);
        if (! is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        match ($mime) {
            'image/jpeg' => @imagejpeg($image, $targetFullPath, $quality),
            'image/png' => @imagepng($image, $targetFullPath, 6),
            'image/webp' => $this->writeGdAsWebp($image, $targetFullPath, $quality),
            default => null,
        };
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function generateWebpVariants(
        \GdImage $source,
        Filesystem $disk,
        string $baseDir,
        string $safeSlug,
        string $suffix,
        int $quality
    ): array {
        $origW = imagesx($source);
        $origH = imagesy($source);
        $widths = config('cms.media.responsive_widths', [400, 800, 1200]);
        $variants = [];

        $variantsDir = trim($baseDir, '/').'/variants';
        $disk->makeDirectory($variantsDir);

        foreach ($widths as $w) {
            $w = (int) $w;
            if ($w <= 0 || $origW <= $w) {
                continue;
            }

            $h = max(1, (int) round(($origH * $w) / max(1, $origW)));
            $copy = imagecreatetruecolor($w, $h);
            imagealphablending($copy, false);
            imagesavealpha($copy, true);
            $transparent = imagecolorallocatealpha($copy, 0, 0, 0, 127);
            imagefilledrectangle($copy, 0, 0, $w, $h, $transparent);
            imagecopyresampled($copy, $source, 0, 0, 0, 0, $w, $h, $origW, $origH);

            $relPath = "{$variantsDir}/{$safeSlug}-{$suffix}-{$w}w.webp";
            $fullPath = $disk->path($relPath);
            $this->writeGdAsWebp($copy, $fullPath, $quality);
            imagedestroy($copy);

            if (file_exists($fullPath)) {
                $variants["{$w}w"] = [
                    'path' => $relPath,
                    'width' => $w,
                    'height' => $h,
                    'size' => (int) filesize($fullPath),
                ];
            }
        }

        return $variants;
    }

    /**
     * Inspect file and extract width, height, mime, and file hash.
     */
    public static function extractMetadata(string $disk, string $filePath): array
    {
        $storage = Storage::disk($disk);
        $meta = [
            'width' => null,
            'height' => null,
            'mime_type' => 'application/octet-stream',
            'file_size' => 0,
            'file_hash' => null,
        ];

        if (! $storage->exists($filePath)) {
            return $meta;
        }

        if (str_ends_with(strtolower($filePath), '.svg')) {
            self::sanitizeSvg($disk, $filePath);
            $meta['mime_type'] = 'image/svg+xml';
        }

        $meta['file_size'] = $storage->size($filePath);
        $meta['mime_type'] = $storage->mimeType($filePath) ?? $meta['mime_type'];

        $fullPath = $storage->path($filePath);
        if (file_exists($fullPath)) {
            $meta['file_hash'] = hash_file('sha256', $fullPath);

            $imgSize = @getimagesize($fullPath);
            if ($imgSize !== false) {
                $meta['width'] = $imgSize[0] ?? null;
                $meta['height'] = $imgSize[1] ?? null;
                if (! empty($imgSize['mime'])) {
                    $meta['mime_type'] = $imgSize['mime'];
                }
            }
        }

        return $meta;
    }

    /**
     * Convert an image asset to WebP format and generate responsive variants via GD.
     */
    public static function convertToWebp(Media $media, int $quality = 82): bool
    {
        return app(self::class)->optimizeStoredMedia($media, $quality);
    }

    /**
     * Check if a hash duplicate exists for this file.
     */
    public static function findDuplicate(string $hash, ?int $excludeId = null): ?Media
    {
        if (empty($hash)) {
            return null;
        }

        $query = Media::where('file_hash', $hash);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->first();
    }

    /**
     * Sanitize SVG file to strip executable scripts, event handlers, and dangerous tags.
     */
    public static function sanitizeSvg(string $disk, string $filePath): bool
    {
        $storage = Storage::disk($disk);
        if (! $storage->exists($filePath)) {
            return false;
        }

        $content = $storage->get($filePath);
        if (! $content) {
            return false;
        }

        $cleaned = self::sanitizeSvgString($content);

        if ($cleaned !== $content) {
            $storage->put($filePath, $cleaned);
            Log::info("SVG file sanitized for security: {$filePath}");

            return true;
        }

        return false;
    }

    /**
     * Deeply sanitize an SVG XML string against all known XSS, XXE, and obfuscation vectors.
     */
    public static function sanitizeSvgString(string $content): string
    {
        $content = preg_replace('#<!DOCTYPE\b[^>]*(\[[^\]]*\])?>#is', '', $content);
        $content = preg_replace('#<!ENTITY\b[^>]*>#is', '', $content);
        $content = preg_replace('#<\?xml-stylesheet\b[^>]*\?>#is', '', $content);

        $previous = '';
        while ($previous !== $content) {
            $previous = $content;

            $content = preg_replace('#<\s*script\b[^>]*>(.*?)<\s*/\s*script\s*>#is', '', $content);
            $content = preg_replace('#<\s*script\b[^>]*/>#is', '', $content);

            $content = preg_replace('#<\s*foreignObject\b[^>]*>(.*?)<\s*/\s*foreignObject\s*>#is', '', $content);
            $content = preg_replace('#<\s*foreignObject\b[^>]*/>#is', '', $content);

            $content = preg_replace('#<\s*(animate|animateTransform|animateMotion|set|handler|listener)\b[^>]*>(.*?)<\s*/\s*\1\s*>#is', '', $content);
            $content = preg_replace('#<\s*(animate|animateTransform|animateMotion|set|handler|listener)\b[^>]*/>#is', '', $content);

            $content = preg_replace('#\s+on[a-zA-Z0-9_-]+\s*=\s*(["\']).*?\1#is', '', $content);
            $content = preg_replace('#\s+on[a-zA-Z0-9_-]+\s*=[^>\s]+#is', '', $content);

            $content = preg_replace_callback('#\b([a-zA-Z0-9_:-]+)\s*=\s*(["\'])(.*?)\2#is', function ($matches) {
                $val = $matches[3];
                $normalized = strtolower(html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                $normalized = preg_replace('/[\x00-\x1F\x7F\s]+/', '', $normalized);

                if (
                    str_starts_with($normalized, 'javascript:') ||
                    str_starts_with($normalized, 'vbscript:') ||
                    str_starts_with($normalized, 'data:text/html') ||
                    str_starts_with($normalized, 'data:text/javascript') ||
                    str_starts_with($normalized, 'data:application/javascript')
                ) {
                    return $matches[1].'=""';
                }

                return $matches[0];
            }, $content);
        }

        return $content;
    }
}
