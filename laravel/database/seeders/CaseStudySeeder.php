<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\Media;
use Illuminate\Database\Seeder;

class CaseStudySeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/case_studies.json');
        if (! file_exists($jsonPath)) {
            $jsonPath = base_path('../api/data/case_studies.json');
        }

        if (file_exists($jsonPath)) {
            $items = json_decode(file_get_contents($jsonPath), true);
        } else {
            $items = [];
        }

        $defaultMedia = Media::where('file_name', 'cs-urbanthreads.jpg')->first()?->id;

        foreach ($items as $index => $item) {
            $statsArray = [];
            if (! empty($item['stats']) && is_array($item['stats'])) {
                foreach ($item['stats'] as $st) {
                    $statsArray[] = [
                        'label' => $st['label'] ?? 'Metric',
                        'value' => $st['val'] ?? $st['value'] ?? '',
                    ];
                }
            } elseif (! empty($item['metric'])) {
                $statsArray[] = [
                    'label' => $item['result'] ?? 'Performance Metric',
                    'value' => $item['metric'],
                ];
            }

            CaseStudy::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'client_name' => $item['brand'] ?? $item['client'] ?? $item['client_name'] ?? 'Enterprise Partner',
                    'project_name' => $item['title'] ?? 'Growth Transformation',
                    'category' => $item['category'] ?? 'Growth Sprints',
                    'sub_tag' => $item['subTag'] ?? 'Performance Marketing',
                    'filter_categories' => $item['filterCategories'] ?? [$item['category'] ?? 'Growth'],
                    'year' => (string) ($item['year'] ?? '2025'),
                    'headline_prefix' => $item['headlinePrefix'] ?? 'Scaling with ',
                    'headline_highlight' => $item['headlineHighlight'] ?? ($item['metric'] ?? 'High ROAS'),
                    'headline_suffix' => $item['headlineSuffix'] ?? ' in Record Time.',
                    'hero_description' => $item['heroDescription'] ?? ($item['title'] ?? ''),
                    'hero_media_id' => $defaultMedia,
                    'challenge' => is_array($item['challenge'] ?? null) ? json_encode($item['challenge']) : ($item['challenge'] ?? 'Scaling sustainably with strict CAC constraints.'),
                    'strategy' => is_array($item['strategy'] ?? null) ? json_encode($item['strategy']) : ($item['strategy'] ?? 'Deploying full-funnel algorithmic media and high-retention creative testing.'),
                    'results_metrics' => $statsArray,
                    'sort_order' => $index + 1,
                    'status' => 'published',
                ]
            );
        }
    }
}
