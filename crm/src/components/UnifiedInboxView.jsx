import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Sparkles, 
  Clock, 
  Check, 
  Filter,
  User,
  ShieldCheck
} from 'lucide-react';
import { AGENCY_TEMPLATES } from '../data/templates.js';
import { whatsAppAdapter, emailAdapter } from '../adapters/index.js';
import { maskSensitiveLeadData } from '../utils/rbac.js';
import { resolveSlaOnFirstContact } from '../utils/slaManager.js';

export function UnifiedInboxView({ leads = [], onShowToast, onUpdateLead, currentUser }) {
  const [selectedLead, setSelectedLead] = useState(leads[0] || null);
  const [filterChannel, setFilterChannel] = useState('all'); // 'all', 'whatsapp', 'email', 'internal'
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // 'en' or 'hi'
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      leadId: leads[0]?.id,
      channel: 'whatsapp',
      direction: 'inbound',
      sender: leads[0]?.name || 'Vikramaditya',
      text: 'Hi GetIntoFeed, we are spending ₹1.5L on Meta ads right now. Need 12 video reels to lower our lead cost.',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: uuidv4(),
      leadId: leads[0]?.id,
      channel: 'whatsapp',
      direction: 'outbound',
      sender: 'Ashish (Founder)',
      text: 'Hi Vikramaditya! Great connecting. Just reviewing your luxury realty website. Sending you 3 quick creative recommendations.',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: uuidv4(),
      leadId: leads[0]?.id,
      channel: 'email',
      direction: 'outbound',
      sender: 'GetIntoFeed Growth <growth@getintofeed.com>',
      text: 'Subject: Your 30-Day Creative Growth Sprint Proposal\nPDF Attached: GetIntoFeed_Growth_Proposal.pdf (1.8MB)',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: uuidv4(),
      leadId: leads[0]?.id,
      channel: 'internal',
      direction: 'note',
      sender: 'Rahul (Sales Lead)',
      text: '@Ashish Client is ready to pay upfront via UPI once Delhi GST invoice is shared.',
      timestamp: new Date(Date.now() - 300000).toISOString()
    }
  ]);

  const displayLead = selectedLead ? maskSensitiveLeadData(selectedLead, currentUser?.role) : null;

  const handleApplyTemplate = (tpl) => {
    if (!selectedLead) return;
    const body = selectedLanguage === 'hi' ? tpl.hi(selectedLead) : tpl.en(selectedLead);
    setInputText(body);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedLead) return;

    if (filterChannel === 'email') {
      await emailAdapter.sendEmail({
        to: selectedLead.email,
        subject: `GetIntoFeed Growth Sprint — Update for ${selectedLead.company || selectedLead.brand}`,
        text: inputText.trim()
      });
      onShowToast?.(`Email dispatched to ${selectedLead.email}`);
    } else {
      await whatsAppAdapter.sendMessage({
        to: selectedLead.phone,
        message: inputText.trim()
      });
      onShowToast?.(`WhatsApp delivered to ${selectedLead.phone}!`);
    }

    // Resolve Speed-to-Lead SLA on verified interaction
    if (!selectedLead.slaResolved) {
      const channelType = filterChannel === 'email' ? 'email' : 'whatsapp';
      const updated = resolveSlaOnFirstContact(selectedLead, channelType, 'Ashish (Founder)');
      setSelectedLead(updated);
      onUpdateLead?.(updated);
      onShowToast?.(`First contact logged via ${channelType}! SLA Met 🟢`);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        leadId: selectedLead.id,
        channel: filterChannel === 'email' ? 'email' : 'whatsapp',
        direction: 'outbound',
        sender: 'Ashish (Founder)',
        text: inputText.trim(),
        timestamp: new Date().toISOString()
      }
    ]);
    setInputText('');
  };

  const filteredMessages = messages.filter((m) => {
    if (filterChannel === 'all') return true;
    return m.channel === filterChannel;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-subtle flex flex-col md:flex-row h-[700px]">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT: CONVERSATION THREADS LIST
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">
              Conversations
            </h3>
            <span className="text-[11px] text-slate-500">
              Omnichannel WhatsApp &amp; Email
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            Live Stream
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {leads.slice(0, 10).map((l) => {
            const masked = maskSensitiveLeadData(l, currentUser?.role);
            const isSelected = selectedLead?.id === l.id;

            return (
              <div
                key={l.id}
                onClick={() => setSelectedLead(l)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-white border-l-2 border-slate-900 shadow-2xs'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-900 text-[13px] truncate">
                    {l.company || l.brand || l.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                </div>
                <div className="text-[12px] text-slate-500 truncate mt-0.5">
                  {masked.name || masked.contact} • {l.city || 'Delhi NCR'}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    WhatsApp
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium truncate">
                    {l.dealType || 'Growth Sprint'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: ACTIVE MESSAGE STREAM & COMPOSER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-slate-900">
                {selectedLead?.company || selectedLead?.brand || selectedLead?.name}
              </h3>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {displayLead?.phone}
              </span>
              <span className="text-[11px] font-bold uppercase bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                {selectedLead?.dealType || 'Sprint'}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Contact: {displayLead?.name || displayLead?.contact} • {selectedLead?.service_interest}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
            {['all', 'whatsapp', 'email', 'internal'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterChannel(c)}
                className={`px-2.5 py-1 rounded-md capitalize transition ${
                  filterChannel === c
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {filteredMessages.map((msg) => {
            const isInternal = msg.channel === 'internal';
            const isOutbound = msg.direction === 'outbound';

            if (isInternal) {
              return (
                <div 
                  key={msg.id}
                  className="mx-auto max-w-xl bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[12px] text-amber-900"
                >
                  <div className="flex items-center justify-between font-semibold text-[11px] text-amber-800 mb-1">
                    <span>Internal Note • {msg.sender}</span>
                    <span className="font-mono text-[10px] text-amber-700">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                    isOutbound
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Agency Templates & Tone Selector */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3 overflow-x-auto text-[12px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Tone:</span>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedLanguage === 'en'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedLanguage === 'hi'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hinglish 🇮🇳
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {AGENCY_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleApplyTemplate(t)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition"
              >
                {t.title.split(' ')[0]} {t.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex gap-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type ${filterChannel === 'email' ? 'email' : 'WhatsApp'} message or @mention teammate...`}
            className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            aria-label="Send message"
            className="bg-[#D4FF00] hover:bg-[#c4ec00] text-slate-950 font-bold px-4 rounded-xl text-[13px] transition flex items-center justify-center shrink-0 shadow-xs focus:ring-2 focus:ring-[#D4FF00]"
          >
            <Send className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>Send</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default UnifiedInboxView;
