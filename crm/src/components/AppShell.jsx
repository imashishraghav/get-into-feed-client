import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Target, 
  MessageSquare, 
  Video, 
  Receipt, 
  Search, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Bell, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Command,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { seedLeads } from '../data/seedLeads.js';
import { ACTIVE_PROJECTS, getProjectByLeadId } from '../data/projectData.js';
import { ROLES, filterClientTenantData } from '../utils/rbac.js';
import { useUndoToast } from '../hooks/useUndoToast.js';
import { UndoToast } from './ui/UndoToast.jsx';
import { ModalFocusTrap } from './ui/ModalFocusTrap.jsx';

// Views
import { CommandCenterView } from './CommandCenterView.jsx';
import { LeadPipelineView } from './LeadPipelineView.jsx';
import { ReelsStudioView } from './ReelsStudioView.jsx';
import { BillingStudioView } from './BillingStudioView.jsx';
import { UnifiedInboxView } from './UnifiedInboxView.jsx';

// Drawers & Modals
import { SlideOverDossier } from './SlideOverDossier.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { QuickAddModal } from './QuickAddModal.jsx';
import { PublicProposalModal } from './PublicProposalModal.jsx';
import { EsignContractModal } from './EsignContractModal.jsx';
import { GstInvoiceModal } from './GstInvoiceModal.jsx';

export function AppShell() {
  const { currentUser, switchRole, demoUsers } = useAuth();
  const { toastState, showUndoToast, triggerUndo, dismissToast } = useUndoToast();

  // Zone 1: Rail State (Collapsed vs Expanded)
  const [isRailExpanded, setIsRailExpanded] = useState(true);

  // Active Primary Module: Exactly 5 routes ('overview' | 'leads' | 'inbox' | 'reels' | 'billing')
  const [currentModule, setCurrentModule] = useState(() => {
    if (typeof window !== 'undefined') {
      const requested = new URLSearchParams(window.location.search).get('module');
      const allowed = ['overview', 'leads', 'inbox', 'reels', 'billing'];
      if (requested && allowed.includes(requested)) return requested;
    }
    return currentUser?.role === ROLES.CLIENT ? 'reels' : 'overview';
  });

  // Leads & Pipeline State
  const [leads, setLeads] = useState(seedLeads);
  const [selectedLead, setSelectedLead] = useState(null); // Zone 3 Dossier: Closed by default!
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('action') === 'quick_add';
  });
  const [billingCreatorTrigger, setBillingCreatorTrigger] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [leadForProposalModal, setLeadForProposalModal] = useState(null);
  const [activeProposalForEsign, setActiveProposalForEsign] = useState(null);
  const [leadForGstInvoiceModal, setLeadForGstInvoiceModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter leads based on role & client tenant isolation
  let visibleLeads = filterClientTenantData(leads, currentUser);
  if (currentUser?.role === ROLES.SALES_REP) {
    visibleLeads = visibleLeads.filter(
      (l) => l.assigned_to?.includes('Rahul') || l.assigned_to?.includes('Priya')
    );
  }

  const handleAddLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    setSelectedLead(newLead);
    showToast(`New lead added: ${newLead.company || newLead.name}!`);
  };

  const handleUpdateLead = (updatedLead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    if (selectedLead?.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Command Center', icon: Activity, subtitle: 'Agency Pulse' },
    { id: 'leads', label: 'Lead Pipeline', icon: Target, subtitle: 'Meta & D2C Leads' },
    { id: 'inbox', label: 'Unified Inbox', icon: MessageSquare, subtitle: 'WhatsApp & Calls' },
    { id: 'reels', label: '12 Reels Studio', icon: Video, subtitle: 'Creative Delivery' },
    { id: 'billing', label: 'GST & Billing', icon: Receipt, subtitle: 'Delhi 07 & UPI' },
  ];

  const getPrimaryCta = () => {
    switch (currentModule) {
      case 'leads':
      case 'overview':
        return { label: '+ New Lead', onClick: () => setIsQuickAddOpen(true) };
      case 'billing':
        return {
          label: '+ Issue Invoice',
          onClick: () => {
            setCurrentModule('billing');
            setBillingCreatorTrigger((prev) => prev + 1);
          }
        };
      case 'reels':
        return { label: '+ Upload Reel', onClick: () => showToast('Uploaded 9:16 vertical hook to 12 Reels Studio!') };
      case 'inbox':
        return { label: '+ New WhatsApp', onClick: () => showToast('Select a lead to initiate WhatsApp conversation') };
      default:
        return { label: '+ New Lead', onClick: () => setIsQuickAddOpen(true) };
    }
  };

  const primaryCta = getPrimaryCta();

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0F172A] flex font-sans antialiased selection:bg-[#D4FF00] selection:text-[#0F172A]">
      
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: SLIM COLLAPSIBLE SIDEBAR RAIL (64px / 220px)
          ───────────────────────────────────────────────────────────── */}
      <aside 
        className={`bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between z-40 transition-all duration-200 ease-out sticky top-0 h-screen ${
          isRailExpanded ? 'w-[220px]' : 'w-[64px]'
        }`}
      >
        {/* Top Branding & Role */}
        <div>
          {/* Header Monogram */}
          <div className="h-14 border-b border-slate-100 flex items-center justify-between px-3.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 relative">
                GIF
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] absolute top-1 right-1"></span>
              </div>
              {isRailExpanded && (
                <div className="overflow-hidden leading-tight">
                  <span className="text-[14px] font-bold text-slate-950 tracking-tight block truncate">
                    FeedOS
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    GetIntoFeed Delhi
                  </span>
                </div>
              )}
            </div>

            {/* Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setIsRailExpanded(!isRailExpanded)}
              aria-label={isRailExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md transition hidden sm:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {isRailExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Pill */}
          {isRailExpanded ? (
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium truncate max-w-[120px]">
                {currentUser?.name || 'Ashish'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 uppercase tracking-wider">
                {currentUser?.role === ROLES.OWNER ? 'Admin' : currentUser?.role}
              </span>
            </div>
          ) : (
            <div className="py-2 border-b border-slate-100 flex justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500" title={`Logged in as ${currentUser?.name}`}></span>
            </div>
          )}

          {/* Primary Navigation Items (Max 5 Routes) */}
          <nav className="p-2 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentModule(item.id);
                    setSelectedLead(null); // Keep dossier closed
                  }}
                  aria-label={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors relative focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4FF00]' : 'text-slate-500'}`} aria-hidden="true" />
                  
                  {isRailExpanded && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] absolute right-2.5" aria-hidden="true"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions: Cmd+K + Settings & RBAC */}
        <div className="p-2 border-t border-slate-100 space-y-1">
          {/* Cmd+K Trigger */}
          <button
            type="button"
            onClick={() => setIsCmdKOpen(true)}
            aria-label="Open command palette"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-300 ${
              !isRailExpanded ? 'justify-center' : ''
            }`}
          >
            <Command className="w-4 h-4 text-slate-400" aria-hidden="true" />
            {isRailExpanded && (
              <span className="flex-1 text-left flex items-center justify-between">
                <span>Quick Find</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500">⌘K</kbd>
              </span>
            )}
          </button>

          {/* Settings & RBAC Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings and RBAC controls"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-300 ${
              !isRailExpanded ? 'justify-center' : ''
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" aria-hidden="true" />
            {isRailExpanded && (
              <span className="flex-1 text-left truncate">Settings &amp; RBAC</span>
            )}
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: FOCUSED MAIN WORKSPACE (Sticky 56px Header + Content)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky 56px Top Workspace Header */}
        <header className="h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
          
          {/* Left: View Title & Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              {navItems.find((n) => n.id === currentModule)?.label || 'Overview'}
            </h1>
            <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60 hidden sm:inline-block">
              {navItems.find((n) => n.id === currentModule)?.subtitle}
            </span>
          </div>

          {/* Center: Segmented Filter Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[12px] font-semibold text-slate-600">
            {currentModule === 'leads' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-md transition ${activeFilter === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  All Leads
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('needs_reply')}
                  className={`px-3 py-1 rounded-md transition ${activeFilter === 'needs_reply' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Needs Reply
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('hot')}
                  className={`px-3 py-1 rounded-md transition ${activeFilter === 'hot' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  HOT (₹1.2L+)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('won')}
                  className={`px-3 py-1 rounded-md transition ${activeFilter === 'won' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Won Deals
                </button>
              </>
            )}

            {currentModule === 'overview' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-md transition ${activeFilter === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Operations Pulse
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('needs_reply')}
                  className={`px-3 py-1 rounded-md transition ${activeFilter === 'needs_reply' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  SLA Priority
                </button>
              </>
            )}

            {currentModule === 'billing' && (
              <span className="px-3 py-1 text-slate-600">
                Delhi State 07 • Sec 393 Withholding • ICICI UPI
              </span>
            )}

            {currentModule === 'reels' && (
              <span className="px-3 py-1 text-slate-600">
                12 Reels Studio • 9:16 Vertical Delivery
              </span>
            )}
          </div>

          {/* Right: Only ONE #D4FF00 Primary CTA Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => showToast('Speed-to-lead 100% on track • DPDP compliant')}
              aria-label="View notifications"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition relative focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-2" aria-hidden="true"></span>
            </button>

            {/* Signature Brand Accent Button (#D4FF00 + #0F172A Bold) */}
            <button
              type="button"
              onClick={primaryCta.onClick}
              className="bg-[#D4FF00] hover:bg-[#c4ec00] text-slate-950 font-semibold text-[13px] px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
            >
              {primaryCta.label}
            </button>
          </div>

        </header>

        {/* Generous 24px Workspace Padding around Active Module */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {currentModule === 'overview' && (
            <CommandCenterView
              leads={visibleLeads}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onOpenReel={() => setCurrentModule('reels')}
              onSendProposal={(lead) => setLeadForProposalModal(lead)}
              onGenerateGst={(lead) => setLeadForGstInvoiceModal(lead)}
              currentUser={currentUser}
            />
          )}

          {currentModule === 'leads' && (
            <LeadPipelineView
              leads={visibleLeads}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onUpdateLead={handleUpdateLead}
              onSendProposal={(lead) => setLeadForProposalModal(lead)}
              onGenerateGst={(lead) => setLeadForGstInvoiceModal(lead)}
              currentUser={currentUser}
              activeFilter={activeFilter}
              onShowToast={showToast}
              onShowUndoToast={showUndoToast}
            />
          )}

          {currentModule === 'inbox' && (
            <UnifiedInboxView
              leads={visibleLeads}
              currentUser={currentUser}
              onUpdateLead={handleUpdateLead}
              onShowToast={showToast}
              onSelectLead={(lead) => setSelectedLead(lead)}
            />
          )}

          {currentModule === 'reels' && (
            <ReelsStudioView
              currentUser={currentUser}
              onShowToast={showToast}
            />
          )}

          {currentModule === 'billing' && (
            <BillingStudioView
              leads={visibleLeads}
              onShowToast={showToast}
              openCreatorTrigger={billingCreatorTrigger}
            />
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: ON-DEMAND SLIDE-OVER DOSSIER (440px Right Drawer)
          Must stay closed by default!
          ───────────────────────────────────────────────────────────── */}
      {selectedLead && (
        <SlideOverDossier
          lead={selectedLead}
          isOpen={Boolean(selectedLead)}
          userRole={currentUser?.role}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
          onShowToast={showToast}
          onOpenDeliveryOS={() => {
            setCurrentModule('reels');
            setSelectedLead(null);
          }}
          onSendProposal={(l) => setLeadForProposalModal(l)}
          onGenerateGst={(l) => setLeadForGstInvoiceModal(l)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          GLOBAL MODALS
          ───────────────────────────────────────────────────────────── */}
      <CommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        leads={visibleLeads}
        onSelectLead={(lead) => {
          setSelectedLead(lead);
          setIsCmdKOpen(false);
        }}
        onNavigate={(mod) => {
          setCurrentModule(mod === 'delivery' ? 'reels' : mod);
          setIsCmdKOpen(false);
        }}
        onAddLead={() => {
          setIsCmdKOpen(false);
          setIsQuickAddOpen(true);
        }}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddLead={handleAddLead}
        onShowToast={showToast}
      />

      {leadForProposalModal && (
        <PublicProposalModal
          isOpen={Boolean(leadForProposalModal)}
          lead={leadForProposalModal}
          onClose={() => setLeadForProposalModal(null)}
          onConvertContract={(proposal) => {
            setActiveProposalForEsign(proposal);
            setLeadForProposalModal(null);
          }}
          onShowToast={showToast}
        />
      )}

      {activeProposalForEsign && (
        <EsignContractModal
          isOpen={Boolean(activeProposalForEsign)}
          proposal={activeProposalForEsign}
          onClose={() => setActiveProposalForEsign(null)}
          onContractSigned={() => {
            setActiveProposalForEsign(null);
            showToast('Retainer contract e-signed via Aadhaar OTP! Status: Active Retainer.');
          }}
          onShowToast={showToast}
        />
      )}

      {leadForGstInvoiceModal && (
        <GstInvoiceModal
          isOpen={Boolean(leadForGstInvoiceModal)}
          lead={leadForGstInvoiceModal}
          onClose={() => setLeadForGstInvoiceModal(null)}
          onInvoiceCreated={() => {
            setLeadForGstInvoiceModal(null);
            showToast('Tax invoice generated with Razorpay UPI QR code!');
          }}
          onShowToast={showToast}
        />
      )}

      {/* Settings & RBAC Modal with ModalFocusTrap */}
      <ModalFocusTrap
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings & Role-Based Access (RBAC)"
        ariaLabel="Settings and RBAC Controls"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-[12px] text-slate-500">
            Switch persona to test role-based access scoping, freelancer margin masking, and client tenant isolation:
          </p>

          <div className="space-y-2">
            {Object.keys(demoUsers).map((roleKey) => {
              const user = demoUsers[roleKey];
              const isCurrent = currentUser?.role === user.role;

              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => {
                    switchRole(user.role);
                    setIsSettingsOpen(false);
                    showToast(`Switched active persona to ${user.name} (${user.role})`);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    isCurrent
                      ? 'border-slate-900 bg-slate-50 font-semibold'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[13px] text-slate-900 block font-medium">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Role: {user.role} • {user.role === ROLES.FREELANCER ? 'PII Masked (+91 98188 XXXXX)' : user.role === ROLES.CLIENT ? 'Tenant Isolated' : 'Full Agency Access'}
                    </span>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-slate-900" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>DPDP Act 2023 Enforced</span>
            </span>
            <span className="font-mono">v1.2_2026_11</span>
          </div>
        </div>
      </ModalFocusTrap>

      {/* Actionable 10-Second Undo Toast */}
      <UndoToast
        toastState={toastState}
        onUndo={triggerUndo}
        onDismiss={dismissToast}
      />

      {/* Auto-Dismissing Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-xl shadow-modal text-[13px] font-medium flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4FF00]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default AppShell;
