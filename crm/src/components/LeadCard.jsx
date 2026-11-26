import React from 'react';
import { Phone, MessageSquare, Clock, User, Building, ArrowRight, Zap, Flame, Snowflake, ExternalLink } from 'lucide-react';
import { openWhatsApp, WHATSAPP_TEMPLATES } from '../data/templates.js';

export function LeadCard({ lead, onSelectLead, onDragStart, onMoveStage }) {
  const isHot = lead.score >= 75 || lead.score_badge === 'HOT';
  const isWarm = (lead.score >= 40 && lead.score < 75) || lead.score_badge === 'WARM';

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const defaultTemplate = WHATSAPP_TEMPLATES[0].buildText(lead);
    openWhatsApp(lead.whatsapp || lead.phone, defaultTemplate);
  };

  const handleCallClick = (e) => {
    e.stopPropagation();
    if (lead.phone) {
      window.open(`tel:${lead.phone.replace(/\s+/g, '')}`, '_self');
    } else {
      alert('No phone number recorded.');
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => onSelectLead(lead.id)}
      className={`group relative rounded-xl border bg-slate-900/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-grab active:cursor-grabbing select-none ${
        lead.sla_breached
          ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/50'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* SLA Alert Indicator */}
      {lead.sla_breached && (
        <div className="mb-2.5 flex items-center gap-1.5 rounded-lg bg-rose-950/80 px-2.5 py-1 text-[11px] font-bold text-rose-400 border border-rose-800/60 animate-pulse">
          <Clock className="h-3 w-3" />
          <span>SLA BREACH: Uncontacted &gt; 15 mins</span>
        </div>
      )}

      {/* Top Meta: Code & Score Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[11px] text-slate-400 font-semibold tracking-wider">
          {lead.lead_code || `LEAD-${lead.id}`}
        </span>

        {/* Score Badge */}
        {isHot ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-400">
            <Flame className="h-3 w-3 fill-rose-400 text-rose-400" />
            HOT {lead.score}
          </span>
        ) : isWarm ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
            <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
            WARM {lead.score}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            <Snowflake className="h-3 w-3 text-slate-400" />
            {lead.score || 15}
          </span>
        )}
      </div>

      {/* Contact Name & Company */}
      <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#D4FF00] transition-colors leading-tight">
        {lead.name}
      </h4>

      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 font-medium truncate">
        <Building className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        <span className="truncate">{lead.company}</span>
      </div>

      {/* Service & Budget Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-blue-950/80 border border-blue-800/50 px-2 py-0.5 text-[11px] font-medium text-blue-300">
          {lead.service}
        </span>
        {lead.budget && (
          <span className="rounded-md bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
            {lead.budget}
          </span>
        )}
      </div>

      {/* Card Action Row */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {/* Quick Contact Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Chat on WhatsApp (Speed-to-lead template)"
            onClick={handleWhatsAppClick}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            title="Call Client directly"
            onClick={handleCallClick}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 transition-all cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Time Ago & Strategist */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Clock className="h-3 w-3" />
          <span>{lead.created_at_human}</span>
        </div>
      </div>
    </div>
  );
}
