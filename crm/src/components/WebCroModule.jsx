import React, { useState } from 'react';
import {
  Globe,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Gauge,
  Code2,
  Rocket
} from 'lucide-react';

export default function WebCroModule({ project }) {
  const web = project?.webCro || {
    siteUrl: 'https://singhaniacouture.com',
    stagingUrl: 'https://staging-singhania.getintofeed.agency',
    techStack: 'Next.js App Router + Shopify Headless',
    speedScore: 97,
    accessibilityScore: 100,
    seoScore: 100,
    bestPracticesScore: 96,
    lcp: '1.1s (Mobile 4G)',
    activeCroExperiment: {
      name: 'Sticky 1-Tap "Shop The Reel Look" Video Drawer',
      status: 'winning',
      conversionUplift: '+19.4%',
      signOffStatus: 'client_approved'
    }
  };

  const [deployed, setDeployed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Code2 className="w-3 h-3" />
              Next.js & Headless CRO
            </span>
            <span className="text-xs text-slate-500 font-mono">Mobile-First 4G Speed</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Web Development & Conversion Rate Optimization (CRO)
          </h2>
          <p className="text-xs text-slate-500">
            Lighthouse performance scores, active CRO conversion experiments, and staging sign-off for {project?.clientCompany}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={web.stagingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview Staging
          </a>
          <button
            type="button"
            onClick={() => setDeployed(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Rocket className="w-3.5 h-3.5" />
            {deployed ? 'Deployed to Production' : 'Deploy to Production'}
          </button>
        </div>
      </div>

      {deployed && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Production release successful! Cache purged on Cloudflare CDN and edge nodes updated.
        </div>
      )}

      {/* Google Lighthouse Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-sm text-emerald-700 bg-emerald-50 mb-2">
            {web.speedScore}
          </div>
          <div className="text-xs font-bold text-slate-900">Performance</div>
          <div className="text-[10px] text-slate-400 mt-0.5">LCP {web.lcp}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-sm text-emerald-700 bg-emerald-50 mb-2">
            {web.accessibilityScore}
          </div>
          <div className="text-xs font-bold text-slate-900">Accessibility</div>
          <div className="text-[10px] text-slate-400 mt-0.5">WCAG 2.1 AA</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-sm text-emerald-700 bg-emerald-50 mb-2">
            {web.bestPracticesScore}
          </div>
          <div className="text-xs font-bold text-slate-900">Best Practices</div>
          <div className="text-[10px] text-slate-400 mt-0.5">HTTPS & Security</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-sm text-emerald-700 bg-emerald-50 mb-2">
            {web.seoScore}
          </div>
          <div className="text-xs font-bold text-slate-900">SEO Score</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Schema & OpenGraph</div>
        </div>
      </div>

      {/* Active CRO Experiment Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Active CRO Conversion Experiment</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
            {web.activeCroExperiment?.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {web.activeCroExperiment?.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Sticky mobile drawer that lets reel viewers add products straight to cart without page reload.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Cart Conversion Lift</div>
              <div className="text-lg font-black text-emerald-600">
                {web.activeCroExperiment?.conversionUplift}
              </div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
