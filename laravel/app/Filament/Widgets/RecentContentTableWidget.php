<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Service;
use Filament\Widgets\Widget;

class RecentContentTableWidget extends Widget
{
    protected static string $view = 'filament.widgets.recent-content-table';

    protected static bool $isLazy = false;

    protected static ?int $sort = -5;

    protected int|string|array $columnSpan = 'full';

    public static function canView(): bool
    {
        return true;
    }

    public function getRecentItems(): array
    {
        $services = Service::latest('updated_at')->take(4)->get()->map(function ($s) {
            return [
                'title' => $s->name,
                'type' => 'Service',
                'type_badge' => 'bg-slate-100 text-slate-700 border-slate-200',
                'status' => $s->status ?: 'draft',
                'updated' => $s->updated_at?->format('d M Y') ?? 'Recently',
                'timestamp' => $s->updated_at?->timestamp ?? 0,
                'author' => 'Ashish',
                'edit_url' => "/admin/services/{$s->id}/edit",
            ];
        });

        $cases = CaseStudy::latest('updated_at')->take(4)->get()->map(function ($c) {
            return [
                'title' => $c->client_name.' — '.$c->project_name,
                'type' => 'Case Study',
                'type_badge' => 'bg-slate-100 text-slate-700 border-slate-200',
                'status' => $c->status ?: 'draft',
                'updated' => $c->updated_at?->format('d M Y') ?? 'Recently',
                'timestamp' => $c->updated_at?->timestamp ?? 0,
                'author' => 'Ashish',
                'edit_url' => "/admin/case-studies/{$c->id}/edit",
            ];
        });

        $blogs = BlogPost::latest('updated_at')->take(4)->get()->map(function ($b) {
            return [
                'title' => $b->title,
                'type' => 'Blog Post',
                'type_badge' => 'bg-slate-100 text-slate-700 border-slate-200',
                'status' => $b->status ?: 'draft',
                'updated' => $b->updated_at?->format('d M Y') ?? 'Recently',
                'timestamp' => $b->updated_at?->timestamp ?? 0,
                'author' => $b->author_name ?: 'Ashish',
                'edit_url' => "/admin/blog-posts/{$b->id}/edit",
            ];
        });

        $pages = Page::latest('updated_at')->take(4)->get()->map(function ($p) {
            return [
                'title' => $p->title,
                'type' => 'Page',
                'type_badge' => 'bg-slate-100 text-slate-700 border-slate-200',
                'status' => $p->status ?: 'draft',
                'updated' => $p->updated_at?->format('d M Y') ?? 'Recently',
                'timestamp' => $p->updated_at?->timestamp ?? 0,
                'author' => 'Ashish',
                'edit_url' => "/admin/pages/{$p->id}/edit",
            ];
        });

        $all = $services->concat($cases)->concat($blogs)->concat($pages)->sortByDesc('timestamp')->take(6)->values()->all();

        return $all;
    }
}
