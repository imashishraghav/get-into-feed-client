<?php

namespace Database\Seeders;

use App\Models\Award;
use Illuminate\Database\Seeder;

class AwardSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/awards.json');
        if (! file_exists($jsonPath)) {
            $jsonPath = base_path('../api/data/awards.json');
        }

        if (file_exists($jsonPath)) {
            $awards = json_decode(file_get_contents($jsonPath), true);
        } else {
            $awards = [];
        }

        foreach ($awards as $index => $a) {
            Award::updateOrCreate(
                ['title' => $a['title']],
                [
                    'organization' => $a['org'] ?? ($a['organization'] ?? 'Agency Honors'),
                    'year' => (string) ($a['year'] ?? '2025'),
                    'category' => $a['category'] ?? 'Growth Excellence',
                    'description' => $a['desc'] ?? ($a['description'] ?? ''),
                    'sort_order' => $index + 1,
                    'status' => 'published',
                ]
            );
        }
    }
}
