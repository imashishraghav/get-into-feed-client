import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  AGENCY_GSTIN,
  AGENCY_STATE_CODE,
  INDIAN_STATE_CODES,
  calculateGstInvoice,
  generateInvoiceNumber
} from '../utils/gstEngine.js';
import { SAC_PRICE_BOOK, SECTION_393_TDS_RATES } from '../utils/priceBook.js';
import { paymentAdapter, whatsAppAdapter } from '../adapters/index.js';
import { automationEngine } from '../utils/automationEngine.js';
import { ModalFocusTrap } from './ui/ModalFocusTrap.jsx';
import { AlertCircle, CheckCircle2, ShieldCheck, Download, Send } from 'lucide-react';

export function GstInvoiceModal({ isOpen, lead, onClose, onInvoiceCreated, onShowToast }) {
  const [baseAmount, setBaseAmount] = useState(lead?.dealValue || lead?.budget_monthly || 79000);
  const [clientGstin, setClientGstin] = useState(lead?.gstin || (lead?.state_code === '09' ? '09BBBBB1111B1Z2' : '07AAAAA9999A1Z9'));
  const [clientState, setClientState] = useState(lead?.state_code || '07');
  const [sacCode, setSacCode] = useState(lead?.sacCode || '998361');
  const [sec393Key, setSec393Key] = useState('sec_393_item_1_corp');
  const [customTdsRate, setCustomTdsRate] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  if (!isOpen || !lead) return null;

  const invoiceCalc = calculateGstInvoice({
    baseAmount: Number(baseAmount) || 0,
    clientStateCode: clientState,
    sacCode,
    sec393Key,
    customTdsRate: Number(customTdsRate)
  });

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    const invoiceNumber = generateInvoiceNumber(104);

    // Call Payment Adapter with tax-inclusive gross total (no double-GST)
    const paylink = await paymentAdapter.createPaymentLink({
      amount: invoiceCalc.grossInvoiceTotal,
      grossAmount: invoiceCalc.grossInvoiceTotal,
      baseAmount: invoiceCalc.baseAmount,
      gstIncluded: true,
      customerName: lead.name || lead.contact,
      customerPhone: lead.phone,
      customerEmail: lead.email,
      description: `Tax Invoice ${invoiceNumber} — ${lead.service_interest || 'Agency Retainer'}`,
      stateCode: clientState,
      sacCode
    });

    const fullInvoiceRecord = {
      id: uuidv4(),
      invoiceNumber,
      lead_id: lead.id,
      customerName: lead.name || lead.contact,
      company: lead.company || lead.brand,
      phone: lead.phone,
      email: lead.email,
      clientGstin,
      clientState,
      ...invoiceCalc,
      paymentLink: paylink.short_url,
      upiQr: paylink.upi_qr,
      status: 'pending',
      issuedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    setGeneratedInvoice(fullInvoiceRecord);
    setIsGenerating(false);

    // Trigger AR-07 Automation Recipe (GST Invoice Generated Paylink)
    await automationEngine.dispatchEvent('invoice.created', {
      id: fullInvoiceRecord.id,
      leadId: lead.id,
      amount: fullInvoiceRecord.grossInvoiceTotal
    });

    onInvoiceCreated?.(fullInvoiceRecord);
    onShowToast?.(`Tax Invoice ${invoiceNumber} issued with Sec 393 TDS & Razorpay UPI!`);
  };

  const handleSendWhatsAppInvoice = async () => {
    if (!generatedInvoice) return;
    await whatsAppAdapter.sendTemplateMessage({
      to: lead.phone,
      templateName: 'delhi_gst_invoice_paylink',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: lead.name || lead.contact },
            { type: 'text', text: generatedInvoice.invoiceNumber },
            { type: 'text', text: generatedInvoice.formatted.net },
            { type: 'text', text: generatedInvoice.paymentLink }
          ]
        }
      ]
    });
    onShowToast?.(`WhatsApp invoice sent to ${lead.phone}!`);
    onClose();
  };

  return (
    <ModalFocusTrap
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue GST Tax Invoice — ${lead.company || lead.brand}`}
      ariaLabel="GST Tax Invoice Generator"
      maxWidth="max-w-2xl"
    >
      {!generatedInvoice ? (
        <div className="space-y-4 text-xs">
          {/* Top Info Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">GetIntoFeed GSTIN</span>
              <span className="font-mono font-bold text-slate-800">{AGENCY_GSTIN} (Delhi 07)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Place of Supply</span>
              <span className="font-semibold text-slate-800">{invoiceCalc.clientStateName}</span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inv-base-amount" className="font-bold text-slate-700 block mb-1">
                Base Retainer / Fee (INR ₹) *
              </label>
              <input
                id="inv-base-amount"
                type="number"
                step="1000"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold tabular-nums focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="inv-client-state" className="font-bold text-slate-700 block mb-1">
                Client Billing State *
              </label>
              <select
                id="inv-client-state"
                value={clientState}
                onChange={(e) => setClientState(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              >
                {Object.entries(INDIAN_STATE_CODES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inv-client-gstin" className="font-bold text-slate-700 block mb-1">
                Client GSTIN (Optional)
              </label>
              <input
                id="inv-client-gstin"
                type="text"
                value={clientGstin}
                onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                placeholder="07AAAAA0000A1Z5"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono text-[11px] focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="inv-sac-select" className="font-bold text-slate-700 block mb-1">
                Service Accounting Code (SAC) *
              </label>
              <select
                id="inv-sac-select"
                value={sacCode}
                onChange={(e) => setSacCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              >
                {Object.values(SAC_PRICE_BOOK).map((s) => (
                  <option key={s.serviceId} value={s.code}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CA Review Flag Warning if present */}
          {invoiceCalc.caReviewFlag && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
              <div className="text-[11px] leading-tight">
                <strong className="font-semibold block">CA Review Flag on SAC {sacCode}:</strong>
                {invoiceCalc.caReviewFlag}
              </div>
            </div>
          )}

          {/* Income-tax Act, 2025 Section 393 Withholding */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label htmlFor="inv-sec393-select" className="font-bold text-slate-800 block">
              Income-tax Act, 2025 Withholding (Section 393)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <select
                  id="inv-sec393-select"
                  value={sec393Key}
                  onChange={(e) => {
                    setSec393Key(e.target.value);
                    const cfg = SECTION_393_TDS_RATES[e.target.value];
                    if (cfg) setCustomTdsRate(cfg.ratePercent);
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-[11px] font-medium"
                >
                  {Object.values(SECTION_393_TDS_RATES).map((cfg) => (
                    <option key={cfg.id} value={cfg.id}>
                      {cfg.statutoryReference} ({cfg.category} — {cfg.ratePercent}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5">
                  <span className="text-[11px] text-slate-400 font-bold">Rate:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={customTdsRate}
                    onChange={(e) => setCustomTdsRate(e.target.value)}
                    className="w-full text-slate-900 font-bold tabular-nums text-right outline-none text-[11px]"
                  />
                  <span className="text-[11px] text-slate-500 font-bold">%</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Replaces legacy 194C/194J references. Net receivable reflects TDS withheld by client.
            </p>
          </div>

          {/* Tax Calculation Summary Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 tabular-nums">
            <div className="flex justify-between text-slate-300">
              <span>Base Taxable Amount:</span>
              <span>{invoiceCalc.formatted.base}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>
                {invoiceCalc.isIntraState ? 'Delhi GST (CGST 9% + SGST 9%):' : 'Inter-State GST (IGST 18%):'}
              </span>
              <span>+{invoiceCalc.formatted.gst}</span>
            </div>
            <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
              <span>Gross Invoice Total:</span>
              <span>{invoiceCalc.formatted.gross}</span>
            </div>
            <div className="flex justify-between text-amber-400 text-[11px]">
              <span>Sec 393 Deducted TDS ({customTdsRate}%):</span>
              <span>-{invoiceCalc.formatted.tds}</span>
            </div>
            <div className="flex justify-between font-black text-[#D4FF00] text-sm pt-1 border-t border-slate-800">
              <span>Net Receivable in ICICI Bank:</span>
              <span>{invoiceCalc.formatted.net}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateInvoice}
              className="px-5 py-2 rounded-xl bg-[#D4FF00] hover:bg-[#bfe600] text-[#0F172A] font-bold transition flex items-center gap-1.5 focus:ring-2 focus:ring-[#D4FF00]"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>{isGenerating ? 'Generating...' : 'Issue Invoice & Generate Paylink'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Generated Invoice State */
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">
                Invoice {generatedInvoice.invoiceNumber} Issued Successfully
              </h4>
              <p className="text-emerald-700 text-[11px]">
                Net Receivable: {generatedInvoice.formatted.net} • Razorpay UPI Paylink Active
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Razorpay UPI Payment Link</span>
            <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] select-all break-all">
              {generatedInvoice.paymentLink}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Done
            </button>
            <button
              type="button"
              onClick={handleSendWhatsAppInvoice}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Dispatch via WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </ModalFocusTrap>
  );
}

export default GstInvoiceModal;
