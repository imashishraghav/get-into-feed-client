import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send, Sparkles, User, Building, ExternalLink } from 'lucide-react';
import { WHATSAPP_TEMPLATES, openWhatsApp } from '../data/templates.js';

export function WhatsAppHubView({ leads = [] }) {
  const [selectedLeadId, setSelectedLeadId] = useState(leads.length > 0 ? leads[0].id : '');
  const [customName, setCustomName] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customService, setCustomService] = useState('Performance Marketing (Google & Meta Ads)');
  const [customPhone, setCustomPhone] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Determine active lead context
  const activeLead = leads.find((l) => l.id === Number(selectedLeadId)) || {
    name: customName || 'Rohit Verma',
    company: customCompany || 'Aura Living D2C',
    service: customService || 'Performance Marketing',
    phone: customPhone || '+91 98765 43210',
    whatsapp: customPhone || '+91 98765 43210'
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (text) => {
    openWhatsApp(activeLead.whatsapp || activeLead.phone, text);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <MessageSquare className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-white">High-Converting WhatsApp Outreach Hub</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Research shows that responding on WhatsApp within <strong className="text-white">5 minutes</strong> yields a 21x higher connection rate than email. Use these battle-tested agency scripts tailored to GetIntoFeed services.
            </p>
          </div>

          {/* Quick Lead Selector */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3 shrink-0">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Inject Lead Context
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-lime-400 focus:outline-none"
              >
                <option value="">Custom Demo Lead</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.company || 'No Company'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {WHATSAPP_TEMPLATES.map((tmpl) => {
          const messageText = tmpl.buildText(activeLead);
          const isCopied = copiedId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {tmpl.category}
                    </span>
                    <h3 className="text-xs font-bold text-white">{tmpl.title}</h3>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{tmpl.description}</p>

                {/* Pre-rendered WhatsApp Chat Bubble */}
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 font-sans text-xs text-slate-200 whitespace-pre-line leading-relaxed relative">
                  {messageText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(tmpl.id, messageText)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleSend(messageText)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
