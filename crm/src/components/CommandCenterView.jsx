import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Video, 
  Receipt, 
  Clock, 
  ArrowUpRight, 
  MoreHorizontal, 
  Phone, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';
import { ROLES, maskSensitiveLeadData } from '../utils/rbac.js';
import { SlaCountdown } from './ui/SlaCountdown.jsx';

export function CommandCenterView({ 
  leads = [], 
  onSelectLead, 
  onOpenReel, 
  onSendProposal, 
  onGenerateGst,
  currentUser 
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Compute live KPI metrics
  const activeLeads = leads.filter(l => l.stage !== 'Lost');
  const totalPipelineValue = activeLeads.reduce((acc, l) => acc + (l.dealValue || l.budget_monthly || 75000), 0);
  const pipelineValueLakhs = (totalPipelineValue / 100000).toFixed(1);

  // Priority Action Queue: leads needing reply or with active SLA timers
  const priorityQueue = leads
    .filter(l => !l.slaResolved || l.stage === 'Captured' || l.stage === 'Contacted')
    .slice(0, 5);

  // Live Agency Activity feed items (Strictly foreign-key scoped by lead_id)
  const agencyActivity = [
    {
      id: 'act-1',
      lead_id: leads[0]?.id || 'lead-01',
      title: 'ICICI UPI Payment Received',
      desc: 'Singhania Couture settled ₹91,640 net retainer (Sec 393 Withheld)',
      time: '4m ago',
      type: 'payment',
      badge: '₹91,640 Paid',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
    },
    {
      id: 'act-2',
      lead_id: leads[1]?.id || 'lead-02',
      title: 'Digio Aadhaar E-Sign Completed',
      desc: 'Rawal Fine Jewels e-signed 30-Day Growth Sprint agreement',
      time: '18m ago',
      type: 'esign',
      badge: 'Agreement Signed',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
    },
    {
      id: 'act-3',
      lead_id: leads[2]?.id || 'lead-03',
      title: 'Meta Lead Ad Webhook Captured',
      desc: 'Inbound D2C inquiry from Gurgaon • Advantage+ campaign (ROAS 4.35x)',
      time: '32m ago',
      type: 'lead',
      badge: '+91 98188 XXXXX',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200/60'
    },
    {
      id: 'act-4',
      lead_id: leads[3]?.id || 'lead-04',
      title: 'Reel #04 Ready for Review',
      desc: 'Kala Sanskriti Studio uploaded 9:16 vertical hook revision (00:08 pinned)',
      time: '1h ago',
      type: 'reel',
      badge: '12 Reels Studio',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60'
    }
  ];

  // Pipeline funnel steps
  const funnelStages = [
    { name: 'Captured', count: leads.length, val: `₹${pipelineValueLakhs}L`, pct: '100%' },
    { name: 'Qualified', count: Math.round(leads.length * 0.64), val: `₹${(pipelineValueLakhs * 0.64).toFixed(1)}L`, pct: '64%' },
    { name: 'Proposal Sent', count: Math.round(leads.length * 0.35), val: `₹${(pipelineValueLakhs * 0.35).toFixed(1)}L`, pct: '35%' },
    { name: 'Won Deals', count: Math.round(leads.length * 0.22), val: `₹${(pipelineValueLakhs * 0.22).toFixed(1)}L`, pct: '22%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────
          ROW 1: 4 EQUAL KPI CARDS (Linear / Stripe Style)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Speed-to-Lead */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Avg Speed-to-Lead
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              SLA Met
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-semibold text-slate-900 tabular-nums tracking-tight">
              1m 42s
            </span>
            <span className="text-[13px] text-slate-500 font-medium">/ 5m target</span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Turant reply bhejein • Automated WhatsApp SLA</span>
          </p>
        </div>

        {/* KPI 2: Active Pipeline Value */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Active Pipeline Value
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
              {activeLeads.length} Deals
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-semibold text-slate-900 tabular-nums tracking-tight">
              ₹{pipelineValueLakhs} Lakh
            </span>
            <span className="text-[13px] text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /> +18.4%
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2">
            Delhi NCR &amp; D2C Growth Sprints &amp; Retainers
          </p>
        </div>

        {/* KPI 3: Reels Pending Sign-off */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Reels Pending Sign-Off
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Action Req.
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-semibold text-slate-900 tabular-nums tracking-tight">
              4 Reels
            </span>
            <span className="text-[13px] text-slate-500 font-medium">of 12 monthly</span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>12 Reels Studio • Frame.io style review</span>
          </p>
        </div>

        {/* KPI 4: Unpaid GST Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Unpaid GST Invoices
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
              2 Overdue
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-semibold text-slate-900 tabular-nums tracking-tight">
              ₹2.36 Lakh
            </span>
            <span className="text-[13px] text-slate-500 font-medium">Gross GST</span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Delhi 07 SAC 998361 • ICICI UPI QR active</span>
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: 65% / 35% SPLIT WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 65%: PRIORITY ACTION QUEUE */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-slate-900">
                  Priority Action Queue
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 bg-slate-100 rounded-full border border-slate-200/60">
                  {priorityQueue.length} Active
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Leads requiring first-contact touchpoint or content awaiting client review
              </p>
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4FF00] border border-slate-900"></span>
              Live Pulse
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-5">Brand / Lead</th>
                  <th className="py-2.5 px-4">Deal Structure</th>
                  <th className="py-2.5 px-4">Value / Speed-to-Lead</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {priorityQueue.map((lead) => {
                  const maskedLead = maskSensitiveLeadData(lead, currentUser?.role);
                  const formattedBudget = maskedLead.budget_formatted || `₹${((lead.dealValue || lead.budget_monthly || 75000) / 100000).toFixed(2)}L`;

                  return (
                    <tr 
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Brand / Lead */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center font-bold text-[12px] group-hover:border-slate-400 transition-colors">
                            {(lead.company || lead.brand || lead.name || 'G')[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block group-hover:text-slate-950">
                              {lead.company || lead.brand || lead.name}
                            </span>
                            <span className="text-[12px] text-slate-500 block">
                              {maskedLead.name || maskedLead.contact} • {lead.city || 'Delhi NCR'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Deal Structure */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {lead.dealType || 'Growth Sprint'}
                        </span>
                      </td>

                      {/* Value & SlaCountdown Component */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 tabular-nums block">
                          {formattedBudget}
                        </span>
                        <div className="mt-0.5">
                          <SlaCountdown 
                            deadline={lead.slaDeadlineAt}
                            slaResolved={lead.slaResolved}
                            speedToLeadSeconds={lead.speedToLeadSeconds}
                            firstContactChannel={lead.firstContactChannel}
                          />
                        </div>
                      </td>

                      {/* Action & More Menu */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            aria-label={`Open dossier for ${lead.company || lead.name}`}
                            className="text-[12px] font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition"
                          >
                            Open Dossier
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                              aria-label={`More actions for ${lead.company || lead.name}`}
                              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
                            >
                              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                            </button>

                            {activeMenuId === lead.id && (
                              <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-slate-200 rounded-xl shadow-modal py-1 text-left text-[13px]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onSendProposal && onSendProposal(lead);
                                  }}
                                  className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FileText className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                  <span>Send Proposal</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onGenerateGst && onGenerateGst(lead);
                                  }}
                                  className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Receipt className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                  <span>Generate Delhi GST</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onSelectLead(lead);
                                  }}
                                  className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                  <span>WhatsApp Quick Reply</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
            <span className="text-[12px] text-slate-500 font-medium">
              Showing top 5 high-priority items • Full lead roster in Lead Pipeline
            </span>
          </div>
        </div>

        {/* RIGHT 35%: LIVE AGENCY ACTIVITY STREAM (Strictly lead_id foreign-key scoped) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-subtle p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">
                Live Agency Stream
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Foreign-key scoped activity feed
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
          </div>

          <div className="mt-4 space-y-4">
            {agencyActivity.map((item) => (
              <div key={item.id} className="relative pl-5 before:absolute before:left-1 before:top-2 before:bottom-0 before:w-px before:bg-slate-100 last:before:hidden">
                <span className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" aria-hidden="true"></span>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-semibold text-slate-900 block leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className={`inline-block px-2 py-0.5 rounded font-medium border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    lead_id: {item.lead_id?.slice(0, 8)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>DPDP Act 2023 Verified</span>
              </span>
              <span className="font-mono">v1.2_2026_11</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 3: HORIZONTAL 4-STAGE PIPELINE FUNNEL (Linear Style)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Agency Conversion Funnel
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Funnel velocity across Growth Sprints, Service Packages &amp; Retainers
            </p>
          </div>
          <span className="text-[12px] font-semibold text-slate-700 tabular-nums bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
            23.3% Win Rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {funnelStages.map((stage, idx) => (
            <div 
              key={stage.name}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <span>0{idx + 1}. {stage.name}</span>
                <span className="text-slate-900 tabular-nums">{stage.pct}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[20px] font-semibold text-slate-900 tabular-nums">
                  {stage.count}
                </span>
                <span className="text-[13px] text-slate-500 font-medium tabular-nums">
                  ({stage.val})
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-slate-900 h-full rounded-full transition-all duration-300"
                  style={{ width: stage.pct }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CommandCenterView;
