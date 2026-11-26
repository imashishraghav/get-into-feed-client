import React from 'react';
import { 
  Layers, 
  Table, 
  BarChart3, 
  MessageSquare, 
  Cpu, 
  Flame, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export function Sidebar({ currentView, setCurrentView, stats }) {
  const navItems = [
    { id: 'pipeline', label: 'Pipeline Board', icon: Layers, badge: stats?.total_leads || null },
    { id: 'table', label: 'Leads Database', icon: Table },
    { id: 'analytics', label: 'Growth Analytics', icon: BarChart3 },
    { id: 'whatsapp', label: 'WhatsApp Outreach', icon: MessageSquare, badge: '5 Ready' },
    { id: 'automations', label: 'Automations & SLA', icon: Cpu, badge: 'Active' },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-950 p-4">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Operations Portal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-lime-400 border border-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-lime-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                      isActive ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Speed-to-Lead SLA Target Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-300">15-Min SLA Target</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inbound leads contacted in &lt; 5 mins have an <strong className="text-lime-400">8.4x higher conversion rate</strong> to closed deals.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/80 pt-2 text-slate-400">
            <span>Avg Response:</span>
            <span className="font-bold text-lime-400">~ 4.2 Mins</span>
          </div>
        </div>

        {/* Quick Growth Metrics */}
        {stats && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Pipeline Inbound:</span>
              <span className="font-mono font-bold text-white">{stats.total_leads || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Won Retainers:</span>
              <span className="font-mono font-bold text-emerald-400">{stats.won_count || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Win Rate:</span>
              <span className="font-mono font-bold text-lime-400">{stats.win_rate_percent || 0}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Server Node */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Hostinger API
          </span>
          <span>v1.2.0</span>
        </div>
        <p className="text-[10px] text-slate-600">
          GetIntoFeed High-Velocity Sales &amp; Growth Engine
        </p>
      </div>
    </aside>
  );
}
