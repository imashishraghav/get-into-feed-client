import React, { useState } from 'react';
import { X, User, Phone, Mail, Building, Tag, IndianRupee, MessageSquare, Check, Sparkles } from 'lucide-react';
import { createManualLead } from '../utils/api.js';

export function ManualLeadModal({ isOpen, onClose, onLeadCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    interested_service: 'Performance Marketing (Google & Meta Ads)',
    budget: '₹1.5L - ₹3L / mo',
    priority: 'High',
    source: 'Direct WhatsApp Inbound',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Contact Name and Phone number are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await createManualLead(formData);
      if (res.success) {
        onLeadCreated(res.lead);
        onClose();
      } else {
        setError(res.error || 'Failed to create lead.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with CRM server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-slate-950 font-bold">
              +
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Log New Inbound Lead</h3>
              <p className="text-[11px] text-slate-400">Add phone, referral or WhatsApp lead to pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="rounded-lg border border-rose-500/50 bg-rose-950/60 p-3 text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-8 pr-3 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Phone / WhatsApp <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-8 pr-3 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Work Email (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="founder@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-8 pr-3 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Company / Brand Name
              </label>
              <div className="relative">
                <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Nexa Health D2C"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-8 pr-3 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Interested Growth Service
              </label>
              <select
                name="interested_service"
                value={formData.interested_service}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white focus:border-lime-400 focus:outline-none"
              >
                <option value="Performance Marketing (Google & Meta Ads)">Performance Marketing (Google & Meta Ads)</option>
                <option value="SEO & Organic Search Dominance">SEO & Organic Search Dominance</option>
                <option value="CRO & High-Converting Landing Pages">CRO & High-Converting Landing Pages</option>
                <option value="E-Commerce D2C Scaling">E-Commerce D2C Scaling</option>
                <option value="Full-Funnel Brand Growth">Full-Funnel Brand Growth</option>
                <option value="360° Growth Audit">360° Growth Audit</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Monthly Ad / Retainer Budget
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white focus:border-lime-400 focus:outline-none"
              >
                <option value="₹50k - ₹1.5L / mo">₹50k - ₹1.5L / mo</option>
                <option value="₹1.5L - ₹3L / mo">₹1.5L - ₹3L / mo</option>
                <option value="₹3L - ₹5L / mo">₹3L - ₹5L / mo</option>
                <option value="₹5L+ Enterprise / mo">₹5L+ Enterprise / mo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white focus:border-lime-400 focus:outline-none"
              >
                <option value="Urgent">🔥 Urgent (&lt; 1 hr callback)</option>
                <option value="High">⚡ High (Same day)</option>
                <option value="Medium">Medium (Within 24 hrs)</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Source Channel
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white focus:border-lime-400 focus:outline-none"
              >
                <option value="Direct WhatsApp Inbound">Direct WhatsApp Inbound</option>
                <option value="Client Referral">Client Referral</option>
                <option value="Inbound Phone Call">Inbound Phone Call</option>
                <option value="LinkedIn DM Outreach">LinkedIn DM Outreach</option>
                <option value="Offline Event / Meeting">Offline Event / Meeting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Internal Notes / Context
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="What are they looking to achieve? Current ad spend, pain points, timeline..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-lime-400 px-5 py-2 font-bold text-slate-950 hover:bg-lime-300 transition-all shadow-[0_0_12px_rgba(212,255,0,0.25)] disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Save & Inject into Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
