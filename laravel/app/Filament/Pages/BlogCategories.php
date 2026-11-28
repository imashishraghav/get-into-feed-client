<?php

namespace App\Filament\Pages;

use App\Models\BlogPost;
use App\Models\Setting;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Str;

class BlogCategories extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-folder';

    protected static ?string $navigationGroup = 'Content Studio';

    protected static ?string $navigationLabel = 'Categories';

    protected static ?int $navigationSort = 3;

    protected static ?string $slug = 'blog-categories';

    protected static string $view = 'filament.pages.blog-categories';

    protected static ?string $title = 'Categories';

    public string $name = '';

    public string $categorySlug = '';

    public string $description = '';

    public string $search = '';

    public function mount(): void
    {
        $this->ensureDefaultCategories();
    }

    public function updatedName($value): void
    {
        if (empty($this->categorySlug)) {
            $this->categorySlug = Str::slug($value);
        }
    }

    protected function getDefaultCategories(): array
    {
        return [
            ['name' => 'Growth Playbook', 'slug' => 'growth-playbook', 'description' => 'Proven growth strategies and frameworks for high-scale founders.'],
            ['name' => 'Paid Performance', 'slug' => 'paid-performance', 'description' => 'Meta Ads, Google Search, and omnichannel performance optimization.'],
            ['name' => 'AI & GEO Search', 'slug' => 'ai-geo-search', 'description' => 'Generative Engine Optimization and AI crawler visibility guides.'],
            ['name' => 'SEO & AI Search', 'slug' => 'seo-ai-search', 'description' => 'Technical search engine optimization and ranking strategies.'],
            ['name' => 'Creative Strategy', 'slug' => 'creative-strategy', 'description' => 'High-converting ad creatives, hooks, and video frameworks.'],
            ['name' => 'Web & CRO', 'slug' => 'web-cro', 'description' => 'Conversion rate optimization, page speed, and landing page designs.'],
            ['name' => 'Brand Positioning', 'slug' => 'brand-positioning', 'description' => 'Category creation, brand messaging, and differentiation.'],
        ];
    }

    protected function ensureDefaultCategories(): void
    {
        $current = Setting::get('blog_categories_registry', null);
        if ($current === null || ! is_array($current) || count($current) === 0) {
            Setting::set('cms', 'blog_categories_registry', $this->getDefaultCategories(), true);
        }
    }

    public function getCategories(): array
    {
        $raw = Setting::get('blog_categories_registry', $this->getDefaultCategories());
        if (! is_array($raw)) {
            $raw = $this->getDefaultCategories();
        }

        // Also merge any category found in existing blog posts not yet registered
        $existingInPosts = BlogPost::query()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category')
            ->toArray();

        $registeredNames = array_map('strtolower', array_column($raw, 'name'));
        foreach ($existingInPosts as $postCat) {
            if (! in_array(strtolower($postCat), $registeredNames)) {
                $raw[] = [
                    'name' => $postCat,
                    'slug' => Str::slug($postCat),
                    'description' => 'Imported from existing blog posts.',
                ];
                $registeredNames[] = strtolower($postCat);
            }
        }

        // Calculate real-time post count for each category
        foreach ($raw as &$cat) {
            $cat['count'] = BlogPost::where('category', $cat['name'])->count();
        }
        unset($cat);

        // Filter by search query if present
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

    public function addCategory(): void
    {
        $this->validate([
            'name' => 'required|min:2|max:100',
        ]);

        $name = trim($this->name);
        $slug = ! empty(trim($this->categorySlug)) ? Str::slug($this->categorySlug) : Str::slug($name);
        $description = trim($this->description);

        $raw = Setting::get('blog_categories_registry', $this->getDefaultCategories());
        if (! is_array($raw)) {
            $raw = [];
        }

        // Check for duplicates
        foreach ($raw as $existing) {
            if (strtolower($existing['name']) === strtolower($name)) {
                Notification::make()
                    ->danger()
                    ->title('Category already exists')
                    ->body("A category named '{$name}' is already registered.")
                    ->send();

                return;
            }
        }

        $raw[] = [
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
        ];

        Setting::set('cms', 'blog_categories_registry', array_values($raw), true);

        $this->reset(['name', 'categorySlug', 'description']);

        Notification::make()
            ->success()
            ->title('Category added')
            ->body("Category '{$name}' was successfully added to your blog.")
            ->send();
    }

    public function deleteCategory(string $name): void
    {
        $raw = Setting::get('blog_categories_registry', $this->getDefaultCategories());
        if (! is_array($raw)) {
            $raw = [];
        }

        $filtered = array_filter($raw, function ($item) use ($name) {
            return strtolower($item['name']) !== strtolower($name);
        });

        Setting::set('cms', 'blog_categories_registry', array_values($filtered), true);

        Notification::make()
            ->warning()
            ->title('Category removed')
            ->body("Category '{$name}' was removed from the registry.")
            ->send();
    }
}
