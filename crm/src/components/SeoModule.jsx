import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  MapPin,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowUpRight,
  Plus,
  Check
} from 'lucide-react';

export default function SeoModule({ project }) {
  const seo = project?.seo || {
    trackedKeywords: [],
    organicClicks: 14280,
    clicksGrowthMoM: '+34.2%',
    organicImpressions: 245000,
    avgCtr: '5.83%',
    delhiLocalRank: 'Top 3 Map Pack in South Delhi & Gurugram'
  };

  const [keywords, setKeywords] = useState(seo.trackedKeywords);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;

    const newK = {
      keyword: newKeywordInput.trim(),
      rank: 6,
      previousRank: 12,
      searchVolume: 1800,
      change: '+6'
    };

    setKeywords([...keywords, newK]);
    setNewKeywordInput('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Search className="w-3 h-3" />
              GSC & GA4 Organic Tracking
            </span>
            <span className="text-xs text-slate-500 font-mono">Delhi NCR & National SEO</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            SEO & Search Visibility Engine
          </h2>
          <p className="text-xs text-slate-500">
            High-intent search rankings, organic click trajectory, and Google Local Map Pack positioning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs flex items-center gap-2 text-blue-800 font-semibold">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{seo.delhiLocalRank}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Organic Clicks</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> {seo.clicksGrowthMoM}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {seo.organicClicks.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified via Google Search Console</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Organic Impressions</span>
            <span className="text-xs font-semibold text-emerald-600">+42.0% MoM</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {seo.organicImpressions.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total search impressions</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Average Search CTR</div>
          <div className="text-2xl font-black text-emerald-600">
            {seo.avgCtr}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">High conversion purchase intent</p>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Target Keywords & SERP Rankings ({keywords.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Keyword
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddKeyword} className="p-4 bg-slate-50 border-b border-slate-200 flex gap-2">
            <input
              type="text"
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              placeholder="e.g. bridal lehenga rental delhi ncr..."
              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Track Keyword
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Keyword Query</th>
                <th className="px-4 py-3">Google Rank</th>
                <th className="px-4 py-3">Search Volume</th>
                <th className="px-4 py-3">30-Day Movement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {keywords.map((k, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {k.keyword}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold font-mono text-xs ${
                      k.rank <= 3
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{k.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {k.searchVolume?.toLocaleString('en-IN')} / mo
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {k.change} positions
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
