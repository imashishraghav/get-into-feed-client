import React, { useState } from 'react';
import { Search, Phone, MessageSquare, Filter, Building, Clock, Flame, Zap, Snowflake } from 'lucide-react';
import { openWhatsApp, WHATSAPP_TEMPLATES } from '../data/templates.js';

export function LeadsTable({ leads, onSelectLead, onSearch, searchQuery, stageFilter, setStageFilter }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads by name, phone, company, or code..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#D4FF00] focus:outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 py-2.5 px-3 rounded-xl focus:border-[#D4FF00] focus:outline-none cursor-pointer"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="New">1. New Inbound</option>
            <option value="Contacted">2. Attempted Contact</option>
            <option value="Discovery">3. Discovery Call</option>
            <option value="Proposal">4. Proposal Sent</option>
            <option value="Negotiation">5. In Negotiation</option>
            <option value="Won">6. Closed Won</option>
            <option value="Lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Lead</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Company &amp; Region</th>
                <th className="py-3 px-4">Service &amp; Budget</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Quick Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads && leads.length > 0 ? (
                leads.map((lead) => {
                  const isHot = lead.score >= 75 || lead.score_badge === 'HOT';
                  const isWarm = (lead.score >= 40 && lead.score < 75) || lead.score_badge === 'WARM';

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead.id)}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      {/* Lead Code & Time */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-[#D4FF00]">
                          {lead.lead_code || `LEAD-${lead.id}`}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {lead.created_at_human || lead.created_at}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-100 block">
                          {lead.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 block">
                          {lead.phone || '—'}
                        </span>
                      </td>

                      {/* Company & Region */}
                      <td className="py-3 px-4">
                        <span className="text-slate-200 font-medium block">
                          {lead.company || 'Direct Client'}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {lead.city || 'Delhi NCR'}
                        </span>
                      </td>

                      {/* Service & Budget */}
                      <td className="py-3 px-4">
                        <span className="text-blue-400 font-medium block">
                          {lead.service || lead.interested_service}
                        </span>
                        <span className="text-emerald-400 font-bold text-[11px] block">
                          {lead.budget || 'Inbound'}
                        </span>
                      </td>

                      {/* Stage Pill */}
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          lead.stage === 'Won'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : lead.stage === 'Lost'
                            ? 'bg-slate-800 text-slate-400'
                            : lead.stage === 'Proposal'
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                            : lead.stage === 'Discovery'
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            : lead.stage === 'Contacted'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}>
                          {lead.stage || 'New'}
                        </span>
                      </td>

                      {/* Score Badge */}
                      <td className="py-3 px-4">
                        {isHot ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-400">
                            <Flame className="h-3 w-3 fill-rose-400" /> {lead.score || 85}
                          </span>
                        ) : isWarm ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                            <Zap className="h-3 w-3 fill-amber-400" /> {lead.score || 50}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <Snowflake className="h-3 w-3" /> {lead.score || 15}
                          </span>
                        )}
                      </td>

                      {/* Outreach Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            title="WhatsApp Chat"
                            onClick={() => {
                              const tpl = WHATSAPP_TEMPLATES[0].buildText(lead);
                              openWhatsApp(lead.whatsapp || lead.phone, tpl);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>
                          <a
                            href={`tel:${(lead.phone || '').replace(/\s+/g, '')}`}
                            title="Call Phone"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 hover:bg-blue-500 text-blue-400 hover:text-white transition cursor-pointer"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 italic">
                    No leads match your current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
