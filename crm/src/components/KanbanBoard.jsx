import React, { useState } from 'react';
import { LeadCard } from './LeadCard.jsx';
import { Plus, Filter, Sparkles } from 'lucide-react';

export function KanbanBoard({ stages, onMoveStage, onSelectLead, onRefresh }) {
  const [draggedLeadId, setDraggedLeadId] = useState(null);
  const [activeOverStage, setActiveOverStage] = useState(null);

  const handleDragStart = (e, leadId) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('text/plain', String(leadId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeOverStage !== stageId) {
      setActiveOverStage(stageId);
    }
  };

  const handleDragLeave = (e, stageId) => {
    if (activeOverStage === stageId) {
      setActiveOverStage(null);
    }
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    setActiveOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      onMoveStage(parseInt(leadId, 10), targetStageId);
    }
    setDraggedLeadId(null);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 sm:p-6 pb-12 custom-scrollbar">
      <div className="flex gap-4 min-w-max items-start">
        {stages.map((stage) => {
          const isOver = activeOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-[320px] shrink-0 rounded-2xl bg-slate-950/60 border transition-all duration-150 flex flex-col max-h-[calc(100vh-140px)] ${
                isOver
                  ? 'border-[#D4FF00] bg-slate-900/90 shadow-[0_0_20px_rgba(212,255,0,0.15)] ring-1 ring-[#D4FF00]/50'
                  : 'border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Stage Header */}
              <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.color || '#3b82f6' }}
                  />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                    {stage.title}
                  </h3>
                </div>

                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-2 text-[11px] font-bold text-slate-300 font-mono">
                  {stage.count}
                </span>
              </div>

              {/* Lead Cards List Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[150px]">
                {stage.leads && stage.leads.length > 0 ? (
                  stage.leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onSelectLead={onSelectLead}
                      onDragStart={handleDragStart}
                      onMoveStage={onMoveStage}
                    />
                  ))
                ) : (
                  <div
                    className={`h-28 rounded-xl border border-dashed flex flex-col items-center justify-center text-center p-4 transition-colors ${
                      isOver ? 'border-[#D4FF00] bg-[#D4FF00]/5 text-[#D4FF00]' : 'border-slate-800 text-slate-600'
                    }`}
                  >
                    <p className="text-xs font-medium">
                      {isOver ? 'Drop lead here' : 'No deals in this stage'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
