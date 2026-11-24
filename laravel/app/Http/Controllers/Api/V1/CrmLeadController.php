<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\CrmNote;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CrmLeadController extends Controller
{
    /**
     * Authenticate CRM users (Ashish & Sales Executives).
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password. Please verify your credentials.',
            ], 401);
        }

        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This account has been deactivated. Contact the administrator.',
            ], 403);
        }

        // Generate Sanctum token or authenticated access token
        $token = $user->createToken('crm-portal-access')->plainTextToken;

        // Update last login telemetry
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Welcome back to GetIntoFeed CRM!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'Admin',
            ],
        ]);
    }

    /**
     * Get authenticated CRM user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'Admin',
                'last_login_at' => $user->last_login_at,
            ],
        ]);
    }

    /**
     * Authorize user access to CRM actions.
     */
    protected function authorizeLeadAccess(Request $request, string $permission = 'leads.view'): ?JsonResponse
    {
        $user = $request->user();
        if (! $user || ! $user->is_active) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        $allowed = $user->isSuperAdmin()
            || $user->hasCmsPermission($permission)
            || in_array($user->role, ['superadmin', 'admin', 'sales_crm']);

        if (! $allowed) {
            return response()->json(['success' => false, 'message' => 'Forbidden. Insufficient CRM permissions.'], 403);
        }

        return null;
    }

    /**
     * Get High-Level CRM Statistics & Conversion Metrics.
     */
    public function stats(Request $request): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.view')) {
            return $deny;
        }

        $totalLeads = Lead::count();
        $thisMonthLeads = Lead::where('created_at', '>=', now()->startOfMonth())->count();
        $todayLeads = Lead::whereDate('created_at', today())->count();

        // Pipeline stage counts
        $stageCounts = Lead::select('stage', DB::raw('count(*) as count'))
            ->groupBy('stage')
            ->pluck('count', 'stage')
            ->toArray();

        $wonCount = $stageCounts['Won'] ?? 0;
        $lostCount = $stageCounts['Lost'] ?? 0;
        $closedTotal = $wonCount + $lostCount;
        $winRate = $closedTotal > 0 ? round(($wonCount / $closedTotal) * 100, 1) : 0;

        // SLA Breaches: Leads in stage 'New' older than 15 minutes without first_response_at
        $slaBreaches = Lead::where(function ($q) {
            $q->where('stage', 'New')->orWhereNull('stage');
        })
        ->whereNull('first_response_at')
        ->where('created_at', '<=', now()->subMinutes(15))
        ->count();

        // Channel attribution breakdown
        $channels = Lead::select('source', DB::raw('count(*) as count'))
            ->groupBy('source')
            ->orderBy('count', 'desc')
            ->take(5)
            ->get();

        // Services breakdown
        $services = Lead::select('interested_service', DB::raw('count(*) as count'))
            ->whereNotNull('interested_service')
            ->groupBy('interested_service')
            ->orderBy('count', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_leads' => $totalLeads,
                'this_month' => $thisMonthLeads,
                'today' => $todayLeads,
                'won_deals' => $wonCount,
                'win_rate_percent' => $winRate,
                'sla_breaches' => $slaBreaches,
                'stage_counts' => $stageCounts,
                'top_channels' => $channels,
                'top_services' => $services,
            ],
        ]);
    }

    /**
     * Get Grouped Pipeline Data for Kanban Board.
     */
    public function pipeline(Request $request): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.view')) {
            return $deny;
        }

        $stages = [
            'New' => [
                'id' => 'New',
                'title' => '1. New Inbound',
                'description' => 'Uncontacted fresh leads awaiting initial outreach',
                'color' => '#3b82f6', // blue
            ],
            'Contacted' => [
                'id' => 'Contacted',
                'title' => '2. Attempted Contact',
                'description' => 'Initial phone call or WhatsApp outreach sent',
                'color' => '#f59e0b', // amber
            ],
            'Discovery' => [
                'id' => 'Discovery',
                'title' => '3. Discovery Call',
                'description' => 'Discovery meeting scheduled or in progress',
                'color' => '#8b5cf6', // purple
            ],
            'Proposal' => [
                'id' => 'Proposal',
                'title' => '4. Proposal Sent',
                'description' => 'Commercial growth sprint quotation shared',
                'color' => '#06b6d4', // cyan
            ],
            'Negotiation' => [
                'id' => 'Negotiation',
                'title' => '5. In Negotiation',
                'description' => 'Closing terms, timeline & scope alignment',
                'color' => '#ec4899', // pink
            ],
            'Won' => [
                'id' => 'Won',
                'title' => '6. Closed Won (Client)',
                'description' => 'Active retained client onboarded',
                'color' => '#10b981', // emerald
            ],
            'Lost' => [
                'id' => 'Lost',
                'title' => 'Closed Lost',
                'description' => 'Disqualified or chose competitor',
                'color' => '#6b7280', // gray
            ],
        ];

        // Fetch leads with assigned user
        $leads = Lead::with('assignedUser:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        $pipelineData = [];
        foreach ($stages as $key => $meta) {
            $matchingLeads = $leads->filter(function ($lead) use ($key) {
                $leadStage = $lead->stage ?: 'New';
                return $leadStage === $key;
            })->values()->map(function ($lead) {
                return $this->formatLeadCard($lead);
            });

            $pipelineData[] = [
                'id' => $meta['id'],
                'title' => $meta['title'],
                'description' => $meta['description'],
                'color' => $meta['color'],
                'count' => $matchingLeads->count(),
                'leads' => $matchingLeads,
            ];
        }

        return response()->json([
            'success' => true,
            'stages' => $pipelineData,
        ]);
    }

    /**
     * List, Search, and Filter Leads (Table View).
     */
    public function index(Request $request): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.view')) {
            return $deny;
        }

        $query = Lead::with('assignedUser:id,name');

        // Search by query
        if ($request->filled('q')) {
            $q = trim($request->input('q'));
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('phone', 'like', "%{$q}%")
                  ->orWhere('email', 'like', "%{$q}%")
                  ->orWhere('company', 'like', "%{$q}%")
                  ->orWhere('lead_code', 'like', "%{$q}%");
            });
        }

        // Filter by stage
        if ($request->filled('stage') && $request->input('stage') !== 'all') {
            $query->where('stage', $request->input('stage'));
        }

        // Filter by priority
        if ($request->filled('priority') && $request->input('priority') !== 'all') {
            $query->where('priority', $request->input('priority'));
        }

        // Filter by service
        if ($request->filled('service') && $request->input('service') !== 'all') {
            $query->where('interested_service', 'like', '%' . $request->input('service') . '%');
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $leads = $query->orderBy($sortBy, $sortDir)->paginate(25);

        return response()->json([
            'success' => true,
            'data' => $leads->items(),
            'pagination' => [
                'current_page' => $leads->currentPage(),
                'total_pages' => $leads->lastPage(),
                'total_items' => $leads->total(),
                'per_page' => $leads->perPage(),
            ],
        ]);
    }

    /**
     * Create a new Lead manually from CRM portal.
     */
    public function store(Request $request): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.manage')) {
            return $deny;
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'company' => 'nullable|string|max:100',
            'interested_service' => 'nullable|string|max:100',
            'budget' => 'nullable|string|max:50',
            'priority' => 'nullable|string|in:Low,Medium,High,Urgent',
            'source' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ]);

        $leadCode = 'GIF-' . strtoupper(Str::random(6));
        $lead = Lead::create([
            'lead_code' => $leadCode,
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'whatsapp' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'company' => $validated['company'] ?? null,
            'interested_service' => $validated['interested_service'] ?? 'General Growth Consultation',
            'budget' => $validated['budget'] ?? null,
            'priority' => $validated['priority'] ?? 'Medium',
            'source' => $validated['source'] ?? 'Manual CRM Entry',
            'stage' => 'New',
            'status' => 'New',
            'sla_due_at' => now()->addMinutes(15),
            'notes' => $validated['notes'] ?? null,
        ]);

        if (!empty($validated['notes'])) {
            CrmNote::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()?->id,
                'content' => $validated['notes'],
            ]);
        }

        Activity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'type' => 'creation',
            'summary' => 'Lead created manually in CRM by ' . ($request->user()?->name ?: 'Ashish Raghav'),
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead successfully logged in CRM.',
            'lead' => $this->formatLeadCard($lead),
        ], 201);
    }

    /**
     * Get Lead 360° Profile with full activities, notes and attribution.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.view')) {
            return $deny;
        }

        $lead = Lead::with([
            'assignedUser:id,name,email',
            'activities' => fn ($q) => $q->orderBy('created_at', 'desc'),
            'notes.user:id,name',
            'opportunities',
        ])->find($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead record not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'lead' => $this->formatLead360($lead),
        ]);
    }

    /**
     * Update Lead Pipeline Stage (Kanban Drag-and-Drop).
     */
    public function updateStage(Request $request, int $id): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.manage')) {
            return $deny;
        }

        $validated = $request->validate([
            'stage' => 'required|string|in:New,Contacted,Discovery,Proposal,Negotiation,Won,Lost',
            'lost_reason' => 'nullable|string|max:255',
        ]);

        $lead = Lead::find($id);
        if (!$lead) {
            return response()->json(['success' => false, 'message' => 'Lead not found.'], 404);
        }

        $oldStage = $lead->stage ?: 'New';
        $newStage = $validated['stage'];

        $updateData = [
            'stage' => $newStage,
            'status' => $newStage,
        ];

        // Track first response if moving out of New
        if ($oldStage === 'New' && $newStage !== 'New' && empty($lead->first_response_at)) {
            $updateData['first_response_at'] = now();
        }

        if ($newStage === 'Lost' && !empty($validated['lost_reason'])) {
            $updateData['lost_reason'] = $validated['lost_reason'];
        }

        $lead->update($updateData);

        // Automatically log activity in timeline
        $userName = $request->user()?->name ?: 'Growth Strategist';
        Activity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'type' => 'stage_change',
            'summary' => "Pipeline stage moved from '{$oldStage}' to '{$newStage}' by {$userName}.",
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Lead stage moved to {$newStage}",
            'lead' => $this->formatLeadCard($lead->fresh()),
        ]);
    }

    /**
     * Update Lead Details.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.manage')) {
            return $deny;
        }

        $lead = Lead::find($id);
        if (!$lead) {
            return response()->json(['success' => false, 'message' => 'Lead not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'website' => 'nullable|string|max:255',
            'budget' => 'nullable|string|max:100',
            'interested_service' => 'nullable|string|max:255',
            'priority' => 'sometimes|string|in:Urgent,High,Medium,Low',
            'score' => 'nullable|integer|min:0|max:100',
            'assigned_user_id' => 'nullable|exists:users,id',
            'next_follow_up_at' => 'nullable|date',
            'message' => 'nullable|string',
        ]);

        $lead->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lead details successfully updated.',
            'lead' => $this->formatLead360($lead->fresh(['assignedUser'])),
        ]);
    }

    /**
     * Add Team Note to Lead.
     */
    public function storeNote(Request $request, int $id): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.manage')) {
            return $deny;
        }

        $lead = Lead::find($id);
        if (!$lead) {
            return response()->json(['success' => false, 'message' => 'Lead not found.'], 404);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:2|max:3000',
        ]);

        $note = CrmNote::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'content' => trim($validated['content']),
        ]);

        // Auto log in activity stream
        $author = $request->user()?->name ?: 'Team Member';
        Activity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'type' => 'note_added',
            'summary' => "Note added by {$author}: " . Str::limit(trim($validated['content']), 80),
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note saved.',
            'note' => [
                'id' => $note->id,
                'content' => $note->content,
                'author' => $author,
                'created_at' => $note->created_at->format('d M Y, h:i A'),
            ],
        ]);
    }

    /**
     * Log Call, Meeting, or WhatsApp interaction.
     */
    public function storeActivity(Request $request, int $id): JsonResponse
    {
        if ($deny = $this->authorizeLeadAccess($request, 'leads.manage')) {
            return $deny;
        }

        $lead = Lead::find($id);
        if (!$lead) {
            return response()->json(['success' => false, 'message' => 'Lead not found.'], 404);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:call,meeting,whatsapp,email,other',
            'summary' => 'required|string|max:500',
            'outcome' => 'nullable|string|max:100',
        ]);

        $typeLabel = ucfirst($validated['type']);
        $outcomeText = !empty($validated['outcome']) ? " [Outcome: {$validated['outcome']}]" : '';

        $activity = Activity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'type' => $validated['type'],
            'summary' => "{$typeLabel}: {$validated['summary']}{$outcomeText}",
            'completed_at' => now(),
        ]);

        // If first response was not recorded, record it now
        if (empty($lead->first_response_at)) {
            $lead->update([
                'first_response_at' => now(),
                'stage' => $lead->stage === 'New' ? 'Contacted' : $lead->stage,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Activity logged.',
            'activity' => [
                'id' => $activity->id,
                'type' => $activity->type,
                'summary' => $activity->summary,
                'completed_at' => $activity->completed_at ? $activity->completed_at->format('d M Y, h:i A') : now()->format('d M Y, h:i A'),
            ],
        ]);
    }

    /**
     * Format lightweight lead data for Kanban Card.
     */
    protected function formatLeadCard(Lead $lead): array
    {
        // Calculate algorithmic score if 0
        $score = $lead->score;
        if ($score === 0 || empty($score)) {
            $score = 15;
            if (!empty($lead->budget)) $score += 25;
            if (!empty($lead->company)) $score += 20;
            if (!empty($lead->phone) && strlen(preg_replace('/\D/', '', $lead->phone)) >= 10) $score += 20;
            if (!empty($lead->gclid)) $score += 15;
        }

        // SLA urgency
        $isSlaBreached = empty($lead->first_response_at) && $lead->created_at->diffInMinutes(now()) >= 15;

        return [
            'id' => $lead->id,
            'lead_code' => $lead->lead_code,
            'name' => $lead->name ?: 'Direct Inbound',
            'company' => $lead->company ?: 'Independent Brand',
            'phone' => $lead->phone,
            'whatsapp' => $lead->whatsapp ?: $lead->phone,
            'email' => str_contains($lead->email ?? '', '@lead.getintofeed.com') ? null : $lead->email,
            'service' => $lead->interested_service ?: 'General Growth',
            'budget' => $lead->budget,
            'stage' => $lead->stage ?: 'New',
            'priority' => $lead->priority ?: 'Medium',
            'score' => $score,
            'score_badge' => $score >= 75 ? 'HOT' : ($score >= 40 ? 'WARM' : 'COLD'),
            'sla_breached' => $isSlaBreached,
            'created_at_human' => $lead->created_at->diffForHumans(),
            'created_at' => $lead->created_at->format('Y-m-d H:i'),
            'assigned_to' => $lead->assignedUser?->name ?: 'Unassigned',
        ];
    }

    /**
     * Format 360° Detailed Lead Profile.
     */
    protected function formatLead360(Lead $lead): array
    {
        $card = $this->formatLeadCard($lead);

        return array_merge($card, [
            'city' => $lead->city,
            'industry' => $lead->industry,
            'website' => $lead->website,
            'message' => $lead->message,
            'source' => $lead->source ?: 'Website Inbound',
            'page_url' => $lead->page_url,
            'page_title' => $lead->page_title,
            'referrer' => $lead->referrer,
            'form_type' => $lead->form_type,
            'ip_address' => $lead->ip_address,
            'user_agent' => $lead->user_agent,
            'utm_source' => $lead->utm_source,
            'utm_medium' => $lead->utm_medium,
            'utm_campaign' => $lead->utm_campaign,
            'gclid' => $lead->gclid,
            'fbclid' => $lead->fbclid,
            'first_response_at' => $lead->first_response_at ? $lead->first_response_at->format('d M Y, h:i A') : null,
            'next_follow_up_at' => $lead->next_follow_up_at ? $lead->next_follow_up_at->format('Y-m-d\TH:i') : null,
            'lost_reason' => $lead->lost_reason,
            'notes' => $lead->notes ? $lead->notes->map(function ($n) {
                return [
                    'id' => $n->id,
                    'content' => $n->content,
                    'author' => $n->user?->name ?: 'Team Member',
                    'created_at' => $n->created_at->format('d M Y, h:i A'),
                ];
            }) : [],
            'activities' => $lead->activities ? $lead->activities->map(function ($a) {
                return [
                    'id' => $a->id,
                    'type' => $a->type,
                    'summary' => $a->summary,
                    'completed_at' => $a->completed_at ? $a->completed_at->format('d M Y, h:i A') : $a->created_at->format('d M Y, h:i A'),
                ];
            }) : [],
        ]);
    }
}
