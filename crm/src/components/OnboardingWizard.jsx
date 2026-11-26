import React, { useState } from 'react';

export function OnboardingWizard({ isOpen, onClose, onSeedData, onClearData, onShowToast }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [agencyName, setAgencyName] = useState('GetIntoFeed');
  const [city, setCity] = useState('Delhi NCR');
  const [selectedServices, setSelectedServices] = useState([
    'Performance Marketing & Paid Ads',
    'Short-Form Video & Reels'
  ]);
  const [gstNumber, setGstNumber] = useState('07AAAAA0000A1Z5');

  if (!isOpen) return null;

  const toggleService = (srv) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleFinish = (loadSample = true) => {
    if (loadSample) {
      onSeedData();
      onShowToast?.('🎉 Welcome to FeedOS! 60 demo leads loaded across Delhi NCR.');
    } else {
      onClearData();
      onShowToast?.('🎉 FeedOS initialized in clean production mode.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Progress Header */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>GETINTOFEED REVOPS SETUP</span>
            <span>Step {currentStep} of 4</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 text-xs space-y-4">
          
          {/* STEP 1: AGENCY IDENTITY */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                1. Agency Profile & Location
              </h3>
              <p className="text-slate-500">
                Confirm your agency name and primary service geography for Speed-to-Lead SLA routing.
              </p>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">HQ Geography</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              </div>
            </div>
          )}

          {/* STEP 2: CORE SERVICES */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                2. Active Agency Offerings
              </h3>
              <p className="text-slate-500">Select which services your team sells and delivers:</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  'Performance Marketing & Paid Ads',
                  'Short-Form Video & Reels',
                  'Search Engine Optimization (SEO)',
                  'Web Development & CRO',
                  'Brand Strategy & Identity',
                  'Influencer Marketing'
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between font-semibold transition ${
                      selectedServices.includes(s)
                        ? 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700'
                    }`}
                  >
                    <span>{s}</span>
                    <span>{selectedServices.includes(s) ? '✓' : '+'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DELHI GST SETUP */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                3. GST & Indian Invoicing
              </h3>
              <p className="text-slate-500">
                Auto-apply Delhi Intra-State CGST (9%) + SGST (9%) or Inter-State IGST (18%) on invoices.
              </p>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Agency GSTIN (State 07)</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold"
                />
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded-xl text-emerald-800 dark:text-emerald-200 text-[11px]">
                ✓ Default SAC Code: <strong>998361</strong> (Advertising & creative marketing services)
              </div>
            </div>
          )}

          {/* STEP 4: SAMPLE DATA CHOICE */}
          {currentStep === 4 && (
            <div className="space-y-3 text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 text-2xl flex items-center justify-center mx-auto">
                🚀
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                You're Ready to Roll!
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Would you like to populate the CRM with <strong>60 realistic Delhi NCR demo leads</strong> so your team can test WhatsApp follow-ups, reels approvals, and GST invoicing right away?
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleFinish(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs text-xs"
                >
                  Load 60 Demo Leads (Recommended) ➔
                </button>
                <button
                  onClick={() => handleFinish(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition text-xs"
                >
                  Start Fresh with Empty CRM
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        {currentStep < 4 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((p) => p - 1)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep((p) => p + 1)}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
            >
              Next Step ➔
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
