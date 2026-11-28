import React, { useState } from 'react';
import {
  X,
  Printer,
  Share2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building,
  Award,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { generateClientGrowthReport } from '../utils/reportGenerator.js';

export default function GrowthReportModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  const [shareSuccess, setShareSuccess] = useState(false);
  const report = generateClientGrowthReport(project);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi ${report.clientName}! Here is the GetIntoFeed Monthly Growth Sprint Report for ${report.clientCompany}:\n\n` +
      `📈 Blended ROAS: ${report.metrics.blendedRoas} (Target: ${report.metrics.targetRoas})\n` +
      `💰 Revenue: ${report.metrics.revenue} generated\n` +
      `🎯 CPA: ${report.metrics.cpa} (-16% under target)\n` +
      `🔍 Organic SEO Growth: ${report.metrics.organicGrowth}\n\n` +
      `Full executive report available in your Client Portal!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  {report.reportId}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{report.generatedAt}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                White-Label Client Growth Sprint Report
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              Send to Client WhatsApp
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {shareSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 text-xs font-semibold text-emerald-800 text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Growth report summary dispatched to WhatsApp!
          </div>
        )}

        {/* Printable White-Label Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0 print:m-0">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
                  GET INTO FEED
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Creative & Performance Marketing Studio
                </span>
              </div>
              <p className="text-xs text-slate-500">
                New Delhi • Gurugram • Noida • https://getintofeed.com
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-400 font-medium">Prepared Exclusively For:</div>
              <div className="text-base font-bold text-slate-900">{report.clientCompany}</div>
              <div className="text-xs text-slate-600">Attn: {report.clientName}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">Sprint: {report.sprintDates}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Executive Growth Narrative
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          {/* Core Metrics Grid (3 cols) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Sprint Performance Attribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">Blended ROAS</div>
                <div className="text-xl font-black text-emerald-600 mt-0.5">
                  {report.metrics.blendedRoas}
                </div>
                <div className="text-[10px] text-slate-400">Target: {report.metrics.targetRoas}</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">Gross Revenue</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {report.metrics.revenue}
                </div>
                <div className="text-[10px] text-slate-400">{report.metrics.totalOrders} total orders</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">Customer CPA</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {report.metrics.cpa}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">-16.0% vs target</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">Organic SEO Growth</div>
                <div className="text-xl font-black text-indigo-600 mt-0.5">
                  {report.metrics.organicGrowth}
                </div>
                <div className="text-[10px] text-slate-400">{report.metrics.organicClicks} organic clicks</div>
              </div>
            </div>
          </div>

          {/* Winning Creative Reels Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Top 3 Winning Creative Video Hooks
            </h3>
            <div className="space-y-2">
              {report.topReels.map((reel, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px] border border-blue-200">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{reel.title}</span>
                      <span className="text-slate-400 text-[11px] ml-2 font-mono">
                        ({reel.duration} • {reel.version})
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {reel.highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next 30-Day Sprint Roadmap */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Next 30-Day Sprint Strategic Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {report.nextSprintRoadmap.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-2 text-slate-700"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Sign-Off */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <div className="font-bold text-slate-900">{report.agencyContact.name}</div>
              <div>{report.agencyContact.title}</div>
              <div>{report.agencyContact.agency}</div>
            </div>
            <div className="sm:text-right">
              <div>Verified by GetIntoFeed Analytics Engine</div>
              <div className="text-[11px] text-slate-400">Strictly Confidential • For Client Use Only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
