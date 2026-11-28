import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Target, 
  Video, 
  Receipt, 
  MessageSquare, 
  Activity, 
  ArrowRight,
  Command,
  X
} from 'lucide-react';

export function CommandPalette({ 
  isOpen, 
  onClose, 
  leads = [], 
  onSelectLead, 
  onNavigate, 
  onAddLead 
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLeads = query.trim()
    ? leads.filter((l) =>
        (l.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (l.company || '').toLowerCase().includes(query.toLowerCase()) ||
        (l.city || '').toLowerCase().includes(query.toLowerCase()) ||
        (l.service_interest || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : leads.slice(0, 4);

  const navRoutes = [
    { id: 'overview', label: 'Go to Command Center', icon: Activity, desc: 'Agency Pulse & SLA Queue' },
    { id: 'leads', label: 'Go to Lead Pipeline', icon: Target, desc: '60 Deals & Human Qualification' },
    { id: 'inbox', label: 'Go to Unified Inbox', icon: MessageSquare, desc: 'WhatsApp Cloud API & Exotel Calls' },
    { id: 'reels', label: 'Go to 12 Reels Studio', icon: Video, desc: 'Monthly Deliverables & Review Player' },
    { id: 'billing', label: 'Go to GST & Billing', icon: Receipt, desc: 'Delhi 07 Invoices & ICICI UPI QR' },
  ];

  const matchingRoutes = query.trim()
    ? navRoutes.filter(r => r.label.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase()))
    : navRoutes;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center pt-24 p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-modal overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Search Bar */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search brand, client, or city..."
            className="flex-1 text-[14px] bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
          />
          <kbd className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results Stream */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 custom-scrollbar">
          
          {/* Quick Primary Actions */}
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
              PRIMARY ACTIONS
            </span>
            <button
              onClick={() => {
                onClose();
                onAddLead();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-900 transition text-[13px]"
            >
              <span className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-[#D4FF00] text-slate-950 flex items-center justify-center font-bold text-xs">
                  +
                </span>
                <span className="font-semibold">Create New Lead</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Quick Ingestion</span>
            </button>
          </div>

          {/* Quick Navigation Routes */}
          {matchingRoutes.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                NAVIGATION
              </span>
              <div className="space-y-0.5">
                {matchingRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.id}
                      onClick={() => {
                        onClose();
                        onNavigate(route.id);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition text-[13px]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900">{route.label}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">{route.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                LEADS &amp; DEALS ({filteredLeads.length})
              </span>
              <div className="space-y-0.5">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      onClose();
                      onSelectLead(lead);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition text-[13px]"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {lead.company || lead.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {lead.name} • {lead.city || 'Delhi NCR'} • {lead.service_interest}
                      </span>
                    </div>
                    <span className="text-[12px] font-semibold text-slate-900 num-tabular">
                      {lead.budget_formatted || `₹${((lead.budget_monthly || 75000) / 100000).toFixed(1)}L`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with <strong>↑</strong> <strong>↓</strong> and <strong>Enter</strong></span>
          <span>FeedOS Quick Command</span>
        </div>

      </div>
    </div>
  );
}