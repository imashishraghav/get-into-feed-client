import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppShell } from './components/AppShell.jsx';
import { registerFeedOsServiceWorker } from './utils/serviceWorkerClient.js';

export function App() {
  const [applySwUpdate, setApplySwUpdate] = useState(null);

  useEffect(() => {
    if (!import.meta.env.PROD) return;

    registerFeedOsServiceWorker((triggerUpdate) => {
      setApplySwUpdate(() => triggerUpdate);
    });

    const handleControllerChange = () => {
      window.location.reload();
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  return (
    <AuthProvider>
      {applySwUpdate && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-[60] bg-white border border-slate-200 rounded-xl shadow-modal px-4 py-3 flex items-center gap-3 text-sm text-[#0F172A]"
        >
          <span className="font-medium">New FeedOS update available.</span>
          <button
            type="button"
            onClick={() => applySwUpdate()}
            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#D4FF00] text-[#0F172A] font-semibold text-xs hover:brightness-95 transition"
          >
            Update now
          </button>
          <button
            type="button"
            onClick={() => setApplySwUpdate(null)}
            className="text-xs text-[#475569] hover:text-[#0F172A] px-1.5 py-1"
          >
            Dismiss
          </button>
        </div>
      )}
      <AppShell />
    </AuthProvider>
  );
}

export default App;
