import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  TrendingUp,
  Search,
  Globe,
  CreditCard,
  MessageCircle,
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import CreativeDeliveryBoard from './CreativeDeliveryBoard.jsx';
import PerformanceAdsModule from './PerformanceAdsModule.jsx';
import SeoModule from './SeoModule.jsx';
import WebCroModule from './WebCroModule.jsx';
import GrowthReportModal from './GrowthReportModal.jsx';

export default function ClientPortalView({ project, onUpdateProject, invoices = [] }) {
  const [activeTab, setActiveTab] = useState('reels');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellSuccess, setUpsellSuccess] = useState('');

  const clientInvoices = invoices.filter(
    (inv) => inv.clientName === project?.clientName || inv.clientGstin === '07AAACS1234F1Z9'
  );

  const handleRequestService = (serviceName) => {
    setUpsellSuccess(`Service request for "${serviceName}" logged! Ashish (Founder) will connect via WhatsApp in 15 mins.`);
    setShowUpsellModal(false);
    setTimeout(() => setUpsellSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Client Portal Branded Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Client Delivery Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Sprint: {project?.sprintStart} ➔ {project?.sprintEnd}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {project?.clientCompany}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Active Growth Sprint: <strong className="text-white">{project?.servicePackage}</strong> • Managed by GetIntoFeed Studio
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Monthly Growth Report
            </button>
            <button
              type="button"
              onClick={() => setShowUpsellModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Service / Scale
            </button>
            <a
              href={`https://wa.me/919811000000?text=${encodeURIComponent(`Hi Ashish! Checking in from ${project?.clientCompany} Client Portal.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Lead
            </a>
          </div>
        </div>

        {/* Assigned Agency Team Pills */}
        <div className="mt-6 pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <span className="text-slate-400 font-medium">Your Dedicated Team:</span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-white">Account Lead:</strong> {project?.assignedTeam?.accountManager}
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-white">Performance:</strong> {project?.assignedTeam?.performanceLead}
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-white">Video Editor:</strong> {project?.assignedTeam?.creativeEditor}
          </span>
        </div>
      </div>

      {upsellSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {upsellSuccess}
        </div>
      )}

      {/* Portal Inner Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'reels'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          Reels Video Review ({project?.reelsDeliverables?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ads'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Meta & Google Ads ROAS
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'seo'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          SEO & Keywords
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('web')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'web'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Web Speed & CRO
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'billing'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Invoices & GST Receipts
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'reels' && (
        <CreativeDeliveryBoard
          project={project}
          onUpdateProject={onUpdateProject}
          isClientView={true}
        />
      )}

      {activeTab === 'ads' && (
        <PerformanceAdsModule
          project={project}
          onUpdateProject={onUpdateProject}
        />
      )}

      {activeTab === 'seo' && (
        <SeoModule
          project={project}
        />
      )}

      {activeTab === 'web' && (
        <WebCroModule
          project={project}
        />
      )}

      {activeTab === 'billing' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Tax Invoices & GST Receipts
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Delhi GSTIN: 07AAAAA0000A1Z5
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {clientInvoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No invoices found for this client.
              </div>
            ) : (
              clientInvoices.map((inv) => (
                <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      {inv.serviceDescription} • Due: {inv.dueDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 font-mono">{inv.formattedGross}</div>
                      <div className="text-[10px] text-slate-400">Includes 18% GST</div>
                    </div>
                    {inv.status !== 'PAID' && inv.razorpayLink && (
                      <a
                        href={inv.razorpayLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Pay via UPI
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Upsell / Add Service Modal */}
      {showUpsellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add High-Impact Growth Deliverables
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an add-on to instantly scale your current 30-day sprint without new contract lock-in.
            </p>

            <div className="space-y-2.5">
              {[
                { title: '+4 Thumb-Stopping 9:16 Video Reels', fee: '₹18,000 one-off', desc: 'Scripted, shot and edited for Meta Advantage+' },
                { title: 'Scale Meta/Google Ad Spend by ₹50,000', fee: '₹50,000 ad spend', desc: 'Direct platform budget scale managed by Priya' },
                { title: 'Headless Next.js Speed Optimization Audit', fee: '₹15,000 one-off', desc: 'Guaranteed 95+ mobile Lighthouse score' },
                { title: 'Delhi NCR Local 3-Pack SEO Domination', fee: '₹12,000 / mo', desc: 'Target local luxury and bridal buyers' }
              ].map((addon, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRequestService(addon.title)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{addon.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{addon.desc}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="font-mono font-bold text-blue-600">{addon.fee}</div>
                    <span className="text-[10px] text-slate-400">1-Tap Add ➔</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowUpsellModal(false)}
              className="mt-4 w-full py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* White-Label Growth Report Modal */}
      <GrowthReportModal
        project={project}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}
