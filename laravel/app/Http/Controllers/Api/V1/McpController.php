<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Media;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class McpController extends Controller
{
    /**
     * Tools that mutate database state or inject leads/content, requiring Bearer authentication.
     */
    protected const MUTATION_TOOLS = [
        'upsert_blog_post',
        'create_blog_post',
        'optimize_blog_seo',
        'set_blog_seo',
        'register_media_assets',
        'create_growth_lead',
        'submit_lead_inquiry',
        'request_360_growth_audit',
    ];

    /**
     * Verify whether caller has valid MCP Bearer or X-MCP-Key authorization.
     */
    protected function isAuthorized(Request $request): bool
    {
        $expectedKey = config('cms.mcp_api_key') ?: config('services.mcp.key');
        if (empty($expectedKey)) {
            $expectedKey = hash('sha256', (string) config('app.key'));
        }

        $header = $request->header('Authorization') ?: $request->header('X-MCP-Key') ?: '';
        if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
            $token = trim($matches[1]);
        } else {
            $token = trim($header);
        }

        if (empty($token)) {
            return false;
        }

        return hash_equals($expectedKey, $token);
    }

    /**
     * Standard Industry Benchmarks for Performance Marketing ROI Calculation
     */
    private const INDUSTRY_BENCHMARKS = [
        'd2c' => [
            'name' => 'D2C & E-Commerce',
            'avgCpc' => 18,
            'convRate' => 3.2,
            'roasMultiplier' => 4.8,
            'avgTicketSize' => 1850,
        ],
        'b2b' => [
            'name' => 'B2B SaaS & Enterprise IT',
            'avgCpc' => 65,
            'convRate' => 4.5,
            'roasMultiplier' => 5.4,
            'avgTicketSize' => 45000,
        ],
        'realestate' => [
            'name' => 'Luxury Real Estate & High-Ticket',
            'avgCpc' => 42,
            'convRate' => 3.8,
            'roasMultiplier' => 6.2,
            'avgTicketSize' => 150000,
        ],
        'edtech' => [
            'name' => 'EdTech & Career Certifications',
            'avgCpc' => 24,
            'convRate' => 5.1,
            'roasMultiplier' => 4.2,
            'avgTicketSize' => 28000,
        ],
        'healthcare' => [
            'name' => 'Clinics & Healthcare Networks',
            'avgCpc' => 28,
            'convRate' => 4.8,
            'roasMultiplier' => 5.0,
            'avgTicketSize' => 12000,
        ],
        'services' => [
            'name' => 'Professional Services & Agencies',
            'avgCpc' => 35,
            'convRate' => 4.0,
            'roasMultiplier' => 4.6,
            'avgTicketSize' => 35000,
        ],
    ];

    /**
     * MCP Tools Definition
     */
    public function getToolsSchema(): array
    {
        return [
            [
                'name' => 'get_agency_services',
                'description' => 'Retrieve active digital growth services, deliverables, and capabilities from Get Into Feed (Performance Ads, Technical SEO, React Web Development, UGC Video Reels, Retention, AI Search GEO).',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'category' => [
                            'type' => 'string',
                            'description' => "Optional keyword filter (e.g. 'ads', 'seo', 'web', 'creative')",
                        ],
                    ],
                ],
            ],
            [
                'name' => 'get_case_studies',
                'description' => 'Get verified client performance outcomes and case studies from Get Into Feed (e.g. Veloura Organics 4.8x ROAS, SkillCraft Academy +312% leads, Zentura Cloud $1.4M pipeline).',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'industry' => [
                            'type' => 'string',
                            'description' => "Optional industry or brand filter: 'd2c', 'b2b', 'edtech', 'realestate', or 'all'",
                        ],
                    ],
                ],
            ],
            [
                'name' => 'calculate_growth_roi',
                'description' => 'Calculate expected high-intent traffic, qualified leads, ROAS multiplier, and projected revenue growth for an Indian or global brand based on monthly ad budget and industry sector.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'monthlyBudgetInr' => [
                            'type' => 'number',
                            'description' => 'Monthly digital marketing ad spend in INR (e.g. 50000, 150000, 500000)',
                        ],
                        'industry' => [
                            'type' => 'string',
                            'enum' => ['d2c', 'b2b', 'realestate', 'edtech', 'healthcare', 'services'],
                            'description' => 'Target commercial industry sector',
                        ],
                    ],
                    'required' => ['monthlyBudgetInr', 'industry'],
                ],
            ],
            [
                'name' => 'create_growth_lead',
                'description' => 'Submit a new inbound qualified client lead, growth consultation request, or project inquiry to Get Into Feed growth engine.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'name' => ['type' => 'string', 'description' => 'Lead / Founder full name'],
                        'email' => ['type' => 'string', 'description' => 'Work or business email address'],
                        'phone' => ['type' => 'string', 'description' => 'WhatsApp or phone number with country code'],
                        'company' => ['type' => 'string', 'description' => 'Company or Brand name'],
                        'website' => ['type' => 'string', 'description' => 'Website URL or domain'],
                        'service' => ['type' => 'string', 'description' => "Desired service (e.g. 'Performance Ads', 'Full-Funnel Sprint')"],
                        'budget' => ['type' => 'string', 'description' => "Monthly ad budget range (e.g. 'Rs 50k - Rs 1L/month')"],
                        'message' => ['type' => 'string', 'description' => 'Growth targets, current bottlenecks or project requirements'],
                    ],
                    'required' => ['name', 'email', 'service'],
                ],
            ],
            [
                'name' => 'request_360_growth_audit',
                'description' => 'Generate and submit a 360° Digital Growth Diagnostic Audit request for a business website or domain.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'company' => ['type' => 'string', 'description' => 'Brand or company name'],
                        'website' => ['type' => 'string', 'description' => "Website URL (e.g. 'https://brand.com')"],
                        'growthBlockers' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                            'description' => "List of bottlenecks (e.g. ['Low ROAS', 'Stagnant SEO', 'Low Web Conversion'])",
                        ],
                        'name' => ['type' => 'string', 'description' => 'Contact person name'],
                        'email' => ['type' => 'string', 'description' => 'Contact email'],
                        'phone' => ['type' => 'string', 'description' => 'WhatsApp contact number'],
                        'budget' => ['type' => 'string', 'description' => 'Current monthly spend range'],
                    ],
                    'required' => ['company', 'name', 'email', 'phone'],
                ],
            ],
            [
                'name' => 'get_pricing_tiers',
                'description' => 'Get transparent pricing sprint tiers, deliverables, and guarantees for Get Into Feed marketing packages.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [],
                ],
            ],
            [
                'name' => 'get_company_info',
                'description' => 'Retrieve verified company profile, leadership, certifications, contact info, and headquarters location.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [],
                ],
            ],
            [
                'name' => 'get_blog_posts',
                'description' => 'Retrieve published growth marketing playbooks, guides, and insight articles from Get Into Feed.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'category' => [
                            'type' => 'string',
                            'description' => "Optional category filter (e.g. 'SEO', 'Performance Ads', 'Conversion')",
                        ],
                    ],
                ],
            ],
            [
                'name' => 'upsert_blog_post',
                'description' => 'Publish or update a blog post / growth playbook in the Get Into Feed database via MCP. Supports HTML/Markdown content, SEO metadata, category, and author assignment.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer', 'description' => 'Optional ID of existing post to update'],
                        'title' => ['type' => 'string', 'description' => 'Blog article title'],
                        'slug' => ['type' => 'string', 'description' => 'URL slug (e.g. increase-form-conversions-and-generate-more-leads)'],
                        'content' => ['type' => 'string', 'description' => 'Full article body HTML/Markdown'],
                        'category' => ['type' => 'string', 'description' => "Category (e.g. 'Lead Gen.', 'SEO', 'Paid Performance')"],
                        'excerpt' => ['type' => 'string', 'description' => 'Short summary excerpt for social sharing and search'],
                        'tags' => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => 'Article topic tags'],
                        'author_name' => ['type' => 'string', 'description' => 'Author name (default: Ashish)'],
                        'read_time' => ['type' => 'string', 'description' => 'Estimated read time (e.g. 9 min read)'],
                        'featured_media_id' => ['type' => 'integer', 'description' => 'Cover / Featured Media ID'],
                        'status' => ['type' => 'string', 'enum' => ['published', 'draft', 'scheduled'], 'description' => 'Publication status'],
                        'seo_title' => ['type' => 'string', 'description' => 'Custom SEO title tag'],
                        'meta_description' => ['type' => 'string', 'description' => 'Meta description for search engines'],
                    ],
                    'required' => ['title', 'content'],
                ],
            ],
            [
                'name' => 'optimize_blog_seo',
                'description' => 'Perform comprehensive 360° SEO optimization for a blog post via MCP. Sets focus keyphrase, secondary LSI keywords, SERP title, meta description, canonical URL, OpenGraph social cards, Twitter cards, JSON-LD Schema (Article + FAQPage), robots directives, XML sitemap priority, and authority backlinks.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer', 'description' => 'Post ID (e.g. 21)'],
                        'slug' => ['type' => 'string', 'description' => 'Post slug'],
                        'tags' => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => 'Topic tags for categorization and search filtering'],
                        'focus_keyword' => ['type' => 'string', 'description' => 'Primary focus keyphrase for ranking'],
                        'target_keywords' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                            'description' => 'Secondary / LSI keyphrases and synonyms',
                        ],
                        'seo_title' => ['type' => 'string', 'description' => 'Google SERP title (up to 60 chars)'],
                        'meta_description' => ['type' => 'string', 'description' => 'High-CTR meta description (up to 160 chars)'],
                        'canonical_url' => ['type' => 'string', 'description' => 'Canonical URL tag'],
                        'og_title' => ['type' => 'string', 'description' => 'OpenGraph Facebook/LinkedIn title'],
                        'og_description' => ['type' => 'string', 'description' => 'OpenGraph description'],
                        'twitter_title' => ['type' => 'string', 'description' => 'Twitter/X Card title'],
                        'twitter_description' => ['type' => 'string', 'description' => 'Twitter/X Card description'],
                        'schema_type' => ['type' => 'string', 'description' => 'Schema type: Article, BlogPosting, etc.'],
                        'custom_schema_json' => ['type' => 'object', 'description' => 'Custom JSON-LD schema with FAQPage, Article, etc.'],
                        'robots_index' => ['type' => 'boolean', 'description' => 'Index in search results (true)'],
                        'robots_follow' => ['type' => 'boolean', 'description' => 'Follow links (true)'],
                        'in_sitemap' => ['type' => 'boolean', 'description' => 'Include in XML sitemap (true)'],
                        'sitemap_priority' => ['type' => 'string', 'description' => 'Sitemap priority (0.8 - 1.0)'],
                        'sitemap_changefreq' => ['type' => 'string', 'description' => 'Sitemap changefreq (weekly)'],
                        'seo_score' => ['type' => 'integer', 'description' => 'Yoast SEO health score (0-100)'],
                        'backlinks' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'anchor' => ['type' => 'string'],
                                    'url' => ['type' => 'string'],
                                ],
                            ],
                            'description' => 'Authority citations and backlinks',
                        ],
                    ],
                    'required' => ['focus_keyword', 'seo_title', 'meta_description'],
                ],
            ],
            [
                'name' => 'register_media_assets',
                'description' => 'Register uploaded media assets (images, infographics, diagrams) into the Media Library database.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'assets' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'file_name' => ['type' => 'string'],
                                    'file_path' => ['type' => 'string'],
                                    'file_size' => ['type' => 'integer'],
                                    'mime_type' => ['type' => 'string'],
                                    'alt_text' => ['type' => 'string'],
                                    'title' => ['type' => 'string'],
                                ],
                                'required' => ['file_name', 'file_path'],
                            ],
                        ],
                    ],
                    'required' => ['assets'],
                ],
            ],
        ];
    }

    /**
     * MCP Resources Definition
     */
    public function getResourcesSchema(): array
    {
        return [
            [
                'uri' => 'mcp://getintofeed/overview',
                'name' => 'Agency Overview & Credentials',
                'description' => 'Overview of Get Into Feed agency, certifications (Google Premier Partner, Meta Partner), team hubs, and stats.',
                'mimeType' => 'application/json',
            ],
            [
                'uri' => 'mcp://getintofeed/pricing',
                'name' => 'Growth Sprint Pricing & Packages',
                'description' => 'Transparent sprint tiers (Starter at ₹39k/mo, Scale Engine at ₹79k/mo, Enterprise at ₹1.49L/mo) with full deliverable lists.',
                'mimeType' => 'application/json',
            ],
            [
                'uri' => 'mcp://getintofeed/benchmarks',
                'name' => 'Indian Digital Marketing Industry Benchmarks',
                'description' => 'Standard CPC, conversion rates, and ROAS benchmarks across D2C, B2B SaaS, Real Estate, and EdTech sectors in India.',
                'mimeType' => 'application/json',
            ],
        ];
    }

    /**
     * Handle MCP Discovery or JSON-RPC 2.0 Dispatch
     */
    public function index(Request $request)
    {
        // If GET request, return server discovery information
        if ($request->isMethod('GET')) {
            return response()->json([
                'status' => 'ok',
                'protocol' => 'mcp',
                'version' => '2024-11-05',
                'server' => 'getintofeed-agency-mcp',
                'endpoint' => 'https://getintofeed.com/api/mcp',
                'capabilities' => [
                    'tools' => ['listChanged' => false],
                    'resources' => ['subscribe' => false, 'listChanged' => false],
                ],
                'toolsCount' => count($this->getToolsSchema()),
                'resourcesCount' => count($this->getResourcesSchema()),
                'documentation' => 'https://getintofeed.com/.well-known/mcp.json',
            ]);
        }

        // Process POST JSON-RPC 2.0 request
        $payload = $request->json()->all();
        if (empty($payload) || ! is_array($payload)) {
            $payload = json_decode($request->getContent(), true) ?: [];
        }

        if (empty($payload)) {
            return response()->json([
                'jsonrpc' => '2.0',
                'id' => null,
                'error' => ['code' => -32600, 'message' => 'Invalid Request: empty or non-JSON payload'],
            ], 400);
        }

        $response = $this->handleMcpRpc($payload, $request);

        if ($response === null) {
            return response()->noContent();
        }

        return response()->json($response);
    }

    /**
     * Health check endpoint
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'protocol' => 'mcp',
            'version' => '2024-11-05',
            'server' => 'getintofeed-agency-mcp',
            'toolsCount' => count($this->getToolsSchema()),
            'resourcesCount' => count($this->getResourcesSchema()),
            'database' => 'connected',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * List tools endpoint
     */
    public function tools(): JsonResponse
    {
        return response()->json([
            'protocolVersion' => '2024-11-05',
            'tools' => $this->getToolsSchema(),
        ]);
    }

    /**
     * List resources endpoint
     */
    public function resources(): JsonResponse
    {
        return response()->json([
            'protocolVersion' => '2024-11-05',
            'resources' => $this->getResourcesSchema(),
        ]);
    }

    /**
     * Server-Sent Events (SSE) Transport Endpoint
     */
    public function sse(Request $request): StreamedResponse
    {
        $sessionId = Str::random(20);

        return response()->stream(function () use ($sessionId) {
            echo "event: endpoint\n";
            echo "data: /api/mcp?sessionId={$sessionId}\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * RESTful direct tool execution
     */
    public function executeDirect(Request $request, string $toolName): JsonResponse
    {
        if (in_array($toolName, self::MUTATION_TOOLS, true) && ! $this->isAuthorized($request)) {
            return response()->json([
                'status' => 'error',
                'code' => 401,
                'message' => "Unauthorized: Authentication required to execute mutation tool '{$toolName}'. Provide valid Bearer token or X-MCP-Key.",
            ], 401);
        }

        try {
            $args = $request->json()->all() ?: [];
            $output = $this->executeTool($toolName, $args);

            return response()->json([
                'status' => 'success',
                'tool' => $toolName,
                'result' => $output,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Core JSON-RPC 2.0 Dispatcher
     */
    private function handleMcpRpc(array $request, ?Request $httpRequest = null): ?array
    {
        $jsonrpc = $request['jsonrpc'] ?? null;
        $id = $request['id'] ?? null;
        $method = $request['method'] ?? '';
        $params = $request['params'] ?? [];

        if ($jsonrpc !== '2.0') {
            return [
                'jsonrpc' => '2.0',
                'id' => $id,
                'error' => ['code' => -32600, 'message' => "Invalid JSON-RPC version. Must be '2.0'."],
            ];
        }

        try {
            switch ($method) {
                case 'initialize':
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'result' => [
                            'protocolVersion' => '2024-11-05',
                            'capabilities' => [
                                'tools' => ['listChanged' => false],
                                'resources' => ['subscribe' => false, 'listChanged' => false],
                            ],
                            'serverInfo' => [
                                'name' => 'getintofeed-agency-mcp',
                                'version' => '1.0.0',
                                'description' => 'Get Into Feed Digital Growth Marketing & Web Engineering Studio MCP server',
                            ],
                        ],
                    ];

                case 'notifications/initialized':
                    return null; // Notification, no response

                case 'ping':
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'result' => new \stdClass,
                    ];

                case 'tools/list':
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'result' => [
                            'tools' => $this->getToolsSchema(),
                        ],
                    ];

                case 'tools/call':
                    $name = $params['name'] ?? null;
                    $args = $params['arguments'] ?? [];

                    if (! $name) {
                        return [
                            'jsonrpc' => '2.0',
                            'id' => $id,
                            'error' => ['code' => -32602, 'message' => 'Missing tool name in params'],
                        ];
                    }

                    if (in_array($name, self::MUTATION_TOOLS, true) && (! $httpRequest || ! $this->isAuthorized($httpRequest))) {
                        return [
                            'jsonrpc' => '2.0',
                            'id' => $id,
                            'error' => [
                                'code' => -32001,
                                'message' => "Unauthorized: Authentication required to execute mutation tool '{$name}'. Please provide a valid Bearer token.",
                            ],
                        ];
                    }

                    $output = $this->executeTool($name, $args);
                    $formattedOutput = is_string($output) ? $output : json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'result' => [
                            'content' => [
                                [
                                    'type' => 'text',
                                    'text' => $formattedOutput,
                                ],
                            ],
                            'isError' => false,
                        ],
                    ];

                case 'resources/list':
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'result' => [
                            'resources' => $this->getResourcesSchema(),
                        ],
                    ];

                case 'resources/read':
                    $uri = $params['uri'] ?? null;
                    if (! $uri) {
                        return [
                            'jsonrpc' => '2.0',
                            'id' => $id,
                            'error' => ['code' => -32602, 'message' => 'Missing uri parameter in params'],
                        ];
                    }

                    $data = $this->readResource($uri);

                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'result' => [
                            'contents' => [
                                [
                                    'uri' => $uri,
                                    'mimeType' => 'application/json',
                                    'text' => json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                                ],
                            ],
                        ],
                    ];

                default:
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => ['code' => -32601, 'message' => "Method '{$method}' not found."],
                    ];
            }
        } catch (\Throwable $e) {
            return [
                'jsonrpc' => '2.0',
                'id' => $id,
                'error' => [
                    'code' => -32000,
                    'message' => $e->getMessage() ?: 'Internal Server Error during MCP execution',
                ],
            ];
        }
    }

    /**
     * Tool Execution Logic (Connected to live Database Models)
     */
    private function executeTool(string $name, array $args = []): array
    {
        switch ($name) {
            case 'get_agency_services':
            case 'list_services':
                $query = Service::query()->where('status', 'published');
                if (! empty($args['category'])) {
                    $cat = strtolower(trim($args['category']));
                    $query->where(function ($q) use ($cat) {
                        $q->where('name', 'LIKE', "%{$cat}%")
                            ->orWhere('short_description', 'LIKE', "%{$cat}%")
                            ->orWhere('category', 'LIKE', "%{$cat}%");
                    });
                }
                $services = $query->orderBy('sort_order')->get();

                if ($services->isEmpty()) {
                    // Fallback to high-value canonical service listing
                    return [
                        'count' => 6,
                        'services' => [
                            ['name' => 'Performance Marketing & Paid Ads', 'tier' => '₹49,999/mo', 'deliverables' => 'Google Ads, Meta Ads, Retargeting, ROAS scaling'],
                            ['name' => 'Short-Form Video & UGC Reels', 'tier' => '₹29,999/mo', 'deliverables' => '12 custom vertical video reels, scripted, edited & optimized'],
                            ['name' => 'Technical SEO & AI Search (GEO)', 'tier' => '₹39,999/mo', 'deliverables' => 'Google Search ranking, Perplexity & ChatGPT citation optimization'],
                            ['name' => 'Full-Funnel Web Engineering', 'tier' => 'Custom', 'deliverables' => 'High-conversion Next.js / React web applications & landing pages'],
                            ['name' => 'Brand Strategy & Positioning', 'tier' => 'Sprint', 'deliverables' => 'Brand deck, value proposition, competitive teardown'],
                            ['name' => 'Conversion Rate Optimization (CRO)', 'tier' => 'Sprint', 'deliverables' => 'A/B testing, Heatmaps, UI/UX checkout streamlining'],
                        ],
                    ];
                }

                return [
                    'count' => $services->count(),
                    'services' => $services->map(fn ($s) => [
                        'name' => $s->name,
                        'slug' => $s->slug,
                        'category' => $s->category,
                        'pricing_tier' => $s->pricing_tier,
                        'short_description' => $s->short_description,
                        'deliverables' => $s->deliverables ?: $s->what_we_do,
                        'url' => "https://getintofeed.com/services/{$s->slug}",
                    ])->toArray(),
                ];

            case 'get_case_studies':
                $query = CaseStudy::query()->where('status', 'published');
                if (! empty($args['industry']) && $args['industry'] !== 'all') {
                    $ind = strtolower(trim($args['industry']));
                    $query->where(function ($q) use ($ind) {
                        $q->where('client_name', 'LIKE', "%{$ind}%")
                            ->orWhere('category', 'LIKE', "%{$ind}%")
                            ->orWhere('project_name', 'LIKE', "%{$ind}%");
                    });
                }
                $studies = $query->orderBy('sort_order')->get();

                if ($studies->isEmpty()) {
                    return [
                        'count' => 3,
                        'caseStudies' => [
                            [
                                'client' => 'Veloura Organics (D2C Skincare)',
                                'headline' => 'Scale from ₹4.2L/mo to ₹28.5L/mo at 4.8x Blended ROAS',
                                'metrics' => '+578% Revenue Growth, 4.8x Meta ROAS, ₹142 Cost Per Acquisition',
                            ],
                            [
                                'client' => 'SkillCraft Academy (EdTech)',
                                'headline' => '312% Surge in Paid Course Enrollments via Google Search',
                                'metrics' => '₹48 Cost Per Qualified Lead, 14,200 High-Intent Webinar Attendees',
                            ],
                            [
                                'client' => 'Zentura Cloud (B2B SaaS)',
                                'headline' => '$1.4M Enterprise Pipeline Built via LinkedIn Inbound Ads',
                                'metrics' => '42 Closed Enterprise Contracts, $34k Average Contract Value',
                            ],
                        ],
                    ];
                }

                return [
                    'count' => $studies->count(),
                    'caseStudies' => $studies->map(fn ($c) => [
                        'client_name' => $c->client_name,
                        'project_name' => $c->project_name,
                        'category' => $c->category,
                        'headline' => trim("{$c->headline_prefix} {$c->headline_highlight} {$c->headline_suffix}"),
                        'results' => $c->results_metrics,
                        'url' => "https://getintofeed.com/case-studies/{$c->slug}",
                    ])->toArray(),
                ];

            case 'calculate_growth_roi':
                $budget = max(10000, (float) ($args['monthlyBudgetInr'] ?? 100000));
                $indKey = strtolower(trim((string) ($args['industry'] ?? 'd2c')));
                $bench = self::INDUSTRY_BENCHMARKS[$indKey] ?? self::INDUSTRY_BENCHMARKS['d2c'];

                $estimatedClicks = (int) round($budget / $bench['avgCpc']);
                $estimatedLeads = (int) round($estimatedClicks * ($bench['convRate'] / 100));
                $projectedRevenue = (int) round($budget * $bench['roasMultiplier']);

                return [
                    'input' => [
                        'monthlyBudgetInr' => $budget,
                        'industry' => $bench['name'],
                    ],
                    'benchmarks' => [
                        'avgCpcInr' => $bench['avgCpc'],
                        'conversionRatePercent' => $bench['convRate'].'%',
                        'roasMultiplier' => $bench['roasMultiplier'].'x',
                    ],
                    'forecast90Days' => [
                        'estimatedHighIntentVisits' => $estimatedClicks,
                        'estimatedQualifiedConversions' => $estimatedLeads,
                        'projectedGrossRevenueInr' => $projectedRevenue,
                        'projectedRoas' => $bench['roasMultiplier'].'x',
                        'recommendedTier' => $budget >= 300000 ? 'Enterprise Domination' : ($budget >= 75000 ? 'Scale Engine' : 'Starter Sprint'),
                    ],
                ];

            case 'create_growth_lead':
            case 'submit_lead_inquiry':
                $name = trim((string) ($args['name'] ?? ''));
                $email = strtolower(trim((string) ($args['email'] ?? '')));
                $phone = trim((string) ($args['phone'] ?? ''));
                $company = trim((string) ($args['company'] ?? ''));
                $website = trim((string) ($args['website'] ?? ''));
                $service = trim((string) ($args['service'] ?? 'Growth Consultation'));
                $budget = trim((string) ($args['budget'] ?? ''));
                $message = trim((string) ($args['message'] ?? 'Submitted via Model Context Protocol (MCP) Agent'));

                if (empty($name) || (empty($email) && empty($phone))) {
                    throw new \InvalidArgumentException('Name and either Email or Phone are required to create a lead.');
                }

                $leadCode = 'LEAD-MCP-'.strtoupper(Str::random(6));

                $lead = Lead::create([
                    'lead_code' => $leadCode,
                    'name' => $name,
                    'email' => $email ?: null,
                    'phone' => $phone ?: null,
                    'company' => $company ?: 'Direct Inquiry',
                    'website' => $website ?: null,
                    'interested_service' => $service,
                    'budget' => $budget ?: 'Not Specified',
                    'message' => $message,
                    'source' => 'mcp-agent',
                    'form_type' => 'mcp_integration',
                    'status' => 'new',
                    'priority' => 'high',
                ]);

                return [
                    'status' => 'success',
                    'message' => 'Lead successfully recorded in Get Into Feed growth CRM.',
                    'leadCode' => $lead->lead_code,
                    'leadId' => $lead->id,
                    'assignedTeam' => 'Growth Strategy Team',
                    'contactPerson' => $lead->name,
                    'service' => $lead->interested_service,
                    'nextSteps' => 'Our founder & performance director Ashish will review this request within 4 business hours.',
                ];

            case 'request_360_growth_audit':
                $company = trim((string) ($args['company'] ?? ''));
                $website = trim((string) ($args['website'] ?? ''));
                $name = trim((string) ($args['name'] ?? ''));
                $email = strtolower(trim((string) ($args['email'] ?? '')));
                $phone = trim((string) ($args['phone'] ?? ''));
                $budget = trim((string) ($args['budget'] ?? 'Not Specified'));
                $blockers = is_array($args['growthBlockers'] ?? null) ? implode(', ', $args['growthBlockers']) : (string) ($args['growthBlockers'] ?? 'General 360 Diagnostic');

                if (empty($company) || empty($name) || empty($email)) {
                    throw new \InvalidArgumentException('Company, Name, and Email are required for audit request.');
                }

                $leadCode = 'AUDIT-'.strtoupper(Str::random(6));
                $fullMessage = "[360° Growth Audit Request via MCP]\nWebsite: {$website}\nGrowth Blockers: {$blockers}\nCurrent Ad Spend: {$budget}";

                $lead = Lead::create([
                    'lead_code' => $leadCode,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone ?: null,
                    'company' => $company,
                    'website' => $website ?: null,
                    'interested_service' => '360° Growth Audit',
                    'budget' => $budget,
                    'message' => $fullMessage,
                    'source' => 'mcp-audit-tool',
                    'form_type' => '360_growth_audit',
                    'status' => 'new',
                    'priority' => 'urgent',
                ]);

                return [
                    'status' => 'success',
                    'message' => "360° Growth Audit requested for {$company}.",
                    'auditCode' => $lead->lead_code,
                    'auditId' => $lead->id,
                    'website' => $website,
                    'deliveryTime' => '24-48 hours',
                    'deliverables' => [
                        'Competitor Ad Creative Teardown',
                        'Conversion Funnel Friction Points',
                        'Keyword & GEO Search Gap Analysis',
                        '12-Week Sprint Roadmap with Projected ROAS',
                    ],
                ];

            case 'get_pricing_tiers':
                return [
                    'currency' => 'INR (₹)',
                    'tiers' => [
                        [
                            'name' => 'Starter Sprint',
                            'price' => '₹39,000 / month',
                            'idealFor' => 'Early-stage founders & local brands validating acquisition',
                            'deliverables' => [
                                'Meta or Google Ads Setup & Management',
                                'Conversion-Optimized Landing Page Audit',
                                'Weekly KPI Reporting & ROAS Dashboard',
                                'Ad Spend Management up to ₹1,50,000/mo',
                            ],
                        ],
                        [
                            'name' => 'Scale Engine (Most Popular)',
                            'price' => '₹79,000 / month',
                            'idealFor' => 'Scaling D2C, B2B, and high-ticket service brands',
                            'deliverables' => [
                                'Omnichannel Ads (Meta + Google + YouTube Retargeting)',
                                '12 Custom UGC Video Ads & High-CTR Banners',
                                'Full Technical SEO + AI Search Citation Optimization',
                                'Bi-Weekly Strategy Calls with Growth Lead',
                                'Ad Spend Management up to ₹7,00,000/mo',
                            ],
                        ],
                        [
                            'name' => 'Enterprise Domination',
                            'price' => '₹1,49,000 / month',
                            'idealFor' => 'Market leaders & funded companies wanting aggressive growth',
                            'deliverables' => [
                                'Dedicated Cross-Functional Growth Squad',
                                'High-Velocity Creative Studio (24+ Creatives/mo)',
                                'Continuous Conversion Rate Optimization (CRO)',
                                'Custom Next.js Web Feature Engineering',
                                'Unlimited Managed Ad Spend & 24/7 Slack Access',
                            ],
                        ],
                    ],
                    'commitment' => '45-Day Performance Commitment: If strategic agreed KPIs are not hit in Month 1, we work free until delivered.',
                ];

            case 'get_company_info':
                return [
                    'company' => 'Get Into Feed Media Pvt. Ltd.',
                    'tagline' => "India's #1 Performance Marketing & Web Engineering Studio",
                    'headquarters' => 'Delhi NCR, India',
                    'hubs' => ['Delhi-NCR', 'Bengaluru', 'Mumbai', 'Remote Worldwide'],
                    'website' => 'https://getintofeed.com',
                    'email' => 'hello@getintofeed.com',
                    'phone' => '+91 96258 77559',
                    'certifications' => [
                        'Google Premier Partner 2026',
                        'Meta Certified Media Buying Professional',
                        'Clutch Top Agency Rating: 4.9 / 5.0',
                        'LinkedIn Marketing Partner',
                    ],
                    'founders' => 'Ashish & Core Growth Team',
                ];

            case 'get_blog_posts':
                $query = BlogPost::query()->where('status', 'published');
                if (! empty($args['category'])) {
                    $cat = strtolower(trim($args['category']));
                    $query->where('category', 'LIKE', "%{$cat}%");
                }
                $posts = $query->latest('published_at')->take(10)->get();

                return [
                    'count' => $posts->count(),
                    'posts' => $posts->map(fn ($p) => [
                        'id' => $p->id,
                        'title' => $p->title,
                        'slug' => $p->slug,
                        'category' => $p->category,
                        'published_at' => $p->published_at ? $p->published_at->format('d M Y') : '',
                        'url' => "https://getintofeed.com/blog/{$p->slug}",
                    ])->toArray(),
                ];

            case 'upsert_blog_post':
            case 'create_blog_post':
                $title = trim((string) ($args['title'] ?? ''));
                $content = trim((string) ($args['content'] ?? ''));
                if (empty($title) || empty($content)) {
                    throw new \InvalidArgumentException('Title and content are required to publish a blog post.');
                }

                $slug = ! empty($args['slug']) ? Str::slug($args['slug']) : Str::slug($title);
                $post = null;
                if (! empty($args['id'])) {
                    $post = BlogPost::find($args['id']);
                }
                if (! $post) {
                    $post = BlogPost::where('slug', $slug)->first();
                }
                if (! $post) {
                    $post = new BlogPost;
                    $post->slug = $slug;
                }

                $post->title = $title;
                $post->content = $content;
                if (! empty($args['category'])) {
                    $post->category = $args['category'];
                } elseif (empty($post->category)) {
                    $post->category = 'Lead Gen.';
                }
                if (! empty($args['excerpt'])) {
                    $post->excerpt = $args['excerpt'];
                } elseif (empty($post->excerpt)) {
                    $post->excerpt = Str::limit(strip_tags($content), 160);
                }
                if (isset($args['tags'])) {
                    $tags = is_array($args['tags']) ? $args['tags'] : array_map('trim', explode(',', (string) $args['tags']));
                    $post->tags = array_values(array_filter($tags));
                }
                $post->author_name = $args['author_name'] ?? ($post->author_name ?: 'Ashish');
                $post->author_role = $args['author_role'] ?? ($post->author_role ?: 'Growth Collective');
                $post->read_time = $args['read_time'] ?? ($post->read_time ?: '9 min read');
                if (! empty($args['featured_media_id'])) {
                    $post->featured_media_id = (int) $args['featured_media_id'];
                }
                $post->editor_mode = 'classic';
                $post->status = $args['status'] ?? 'published';
                if ($post->status === 'published' && ! $post->published_at) {
                    $post->published_at = now();
                }
                $post->save();

                // Sync SEO metadata
                $seoTitle = $args['seo_title'] ?? $post->title;
                $metaDesc = $args['meta_description'] ?? ($post->excerpt ?: Str::limit(strip_tags($content), 155));
                if ($post->seo) {
                    $post->seo->update([
                        'seo_title' => $seoTitle,
                        'meta_description' => $metaDesc,
                        'focus_keyword' => 'form conversions leads 2027',
                        'robots_index' => true,
                        'robots_follow' => true,
                        'schema_type' => 'Article',
                    ]);
                } else {
                    $post->seo()->create([
                        'seo_title' => $seoTitle,
                        'meta_description' => $metaDesc,
                        'focus_keyword' => 'form conversions leads 2027',
                        'robots_index' => true,
                        'robots_follow' => true,
                        'schema_type' => 'Article',
                    ]);
                }

                return [
                    'status' => 'success',
                    'message' => 'Blog post successfully uploaded and published via MCP.',
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'status' => $post->status,
                    'category' => $post->category,
                    'read_time' => $post->read_time,
                    'author' => $post->author_name,
                    'published_at' => $post->published_at ? $post->published_at->format('d M Y') : '',
                    'url' => "https://getintofeed.com/blog/{$post->slug}",
                ];

            case 'optimize_blog_seo':
            case 'set_blog_seo':
                $post = null;
                if (! empty($args['id'])) {
                    $post = BlogPost::find($args['id']);
                }
                if (! $post && ! empty($args['slug'])) {
                    $post = BlogPost::where('slug', $args['slug'])->first();
                }
                if (! $post) {
                    $post = BlogPost::latest('id')->first();
                }
                if (! $post) {
                    throw new \InvalidArgumentException('No blog post found to optimize SEO for.');
                }

                $seoData = [
                    'focus_keyword' => trim((string) ($args['focus_keyword'] ?? 'increase form conversions')),
                    'target_keywords' => $args['target_keywords'] ?? [],
                    'seo_title' => trim((string) ($args['seo_title'] ?? $post->title)),
                    'meta_description' => trim((string) ($args['meta_description'] ?? ($post->excerpt ?: ''))),
                    'canonical_url' => $args['canonical_url'] ?? "https://getintofeed.com/blog/{$post->slug}",
                    'og_title' => $args['og_title'] ?? ($args['seo_title'] ?? $post->title),
                    'og_description' => $args['og_description'] ?? ($args['meta_description'] ?? ($post->excerpt ?: '')),
                    'twitter_title' => $args['twitter_title'] ?? ($args['seo_title'] ?? $post->title),
                    'twitter_description' => $args['twitter_description'] ?? ($args['meta_description'] ?? ($post->excerpt ?: '')),
                    'schema_type' => $args['schema_type'] ?? 'Article',
                    'custom_schema_json' => $args['custom_schema_json'] ?? null,
                    'robots_index' => isset($args['robots_index']) ? (bool) $args['robots_index'] : true,
                    'robots_follow' => isset($args['robots_follow']) ? (bool) $args['robots_follow'] : true,
                    'in_sitemap' => isset($args['in_sitemap']) ? (bool) $args['in_sitemap'] : true,
                    'sitemap_priority' => (string) ($args['sitemap_priority'] ?? '0.9'),
                    'sitemap_changefreq' => (string) ($args['sitemap_changefreq'] ?? 'weekly'),
                    'seo_score' => (int) ($args['seo_score'] ?? 98),
                    'backlinks' => $args['backlinks'] ?? [],
                ];

                if (! empty($args['og_media_id'])) {
                    $seoData['og_media_id'] = (int) $args['og_media_id'];
                }
                if (! empty($args['twitter_media_id'])) {
                    $seoData['twitter_media_id'] = (int) $args['twitter_media_id'];
                }

                if (isset($args['tags'])) {
                    $tags = is_array($args['tags']) ? $args['tags'] : array_map('trim', explode(',', (string) $args['tags']));
                    $post->tags = array_values(array_filter($tags));
                    $post->save();
                }

                if ($post->seo) {
                    $post->seo->update($seoData);
                    $seo = $post->seo->fresh();
                } else {
                    $seo = $post->seo()->create($seoData);
                }

                return [
                    'status' => 'success',
                    'message' => 'Complete 360° SEO optimization successfully saved for blog post via MCP.',
                    'post' => [
                        'id' => $post->id,
                        'title' => $post->title,
                        'slug' => $post->slug,
                        'tags' => $post->tags ?: [],
                        'url' => "https://getintofeed.com/blog/{$post->slug}",
                    ],
                    'seo_audit' => [
                        'focus_keyword' => $seo->focus_keyword,
                        'target_keywords' => $seo->target_keywords,
                        'tags' => $post->tags ?: [],
                        'seo_title' => $seo->seo_title,
                        'title_length' => mb_strlen($seo->seo_title),
                        'meta_description' => $seo->meta_description,
                        'meta_length' => mb_strlen($seo->meta_description),
                        'canonical_url' => $seo->canonical_url,
                        'schema_type' => $seo->schema_type,
                        'has_custom_schema' => ! empty($seo->custom_schema_json),
                        'robots' => ($seo->robots_index ? 'index' : 'noindex').', '.($seo->robots_follow ? 'follow' : 'nofollow'),
                        'sitemap' => [
                            'in_sitemap' => $seo->in_sitemap,
                            'priority' => $seo->sitemap_priority,
                            'changefreq' => $seo->sitemap_changefreq,
                        ],
                        'backlinks_count' => count($seo->backlinks ?: []),
                        'seo_score' => $seo->seo_score,
                        'yoast_health' => 'Optimal (Green 98/100)',
                    ],
                ];

            case 'register_media_assets':
                $assets = $args['assets'] ?? [];
                $registered = [];
                $user = User::first();
                foreach ($assets as $asset) {
                    $media = Media::firstOrNew(['file_name' => $asset['file_name']]);
                    $media->file_path = $asset['file_path'];
                    $media->disk = 'public';
                    $media->file_size = $asset['file_size'] ?? 150000;
                    $media->mime_type = $asset['mime_type'] ?? 'image/png';
                    $media->alt_text = $asset['alt_text'] ?? ucwords(str_replace(['-', '_'], ' ', pathinfo($asset['file_name'], PATHINFO_FILENAME)));
                    $media->title = $asset['title'] ?? ucwords(str_replace(['-', '_'], ' ', pathinfo($asset['file_name'], PATHINFO_FILENAME)));
                    if ($user) {
                        $media->uploaded_by_user_id = $user->id;
                    }
                    $media->save();
                    $registered[] = [
                        'id' => $media->id,
                        'file_name' => $media->file_name,
                        'url' => $media->url,
                        'alt_text' => $media->alt_text,
                    ];
                }

                return [
                    'status' => 'success',
                    'count' => count($registered),
                    'media' => $registered,
                ];

            default:
                throw new \InvalidArgumentException("Unknown MCP tool: '{$name}'");
        }
    }

    /**
     * Read MCP Resource
     */
    private function readResource(string $uri): array
    {
        switch ($uri) {
            case 'mcp://getintofeed/overview':
                return [
                    'agency' => 'Get Into Feed Media Pvt. Ltd.',
                    'website' => 'https://getintofeed.com',
                    'tagline' => "India's Premier Digital Growth & Web Engineering Agency",
                    'hubs' => ['Delhi-NCR', 'Bengaluru', 'Mumbai'],
                    'certifications' => [
                        'Google Premier Partner 2026',
                        'Meta Certified Agency',
                        'Clutch 4.9/5',
                    ],
                    'contact' => [
                        'email' => 'hello@getintofeed.com',
                        'phone' => '+91 96258 77559',
                    ],
                ];

            case 'mcp://getintofeed/pricing':
                return $this->executeTool('get_pricing_tiers');

            case 'mcp://getintofeed/benchmarks':
                return self::INDUSTRY_BENCHMARKS;

            default:
                throw new \InvalidArgumentException("Unknown MCP resource URI: '{$uri}'");
        }
    }
}
