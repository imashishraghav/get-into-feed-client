<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/team.json');
        if (! file_exists($jsonPath)) {
            $jsonPath = base_path('../api/data/team.json');
        }

        if (file_exists($jsonPath)) {
            $members = json_decode(file_get_contents($jsonPath), true);
        } else {
            $members = [];
        }

        foreach ($members as $index => $m) {
            $avatarMedia = Media::where('title', $m['name'])->first()?->id;

            TeamMember::updateOrCreate(
                ['name' => $m['name']],
                [
                    'role' => $m['role'],
                    'bio' => $m['bio'] ?? '',
                    'expertise' => $m['expertise'] ?? [],
                    'avatar_media_id' => $avatarMedia,
                    'linkedin_url' => $m['linkedin'] ?? 'https://linkedin.com',
                    'sort_order' => $index + 1,
                    'status' => 'published',
                ]
            );
        }
    }
}
