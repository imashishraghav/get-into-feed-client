import React, { useState } from 'react';
import { ModalFocusTrap } from './ui/ModalFocusTrap.jsx';

export const LOST_REASONS = [
  'Budget too low / Price sensitivity',
  'Timing / Delayed project start',
  'Hired another Delhi NCR competitor',
  'Went cold / Unresponsive on WhatsApp',
  'Service mismatch (Out of agency scope)',
  'Founder decided to do in-house',
  'Other (specify in notes)'
];

export function LostReasonModal({ isOpen, lead, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState(LOST_REASONS[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen || !lead) return null;

  const handleSave = () => {
    onConfirm({
      leadId: lead.id,
      lostReason: selectedReason,
      lostNotes: notes.trim(),
      lostAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <ModalFocusTrap
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Deal as Lost"
      ariaLabel="Mark deal as lost modal"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-[12px] text-slate-500">
          Agency RevOps mandate: Record why <strong className="text-slate-800">{lead.name || lead.contact}</strong> ({lead.company || lead.brand}) did not close.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label htmlFor="lost-reason-select" className="font-semibold text-slate-700 block mb-1">
              Primary Lost Reason *
            </label>
            <select
              id="lost-reason-select"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
            >
              {LOST_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lost-notes-textarea" className="font-semibold text-slate-700 block mb-1">
              Debrief Notes & Competitor Details
            </label>
            <textarea
              id="lost-notes-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Client opted for a freelancer charging ₹35k/mo; suggested re-engaging in 60 days."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs focus:ring-2 focus:ring-rose-500"
          >
            Save Lost Reason
          </button>
        </div>
      </div>
    </ModalFocusTrap>
  );
}

export default LostReasonModal;
