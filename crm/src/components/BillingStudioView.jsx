import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Send, 
  Copy, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Check,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { 
  AGENCY_GSTIN, 
  AGENCY_STATE_CODE, 
  INDIAN_STATE_CODES, 
  calculateGstInvoice, 
  generateInvoiceNumber 
} from '../utils/gstEngine.js';
import { SAC_PRICE_BOOK, SECTION_393_TDS_RATES, AGENCY_SERVICES } from '../utils/priceBook.js';
import { paymentAdapter, whatsAppAdapter } from '../adapters/index.js';

export function BillingStudioView({ leads = [], onShowToast, openCreatorTrigger = 0 }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'creator' | 'pricebook'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'overdue'

  useEffect(() => {
    if (openCreatorTrigger > 0) {
      setActiveTab('creator');
    }
  }, [openCreatorTrigger]);

  // Seed invoices with Section 393 Withholding
  const [invoices, setInvoices] = useState([
    {
      id: uuidv4(),
      invoiceNumber: 'GIF/26-27/0101',
      customerName: 'Ananya Singhania',
      company: 'Singhania Couture',
      phone: '+91 98188 11223',
      baseAmount: 79000,
      cgstAmount: 7110,
      sgstAmount: 7110,
      igstAmount: 0,
      grossTotal: 93220,
      sec393Label: 'Sec 393 Contractor (2%)',
      tdsDeducted: 1580,
      netPayable: 91640,
      status: 'paid',
      issuedAt: 'Nov 18, 2026',
      dueDate: 'Nov 25, 2026',
      sacCode: '998361',
      stateCode: '07',
      paylink: 'https://rzp.io/i/mock_inv101'
    },
    {
      id: uuidv4(),
      invoiceNumber: 'GIF/26-27/0102',
      customerName: 'Sneha Kapur',
      company: 'GlowUp D2C Skincare',
      phone: '+91 98711 23456',
      baseAmount: 110000,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 19800,
      grossTotal: 129800,
      sec393Label: 'Sec 393 Contractor (2%)',
      tdsDeducted: 2200,
      netPayable: 127600,
      status: 'overdue',
      issuedAt: 'Nov 10, 2026',
      dueDate: 'Nov 17, 2026',
      sacCode: '998366',
      stateCode: '06', // Haryana
      paylink: 'https://rzp.io/i/mock_inv102'
    },
    {
      id: uuidv4(),
      invoiceNumber: 'GIF/26-27/0103',
      customerName: 'Rohit Verma',
      company: 'UrbanFit Gyms',
      phone: '+91 99990 12345',
      baseAmount: 150000,
      cgstAmount: 13500,
      sgstAmount: 13500,
      igstAmount: 0,
      grossTotal: 177000,
      sec393Label: 'Sec 393 Contractor (2%)',
      tdsDeducted: 3000,
      netPayable: 174000,
      status: 'pending',
      issuedAt: 'Nov 22, 2026',
      dueDate: 'Nov 29, 2026',
      sacCode: '998361',
      stateCode: '07',
      paylink: 'https://rzp.io/i/mock_inv103'
    }
  ]);

  // Invoice creator form state
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [baseFee, setBaseFee] = useState(79000);
  const [clientGstin, setClientGstin] = useState('07AAAAA9999A1Z9');
  const [clientState, setClientState] = useState('07'); // Delhi
  const [sacCode, setSacCode] = useState('998361');
  const [sec393Key, setSec393Key] = useState('sec_393_item_1_corp');
  const [tdsRate, setTdsRate] = useState(2);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const calculated = calculateGstInvoice({
    baseAmount: Number(baseFee) || 0,
    clientStateCode: clientState,
    sacCode,
    sec393Key,
    customTdsRate: Number(tdsRate)
  });

  const nextInvoiceNumber = generateInvoiceNumber(invoices.length + 101);

  const handleCreateInvoice = async () => {
    const paylinkRes = await paymentAdapter.createPaymentLink({
      amount: calculated.grossInvoiceTotal,
      grossAmount: calculated.grossInvoiceTotal,
      baseAmount: calculated.baseAmount,
      gstIncluded: true,
      stateCode: clientState,
      sacCode,
      customerName: selectedLead?.name || selectedLead?.contact || 'Client',
      customerPhone: selectedLead?.phone || '+91 98110 00000',
      description: `Delhi GST Tax Invoice ${nextInvoiceNumber}`
    });

    const newInv = {
      id: uuidv4(),
      invoiceNumber: nextInvoiceNumber,
      customerName: selectedLead?.name || selectedLead?.contact || 'Client',
      company: selectedLead?.company || selectedLead?.brand || 'Brand Client',
      phone: selectedLead?.phone || '+91 98110 00000',
      baseAmount: calculated.baseAmount,
      cgstAmount: calculated.taxBreakdown.cgstAmount,
      sgstAmount: calculated.taxBreakdown.sgstAmount,
      igstAmount: calculated.taxBreakdown.igstAmount,
      grossTotal: calculated.grossInvoiceTotal,
      sec393Label: `${calculated.tdsDetails.category} (${tdsRate}%)`,
      tdsDeducted: calculated.tdsDetails.tdsDeducted,
      netPayable: calculated.netReceivable,
      status: 'pending',
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sacCode,
      stateCode: clientState,
      paylink: paylinkRes.short_url
    };

    setInvoices([newInv, ...invoices]);
    setActiveTab('list');
    onShowToast?.(`Tax Invoice ${nextInvoiceNumber} created with Sec 393 Withholding & UPI QR!`);
  };

  const handleMarkAsPaid = (invId) => {
    setInvoices(invoices.map((inv) => (inv.id === invId ? { ...inv, status: 'paid' } : inv)));
    onShowToast?.('Invoice reconciled as PAID via Razorpay ICICI settlement!');
  };

  const handleSendReminder = async (inv) => {
    const text = `Hi ${inv.customerName}! Gentle reminder regarding GST Invoice ${inv.invoiceNumber} for ₹${inv.netPayable.toLocaleString('en-IN')}.\n\nPay via UPI: ${inv.paylink}`;
    await whatsAppAdapter.sendMessage({ to: inv.phone, message: text });
    onShowToast?.(`WhatsApp payment reminder dispatched to ${inv.customerName}!`);
  };

  const filteredInvoices = invoices.filter((i) => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((a, c) => a + c.grossTotal, 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((a, c) => a + c.grossTotal, 0);

  return (
    <div className="space-y-6">
      
      {/* Studio Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              India GST &amp; Sec 393 TDS
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Delhi State 07
            </span>
          </div>
          <h2 className="text-[20px] font-semibold text-slate-900 mt-1">
            GST Invoicing &amp; Retainer Payouts
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Auto CGST/SGST vs IGST • Income-tax Act 2025 Sec 393 Withholding • ICICI UPI Links
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition ${
              activeTab === 'list' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoices Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('creator')}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition flex items-center gap-1 ${
              activeTab === 'creator' 
                ? 'bg-[#D4FF00] text-slate-950 font-bold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            + New Invoice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricebook')}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition flex items-center gap-1 ${
              activeTab === 'pricebook' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Price Book &amp; SAC
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Reconciled Inflow (FY 26-27)
          </span>
          <span className="text-[24px] font-bold text-slate-900 tabular-nums">
            ₹{(totalCollected / 100000).toFixed(2)} Lakh
          </span>
          <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
            100% ICICI UPI Settlements
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Unpaid / Overdue Receivables
          </span>
          <span className="text-[24px] font-bold text-slate-900 tabular-nums">
            ₹{(totalOutstanding / 100000).toFixed(2)} Lakh
          </span>
          <span className="text-[11px] text-amber-600 block mt-1 font-medium">
            {invoices.filter(i => i.status !== 'paid').length} Invoices Pending
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Sec 393 TDS Withheld by Clients
          </span>
          <span className="text-[24px] font-bold text-slate-900 tabular-nums">
            ₹{(invoices.reduce((a, c) => a + c.tdsDeducted, 0) / 1000).toFixed(1)}k
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Form 16A Reconciliation Tracked
          </span>
        </div>
      </div>

      {/* TAB 1: INVOICES LEDGER */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-900">Tax Invoices</span>
              <span className="text-[11px] text-slate-400 font-mono">({filteredInvoices.length} Records)</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[12px]">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'all' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('paid')}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'paid' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('overdue')}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'overdue' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Overdue
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Invoice #</th>
                  <th className="py-3 px-4">Client / Brand</th>
                  <th className="py-3 px-4">SAC &amp; Region</th>
                  <th className="py-3 px-4">Base Fee</th>
                  <th className="py-3 px-4">GST 18%</th>
                  <th className="py-3 px-4">Sec 393 TDS</th>
                  <th className="py-3 px-4">Net Receivable</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{inv.company}</span>
                      <span className="text-[12px] text-slate-500 block">{inv.customerName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {inv.sacCode}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {inv.stateCode === '07' ? 'Delhi (Intra)' : 'Inter-State'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 tabular-nums">
                      ₹{inv.baseAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 tabular-nums text-[12px]">
                      +₹{((inv.cgstAmount + inv.sgstAmount + inv.igstAmount)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 tabular-nums text-[12px]">
                      -₹{inv.tdsDeducted.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-950 tabular-nums">
                      ₹{inv.netPayable.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                          <span>Paid</span>
                        </span>
                      ) : inv.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                          <AlertCircle className="w-3 h-3 text-rose-600" aria-hidden="true" />
                          <span>Overdue</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                          <Clock className="w-3 h-3 text-amber-600" aria-hidden="true" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsPaid(inv.id)}
                            className="text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md transition"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSendReminder(inv)}
                          aria-label={`Send WhatsApp payment reminder for ${inv.invoiceNumber}`}
                          className="text-[11px] font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-md transition flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" aria-hidden="true" />
                          <span>Remind</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICE CREATOR & A4 PREVIEW */}
      {activeTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-4">
            <h3 className="text-[14px] font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Generate Delhi GST Tax Invoice
            </h3>

            <div>
              <label htmlFor="create-inv-lead" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Select Client Deal
              </label>
              <select
                id="create-inv-lead"
                value={selectedLeadId}
                onChange={(e) => {
                  setSelectedLeadId(e.target.value);
                  const l = leads.find(lead => lead.id === e.target.value);
                  if (l) {
                    setBaseFee(l.dealValue || l.budget_monthly || 79000);
                    if (l.state_code) setClientState(l.state_code);
                    if (l.sacCode) setSacCode(l.sacCode);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[13px] text-slate-900 font-medium focus:outline-none focus:border-slate-400"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.company || l.brand || l.name} — ₹{((l.dealValue || l.budget_monthly || 75000) / 1000).toFixed(0)}k
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="create-inv-amount" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Base Fee (INR ₹)
              </label>
              <input
                id="create-inv-amount"
                type="number"
                value={baseFee}
                onChange={(e) => setBaseFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[13px] text-slate-900 font-semibold tabular-nums focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label htmlFor="create-inv-state" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Client State / GST Region
              </label>
              <select
                id="create-inv-state"
                value={clientState}
                onChange={(e) => setClientState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[13px] text-slate-900 focus:outline-none focus:border-slate-400"
              >
                {Object.entries(INDIAN_STATE_CODES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="create-inv-sac" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                SAC Code
              </label>
              <select
                id="create-inv-sac"
                value={sacCode}
                onChange={(e) => setSacCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[13px] text-slate-900 focus:outline-none focus:border-slate-400"
              >
                {Object.values(SAC_PRICE_BOOK).map((s) => (
                  <option key={s.serviceId} value={s.code}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CA Review Flag Warning */}
            {calculated.caReviewFlag && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
                <span>{calculated.caReviewFlag}</span>
              </div>
            )}

            <div>
              <label htmlFor="create-inv-sec393" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Income-tax Act 2025 Sec 393 Withholding (TDS)
              </label>
              <select
                id="create-inv-sec393"
                value={sec393Key}
                onChange={(e) => {
                  setSec393Key(e.target.value);
                  const cfg = SECTION_393_TDS_RATES[e.target.value];
                  if (cfg) setTdsRate(cfg.ratePercent);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[13px] text-slate-900 focus:outline-none focus:border-slate-400"
              >
                {Object.values(SECTION_393_TDS_RATES).map((cfg) => (
                  <option key={cfg.id} value={cfg.id}>
                    {cfg.statutoryReference} ({cfg.category} — {cfg.ratePercent}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleCreateInvoice}
              className="w-full bg-[#D4FF00] hover:bg-[#c4ec00] text-slate-950 font-bold text-[13px] py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Receipt className="w-4 h-4" aria-hidden="true" />
              <span>Issue Tax Invoice &amp; Generate ICICI QR</span>
            </button>
          </div>

          {/* A4 Preview */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-subtle space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  TAX INVOICE
                </span>
                <h2 className="text-[18px] font-bold text-slate-900 mt-0.5">
                  Get Into Feed Media Pvt. Ltd.
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                  Delhi NCR Creative &amp; Performance Marketing Studio<br />
                  GSTIN: <strong className="text-slate-800 font-mono">{AGENCY_GSTIN}</strong> (State 07)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[15px] font-mono font-bold text-slate-900 block">
                  {nextInvoiceNumber}
                </span>
                <span className="text-[12px] text-slate-500 block">Date: Nov 25, 2026</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-block mt-1">
                  SAC {sacCode}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-start justify-between text-[12px]">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Billed To</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedLead?.company || selectedLead?.brand || 'Client Brand'}
                </span>
                <span className="text-slate-600 block">
                  Attn: {selectedLead?.name || selectedLead?.contact} • {selectedLead?.city || 'Delhi NCR'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Place of Supply</span>
                <span className="font-medium text-slate-800">
                  {calculated.clientStateName}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-slate-900">
                  {calculated.sacName}
                </span>
                <span className="tabular-nums font-medium text-slate-900">
                  {calculated.formatted.base}
                </span>
              </div>

              {calculated.isIntraState ? (
                <>
                  <div className="flex items-center justify-between text-slate-600 text-[12px]">
                    <span>Central GST (CGST @ 9.0%)</span>
                    <span className="tabular-nums">₹{calculated.taxBreakdown.cgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[12px]">
                    <span>State GST (SGST @ 9.0%)</span>
                    <span className="tabular-nums">₹{calculated.taxBreakdown.sgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-slate-600 text-[12px]">
                  <span>Integrated GST (IGST @ 18.0%)</span>
                  <span className="tabular-nums">₹{calculated.taxBreakdown.igstAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Gross Invoice Total</span>
                <span className="tabular-nums">{calculated.formatted.gross}</span>
              </div>

              <div className="flex items-center justify-between text-amber-700 text-[12px]">
                <span>Less: Withholding under Sec 393 ({calculated.tdsDetails.category} @ {tdsRate}%)</span>
                <span className="tabular-nums">-{calculated.formatted.tds}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-900 text-[15px] font-bold text-slate-950">
                <span>Net Payable in ICICI via UPI QR</span>
                <span className="tabular-nums text-emerald-700">{calculated.formatted.net}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg flex items-center justify-center shadow-xs">
                  <QrCode className="w-7 h-7 text-slate-900" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-slate-900 block">Scan &amp; Pay via UPI</span>
                  <span className="text-[11px] font-mono text-slate-500 block">pa=getintofeed.agency@icici</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                Zero Convenience Fee
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN PRICE BOOK & SAC CATALOG */}
      {activeTab === 'pricebook' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5 space-y-6">
          <div>
            <h3 className="text-[16px] font-semibold text-slate-900">
              Agency Admin Price Book &amp; Statutory References
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Configurable SAC codes with Chartered Accountant review flags and Income-tax Act 2025 Sec 393 rates.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">
              8 Core Agency Disciplines &amp; SAC Mappings
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                    <th className="py-2.5 px-4">Service</th>
                    <th className="py-2.5 px-4">SAC Code</th>
                    <th className="py-2.5 px-4">Standard Base Fee</th>
                    <th className="py-2.5 px-4">Supported Deal Types</th>
                    <th className="py-2.5 px-4">CA Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AGENCY_SERVICES.map((s) => {
                    const sac = SAC_PRICE_BOOK[s.id];
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.sac}</td>
                        <td className="py-3 px-4 tabular-nums font-medium text-slate-900">₹{s.basePrice.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-slate-600">{s.dealTypes.join(', ')}</td>
                        <td className="py-3 px-4">
                          {sac?.caReviewFlag ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" aria-hidden="true" />
                              <span>CA Review Flagged</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                              <span>Standard</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">
              Income-tax Act, 2025 Section 393 Withholding Rates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              {Object.values(SECTION_393_TDS_RATES).map((cfg) => (
                <div key={cfg.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cfg.statutoryReference}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {cfg.ratePercent}% TDS
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {cfg.category} • Payer: {cfg.payerType} ({cfg.formerSectionLabel})
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {cfg.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default BillingStudioView;
