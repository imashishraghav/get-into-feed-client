<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Faq;
use App\Models\Page;
use App\Models\Service;
use App\Models\Testimonial;
use Filament\Widgets\Widget;

class ContentOverviewMatrixWidget extends Widget
{
    protected static string $view = 'filament.widgets.content-overview-matrix';

    protected static bool $isLazy = false;

    protected static ?int $sort = -5;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 2,
    ];

    public function getContentMatrix(): array
    {
        $types = [
            [
                'name' => 'Services',
                'model' => Service::class,
                'icon' => 'heroicon-o-sparkles',
                'route' => '/admin/services',
            ],
            [
                'name' => 'Case Studies',
                'model' => CaseStudy::class,
                'icon' => 'heroicon-o-presentation-chart-line',
                'route' => '/admin/case-studies',
            ],
            [
                'name' => 'Blog Posts',
                'model' => BlogPost::class,
                'icon' => 'heroicon-o-document-text',
                'route' => '/admin/blog-posts',
            ],
            [
                'name' => 'Pages',
                'model' => Page::class,
                'icon' => 'heroicon-o-rectangle-stack',
                'route' => '/admin/pages',
            ],
            [
                'name' => 'Testimonials',
                'model' => Testimonial::class,
                'icon' => 'heroicon-o-chat-bubble-left-right',
                'route' => '/admin/testimonials',
            ],
            [
                'name' => 'FAQs',
                'model' => Faq::class,
                'icon' => 'heroicon-o-question-mark-circle',
                'route' => '/admin/faqs',
            ],
        ];

        $matrix = [];
        foreach ($types as $t) {
            $model = $t['model'];
            $total = $model::count();
            $published = $model::where('status', 'published')->count();
            $draft = $model::where('status', 'draft')->count();
            $review = $model::where('status', 'review')->count();
            $scheduled = $model::where('status', 'scheduled')->count();

            $matrix[] = [
                'name' => $t['name'],
                'icon' => $t['icon'],
                'route' => $t['route'],
                'total' => $total,
                'published' => $published,
                'draft' => $draft,
                'review' => $review,
                'scheduled' => $scheduled,
            ];
        }

        return $matrix;
    }
}
