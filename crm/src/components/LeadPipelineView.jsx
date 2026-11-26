import React, { useState } from 'react';
import { 
  Search, 
  LayoutList, 
  Kanban, 
  MoreHorizontal, 
  Phone, 
  MessageSquare, 
  FileText, 
  Receipt, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Download,
  RotateCcw
} from 'lucide-react';
import { maskSensitiveLeadData, ROLES } from '../utils/rbac.js';
import { SlaCountdown } from './ui/SlaCountdown.jsx';
import { downloadSafeCsv } from '../utils/csvSanitizer.ts';
import { LostReasonModal } from './LostReasonModal.jsx';
import { SAC_PRICE_BOOK } from '../utils/priceBook.ts';

export function LeadPipelineView({ 
  leads = [], 
  onSelectLead, 
  onUpdateLead,
  onSendProposal, 
  onGenerateGst, 
  currentUser,
  activeFilter = 'all',
  onShowToast,
  onShowUndoToast
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'board'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [leadForLostModal, setLeadForLostModal] = useState(null);

  const CANONICAL_STAGES = [
    'Captured',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Won',
    'Lost'
  ];

  // Normalize stage matching
  const normalizeStage = (stage) => {
    if (stage === 'Lead Ingested') return 'Captured';
    if (stage === 'Audit Scheduled') return 'Contacted';
    if (stage === 'Won (Active Retainer)') return 'Won';
    if (stage === 'Contract / Negotiation') return 'Proposal Sent';
    return stage || 'Captured';
  };

  // Filter leads based on query & activeFilter
  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (lead.name || lead.contact || '').toLowerCase().includes(q) ||
      (lead.company || lead.brand || '').toLowerCase().includes(q) ||
      (lead.city || '').toLowerCase().includes(q) ||
      (lead.service_interest || '').toLowerCase().includes(q) ||
      (lead.dealType || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    const currentStage = normalizeStage(lead.stage);

    if (activeFilter === 'sla' || activeFilter === 'needs_reply') {
      return !lead.slaResolved || currentStage === 'Captured';
    }
    if (activeFilter === 'hot') {
      return (lead.dealValue || lead.budget_monthly || 0) >= 120000;
    }
    if (activeFilter === 'proposals') {
      return currentStage === 'Proposal Sent';
    }
    if (activeFilter === 'won') {
      return currentStage === 'Won';
    }

    return true;
  });

  // Export Leads to CSV with Formula Injection Neutralization
  const handleExportCsv = () => {
    const headers = [
      'Lead ID',
      'Brand / Company',
      'Contact Person',
      'Phone',
      'City',
      'State Code',
      'Stage',
      'Deal Type',
      'Deal Value (INR)',
      'Service Discipline',
      'SAC Code',
      'DPDP Consent Status',
      'SLA Status',
      'Created At'
    ];

    const rows = filteredLeads.map((lead) => {
      const masked = maskSensitiveLeadData(lead, currentUser?.role);
      return [
        lead.id,
        lead.company || lead.brand || lead.name,
        masked.name || masked.contact,
        masked.phone,
        lead.city || 'Delhi NCR',
        lead.state_code || '07',
        normalizeStage(lead.stage),
        lead.dealType || 'Growth Sprint',
        lead.dealValue || lead.budget_monthly || 75000,
        lead.service_interest || 'Performance Ads',
        lead.sacCode || '998361',
        lead.dpdpConsent?.consentGiven ? 'Verified' : 'Missing',
        lead.slaResolved ? 'Met' : 'Pending',
        lead.created_at || new Date().toISOString()
      ];
    });

    downloadSafeCsv(`FeedOS_Leads_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    onShowToast?.(`Exported ${filteredLeads.length} leads safely to CSV (formula injection neutralized).`);
  };

  // Stage Transition Handler (Allows Moving Forward and Backward)
  const handleMoveStage = (lead, targetStage) => {
    if (targetStage === 'Lost') {
      setLeadForLostModal(lead);
      return;
    }

    const previousStage = lead.stage;
    const updatedLead = {
      ...lead,
      stage: targetStage,
      updated_at: new Date().toISOString()
    };

    onUpdateLead?.(updatedLead);

    // Phase A #3: Undo Toast for stage transitions
    if (onShowUndoToast) {
      onShowUndoToast(
        `Moved ${lead.company || lead.name} to ${targetStage}`,
        () => {
          onUpdateLead?.({
            ...lead,
            stage: previousStage,
            updated_at: new Date().toISOString()
          });
          onShowToast?.(`Reverted ${lead.company || lead.name} back to ${previousStage}`);
        }
      );
    } else {
      onShowToast?.(`Moved ${lead.company || lead.name} to ${targetStage}`);
    }
  };

  const handleConfirmLostReason = ({ leadId, lostReason, lostNotes }) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const previousStage = lead.stage;
    const updatedLead = {
      ...lead,
      stage: 'Lost',
      status: 'Closed',
      lostReason,
      lostNotes,
      updated_at: new Date().toISOString()
    };

    onUpdateLead?.(updatedLead);

    if (onShowUndoToast) {
      onShowUndoToast(
        `Marked ${lead.company || lead.name} as Lost (${lostReason})`,
        () => {
          onUpdateLead?.({
            ...lead,
            stage: previousStage,
            status: 'Verified',
            lostReason: undefined,
            lostNotes: undefined,
            updated_at: new Date().toISOString()
          });
          onShowToast?.(`Reverted ${lead.company || lead.name} back to ${previousStage}`);
        }
      );
    } else {
      onShowToast?.(`Marked as Lost: ${lostReason}`);
    }
    setLeadForLostModal(null);
  };

  const getStagePill = (rawStage) => {
    const stage = normalizeStage(rawStage);
    switch (stage) {
      case 'Captured':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">Captured</span>;
      case 'Contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">Contacted</span>;
      case 'Qualified':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">Qualified</span>;
      case 'Proposal Sent':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">Proposal Sent</span>;
      case 'Won':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">Won</span>;
      case 'Lost':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">Lost</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{stage}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Export Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search leads by brand name, city, service, or deal type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 text-[13px] text-slate-900 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-slate-400 transition placeholder:text-slate-400"
          />
        </div>

        {/* Export & View Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            aria-label="Export leads to CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export CSV</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Switch to table view"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${
                viewMode === 'table' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              aria-label="Switch to Kanban board view"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${
                viewMode === 'board' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TABLE VIEW
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Lead / Brand</th>
                  <th className="py-3 px-4">Stage &amp; Deal Type</th>
                  <th className="py-3 px-4">Value &amp; Service</th>
                  <th className="py-3 px-4">Speed-to-Lead SLA</th>
                  <th className="py-3 px-4">DPDP Consent</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredLeads.map((lead) => {
                  const maskedLead = maskSensitiveLeadData(lead, currentUser?.role);
                  const formattedBudget = maskedLead.budget_formatted || `₹${((lead.dealValue || lead.budget_monthly || 75000) / 100000).toFixed(2)} Lakh`;
                  const currentStage = normalizeStage(lead.stage);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Brand & Contact */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[12px] text-slate-700 shrink-0 group-hover:border-slate-400 transition-colors">
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

                      {/* Stage & Deal Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          {getStagePill(lead.stage)}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {lead.dealType || 'Growth Sprint'}
                          </span>
                        </div>
                      </td>

                      {/* Deal Value & Service */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 tabular-nums block">
                          {formattedBudget}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                          {lead.service_interest || 'Performance Ads'}
                        </span>
                      </td>

                      {/* Speed-to-Lead SLA Micro-Component */}
                      <td className="py-3.5 px-4">
                        <SlaCountdown 
                          deadline={lead.slaDeadlineAt}
                          slaResolved={lead.slaResolved}
                          speedToLeadSeconds={lead.speedToLeadSeconds}
                          firstContactChannel={lead.firstContactChannel}
                        />
                      </td>

                      {/* DPDP Consent Status */}
                      <td className="py-3.5 px-4">
                        {lead.dpdpConsent?.consentGiven ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" aria-hidden="true" />
                            <span>Consent Missing</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            aria-label={`View dossier for ${lead.company || lead.name}`}
                            className="text-[12px] font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition"
                          >
                            Details
                          </button>

                          {/* Quick Stage Mover Dropdown */}
                          <select
                            value={currentStage}
                            onChange={(e) => handleMoveStage(lead, e.target.value)}
                            aria-label={`Change stage for ${lead.company || lead.name}`}
                            className="text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
                          >
                            {CANONICAL_STAGES.map((stg) => (
                              <option key={stg} value={stg}>{stg}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BOARD VIEW (Kanban Columns with Backward Transitions)
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CANONICAL_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(l => normalizeStage(l.stage) === stage);
            const stageTotalValue = stageLeads.reduce((sum, l) => sum + (l.dealValue || l.budget_monthly || 0), 0);

            return (
              <div 
                key={stage} 
                className="bg-[#F8F9FB] rounded-xl border border-slate-200 p-2.5 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="pb-2.5 mb-2 border-b border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-900">{stage}</h3>
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {stageLeads.length} deals • ₹{(stageTotalValue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {stageLeads.map((lead) => {
                    const masked = maskSensitiveLeadData(lead, currentUser?.role);
                    return (
                      <div
                        key={lead.id}
                        onClick={() => onSelectLead(lead)}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 transition cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-slate-900 text-[12px] leading-tight block">
                            {lead.company || lead.brand || lead.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                            {lead.dealType || 'Sprint'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          {masked.name || masked.contact}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-slate-900 tabular-nums">
                            ₹{((lead.dealValue || lead.budget_monthly || 75000) / 1000).toFixed(0)}k
                          </span>
                          <SlaCountdown 
                            deadline={lead.slaDeadlineAt}
                            slaResolved={lead.slaResolved}
                            speedToLeadSeconds={lead.speedToLeadSeconds}
                            firstContactChannel={lead.firstContactChannel}
                          />
                        </div>

                        {/* Stage Mover on card */}
                        <div className="pt-1 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] text-slate-400">Stage:</span>
                          <select
                            value={normalizeStage(lead.stage)}
                            onChange={(e) => handleMoveStage(lead, e.target.value)}
                            aria-label={`Change stage for ${lead.company || lead.name}`}
                            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 rounded px-1 py-0.5"
                          >
                            {CANONICAL_STAGES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mandatory Lost Reason Modal */}
      {leadForLostModal && (
        <LostReasonModal
          isOpen={Boolean(leadForLostModal)}
          lead={leadForLostModal}
          onClose={() => setLeadForLostModal(null)}
          onConfirm={handleConfirmLostReason}
        />
      )}
    </div>
  );
}

export default LeadPipelineView;
