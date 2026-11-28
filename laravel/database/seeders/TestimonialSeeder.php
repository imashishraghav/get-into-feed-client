<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/reviews.json');
        if (! file_exists($jsonPath)) {
            $jsonPath = base_path('../api/data/reviews.json');
        }

        if (file_exists($jsonPath)) {
            $reviews = json_decode(file_get_contents($jsonPath), true);
        } else {
            $reviews = [];
        }

        foreach ($reviews as $index => $r) {
            Testimonial::updateOrCreate(
                ['client_name' => $r['name']],
                [
                    'client_role' => $r['role'] ?? 'Founder',
                    'company' => $r['company'] ?? 'Verified Client',
                    'quote' => $r['quote'],
                    'rating' => $r['rating'] ?? 5,
                    'service_tag' => $r['service'] ?? 'Growth Sprints',
                    'result_metric' => '+300% ROI',
                    'sort_order' => $index + 1,
                    'status' => 'published',
                ]
            );
        }
    }
}
