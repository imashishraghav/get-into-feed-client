<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CaseStudyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CaseStudy::with(['heroMedia', 'testimonial', 'services', 'seo'])
            ->where('status', 'published')
            ->orderBy('sort_order', 'asc');

        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }

        $items = $query->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'client_name' => $c->client_name,
                'brand' => $c->client_name, // Compatibility alias
                'project_name' => $c->project_name,
                'title' => $c->project_name, // Compatibility alias
                'slug' => $c->slug,
                'category' => $c->category,
                'sub_tag' => $c->sub_tag,
                'subTag' => $c->sub_tag, // Compatibility alias
                'filter_categories' => $c->filter_categories ?? [],
                'filterCategories' => $c->filter_categories ?? [], // Compatibility alias
                'year' => $c->year,
                'headline_prefix' => $c->headline_prefix,
                'headlinePrefix' => $c->headline_prefix, // Compatibility alias
                'headline_highlight' => $c->headline_highlight,
                'headlineHighlight' => $c->headline_highlight, // Compatibility alias
                'headline_suffix' => $c->headline_suffix,
                'headlineSuffix' => $c->headline_suffix, // Compatibility alias
                'hero_description' => $c->hero_description,
                'heroDescription' => $c->hero_description, // Compatibility alias
                'editor_mode' => $c->editor_mode ?? 'classic',
                'content' => $c->content,
                'content_blocks' => $c->content_blocks,
                'hero_image' => $c->heroMedia?->url,
                'heroImage' => $c->heroMedia?->url, // Compatibility alias
                'challenge' => $c->challenge,
                'challenge_paragraphs' => $c->challenge_paragraphs ?? [],
                'challengeParagraphs' => $c->challenge_paragraphs ?? [], // Compatibility alias
                'obstacles' => $c->obstacles ?? [],
                'strategy_pillars' => $c->strategy_pillars ?? [],
                'results' => $c->results_metrics ?? [],
                'stats' => $c->results_metrics ?? [], // Compatibility alias
                'testimonial' => $c->testimonial,
                'services' => $c->services->pluck('name')->toArray(),
                'sort_order' => $c->sort_order,
                'seo' => $c->seo,
            ];
        });

        return response()->json([
            'success' => true,
            'count' => $items->count(),
            'projects' => $items,     // Legacy API compatibility key
            'case_studies' => $items, // Canonical REST key
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $c = CaseStudy::with(['heroMedia', 'testimonial', 'services', 'seo'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (! $c) {
            return response()->json([
                'success' => false,
                'error' => 'Case study not found',
            ], 404);
        }

        $data = [
            'id' => $c->id,
            'client_name' => $c->client_name,
            'brand' => $c->client_name,
            'project_name' => $c->project_name,
            'title' => $c->project_name,
            'slug' => $c->slug,
            'category' => $c->category,
            'sub_tag' => $c->sub_tag,
            'subTag' => $c->sub_tag,
            'filter_categories' => $c->filter_categories ?? [],
            'filterCategories' => $c->filter_categories ?? [],
            'year' => $c->year,
            'headline_prefix' => $c->headline_prefix,
            'headlinePrefix' => $c->headline_prefix,
            'headline_highlight' => $c->headline_highlight,
            'headlineHighlight' => $c->headline_highlight,
            'headline_suffix' => $c->headline_suffix,
            'headlineSuffix' => $c->headline_suffix,
            'hero_description' => $c->hero_description,
            'heroDescription' => $c->hero_description,
            'editor_mode' => $c->editor_mode ?? 'classic',
            'content' => $c->content,
            'content_blocks' => $c->content_blocks,
            'hero_image' => $c->heroMedia?->url,
            'heroImage' => $c->heroMedia?->url,
            'challenge' => $c->challenge,
            'challenge_paragraphs' => $c->challenge_paragraphs ?? [],
            'challengeParagraphs' => $c->challenge_paragraphs ?? [],
            'obstacles' => $c->obstacles ?? [],
            'strategy_pillars' => $c->strategy_pillars ?? [],
            'results' => $c->results_metrics ?? [],
            'stats' => $c->results_metrics ?? [],
            'testimonial' => $c->testimonial,
            'services' => $c->services->pluck('name')->toArray(),
            'seo' => $c->seo,
        ];

        return response()->json([
            'success' => true,
            'case_study' => $data,
            'project' => $data, // Legacy alias
        ]);
    }
}
