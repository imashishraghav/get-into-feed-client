import React, { useState, useEffect } from 'react';
import { 
  X, Phone, MessageSquare, Mail, Building, Globe, MapPin, 
  Clock, Shield, Tag, Calendar, User, CheckCircle2, AlertCircle,
  Flame, Zap, Snowflake, Send, PhoneCall, FileText, Share2, Sparkles
} from 'lucide-react';
import { fetchLead360, addLeadNote, logLeadActivity, updateLeadStage, updateLeadDetails } from '../utils/api.js';
import { WHATSAPP_TEMPLATES, openWhatsApp } from '../data/templates.js';

export function Lead360Modal({ leadId, onClose, onLeadUpdated }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  
  // Call logger state
  const [callOutcome, setCallOutcome] = useState('Connected - Call Completed');
  const [callNotes, setCallNotes] = useState('');
  const [loggingCall, setLoggingCall] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'templates' | 'call'

  useEffect(() => {
    if (!leadId) return;
    loadLead();
  }, [leadId]);

  const loadLead = async () => {
    setLoading(true);
    const data = await fetchLead360(leadId);
    setLead(data);
    setLoading(false);
  };

  const handleStageChange = async (newStage) => {
    if (!lead) return;
    const res = await updateLeadStage(lead.id, newStage);
    if (res.success) {
      setLead(prev => ({ ...prev, stage: newStage }));
      onLeadUpdated();
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim() || !lead) return;
    setSubmittingNote(true);
    const res = await addLeadNote(lead.id, noteContent);
    if (res.success && res.note) {
      setLead(prev => ({
        ...prev,
        notes: [res.note, ...(prev.notes || [])],
        activities: [
          {
            id: Date.now(),
            type: 'note_added',
            summary: `Note: ${noteContent.substring(0, 60)}...`,
            completed_at: 'Just now'
          },
          ...(prev.activities || [])
        ]
      }));
      setNoteContent('');
      onLeadUpdated();
    }
    setSubmittingNote(false);
  };

  const handleLogCall = async (e) => {
    e.preventDefault();
    if (!lead) return;
    setLoggingCall(true);
    const summary = callNotes ? `${callOutcome}: ${callNotes}` : callOutcome;
    const res = await logLeadActivity(lead.id, {
      type: 'call',
      summary,
      outcome: callOutcome
    });
    if (res.success && res.activity) {
      setLead(prev => ({
        ...prev,
        activities: [res.activity, ...(prev.activities || [])],
        stage: prev.stage === 'New' ? 'Contacted' : prev.stage
      }));
      setCallNotes('');
      setActiveTab('notes');
      onLeadUpdated();
    }
    setLoggingCall(false);
  };

  const handleSendTemplate = (tpl) => {
    if (!lead) return;
    const text = tpl.buildText(lead);
    openWhatsApp(lead.whatsapp || lead.phone, text);
    // Log as activity
    logLeadActivity(lead.id, {
      type: 'whatsapp',
      summary: `WhatsApp Sent: ${tpl.title}`,
      outcome: 'Template Delivered'
    }).then(res => {
      if (res.success && res.activity) {
        setLead(prev => ({
          ...prev,
          activities: [res.activity, ...(prev.activities || [])]
        }));
        onLeadUpdated();
      }
    });
  };

  if (!leadId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
              {lead?.lead_code || `LEAD-${leadId}`}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              {loading ? 'Loading Lead Profile...' : (lead?.name || 'Inbound Lead')}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {lead && (
              <select
                value={lead.stage || 'New'}
                onChange={(e) => handleStageChange(e.target.value)}
                className="bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:border-[#D4FF00] focus:outline-none cursor-pointer"
              >
                <option value="New">1. New Inbound</option>
                <option value="Contacted">2. Attempted Contact</option>
                <option value="Discovery">3. Discovery Call</option>
                <option value="Proposal">4. Proposal Sent</option>
                <option value="Negotiation">5. In Negotiation</option>
                <option value="Won">6. Closed Won (Client)</option>
                <option value="Lost">Closed Lost</option>
              </select>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <div className="h-8 w-8 border-2 border-[#D4FF00] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs">Loading complete 360° lead dossier...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 custom-scrollbar">
            
            {/* COLUMN 1: FIRMOGRAPHICS & DIRECT ACTION (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Profile Card */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Client Details
                  </span>
                  {lead.score >= 75 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                      <Flame className="h-3 w-3 fill-rose-400" /> HOT SCORE: {lead.score}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Zap className="h-3 w-3 fill-amber-400" /> WARM: {lead.score}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-100">{lead.name}</h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <Building className="h-3.5 w-3.5 text-slate-500" />
                    <span>{lead.company || 'Direct Client'}</span>
                  </p>
                </div>

                {/* 1-Click Action Buttons */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const introTpl = WHATSAPP_TEMPLATES[0].buildText(lead);
                      openWhatsApp(lead.whatsapp || lead.phone, introTpl);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 px-3 transition cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${(lead.phone || '').replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3 transition cursor-pointer shadow-sm"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Client</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono text-slate-200 font-medium">{lead.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-200 truncate max-w-[180px]">{lead.email || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City / Region:</span>
                    <span className="text-slate-200">{lead.city || 'Delhi NCR'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Budget:</span>
                    <span className="text-emerald-400 font-bold">{lead.budget || 'Inbound'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="text-blue-400 font-medium">{lead.service}</span>
                  </div>
                </div>
              </div>

              {/* Message Box */}
              {lead.message && (
                <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Client Brief / Note
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                    {lead.message}
                  </p>
                </div>
              )}
            </div>

            {/* COLUMN 2: WORKSPACE, NOTES & WHATSAPP TEMPLATES (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-slate-950/40 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'templates'
                      ? 'bg-[#D4FF00] text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>WhatsApp Scripts</span>
                </button>

                <button
                  onClick={() => setActiveTab('call')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'call'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Log Call</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Team Notes</span>
                </button>
              </div>

              {/* TAB 1: WHATSAPP TEMPLATES */}
              {activeTab === 'templates' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-400">
                    Click any script to launch WhatsApp with this client's details pre-filled:
                  </p>
                  {WHATSAPP_TEMPLATES.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => handleSendTemplate(tpl)}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/60 hover:bg-emerald-950/10 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                          {tpl.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          {tpl.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {tpl.buildText(lead)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: LOG CALL */}
              {activeTab === 'call' && (
                <form onSubmit={handleLogCall} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Call Outcome
                    </label>
                    <select
                      value={callOutcome}
                      onChange={(e) => setCallOutcome(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Connected - Spoke with Decision Maker">Connected - Spoke with Decision Maker</option>
                      <option value="Connected - Follow-up Scheduled">Connected - Follow-up Scheduled</option>
                      <option value="Left Voicemail / Audio Note">Left Voicemail / Audio Note</option>
                      <option value="No Answer / Busy">No Answer / Busy</option>
                      <option value="Wrong Number / Invalid">Wrong Number / Invalid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Key Takeaways / Conversation Summary
                    </label>
                    <textarea
                      rows={3}
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="e.g. Discussed Google Ads scaling; interested in ₹50k package; meeting fixed for Thursday."
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loggingCall}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {loggingCall ? 'Saving Call Record...' : 'Save Call & Update Timeline'}
                  </button>
                </form>
              )}

              {/* TAB 3: NOTES & TIMELINE */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Add Note Input */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal note or next step..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl focus:border-[#D4FF00] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submittingNote || !noteContent.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-[#D4FF00] hover:text-slate-950 text-white font-bold text-xs transition cursor-pointer disabled:opacity-40"
                    >
                      Add Note
                    </button>
                  </form>

                  {/* Activity History Stream */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Activity &amp; Interaction Stream
                    </span>
                    
                    {lead.activities && lead.activities.length > 0 ? (
                      lead.activities.map((act) => (
                        <div key={act.id} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                            <span className="font-bold text-slate-400 uppercase">{act.type}</span>
                            <span>{act.completed_at}</span>
                          </div>
                          <p className="text-slate-300">{act.summary}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-600 italic">No previous interactions logged.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 3: MARKETING ATTRIBUTION & TECH DATA (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800/80 pb-1.5">
                  Attribution Intelligence
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Traffic Source</span>
                    <span className="text-slate-200 font-semibold">{lead.source || 'Website Inbound'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Origin Landing Page</span>
                    <span className="text-slate-300 truncate block text-[11px]" title={lead.page_url}>
                      {lead.page_title || lead.page_url || '/'}
                    </span>
                  </div>

                  {lead.gclid && (
                    <div className="p-2 rounded bg-blue-950/40 border border-blue-900/50">
                      <span className="text-blue-400 font-mono text-[10px] block font-bold">Google Ads (GCLID)</span>
                      <span className="text-slate-300 font-mono text-[10px] truncate block">{lead.gclid}</span>
                    </div>
                  )}

                  {lead.fbclid && (
                    <div className="p-2 rounded bg-purple-950/40 border border-purple-900/50">
                      <span className="text-purple-400 font-mono text-[10px] block font-bold">Meta Ads (FBCLID)</span>
                      <span className="text-slate-300 font-mono text-[10px] truncate block">{lead.fbclid}</span>
                    </div>
                  )}

                  {(lead.utm_source || lead.utm_campaign) && (
                    <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">UTM Source:</span>
                        <span className="text-slate-300 font-mono">{lead.utm_source || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">UTM Campaign:</span>
                        <span className="text-slate-300 font-mono">{lead.utm_campaign || '—'}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span>IP: {lead.ip_address || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
