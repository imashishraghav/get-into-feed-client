import React from 'react';
import { Undo2, X } from 'lucide-react';

/**
 * Accessible Undo Toast Component (WCAG AA Compliant)
 */
export function UndoToast({ toastState, onUndo, onDismiss }) {
  if (!toastState) return null;

  return (
    <aside 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-[13px] font-medium animate-in slide-in-from-bottom-5 duration-200"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-slate-100">
        {toastState.message}
      </span>

      {onUndo && (
        <button
          onClick={onUndo}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4FF00] text-slate-950 font-bold text-xs hover:bg-[#bfe600] transition focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
          aria-label="Undo recent action"
        >
          <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Undo</span>
        </button>
      )}

      <button
        onClick={onDismiss}
        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </aside>
  );
}

export default UndoToast;
