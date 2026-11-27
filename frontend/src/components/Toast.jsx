import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

/**
 * Global helper to trigger toasts from anywhere in the application
 * @param {string} message 
 * @param {'success' | 'error' | 'info'} type 
 */
export function toast(message, type = "success") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("gif-toast", {
        detail: { message, type, id: Date.now() + Math.random() }
      })
    );
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleEvent = (e) => {
      if (!e.detail || !e.detail.message) return;
      const newToast = {
        id: e.detail.id || Date.now(),
        message: e.detail.message,
        type: e.detail.type || "success"
      };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 toasts

      setTimeout(() => {
        removeToast(newToast.id);
      }, 4500);
    };

    window.addEventListener("gif-toast", handleEvent);
    return () => window.removeEventListener("gif-toast", handleEvent);
  }, [removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((item) => {
        const isSuccess = item.type === "success";
        const isError = item.type === "error";

        return (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100 ${
              isSuccess
                ? "bg-slate-950 text-white border-emerald-500/40 shadow-emerald-950/20"
                : isError
                ? "bg-rose-950 text-white border-rose-500/40 shadow-rose-950/20"
                : "bg-slate-900 text-white border-blue-500/40 shadow-blue-950/20"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#d4ff00]" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 leading-snug break-words">
              {item.message}
            </div>

            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
