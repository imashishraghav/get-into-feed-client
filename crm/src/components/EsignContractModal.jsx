import React, { useState } from 'react';
import { esignAdapter } from '../adapters/index.js';
import { automationEngine } from '../utils/automationEngine.js';

export function EsignContractModal({ isOpen, proposal, onClose, onContractSigned, onShowToast }) {
  const [isSigning, setIsSigning] = useState(false);
  const [agreement, setAgreement] = useState(null);
  const [isSigned, setIsSigned] = useState(false);

  if (!isOpen || !proposal) return null;

  const signerName = proposal.lead_name || 'Client Signatory';
  const companyName = proposal.company || 'Brand Partner';
  const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client';

  const handleCreateAgreement = async () => {
    const doc = await esignAdapter.createAgreement({
      title: `Retainer Agreement — ${companyName}`,
      signerName,
      signerEmail: `client@${companySlug}.in`,
      signerPhone: '+91 98110 12345',
      contractValue: proposal.monthly_fee
    });
    setAgreement(doc);
    onShowToast?.(`Digio E-Sign agreement dispatched to ${signerName}!`);
  };

  const handleSimulateClientSigning = async () => {
    if (!agreement) return;
    setIsSigning(true);
    setTimeout(async () => {
      const signedDoc = await esignAdapter.simulateSigned(agreement.id);
      setIsSigned(true);
      setIsSigning(false);

      // Trigger AR-06 Automation Recipe (Contract Signed Project Onboarding)
      await automationEngine.dispatchEvent('contract.signed', {
        leadId: proposal.lead_id,
        agreementId: signedDoc.id,
        contractValue: proposal.monthly_fee
      });

      onShowToast?.('🎉 Retainer contract successfully signed with Aadhaar eSign audit trail!');
      onContractSigned?.(signedDoc);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200">
              LEGAL E-SIGNATURE (DIGIO / LEEGALITY)
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
              Indian Retainer Contract Execution
            </h3>
            <p className="text-slate-500">Signer: <strong>{proposal.lead_name}</strong> ({proposal.company})</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold">✕</button>
        </div>

        {/* Contract Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
            <span>Monthly Agency Retainer:</span>
            <span className="text-emerald-600 font-black">{proposal.formatted_fee}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Legal Framework:</span>
            <span>Indian Information Technology Act 2000 (Section 3A)</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Jurisdiction:</span>
            <span>Courts of New Delhi, India</span>
          </div>
        </div>

        {/* Digital Audit Trail Display (When Signed) */}
        {isSigned && agreement && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span>✓</span> Legally Executed via Aadhaar eSign
            </div>
            <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5">
              <div>Signer: {proposal.lead_name}</div>
              <div>Auth Ref: {agreement.audit_trail?.aadhaar_ref || 'XXXX-XXXX-4921'}</div>
              <div>Timestamp: {agreement.signed_at}</div>
              <div>Certificate: eMudhra / Controller of Certifying Authorities</div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col gap-2">
          {!agreement && (
            <button
              onClick={handleCreateAgreement}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
            >
              Generate & Dispatch Digio E-Sign Link ➔
            </button>
          )}

          {agreement && !isSigned && (
            <button
              onClick={handleSimulateClientSigning}
              disabled={isSigning}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
            >
              {isSigning ? 'Verifying Aadhaar OTP Simulation...' : 'Simulate Client Aadhaar E-Sign Verification ✍️'}
            </button>
          )}

          {isSigned && (
            <button
              onClick={() => {
                onClose();
                onContractSigned?.(agreement);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition"
            >
              Generate Delhi GST Tax Invoice Now ➔
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
