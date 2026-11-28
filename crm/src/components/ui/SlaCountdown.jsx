import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Isolated Micro-Component for Speed-to-Lead SLA Countdown
 * 
 * Performance Architecture:
 * Contains its own internal 1-second timer state.
 * Eliminates full-app and full-table re-render cycles!
 */
export function SlaCountdown({ 
  deadline, 
  slaResolved, 
  speedToLeadSeconds = 0,
  firstContactChannel = null,
  className = '' 
}) {
  const calculateRemaining = () => {
    if (!deadline) return 0;
    const diff = Math.floor((new Date(deadline).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  };

  const [secondsRemaining, setSecondsRemaining] = useState(calculateRemaining);

  useEffect(() => {
    if (slaResolved || !deadline) return;

    // Synchronize immediately
    setSecondsRemaining(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, slaResolved]);

  // Format Helper
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}m ${remSecs < 10 ? '0' : ''}${remSecs}s`;
  };

  // Case 1: SLA Resolved via First-Contact
  if (slaResolved) {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 tabular-nums ${className}`}
        title={`First contact logged via ${firstContactChannel || 'Direct outreach'}`}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>
          {speedToLeadSeconds > 0 ? `Responded in ${formatTime(speedToLeadSeconds)}` : 'Responded'}
        </span>
      </span>
    );
  }

  // Case 2: SLA Breached (0 seconds remaining)
  if (secondsRemaining <= 0) {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 animate-pulse tabular-nums ${className}`}
        title="Speed-to-Lead SLA Breached (>5 minutes without verified contact)"
      >
        <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" aria-hidden="true" />
        <span>SLA Breached</span>
      </span>
    );
  }

  // Case 3: Live SLA Active Countdown (< 5 mins)
  const isUrgent = secondsRemaining < 90;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums border ${
        isUrgent 
          ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse' 
          : 'bg-slate-100 text-slate-700 border-slate-200'
      } ${className}`}
      title={`Speed-to-Lead countdown: First contact required within ${formatTime(secondsRemaining)}`}
    >
      <Clock className={`w-3 h-3 shrink-0 ${isUrgent ? 'text-amber-600' : 'text-slate-500'}`} aria-hidden="true" />
      <span>{formatTime(secondsRemaining)}</span>
    </span>
  );
}

export default SlaCountdown;
