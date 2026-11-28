import { useState, useRef, useCallback } from 'react';

/**
 * Hook for managing actionable Undo Toasts
 * Allows reversing accidental stage advances, stage reverts, or deletions.
 */
export function useUndoToast() {
  const [toastState, setToastState] = useState(null);
  const timerRef = useRef(null);

  const showUndoToast = useCallback((message, onUndo, timeoutMs = 8000) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToastState({
      message,
      onUndo,
      createdAt: Date.now()
    });

    timerRef.current = setTimeout(() => {
      setToastState(null);
    }, timeoutMs);
  }, []);

  const triggerUndo = useCallback(() => {
    if (toastState?.onUndo) {
      toastState.onUndo();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToastState(null);
  }, [toastState]);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToastState(null);
  }, []);

  return {
    toastState,
    showUndoToast,
    triggerUndo,
    dismissToast
  };
}

export default useUndoToast;
