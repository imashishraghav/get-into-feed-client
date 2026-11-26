import React, { useState } from 'react';
import { PROPOSAL_TEMPLATES, generateTokenizedProposal } from '../data/proposalTemplates.js';
import { whatsAppAdapter, emailAdapter } from '../adapters/index.js';

export function PublicProposalModal({ isOpen, lead, onClose, onConvertContract, onShowToast }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('sprint_30d_performance');
  const [proposalData, setProposalData] = useState(() =>
    lead ? generateTokenizedProposal({ lead, templateId: 'sprint_30d_performance' }) : null
  );
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !lead) return null;

  const currentTemplate = PROPOSAL_TEMPLATES.find((t) => t.id === selectedTemplateId) || PROPOSAL_TEMPLATES[0];

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id);
    const updated = generateTokenizedProposal({ lead, templateId: id });
    setProposalData(updated);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(proposalData.public_url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onShowToast?.('Tokenized proposal link copied to clipboard!');
  };

  const handleSendWhatsApp = async () => {
    const text = `Hi ${lead.name.split(' ')[0]}! Your 30-Day Growth Sprint proposal is ready. Review here: ${proposalData.public_url}`;
    await whatsAppAdapter.sendMessage({ to: lead.phone, message: text });
    onShowToast?.(`Proposal link sent to ${lead.name} on WhatsApp!`);
  };

  const handleSendEmail = async () => {
    await emailAdapter.sendEmail({
      to: lead.email,
      subject: `Proposal: ${currentTemplate.title} for ${lead.company}`,
      text: `Hi ${lead.name}, please review your growth proposal: ${proposalData.public_url}`
    });
    onShowToast?.(`Proposal sent to ${lead.email}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                PROPOSAL BUILDER
              </span>
              <span className="text-[10px] text-slate-400">Tokenized Link View</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {currentTemplate.title}
            </h2>
            <p className="text-[11px] text-slate-500">Prepared for <strong>{lead.name}</strong> ({lead.company})</p>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold hover:bg-slate-200">
            ✕
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto">
          {PROPOSAL_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedTemplateId === t.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.title.split(' ')[0]} {t.title.split(' ')[1]} ({t.formattedFee.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Proposal Document Body (Client Preview) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#fafafa] dark:bg-slate-950">
          
          {/* Executive Summary Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EXECUTIVE SUMMARY</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
              {currentTemplate.overview}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-slate-400 block">MONTHLY RETAINER</span>
                <span className="font-black text-emerald-600 text-sm">{currentTemplate.formattedFee}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">TARGET PERFORMANCE</span>
                <span className="font-black text-blue-600 text-sm">{currentTemplate.targetRoas}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">COMMITMENT</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{currentTemplate.duration}</span>
              </div>
            </div>
          </div>

          {/* Scope of Work Deliverables */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KEY SPRINT DELIVERABLES</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTemplate.deliverables.map((del, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium leading-tight">{del}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Payment Schedule */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAYMENT & SPRINT TERMS</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentTemplate.terms}
            </p>
          </div>

        </div>

        {/* Footer Actions & Public Dispatch Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5"
            >
              <span>🔗</span> {isCopied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <span>💬</span> Send WhatsApp
            </button>
            <button
              onClick={handleSendEmail}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
            >
              <span>✉️</span> Email Link
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onConvertContract(proposalData);
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center gap-1.5 transition shadow-xs"
          >
            <span>✍️</span> Convert to Digio E-Sign Contract ➔
          </button>

        </div>

      </div>
    </div>
  );
}
