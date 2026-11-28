<?php

namespace App\Http\Requests\Admin;

use App\Models\Media;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Media::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $alt = $this->input('alt') ?? $this->input('alt_text');
        if (($alt === null || trim((string) $alt) === '') && $this->routeIs('admin.media.quick-upload')) {
            $uploaded = $this->uploadedFile();
            if ($uploaded) {
                $baseName = pathinfo($uploaded->getClientOriginalName(), PATHINFO_FILENAME);
                $alt = ucwords(str_replace(['-', '_'], ' ', $baseName)) ?: 'Media asset';
            }
        }

        if ($alt !== null) {
            $this->merge(['alt' => trim((string) $alt)]);
        }
    }

    public function uploadedFile(): ?UploadedFile
    {
        $file = $this->file('file') ?? $this->file('image');

        return $file instanceof UploadedFile ? $file : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isEditorUpload = $this->routeIs('admin.editor.*');
        $maxKb = $isEditorUpload
            ? (int) config('cms.media.editor_max_kb', 5120)
            : (int) config('cms.media.max_kb', 25600);

        $mimes = $isEditorUpload
            ? 'jpeg,jpg,png,webp,gif'
            : 'jpeg,jpg,png,webp,avif,gif,svg,pdf';

        $fileRules = array_values(array_filter([
            'file',
            $isEditorUpload ? 'image' : null,
            "mimes:{$mimes}",
            "max:{$maxKb}",
        ]));

        return [
            'file' => array_merge(['required_without:image'], $fileRules),
            'image' => array_merge(['required_without:file'], $fileRules),
            'alt' => ['required', 'string', 'min:2', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:1000'],
            'folder_id' => ['nullable', 'integer', 'exists:media_folders,id'],
        ];
    }
}
