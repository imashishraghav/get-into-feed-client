<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/faqs.json');
        if (! file_exists($jsonPath)) {
            $jsonPath = base_path('../api/data/faqs.json');
        }

        if (file_exists($jsonPath)) {
            $faqs = json_decode(file_get_contents($jsonPath), true);
        } else {
            $faqs = [];
        }

        foreach ($faqs as $index => $f) {
            Faq::updateOrCreate(
                ['question' => $f['q'] ?? $f['question']],
                [
                    'category' => $f['category'] ?? 'General',
                    'answer' => $f['a'] ?? $f['answer'],
                    'sort_order' => $index + 1,
                    'status' => 'published',
                ]
            );
        }
    }
}
