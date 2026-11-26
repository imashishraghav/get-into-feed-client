import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Flame,
  BarChart3,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function PerformanceAdsModule({ project, onUpdateProject }) {
  const ads = project?.paidAds || {
    monthlyBudget: 250000,
    spentToDate: 178400,
    pacingPercent: 71.4,
    blendedRoas: 4.35,
    targetRoas: 3.80,
    revenueGenerated: 776040,
    totalOrders: 472,
    cpa: 378,
    targetCpa: 450,
    metaRoas: 4.52,
    googleRoas: 3.94,
    creativeFatigueAlerts: []
  };

  const [fatigueResolved, setFatigueResolved] = useState(false);
  const [budgetAdjusted, setBudgetAdjusted] = useState(false);

  const handleResolveFatigue = () => {
    setFatigueResolved(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <TrendingUp className="w-3 h-3" />
              Meta Advantage+ & Google Ads
            </span>
            <span className="text-xs text-slate-500 font-mono">Live Sprint Pacing</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Performance Marketing & Paid Media Delivery
          </h2>
          <p className="text-xs text-slate-500">
            Real-time blended ROAS, automated creative fatigue detection, and pacing metrics for {project?.clientCompany || 'Client'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Sprint Pacing</div>
            <div className="text-sm font-bold text-emerald-600">On Track ({ads.pacingPercent}%)</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xs text-slate-800 bg-emerald-50">
            {ads.pacingPercent}%
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Blended ROAS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Blended ROAS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Target: {ads.targetRoas}x
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
            {ads.blendedRoas}x
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">₹7.76 Lakh revenue generated</p>
        </div>

        {/* Card 2: Ad Spend vs Budget */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Ad Spend Pacing</span>
            <span className="text-[11px] font-mono text-slate-400">Day 24 / 30</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{(ads.spentToDate / 100000).toFixed(2)}L
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${ads.pacingPercent}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">of ₹{(ads.monthlyBudget / 100000).toFixed(2)}L monthly cap</p>
        </div>

        {/* Card 3: CPA / Cost Per Acquisition */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Customer Acquisition (CPA)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Target: ₹{ads.targetCpa}
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 flex items-baseline gap-2">
            ₹{ads.cpa}
            <span className="text-xs font-semibold text-emerald-600">(-16.0% below target)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{ads.totalOrders} total conversions</p>
        </div>

        {/* Card 4: Platform Channel Split */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-2">Channel Split</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Meta Ads
              </span>
              <span className="font-bold text-slate-900">{ads.metaRoas}x ROAS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Google Ads
              </span>
              <span className="font-bold text-slate-900">{ads.googleRoas}x ROAS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Fatigue Early Warning Alert */}
      {ads.creativeFatigueAlerts?.length > 0 && !fatigueResolved && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-900">
                  Creative Fatigue Detected: {ads.creativeFatigueAlerts[0].adName}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {ads.creativeFatigueAlerts[0].message} Frequency has risen to <strong className="font-mono">3.94</strong>.
              </p>
              <div className="mt-3 p-3 bg-white/80 rounded-lg border border-amber-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>💡 <strong>Recommendation:</strong> {ads.creativeFatigueAlerts[0].recommendedAction}</span>
                <button
                  type="button"
                  onClick={handleResolveFatigue}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors flex-shrink-0"
                >
                  Deploy Reel #04 Master Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {fatigueResolved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Creative fatigue resolved: Ad set refreshed with newly approved Reel #04 Master cut.
        </div>
      )}
    </div>
  );
}
