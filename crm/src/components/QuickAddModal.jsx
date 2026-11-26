import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Plus, User, Building, Phone, MapPin, IndianRupee, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AGENCY_SERVICES, SAC_PRICE_BOOK } from '../utils/priceBook.ts';
import { ModalFocusTrap } from './ui/ModalFocusTrap.jsx';

export function QuickAddModal({ isOpen, onClose, onAddLead, onShowToast }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState('meta-ads');
  const [dealType, setDealType] = useState('Growth Sprint');
  const [budget, setBudget] = useState('75000');
  const [city, setCity] = useState('Gurugram');
  
  // DPDP Consent State
  const [dpdpConsentGiven, setDpdpConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const cleanDigits = phone.replace(/\D/g, '');
    const normalizedPhone = cleanDigits.length >= 10 ? `+91 ${cleanDigits.slice(-10)}` : `+91 ${phone.trim()}`;
    const budgetNum = parseInt(budget, 10) || 75000;
    const selectedService = AGENCY_SERVICES.find(s => s.id === serviceId) || AGENCY_SERVICES[0];
    const sacEntry = SAC_PRICE_BOOK[serviceId] || SAC_PRICE_BOOK['meta-ads'];

    const now = new Date();
    const leadId = uuidv4();
    const stateCode = city === 'Noida' ? '09' : '07';

    // 5-minute SLA deadline
    const slaDeadlineAt = new Date(now.getTime() + 300 * 1000).toISOString();

    const newLead = {
      id: leadId,
      name: name.trim(),
      company: company.trim() || `${name.trim()} Brand`,
      phone: normalizedPhone,
      email: `contact@${(company || name).toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
      service_interest: selectedService.name,
      serviceId: selectedService.id,
      sacCode: sacEntry.code,
      caReviewFlag: sacEntry.caReviewFlag,
      dealType,
      dealValue: budgetNum,
      budget_monthly: budgetNum,
      budget_formatted: `₹${(budgetNum / 100000).toFixed(2)} Lakh`,
      city,
      locality: `${city} Central`,
      state_code: stateCode,
      stateName: stateCode === '07' ? 'Delhi (07 — Intra-State)' : 'Inter-State (18% IGST)',
      isIntraState: stateCode === '07',
      stage: 'Captured',
      status: 'Needs Reply',
      source: 'Manual Intake',
      
      // SLA Engine
      slaDeadlineAt,
      slaResolved: false,
      firstContactChannel: null,
      speedToLeadSeconds: 0,
      
      // DPDP Act Compliance
      dpdpConsent: {
        consentGiven: dpdpConsentGiven,
        consentSourceUrl: dpdpConsentGiven ? window.location.href : '',
        consentPolicyVersion: 'v1.2_2026_11',
        consentTimestamp: dpdpConsentGiven ? now.toISOString() : ''
      },

      assigned_to: 'Ashish (Founder)',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    onAddLead(newLead);
    setIsSubmitting(false);
    onShowToast?.(
      dpdpConsentGiven
        ? `Lead ${newLead.company} added! 5-Min SLA timer active.`
        : `Lead added! ⚠️ Flagged "Consent Missing" under DPDP Act.`
    );
    onClose();
  };

  return (
    <ModalFocusTrap
      isOpen={isOpen}
      onClose={onClose}
      title="Create Inbound Lead"
      ariaLabel="New inbound lead modal"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        {/* Name & Company */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-name-input" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Contact Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
              <input
                id="lead-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Singhania"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lead-company-input" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Brand / Company
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
              <input
                id="lead-company-input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. LuxeLiving Realty"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>
          </div>
        </div>

        {/* Phone & City */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-phone-input" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Phone (Indian +91) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
              <input
                id="lead-phone-input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98110 12345"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lead-city-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              NCR Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
              <select
                id="lead-city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
              >
                <option value="Gurugram">Gurugram (Golf Course Rd / Cyber Hub)</option>
                <option value="South Delhi">South Delhi (GK-2 / Hauz Khas)</option>
                <option value="Central Delhi">Central Delhi (Connaught Place)</option>
                <option value="Noida">Noida (Sector 62 / 18 - UP 09)</option>
                <option value="West Delhi">West Delhi (Rajouri Garden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service & Deal Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-service-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Service Discipline (8 Services)
            </label>
            <select
              id="lead-service-select"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                const s = AGENCY_SERVICES.find(srv => srv.id === e.target.value);
                if (s) setBudget(String(s.basePrice));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
            >
              {AGENCY_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.sac})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lead-dealtype-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Deal Structure
            </label>
            <select
              id="lead-dealtype-select"
              value={dealType}
              onChange={(e) => setDealType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
            >
              <option value="Growth Sprint">Growth Sprint (30-Day Burst)</option>
              <option value="Service Package">Service Package (Milestone Project)</option>
              <option value="Retainer">Rolling Retainer (Ongoing Monthly)</option>
              <option value="One-off">One-off Deliverable</option>
            </select>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="lead-budget-input" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Expected Deal Value (INR ₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
            <input
              id="lead-budget-input"
              type="number"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>
        </div>

        {/* DPDP Consent Checkbox */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={dpdpConsentGiven}
              onChange={(e) => setDpdpConsentGiven(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <div className="text-[12px] leading-snug">
              <span className="font-semibold text-slate-800">
                Explicit DPDP Digital Consent Received
              </span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Client agreed to service communications pursuant to GetIntoFeed Privacy Policy v1.2.
              </p>
            </div>
          </label>

          {!dpdpConsentGiven && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Manual lead will be saved with <strong className="font-semibold">"Consent Missing"</strong> flag.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-[#D4FF00] hover:bg-[#bfe600] text-[#0F172A] font-bold transition shadow-xs flex items-center gap-2 focus:ring-2 focus:ring-[#D4FF00]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{isSubmitting ? 'Adding...' : 'Save Lead'}</span>
          </button>
        </div>
      </form>
    </ModalFocusTrap>
  );
}

export default QuickAddModal;
