import React from 'react';

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkAssign,
  onBulkStageChange,
  onBulkExport
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 text-xs font-semibold animate-in slide-in-from-bottom duration-200 border border-slate-800">
      
      <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
          {selectedCount}
        </span>
        <span>Leads Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onBulkAssign}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
        >
          <span>👤</span> Assign Rep
        </button>

        <button
          onClick={onBulkStageChange}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
        >
          <span>📊</span> Change Stage
        </button>

        <button
          onClick={onBulkExport}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
        >
          <span>📥</span> Export CSV
        </button>
      </div>

      <button
        onClick={onClearSelection}
        className="text-slate-400 hover:text-white ml-2 text-xs font-bold"
      >
        ✕ Deselect
      </button>

    </div>
  );
}
