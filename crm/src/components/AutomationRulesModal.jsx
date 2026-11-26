import React from 'react';
import { Cpu, Zap, Clock, MessageSquare, Target, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';

export function AutomationRulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const automations = [
    {
      title: '15-Minute Speed-to-Lead SLA Sentinel',
      status: 'ACTIVE',
      icon: Clock,
      color: 'amber',
      trigger: 'When a new lead submits contact form or audit request on getintofeed.com',
      action: 'Initializes a 15-minute SLA countdown timer. If uncontacted, activates pulsating visual warning and alerts sales team.',
      impact: 'Increases qualification rate by 391% compared to > 1 hour callbacks.'
    },
    {
      title: 'Automated Lead Scoring Algorithm (0 - 100)',
      status: 'ACTIVE',
      icon: Zap,
      color: 'lime',
      trigger: 'On lead ingestion from web or API',
      action: 'Calculates intent score: +35 for budget >= ₹1.5L, +25 for Performance/Google Ads, +20 for detailed brand note, +20 for paid ad click (GCLID/FBCLID).',
      impact: 'Ranks leads into 🔥 HOT (>=75), ⚡ WARM (40-74), and ❄️ COLD (<40) for prioritized outreach.'
    },
    {
      title: 'One-Click Dynamic WhatsApp Engine',
      status: 'ACTIVE',
      icon: MessageSquare,
      color: 'emerald',
      trigger: 'Sales rep clicks "WhatsApp" button on any lead card or drawer',
      action: 'Pre-renders high-converting personalized script with lead first name, brand, interested service, and opens WhatsApp Web/App instantly.',
      impact: 'Eliminates typing delays; enables sub-60-second first touches.'
    },
    {
      title: 'Full-Funnel Paid Attribution Tracking',
      status: 'ACTIVE',
      icon: Target,
      color: 'blue',
      trigger: 'Visitor lands on getintofeed.com from Google or Meta campaigns',
      action: 'Captures utm_source, utm_medium, utm_campaign, gclid, and fbclid in browser cookies and writes them directly into crm_leads table.',
      impact: 'Provides 100% closed-loop ROI tracking from ad click to signed retainer.'
    },
    {
      title: 'Automated Stage Telemetry & Activity Auditing',
      status: 'ACTIVE',
      icon: ShieldCheck,
      color: 'purple',
      trigger: 'Lead card dragged across Kanban stages (New -> Contacted -> Won)',
      action: 'Timestamps first_response_at, updates status, and logs immutable record in crm_activities timeline with rep identity.',
      impact: 'Full transparency into sales velocity and conversion bottlenecks.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-slate-950 font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Automation &amp; SLA Rules</h3>
              <p className="text-[11px] text-slate-400">High-velocity workflow automation engine running on Hostinger backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-6 space-y-4">
          {automations.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-lime-400" />
                    <h4 className="text-xs font-bold text-white">{rule.title}</h4>
                  </div>
                  <span className="flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {rule.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-900">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-0.5">Trigger Condition:</span>
                    <p>{rule.trigger}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300 block mb-0.5">Automated Action:</span>
                    <p>{rule.action}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-slate-900/80 px-3 py-1.5 text-[11px] text-lime-400/90 font-mono flex items-center gap-1.5">
                  <Zap className="h-3 w-3 shrink-0" />
                  <span>Impact: {rule.impact}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
          <span>Engine: Laravel 11.41 Queue &amp; Event Dispatcher</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-slate-200 hover:bg-slate-700 font-semibold"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
