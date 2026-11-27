<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\MediaFolder;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Media Folders
        $folders = [
            'services' => 'Services',
            'case-studies' => 'Case Studies',
            'blog' => 'Blog & Playbooks',
            'team' => 'Team Members',
            'awards' => 'Awards & Honors',
            'clients' => 'Clients & Logos',
            'testimonials' => 'Testimonial Avatars',
            'general' => 'General Assets',
        ];

        $folderModels = [];
        foreach ($folders as $slug => $name) {
            $folderModels[$slug] = MediaFolder::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name]
            );
        }

        // 2. Initial Media Assets from Audited Data
        $mediaAssets = [
            // Services
            [
                'folder' => 'services',
                'file_name' => 'service-seo.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
                'title' => 'Search Engine Optimization Strategy',
                'alt_text' => 'SEO Analytics and Keyword Ranking Graph',
            ],
            [
                'folder' => 'services',
                'file_name' => 'service-performance-marketing.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
                'title' => 'Performance Marketing Ads Dashboard',
                'alt_text' => 'High ROI Paid Ads and ROAS Analytics',
            ],
            [
                'folder' => 'services',
                'file_name' => 'service-social-media.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1600&auto=format&fit=crop',
                'title' => 'Social Media Brand Marketing',
                'alt_text' => 'Viral Reels and Community Engagement',
            ],
            [
                'folder' => 'services',
                'file_name' => 'service-content-marketing.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop',
                'title' => 'Content Marketing and Copywriting',
                'alt_text' => 'High-conversion editorial copy and articles',
            ],
            [
                'folder' => 'services',
                'file_name' => 'service-web-development.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1600&auto=format&fit=crop',
                'title' => 'High-Speed Web Development',
                'alt_text' => 'Custom React and Next.js frontend code',
            ],

            // Case Studies
            [
                'folder' => 'case-studies',
                'file_name' => 'cs-urbanthreads.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                'title' => 'UrbanThreads Co. Fashion Scaling',
                'alt_text' => 'UrbanThreads D2C eCommerce Fashion Storefront',
            ],
            [
                'folder' => 'case-studies',
                'file_name' => 'cs-skyline.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                'title' => 'Skyline Luxury Residences',
                'alt_text' => 'Skyline Luxury Real Estate Penthouse Architecture',
            ],
            [
                'folder' => 'case-studies',
                'file_name' => 'cs-datasync.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                'title' => 'DataSync B2B SaaS Platform',
                'alt_text' => 'DataSync Enterprise Cloud Analytics Dashboard',
            ],

            // Team Avatars
            [
                'folder' => 'team',
                'file_name' => 'team-sarvesh.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'title' => 'Sarvesh Bagla',
                'alt_text' => 'Sarvesh Bagla, Founder & CEO',
            ],
            [
                'folder' => 'team',
                'file_name' => 'team-ajaz.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                'title' => 'Ajaz Mirza',
                'alt_text' => 'Ajaz Mirza, VP Digital Operations',
            ],
            [
                'folder' => 'team',
                'file_name' => 'team-ananya.jpg',
                'file_path' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                'title' => 'Ananya Sharma',
                'alt_text' => 'Ananya Sharma, VP Client Growth',
            ],
        ];

        foreach ($mediaAssets as $asset) {
            Media::updateOrCreate(
                ['file_name' => $asset['file_name']],
                [
                    'folder_id' => $folderModels[$asset['folder']]->id ?? null,
                    'disk' => 'public',
                    'file_path' => $asset['file_path'],
                    'file_size' => 150000,
                    'mime_type' => 'image/jpeg',
                    'title' => $asset['title'],
                    'alt_text' => $asset['alt_text'],
                ]
            );
        }
    }
}
