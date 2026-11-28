<?php

namespace App\Filament\Pages;

use App\Models\BlogPost;
use App\Models\Setting;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Str;

class BlogTags extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationGroup = 'Content Studio';

    protected static ?string $navigationLabel = 'Tags';

    protected static ?int $navigationSort = 4;

    protected static ?string $slug = 'blog-tags';

    protected static string $view = 'filament.pages.blog-tags';

    protected static ?string $title = 'Tags';

    public string $name = '';

    public string $tagSlug = '';

    public string $description = '';

    public string $search = '';

    public function mount(): void
    {
        $this->ensureDefaultTags();
    }

    public function updatedName($value): void
    {
        if (empty($this->tagSlug)) {
            $this->tagSlug = Str::slug($value);
        }
    }

    protected function getDefaultTags(): array
    {
        return [
            ['name' => 'Growth', 'slug' => 'growth', 'description' => 'Fast-scaling growth loops.'],
            ['name' => 'Performance', 'slug' => 'performance', 'description' => 'Direct response and acquisition marketing.'],
            ['name' => 'Meta Ads', 'slug' => 'meta-ads', 'description' => 'Facebook and Instagram ad campaigns.'],
            ['name' => 'Google Ads', 'slug' => 'google-ads', 'description' => 'Search and Performance Max ads.'],
            ['name' => 'SEO', 'slug' => 'seo', 'description' => 'Search engine ranking and organic traffic.'],
            ['name' => 'AI Search', 'slug' => 'ai-search', 'description' => 'LLM search engines and ChatGPT citations.'],
            ['name' => 'CRO', 'slug' => 'cro', 'description' => 'Conversion rate optimization testing.'],
            ['name' => 'B2B', 'slug' => 'b2b', 'description' => 'Enterprise and B2B growth funnels.'],
            ['name' => 'Analytics', 'slug' => 'analytics', 'description' => 'Data tracking and conversion attribution.'],
        ];
    }

    protected function ensureDefaultTags(): void
    {
        $current = Setting::get('blog_tags_registry', null);
        if ($current === null || ! is_array($current) || count($current) === 0) {
            Setting::set('cms', 'blog_tags_registry', $this->getDefaultTags(), true);
        }
    }

    public function getTags(): array
    {
        $raw = Setting::get('blog_tags_registry', $this->getDefaultTags());
        if (! is_array($raw)) {
            $raw = $this->getDefaultTags();
        }

        // Also merge any tag found in existing blog posts
        $existingInPosts = [];
        $postsWithTags = BlogPost::whereNotNull('tags')->pluck('tags')->toArray();
        foreach ($postsWithTags as $tagList) {
            if (is_array($tagList)) {
                foreach ($tagList as $t) {
                    if (! empty($t) && ! in_array($t, $existingInPosts)) {
                        $existingInPosts[] = $t;
                    }
                }
            }
        }

        $registeredNames = array_map('strtolower', array_column($raw, 'name'));
        foreach ($existingInPosts as $postTag) {
            if (! in_array(strtolower($postTag), $registeredNames)) {
                $raw[] = [
                    'name' => $postTag,
                    'slug' => Str::slug($postTag),
                    'description' => 'Imported from existing blog posts.',
                ];
                $registeredNames[] = strtolower($postTag);
            }
        }

        // Real-time post count for each tag
        foreach ($raw as &$tag) {
            $tag['count'] = BlogPost::whereJsonContains('tags', $tag['name'])->count();
        }
        unset($tag);

        // Filter by search query
        if (! empty(trim($this->search))) {
            $s = strtolower(trim($this->search));
            $raw = array_filter($raw, function ($item) use ($s) {
                return str_contains(strtolower($item['name']), $s) ||
                       str_contains(strtolower($item['slug'] ?? ''), $s) ||
                       str_contains(strtolower($item['description'] ?? ''), $s);
            });
        }

        return array_values($raw);
    }

    public function addTag(): void
    {
        $this->validate([
            'name' => 'required|min:2|max:50',
        ]);

        $name = trim($this->name);
        $slug = ! empty(trim($this->tagSlug)) ? Str::slug($this->tagSlug) : Str::slug($name);
        $description = trim($this->description);

        $raw = Setting::get('blog_tags_registry', $this->getDefaultTags());
        if (! is_array($raw)) {
            $raw = [];
        }

        foreach ($raw as $existing) {
            if (strtolower($existing['name']) === strtolower($name)) {
                Notification::make()
                    ->danger()
                    ->title('Tag already exists')
                    ->body("A tag named '{$name}' is already registered.")
                    ->send();

                return;
            }
        }

        $raw[] = [
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
        ];

        Setting::set('cms', 'blog_tags_registry', array_values($raw), true);

        $this->reset(['name', 'tagSlug', 'description']);

        Notification::make()
            ->success()
            ->title('Tag added')
            ->body("Tag '{$name}' was successfully added.")
            ->send();
    }

    public function deleteTag(string $name): void
    {
        $raw = Setting::get('blog_tags_registry', $this->getDefaultTags());
        if (! is_array($raw)) {
            $raw = [];
        }

        $filtered = array_filter($raw, function ($item) use ($name) {
            return strtolower($item['name']) !== strtolower($name);
        });

        Setting::set('cms', 'blog_tags_registry', array_values($filtered), true);

        Notification::make()
            ->warning()
            ->title('Tag removed')
            ->body("Tag '{$name}' was removed from the registry.")
            ->send();
    }
}
