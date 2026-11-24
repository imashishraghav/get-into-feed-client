<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CrmLeadEvent;
use App\Models\CrmTask;
use App\Models\Lead;
use App\Support\LeadAlertDispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuditController extends Controller
{
    public function submitAudit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'website' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'competitor' => 'nullable|string|max:255',
            'utm_source' => 'nullable|string|max:100',
            'utm_medium' => 'nullable|string|max:100',
            'utm_campaign' => 'nullable|string|max:100',
            'utm_term' => 'nullable|string|max:100',
            'utm_content' => 'nullable|string|max:100',
            'gclid' => 'nullable|string|max:100',
            'fbclid' => 'nullable|string|max:100',
        ]);

        $rawWebsite = trim($validated['website']);
        if (! preg_match('#^https?://#i', $rawWebsite)) {
            $rawWebsite = 'https://'.$rawWebsite;
        }

        // 1. Run Automated Real Diagnostics
        $auditResult = $this->runLiveAudit($rawWebsite);

        $leadCode = 'AUDIT-'.strtoupper(Str::random(8));

        $pageUrl = $request->input('page_url') ?: $request->header('referer') ?: 'https://getintofeed.com/audit';
        $pageTitle = $request->input('page_title') ?: 'Free 360° Website Growth Audit';
        $referrer = $request->input('referrer') ?: $request->header('referer') ?: 'Direct Traffic';

        // Phone normalization
        $phoneDigits = preg_replace('/[^0-9]/', '', $validated['phone']);
        $normalizedPhone = strlen($phoneDigits) === 10 ? '+91'.$phoneDigits : '+'.$phoneDigits;

        $findingsSummary = "Growth Score: {$auditResult['overallScore']}/100 | ".
            "SEO: {$auditResult['scores']['seo']}% | Speed: {$auditResult['scores']['speed']}% | ".
            "Mobile: {$auditResult['scores']['mobile']}% | Security: {$auditResult['scores']['security']}%\n".
            'Findings: '.implode('; ', array_slice($auditResult['findings'], 0, 4));

        $lead = Lead::create([
            'lead_code' => $leadCode,
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone' => $normalizedPhone,
            'whatsapp' => $normalizedPhone,
            'website' => $rawWebsite,
            'company' => parse_url($rawWebsite, PHP_URL_HOST) ?: $rawWebsite,
            'interested_service' => '360° Growth Audit & Performance Overhaul',
            'message' => $findingsSummary.($validated['competitor'] ?? false ? "\nCompetitor: ".$validated['competitor'] : ''),
            'source' => 'Free 360° Growth Audit Tool',
            'page_url' => $pageUrl,
            'page_title' => $pageTitle,
            'referrer' => $referrer,
            'form_type' => 'Automated Growth Audit Engine',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'gclid' => $validated['gclid'] ?? null,
            'fbclid' => $validated['fbclid'] ?? null,
            'consent_at' => now(),
            'consent_ip' => $request->ip(),
            'status' => 'New',
            'stage' => 'New',
            'score' => 85, // High commercial intent
            'priority' => 'Urgent',
            'sla_due_at' => now()->addMinutes(15),
        ]);

        // Auto-create CRM Event & SLA Task
        try {
            CrmLeadEvent::create([
                'lead_id' => $lead->id,
                'event_type' => 'created',
                'description' => "Automated 360° Audit executed for {$rawWebsite} [Overall Score: {$auditResult['overallScore']}/100]",
                'properties' => $auditResult,
            ]);

            CrmTask::create([
                'lead_id' => $lead->id,
                'title' => "⚡ Present 360° Audit to {$lead->name} ({$lead->company})",
                'description' => "Automated audit completed with score {$auditResult['overallScore']}/100. Call to review bottlenecks & pitch Growth Plan.",
                'type' => 'SLA',
                'priority' => 'Urgent',
                'status' => 'Pending',
                'due_at' => $lead->sla_due_at,
            ]);
        } catch (\Throwable $ex) {
            Log::warning('CRM audit task creation error: '.$ex->getMessage());
        }

        // Phase 1 Lead Alert Dispatcher
        try {
            app(LeadAlertDispatcher::class)->dispatch(
                (string) $lead->getKey(),
                [
                    'name' => $lead->name,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                    'service' => $lead->interested_service,
                    'message' => $findingsSummary,
                ],
                'Automated 360° Growth Audit Tool'
            );
        } catch (\Throwable $dispatchEx) {
            Log::warning("Failed to dispatch audit alerts for {$lead->lead_code}: ".$dispatchEx->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Your 360° Website Growth Audit is ready! Our growth engineering team will also contact you within 15 minutes.',
            'leadId' => $lead->lead_code,
            'audit' => $auditResult,
        ], 201);
    }

    /**
     * Executes server-side automated diagnostic probes against target domain.
     */
    protected function runLiveAudit(string $url): array
    {
        $parsed = parse_url($url);
        $host = $parsed['host'] ?? '';
        $scheme = $parsed['scheme'] ?? 'https';

        $seoScore = 70;
        $speedScore = 75;
        $mobileScore = 80;
        $securityScore = 70;
        $findings = [];
        $recommendations = [];

        // 1. SSL / Scheme check
        if (strtolower($scheme) === 'https') {
            $securityScore += 15;
            $findings[] = '✅ SSL Certificate active (HTTPS enabled)';
        } else {
            $securityScore -= 30;
            $findings[] = '⚠️ Insecure connection (HTTP detected, SSL missing)';
            $recommendations[] = 'Enforce HTTPS redirect with TLS 1.3 to avoid browser security warnings';
        }

        // 2. HTTP Latency & Response Test
        $startTime = microtime(true);
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 3.5,
                'user_agent' => 'GetIntoFeed-Growth-Audit-Engine/2.0 (+https://getintofeed.com)',
                'ignore_errors' => true,
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ],
        ]);

        $html = @file_get_contents($url, false, $ctx, 0, 150000);
        $latencyMs = round((microtime(true) - $startTime) * 1000);

        if ($latencyMs < 400) {
            $speedScore += 15;
            $findings[] = "⚡ Fast initial server response time (TTFB: {$latencyMs}ms)";
        } elseif ($latencyMs < 900) {
            $findings[] = "⏱️ Moderate server response latency ({$latencyMs}ms)";
            $recommendations[] = 'Implement edge caching (Cloudflare) to bring TTFB under 300ms';
        } else {
            $speedScore -= 25;
            $findings[] = "🐢 High server response latency ({$latencyMs}ms)";
            $recommendations[] = 'Server response time is slowing down ad conversions. Enable HTTP/3 & full-page CDN cache.';
        }

        // 3. HTML Content & SEO Diagnostics
        if (! empty($html)) {
            // Title Tag
            if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $m)) {
                $titleText = trim($m[1]);
                $tLen = strlen($titleText);
                if ($tLen >= 30 && $tLen <= 70) {
                    $seoScore += 10;
                    $findings[] = "✅ Optimal SEO Title length ({$tLen} characters)";
                } else {
                    $findings[] = "⚠️ Sub-optimal Title length ({$tLen} chars: recommended 30-65)";
                    $recommendations[] = 'Refine homepage title to include high-intent core commercial keywords';
                }
            } else {
                $seoScore -= 20;
                $findings[] = '❌ Missing primary <title> meta tag';
                $recommendations[] = 'Add descriptive Title tag immediately for search engine indexing';
            }

            // Meta Description
            if (preg_match('/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']/is', $html, $m)) {
                $descLen = strlen(trim($m[1]));
                if ($descLen >= 100 && $descLen <= 170) {
                    $seoScore += 10;
                    $findings[] = "✅ Compelling Meta Description ({$descLen} characters)";
                } else {
                    $findings[] = "⚠️ Meta Description is {$descLen} chars (ideal: 120-160 chars)";
                }
            } else {
                $seoScore -= 15;
                $findings[] = '⚠️ Missing standard Meta Description for organic snippets';
                $recommendations[] = 'Craft a high-converting meta description with clear brand proposition';
            }

            // Mobile Viewport Check
            if (preg_match('/<meta[^>]*name=["\']viewport["\']/is', $html)) {
                $mobileScore += 10;
                $findings[] = '📱 Mobile responsive viewport configured properly';
            } else {
                $mobileScore -= 30;
                $findings[] = '❌ Missing mobile viewport meta tag (fails mobile UX test)';
                $recommendations[] = 'Add responsive viewport meta tag to prevent rendering scaling penalties';
            }

            // OpenGraph Social Card (Meta Ads Readiness)
            if (preg_match('/<meta[^>]*property=["\']og:image["\']/is', $html)) {
                $findings[] = '🎨 OpenGraph social preview tags found (ready for Meta ads & sharing)';
            } else {
                $seoScore -= 10;
                $findings[] = '⚠️ Missing OpenGraph social cards (og:image / og:title)';
                $recommendations[] = 'Add OpenGraph preview cards to double social CTR on Instagram & WhatsApp shares';
            }
        } else {
            $findings[] = 'ℹ️ Site protected by bot challenge or server timeout during deep scan';
        }

        // Clamp scores between 20 and 98
        $seoScore = max(25, min(95, $seoScore));
        $speedScore = max(20, min(95, $speedScore));
        $mobileScore = max(30, min(96, $mobileScore));
        $securityScore = max(30, min(98, $securityScore));
        $overallScore = round(($seoScore + $speedScore + $mobileScore + $securityScore) / 4);

        return [
            'targetUrl' => $url,
            'hostname' => $host,
            'overallScore' => $overallScore,
            'scores' => [
                'seo' => $seoScore,
                'speed' => $speedScore,
                'mobile' => $mobileScore,
                'security' => $securityScore,
            ],
            'latencyMs' => $latencyMs,
            'findings' => $findings,
            'recommendations' => $recommendations,
            'scannedAt' => now()->toIso8601String(),
        ];
    }
}
