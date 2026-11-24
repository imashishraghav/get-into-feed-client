<?php

namespace App\Filament\Resources\BlogPostResource\Pages;

use App\Filament\Resources\BlogPostResource;
use App\Models\AuditLog;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\HtmlString;

class CreateBlogPost extends CreateRecord
{
    protected static string $resource = BlogPostResource::class;

    public function getBreadcrumbs(): array
    {
        return [];
    }

    public function getTitle(): string|Htmlable
    {
        return new HtmlString('
            <span style="font-size: 22px; font-weight: 400; color: #1d2327; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen-Sans, Ubuntu, Cantarell, \'Helvetica Neue\', sans-serif;">Add New Post</span>
        ');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (! auth()->user()?->hasCmsPermission('blog.publish')) {
            $data['status'] = 'draft';
            $data['published_at'] = null;
            $data['scheduled_for'] = null;
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        $seoData = $this->data['seo'] ?? null;
        if (is_array($seoData)) {
            $this->record->seo()->create([
                'seo_title' => $seoData['seo_title'] ?? null,
                'meta_description' => $seoData['meta_description'] ?? null,
                'focus_keyword' => $seoData['focus_keyword'] ?? null,
                'target_keywords' => $seoData['target_keywords'] ?? [],
                'canonical_url' => $seoData['canonical_url'] ?? null,
                'backlinks' => $seoData['backlinks'] ?? [],
                'robots_index' => (bool) ($seoData['robots_index'] ?? true),
                'robots_follow' => (bool) ($seoData['robots_follow'] ?? true),
                'in_sitemap' => (bool) ($seoData['in_sitemap'] ?? true),
                'sitemap_priority' => $seoData['sitemap_priority'] ?? 0.8,
                'sitemap_changefreq' => $seoData['sitemap_changefreq'] ?? 'weekly',
                'og_title' => $seoData['og_title'] ?? null,
                'og_description' => $seoData['og_description'] ?? null,
                'og_media_id' => $seoData['og_media_id'] ?? null,
                'twitter_title' => $seoData['twitter_title'] ?? null,
                'twitter_description' => $seoData['twitter_description'] ?? null,
                'twitter_media_id' => $seoData['twitter_media_id'] ?? null,
                'schema_type' => $seoData['schema_type'] ?? 'Article',
            ]);
        }

        AuditLog::log('CREATE', $this->record, null, $this->record->toArray());
    }
}
