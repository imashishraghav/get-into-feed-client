<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Faq;
use App\Models\Service;
use App\Models\Setting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BootstrapController extends Controller
{
    /**
     * Consolidated Bootstrap Endpoint
     * Replaces 8 individual simultaneous HTTP requests on initial hydration
     * with a single, high-performance cached payload.
     */
    public function index(Request $request): JsonResponse
    {
        // 5-minute cache TTL with instant fallback
        $data = Cache::remember('api_v1_bootstrap_data', 300, function () {
            // 1. Services
            $services = Service::with(['heroMedia', 'seo'])
                ->where('status', 'published')
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'name' => $s->name,
                        'title' => $s->name,
                        'slug' => $s->slug,
                        'category' => $s->category,
                        'short_description' => $s->short_description,
                        'shortDesc' => $s->short_description,
                        'hero_badge' => $s->hero_badge,
                        'hero_metric' => $s->hero_metric,
                        'hero_image' => $s->heroMedia?->url,
                    ];
                });

            // 2. Projects & Case Studies
            $projects = CaseStudy::with(['heroMedia', 'testimonial', 'services', 'seo'])
                ->where('status', 'published')
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'client_name' => $c->client_name,
                        'brand' => $c->client_name,
                        'project_name' => $c->project_name,
                        'title' => $c->project_name,
                        'slug' => $c->slug,
                        'category' => $c->category,
                        'sub_tag' => $c->sub_tag,
                        'subTag' => $c->sub_tag,
                        'year' => $c->year,
                        'hero_image' => $c->heroMedia?->url,
                        'heroImage' => $c->heroMedia?->url,
                    ];
                });

            // 3. Blog Posts
            $posts = BlogPost::with(['featuredMedia', 'author'])
                ->publiclyListed()
                ->orderBy('published_at', 'desc')
                ->take(12)
                ->get()
                ->map(function ($b) {
                    return [
                        'id' => $b->id,
                        'title' => $b->title,
                        'slug' => $b->slug,
                        'excerpt' => $b->excerpt,
                        'image' => $b->featuredMedia?->url ?: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
                        'cover_image' => $b->featuredMedia?->url ?: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
                        'author' => $b->author_name,
                        'authorRole' => $b->author_role,
                        'category' => $b->category,
                        'tags' => $b->tags ?? [],
                        'readTime' => $b->read_time,
                        'date' => $b->published_at ? $b->published_at->format('M d, Y') : 'Recent',
                        'published_at' => $b->published_at?->toIso8601String(),
                        'is_featured' => $b->is_featured,
                    ];
                });

            // 4. Public Settings
            $settings = Setting::allAsDictionary();

            // 5. Testimonials & Reviews
            $testimonials = Testimonial::with('avatar')
                ->where('status', 'published')
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($t) {
                    return [
                        'id' => $t->id,
                        'name' => $t->client_name,
                        'client_name' => $t->client_name,
                        'role' => $t->client_role,
                        'client_role' => $t->client_role,
                        'company' => $t->company,
                        'quote' => $t->quote,
                        'rating' => $t->rating,
                        'service' => $t->service_tag,
                        'result_metric' => $t->result_metric,
                        'avatar' => $t->avatar?->url ?: '',
                    ];
                });

            // 6. Team Members
            $team = TeamMember::with('avatar')
                ->where('status', 'published')
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'name' => $m->name,
                        'role' => $m->role,
                        'bio' => $m->bio,
                        'expertise' => $m->expertise ?? [],
                        'image' => $m->avatar?->url ?: '',
                        'linkedin' => $m->linkedin_url,
                        'twitter' => $m->twitter_url,
                    ];
                });

            // 7. Awards
            $awards = Award::with('badge')
                ->where('status', 'published')
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'title' => $a->title,
                        'org' => $a->organization,
                        'organization' => $a->organization,
                        'year' => $a->year,
                        'category' => $a->category,
                        'description' => $a->description,
                        'badge_url' => $a->badge?->url ?: '',
                    ];
                });

            // 8. FAQs
            $faqs = Faq::where('status', 'published')
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($f) {
                    return [
                        'id' => $f->id,
                        'category' => $f->category,
                        'question' => $f->question,
                        'q' => $f->question,
                        'answer' => $f->answer,
                        'a' => $f->answer,
                    ];
                });

            return [
                'success' => true,
                'services' => $services,
                'projects' => $projects,
                'case_studies' => $projects,
                'posts' => $posts,
                'settings' => $settings,
                'testimonials' => $testimonials,
                'reviews' => $testimonials,
                'team' => $team,
                'awards' => $awards,
                'faqs' => $faqs,
                'timestamp' => now()->timestamp,
            ];
        });

        return response()->json($data);
    }
}
