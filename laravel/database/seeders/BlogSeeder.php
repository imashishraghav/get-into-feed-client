<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Media;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/blog.json');
        if (! file_exists($jsonPath)) {
            $jsonPath = base_path('../api/data/blog.json');
        }

        if (file_exists($jsonPath)) {
            $posts = json_decode(file_get_contents($jsonPath), true);
        } else {
            $posts = [];
        }

        foreach ($posts as $post) {
            $mediaId = null;
            if (! empty($post['image'])) {
                $media = Media::firstOrCreate(
                    ['file_path' => $post['image']],
                    [
                        'file_name' => basename($post['image']),
                        'disk' => 'public',
                        'file_size' => 102400,
                        'mime_type' => 'image/jpeg',
                        'alt_text' => $post['title'],
                        'title' => $post['title'],
                    ]
                );
                $mediaId = $media->id;
            }

            BlogPost::updateOrCreate(
                ['slug' => $post['slug']],
                [
                    'title' => $post['title'],
                    'excerpt' => $post['excerpt'] ?? '',
                    'featured_media_id' => $mediaId,
                    'author_name' => $post['author'] ?? 'Rahul Desai',
                    'author_role' => $post['authorRole'] ?? 'Head of Growth',
                    'category' => $post['category'] ?? 'Growth Playbook',
                    'tags' => $post['tags'] ?? [$post['category'] ?? 'Growth', 'Performance', 'Marketing'],
                    'content' => $post['content'] ?? '',
                    'read_time' => $post['readTime'] ?? '5 Min Read',
                    'is_featured' => ! empty($post['featured']) || ! empty($post['is_featured']),
                    'status' => 'published',
                    'published_at' => ! empty($post['published_at']) ? $post['published_at'] : now()->subDays(rand(1, 30)),
                ]
            );
        }
    }
}
