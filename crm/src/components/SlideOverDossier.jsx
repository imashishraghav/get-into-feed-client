import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  QrCode,
  Copy,
  Mic,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { whatsAppAdapter, telephonyAdapter, paymentAdapter } from '../adapters/index.js';
import { maskSensitiveLeadData } from '../utils/rbac.js';
import { SlaCountdown } from './ui/SlaCountdown.jsx';
import { resolveSlaOnFirstContact } from '../utils/slaManager.js';
import { SAC_PRICE_BOOK, SECTION_393_TDS_RATES } from '../utils/priceBook.js';

export function SlideOverDossier({
  lead,
  isOpen,
  onClose,
  userRole = 'Admin',
  onUpdateLead,
  onSendProposal,
  onOpenDeliveryOS,
  onGenerateGst,
  onShowToast
}) {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'whatsapp' | 'proposal_gst'
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [generatedPayLink, setGeneratedPayLink] = useState(null);

  // Apply RBAC data masking if user is editor or freelancer
  const displayLead = lead ? maskSensitiveLeadData(lead, userRole) : null;

  // Load chat history
  useEffect(() => {
    if (!lead) return;
    whatsAppAdapter.getChatHistory(lead.phone).then((history) => {
      if (history.length > 0) {
        setChatMessages(history);
      } else {
        setChatMessages([
          {
            id: 'init_msg',
            from: lead.phone,
            direction: 'inbound',
            message: `Hi GetIntoFeed! We saw your 12 Reels Studio case study and want to explore marketing services for ${lead.company || lead.brand || 'our brand'}.`,
            timestamp: lead.created_at ? new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
          }
        ]);
      }
    });
  }, [lead]);

  if (!displayLead) return null;

  const handleSendWhatsApp = async () => {
    if (!newMessage.trim()) return;
    const msgText = newMessage.trim();
    const res = await whatsAppAdapter.sendMessage({
      to: displayLead.phone,
      message: msgText
    });
    setChatMessages((prev) => [
      ...prev,
      {
        id: res.messageId,
        from: '+919811099999',
        direction: 'outbound',
        message: msgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');

    // Phase A #4: Resolve SLA on first contact interaction
    if (!lead.slaResolved) {
      const updatedLead = resolveSlaOnFirstContact(lead, 'whatsapp', 'Ashish (Founder)');
      onUpdateLead?.(updatedLead);
      onShowToast?.(`WhatsApp delivered! First-contact Speed-to-Lead SLA marked Met 🟢`);
    } else {
      onShowToast?.(`WhatsApp message delivered to ${displayLead.phone}`);
    }
  };

  const handleTriggerCall = async () => {
    setIsCalling(true);
    await telephonyAdapter.initiateCall({
      customerPhone: displayLead.phone,
      customerName: displayLead.name || displayLead.contact,
      agentId: 'ashish_founder'
    });
    
    setTimeout(() => {
      setIsCalling(false);
      // Phase A #4: Resolve SLA on first contact call
      if (!lead.slaResolved) {
        const updatedLead = resolveSlaOnFirstContact(lead, 'call', 'Ashish (Founder)');
        onUpdateLead?.(updatedLead);
        onShowToast?.(`Call placed via Exotel! Speed-to-Lead SLA marked Met 🟢`);
      } else {
        onShowToast?.(`Call placed via Exotel to ${displayLead.name || displayLead.contact}!`);
      }
    }, 1500);
  };

  const handleGeneratePayLink = async () => {
    const fee = lead.dealValue || lead.budget_monthly || 79000;
    const res = await paymentAdapter.createPaymentLink({
      amount: fee,
      baseAmount: fee,
      gstIncluded: false,
      stateCode: lead.stateCode || '07',
      sacCode: lead.sacCode || '998361',
      customerName: displayLead.name || displayLead.contact,
      customerEmail: displayLead.email,
      customerPhone: displayLead.phone,
      description: `30-Day Growth Sprint Retainer — ${lead.company || lead.brand}`
    });
    setGeneratedPayLink(res.short_url);
    onShowToast?.('Razorpay UPI payment link created successfully!');
  };

  const sacEntry = SAC_PRICE_BOOK[lead.serviceId] || SAC_PRICE_BOOK['meta-ads'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] transition-opacity pointer-events-auto"
      />

      {/* 440px Right Drawer Panel */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[440px] max-w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto transition-transform duration-200 ease-out animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Lead dossier details"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-[#F8F9FB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {lead.id?.slice(0, 8)}...
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {lead.stage || 'Captured'}
              </span>
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                {lead.dealType || 'Growth Sprint'}
              </span>
            </div>
            <h2 className="text-[18px] font-semibold text-slate-900 mt-1.5 leading-tight">
              {lead.company || lead.brand || lead.name}
            </h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {displayLead.name || displayLead.contact} • {lead.city || 'Delhi NCR'}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dossier panel"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* 3 Clean Tabs */}
        <div className="px-5 border-b border-slate-200 flex items-center gap-6 bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-[13px] font-semibold border-b-2 transition -mb-px ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview &amp; Brief
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 text-[13px] font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            WhatsApp &amp; Voice
            {!lead.slaResolved && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('proposal_gst')}
            className={`py-3 text-[13px] font-semibold border-b-2 transition -mb-px ${
              activeTab === 'proposal_gst'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Proposal &amp; GST
          </button>
        </div>

        {/* Drawer Body Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: OVERVIEW & BRIEF */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Isolated SLA Countdown Micro-Component */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">
                    Speed-to-Lead SLA
                  </span>
                  <div className="mt-1">
                    <SlaCountdown 
                      deadline={displayLead.slaDeadlineAt}
                      slaResolved={displayLead.slaResolved}
                      speedToLeadSeconds={displayLead.speedToLeadSeconds}
                      firstContactChannel={displayLead.firstContactChannel}
                    />
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium bg-white border border-slate-200 px-2 py-1 rounded-md">
                  5-Min SLA Window
                </span>
              </div>

              {/* Deal Parameters */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Deal Parameters &amp; Compliance
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Deal Structure</span>
                    <span className="font-semibold text-slate-900">
                      {lead.dealType || 'Growth Sprint'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Contract Value</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {displayLead.budget_formatted || `₹${((lead.dealValue || lead.budget_monthly || 75000)/100000).toFixed(2)} Lakh`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Primary Service</span>
                    <span className="font-medium text-slate-800">
                      {lead.service_interest || 'Performance Ads'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">SAC Code</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {lead.sacCode || '998361'}
                    </span>
                  </div>
                </div>

                {/* CA Review Flag Warning */}
                {sacEntry?.caReviewFlag && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
                    <span>{sacEntry.caReviewFlag}</span>
                  </div>
                )}
              </div>

              {/* DPDP Digital Consent Card */}
              <div className="p-3 rounded-xl border flex items-center justify-between text-[11px]">
                {lead.dpdpConsent?.consentGiven ? (
                  <div className="flex items-center gap-2 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                    <div>
                      <span className="font-semibold block">DPDP Act Explicit Consent Verified</span>
                      <span className="text-slate-500 text-[10px]">Policy {lead.dpdpConsent.consentPolicyVersion} • Timestamp recorded</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                    <div>
                      <span className="font-semibold block">Consent Missing (Manual Intake)</span>
                      <span className="text-amber-700 text-[10px]">No verifiable digital consent recorded for this contact.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Human-Written Discovery Brief */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-[13px] mb-2">
                  <FileText className="w-4 h-4 text-[#0F172A]" aria-hidden="true" />
                  <span>Lead Brief &amp; Discovery Notes</span>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {lead.bottleneck
                    ? `Reported challenge: "${lead.bottleneck}".`
                    : 'No discovery notes recorded yet. Log rep actions and client feedback after first touch.'}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Source: <strong className="text-slate-900">{lead.source || 'Inbound'}</strong></span>
                  <span className="text-slate-700 bg-white px-2 py-0.5 rounded font-semibold border border-slate-200">
                    Human Qualification
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WHATSAPP & VOICE */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[12px] font-semibold text-slate-900 block">
                    WhatsApp Cloud API Stream
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Official GetIntoFeed WhatsApp • First touch resolves SLA
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerCall}
                  disabled={isCalling}
                  aria-label="Initiate Exotel click to call"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-semibold rounded-lg transition"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isCalling ? 'Dialing...' : 'Exotel Call'}</span>
                </button>
              </div>

              {/* Chat Thread */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 min-h-[220px] max-h-[300px] overflow-y-auto">
                {chatMessages.map((msg) => {
                  const isOutbound = msg.direction === 'outbound' || msg.from?.includes('98110');
                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] px-3.5 py-2 rounded-xl text-[12px] leading-relaxed ${
                          isOutbound 
                            ? 'bg-slate-900 text-white rounded-br-xs' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 tabular-nums px-1">
                        {msg.timestamp || 'Today'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type WhatsApp reply... (English ya Hinglish)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                    className="flex-1 bg-white border border-slate-200 text-[13px] text-slate-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition"
                  />
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    aria-label="Send WhatsApp message"
                    className="bg-[#D4FF00] hover:bg-[#c4ec00] text-slate-950 px-3.5 py-2 rounded-xl font-semibold text-[13px] flex items-center gap-1 transition"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPOSAL & GST */}
          {activeTab === 'proposal_gst' && (
            <div className="space-y-4">
              {/* Proposal Trigger Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-semibold text-slate-900">
                    30-Day Growth Sprint Proposal
                  </h4>
                  <span className="text-[12px] font-semibold text-slate-900 tabular-nums">
                    ₹79,000 / mo
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Includes 12 High-Converting Reels, Paid Ads Management (ROAS pacing), and Web CRO speed sprint.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSendProposal && onSendProposal(lead)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-[12px] py-2 px-3 rounded-lg transition text-center"
                  >
                    Review &amp; Send Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenDeliveryOS && onOpenDeliveryOS(lead)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-[12px] py-2 px-3 rounded-lg transition"
                  >
                    12 Reels Studio
                  </button>
                </div>
              </div>

              {/* Delhi GST & Sec 393 Invoicing Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-[12px] font-semibold text-slate-900">
                    Delhi GST (07) &amp; Sec 393 TDS
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    SAC {lead.sacCode || '998361'}
                  </span>
                </div>

                <div className="space-y-1.5 text-[12px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Base Taxable Fee</span>
                    <span className="tabular-nums font-medium text-slate-900">₹79,000</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Delhi GST (CGST 9% + SGST 9%)</span>
                    <span className="tabular-nums text-slate-700">+₹14,220</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200 font-semibold text-slate-900">
                    <span>Gross Invoice Total</span>
                    <span className="tabular-nums">₹93,220</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-700 text-[11px]">
                    <span>Sec 393 Withholding (Contractor 2%)</span>
                    <span className="tabular-nums">-₹1,580</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>Net Receivable in ICICI</span>
                    <span className="tabular-nums text-emerald-700 font-black">₹91,640</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onGenerateGst && onGenerateGst(lead)}
                    className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-[12px] py-2 rounded-lg transition"
                  >
                    Generate Delhi GST Invoice (GIF/26-27/0101)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#F8F9FB] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenDeliveryOS && onOpenDeliveryOS(lead)}
            className="text-[12px] font-semibold text-slate-900 hover:text-slate-950 flex items-center gap-1"
          >
            Open in Delivery OS <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-slate-500 hover:text-slate-800 px-3 py-1.5 font-medium rounded-lg hover:bg-slate-200/50 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default SlideOverDossier;
