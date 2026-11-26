import React, { useState } from 'react';
import { whatsAppAdapter } from '../adapters/index.js';
import { automationEngine } from '../utils/automationEngine.js';

export function InvoicesListView({ leads = [], onShowToast }) {
  const [invoices, setInvoices] = useState([
    {
      id: 'inv_101',
      invoiceNumber: 'GIF/26-27/0101',
      leadId: leads[0]?.id,
      customerName: 'Vikramaditya Singhania',
      company: 'LuxeLiving Realty',
      phone: '+91 98110 12345',
      baseAmount: 150000,
      totalGst: 27000,
      grossTotal: 177000,
      tdsDeducted: 3000,
      netPayable: 174000,
      status: 'paid',
      issuedAt: 'Nov 18, 2026',
      dueDate: 'Nov 25, 2026',
      paylink: 'https://rzp.io/i/mock_inv101'
    },
    {
      id: 'inv_102',
      invoiceNumber: 'GIF/26-27/0102',
      leadId: leads[1]?.id,
      customerName: 'Sneha Kapur',
      company: 'GlowUp D2C Skincare',
      phone: '+91 98711 23456',
      baseAmount: 79000,
      totalGst: 14220,
      grossTotal: 93220,
      tdsDeducted: 0,
      netPayable: 93220,
      status: 'pending',
      issuedAt: 'Nov 22, 2026',
      dueDate: 'Nov 29, 2026',
      paylink: 'https://rzp.io/i/mock_inv102'
    },
    {
      id: 'inv_103',
      invoiceNumber: 'GIF/26-27/0103',
      leadId: leads[2]?.id,
      customerName: 'Rohit Verma',
      company: 'UrbanFit Gyms',
      phone: '+91 99990 12345',
      baseAmount: 110000,
      totalGst: 19800,
      grossTotal: 129800,
      tdsDeducted: 2200,
      netPayable: 127600,
      status: 'overdue',
      issuedAt: 'Nov 12, 2026',
      dueDate: 'Nov 19, 2026',
      paylink: 'https://rzp.io/i/mock_inv103'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const handleMarkAsPaid = async (inv) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === inv.id ? { ...i, status: 'paid' } : i))
    );

    // Trigger AR-09 Automation Recipe (Invoice Paid Deal Won Celebration)
    await automationEngine.dispatchEvent('invoice.paid', {
      leadId: inv.leadId,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.grossTotal
    });

    onShowToast?.(`Invoice ${inv.invoiceNumber} reconciled as PAID! Deal marked Won.`);
  };

  const handleSendReminder = async (inv) => {
    const text = `Hi ${inv.customerName.split(' ')[0]}! Gentle reminder regarding GST Invoice ${inv.invoiceNumber} for ₹${inv.netPayable.toLocaleString('en-IN')}, due on ${inv.dueDate}.\n\nPay online via UPI: ${inv.paylink}`;
    await whatsAppAdapter.sendMessage({ to: inv.phone, message: text });
    onShowToast?.(`Payment reminder sent to ${inv.customerName} on WhatsApp!`);
  };

  const filteredInvoices = filterStatus === 'all'
    ? invoices
    : invoices.filter((i) => i.status === filterStatus);

  const totalCollected = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.grossTotal, 0);
  const totalPending = invoices.filter((i) => i.status !== 'paid').reduce((acc, i) => acc + i.netPayable, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 text-xs">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">GST Invoices & Razorpay UPI Hub</h2>
          <p className="text-slate-500">Track Delhi NCR GST compliance, TDS Section 194C/J deductions, and automated payment links</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs">
            <span className="text-[10px] text-slate-500 block">TOTAL REVENUE COLLECTED</span>
            <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">₹{(totalCollected / 100000).toFixed(2)} Lakh</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs">
            <span className="text-[10px] text-slate-500 block">PENDING RECEIVABLES</span>
            <span className="font-black text-amber-700 dark:text-amber-300 text-sm">₹{(totalPending / 100000).toFixed(2)} Lakh</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="pt-3 pb-2 flex gap-1.5">
        {['all', 'pending', 'paid', 'overdue'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Invoices High-Density Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-2.5 px-3">Invoice #</th>
              <th className="py-2.5 px-3">Client & Brand</th>
              <th className="py-2.5 px-3">Base Value</th>
              <th className="py-2.5 px-3">GST (18%)</th>
              <th className="py-2.5 px-3">TDS Deduction</th>
              <th className="py-2.5 px-3">Net Client Payable</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition">
                <td className="py-3 px-3 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{inv.customerName}</div>
                  <div className="text-[11px] text-slate-500">{inv.company}</div>
                </td>
                <td className="py-3 px-3 font-medium">₹{inv.baseAmount.toLocaleString('en-IN')}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">₹{inv.totalGst.toLocaleString('en-IN')}</td>
                <td className="py-3 px-3 text-rose-600 font-semibold">
                  {inv.tdsDeducted > 0 ? `-₹${inv.tdsDeducted.toLocaleString('en-IN')}` : '₹0'}
                </td>
                <td className="py-3 px-3 font-black text-slate-900 dark:text-slate-100">
                  ₹{inv.netPayable.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                    inv.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inv.status === 'overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {inv.status !== 'paid' && (
                      <>
                        <button
                          onClick={() => handleMarkAsPaid(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                        >
                          Mark Paid ✓
                        </button>
                        <button
                          onClick={() => handleSendReminder(inv)}
                          className="p-1 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59]"
                          title="Send WhatsApp Reminder"
                        >
                          💬
                        </button>
                      </>
                    )}
                    {inv.status === 'paid' && (
                      <span className="text-emerald-600 font-bold text-[11px]">Reconciled 🟢</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
