import React from 'react';
import { 
  Search, 
  Plus, 
  RotateCw, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  Layers, 
  Table, 
  BarChart3, 
  MessageSquare, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';
import { logoutCrm } from '../utils/api.js';

export function Header({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  stats,
  isRefreshing,
  onRefresh,
  onOpenNewLead,
  user
}) {
  const slaBreaches = stats?.sla_breaches || 0;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Domain Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 font-bold text-slate-950 shadow-[0_0_15px_rgba(212,255,0,0.35)]">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">GetIntoFeed</span>
                <span className="rounded bg-lime-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-lime-400 border border-lime-400/20">
                  CRM
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>crm.getintofeed.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-800">
            <button
              onClick={() => setCurrentView('pipeline')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'pipeline'
                  ? 'bg-slate-800 text-lime-400 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Pipeline Kanban</span>
            </button>

            <button
              onClick={() => setCurrentView('table')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'table'
                  ? 'bg-slate-800 text-lime-400 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Leads Table</span>
              {stats?.total_leads ? (
                <span className="rounded-full bg-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-slate-300">
                  {stats.total_leads}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'analytics'
                  ? 'bg-slate-800 text-lime-400 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Growth KPIs</span>
            </button>

            <button
              onClick={() => setCurrentView('whatsapp')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'whatsapp'
                  ? 'bg-slate-800 text-lime-400 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp Hub</span>
            </button>

            <button
              onClick={() => setCurrentView('automations')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'automations'
                  ? 'bg-slate-800 text-lime-400 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Automations</span>
            </button>
          </nav>
        </div>

        {/* Center / Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads, phone, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            title="Refresh pipeline data"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white transition-colors"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-lime-400' : ''}`} />
          </button>

          {/* SLA Breach Alert Indicator */}
          {slaBreaches > 0 && (
            <div 
              title={`${slaBreaches} lead(s) overdue for first response!`}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-950/80 px-2.5 py-1 text-xs font-bold text-rose-300 animate-pulse cursor-pointer"
              onClick={() => setCurrentView('table')}
            >
              <Bell className="h-3 w-3 text-rose-400" />
              <span>{slaBreaches} SLA Alert</span>
            </div>
          )}

          {/* Add Lead CTA */}
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-lime-300 transition-all shadow-[0_0_12px_rgba(212,255,0,0.25)]"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Add Inbound</span>
          </button>

          {/* User Profile Pill & Quick Main Site Link */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <a
              href="https://getintofeed.com"
              target="_blank"
              rel="noreferrer"
              title="Visit main website"
              className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300"
            >
              <span>Main Site</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>

            <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-lime-400">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden xl:block text-left text-[11px]">
                <p className="font-semibold text-slate-200 leading-tight">{user?.name || 'Ashish Raghav'}</p>
                <p className="text-[10px] text-slate-500 leading-none">{user?.role || 'Admin'}</p>
              </div>
              <button
                onClick={logoutCrm}
                title="Log out"
                className="ml-1 text-slate-500 hover:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
