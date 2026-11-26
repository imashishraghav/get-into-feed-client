import React from 'react';
import { Users, TrendingUp, DollarSign, Clock, Target, AlertTriangle, ArrowUpRight, Flame } from 'lucide-react';

export function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="p-4 sm:p-6 pb-2 space-y-5">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Inbound Leads */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Inbound Pipeline</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
              {stats.total_leads || 0}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              +{stats.this_month || 0} this month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified inbound submissions</p>
        </div>

        {/* Card 2: Won Deals */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Closed Won</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {stats.won_deals || 0}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {stats.win_rate_percent || 0}% win rate
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Retained client transformations</p>
        </div>

        {/* Card 3: 15-Minute SLA Alerts */}
        <div className={`rounded-2xl border p-4 relative overflow-hidden shadow-sm transition ${
          stats.sla_breaches > 0
            ? 'border-rose-500/80 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
            : 'border-slate-800 bg-slate-900/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Response SLA</span>
            <Clock className={`h-4 w-4 ${stats.sla_breaches > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black font-mono ${
              stats.sla_breaches > 0 ? 'text-rose-400' : 'text-slate-100'
            }`}>
              {stats.sla_breaches || 0}
            </span>
            <span className={`text-xs font-bold ${stats.sla_breaches > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stats.sla_breaches > 0 ? 'Breaches Pending' : '100% On-Track'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">&lt;15m first response standard</p>
        </div>

        {/* Card 4: High Intent Inbound Channels */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Growth Channel</span>
            <Target className="h-4 w-4 text-[#D4FF00]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-slate-100 truncate">
              {stats.top_channels && stats.top_channels[0] ? stats.top_channels[0].source : 'Website Inbound'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Leading lead acquisition driver</p>
        </div>

      </div>
    </div>
  );
}
