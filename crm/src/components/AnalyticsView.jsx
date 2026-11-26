import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Layers, 
  Compass, 
  Globe 
} from 'lucide-react';
import { DashboardStats } from './DashboardStats.jsx';

export function AnalyticsView({ stats, pipeline = [] }) {
  const topChannels = stats?.top_channels || [
    { source: 'Website Contact Form', count: 18, percentage: 60 },
    { source: 'Google Ads (Search)', count: 6, percentage: 20 },
    { source: 'Meta Ads (Instagram)', count: 4, percentage: 13 },
    { source: 'Direct Referral', count: 2, percentage: 7 }
  ];

  const topServices = stats?.top_services || [
    { name: 'Performance Marketing (Google & Meta Ads)', count: 14, percent: 45 },
    { name: 'SEO & Organic Search Dominance', count: 8, percent: 26 },
    { name: 'Full-Funnel Brand Growth & Creatives', count: 5, percent: 16 },
    { name: 'CRO & Web Architecture', count: 4, percent: 13 }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Overview */}
      <DashboardStats stats={stats} />

      {/* Pipeline Velocity & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Pipeline Stage Funnel Distribution</h3>
            </div>
            <span className="font-mono text-xs text-slate-500">Live Stages</span>
          </div>

          <div className="space-y-3">
            {pipeline.map((stage) => {
              const total = stats?.total_leads || 1;
              const percent = Math.min(100, Math.round(((stage.count || 0) / total) * 100));
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{stage.title}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white font-bold">{stage.count || 0} leads</span>
                      <span className="text-slate-500 text-[11px]">({percent}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stage.id === 'won'
                          ? 'bg-emerald-400'
                          : stage.id === 'lost'
                          ? 'bg-rose-500'
                          : 'bg-lime-400'
                      }`}
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Inbound Growth Channels */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Acquisition Channel Attribution</h3>
            </div>
            <span className="font-mono text-xs text-slate-500">UTM &amp; GCLID</span>
          </div>

          <div className="space-y-3">
            {topChannels.map((channel, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 font-mono text-xs font-bold text-lime-400">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{channel.source}</p>
                    <p className="text-[10px] text-slate-500">Auto-attributed inbound touchpoint</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-slate-200">{channel.count} leads</p>
                  <p className="text-[10px] text-slate-500">{channel.percentage || 0}% share</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Services In Demand */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white">Service Demand Breakdown</h3>
          </div>
          <span className="font-mono text-xs text-slate-500">Client Intent</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topServices.map((svc, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-bold text-white mb-2 leading-snug">{svc.name}</p>
              <div className="flex items-baseline justify-between mt-auto">
                <span className="font-mono text-lg font-black text-lime-400">{svc.count}</span>
                <span className="text-[11px] text-slate-400 font-mono">{svc.percent}% inquiries</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
