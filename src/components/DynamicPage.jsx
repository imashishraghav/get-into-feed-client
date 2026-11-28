import React, { useState, useEffect } from 'react';
import { PageHeader, PageFooter, CookieConsentBanner, WhatsAppFloatingButton } from './Layout';
import DynamicContentRenderer from './DynamicContentRenderer';
import UniversalLeadModal from './UniversalLeadModal';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function DynamicPage({ slug, onNavigate }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Growth Strategy');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`/api/pages/${encodeURIComponent(slug)}?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Page fetch error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data && data.status === 'success' && data.data) {
            setPage(data.data);
            if (data.data.seo?.title) {
              document.title = `${data.data.seo.title} — GetIntoFeed`;
            } else if (data.data.title) {
              document.title = `${data.data.title} — GetIntoFeed`;
            }
          } else {
            setError(true);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Dynamic page load notice:', err.message);
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-inter">
        <PageHeader onNavigate={onNavigate} />
        <div className="flex-1 py-32 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-inter text-sm mt-4 font-medium">Loading page content...</p>
        </div>
        <PageFooter onNavigate={onNavigate} />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-inter">
        <PageHeader onNavigate={onNavigate} />
        <div className="flex-1 py-24 text-center max-w-lg mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mb-4 font-bold text-2xl font-mono">
            404
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-sans">Page Not Found</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            The page &lsquo;{slug}&rsquo; is either in draft mode, moved, or does not exist.
          </p>
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
            className="mt-6 px-6 py-3 bg-slate-900 hover:bg-[#b5e200] hover:text-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer border-none transition-colors inline-flex items-center gap-2"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <PageFooter onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter text-slate-900">
      <PageHeader
        onNavigate={onNavigate}
        onOpenLeadModal={() => setLeadModalOpen(true)}
      />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Hero Header */}
        <header className="mb-10 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GetIntoFeed Knowledge & Content</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {page.title}
          </h1>
          {page.seo?.description && (
            <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
              {page.seo.description}
            </p>
          )}
        </header>

        {/* Dynamic Dual Editor Content (Classic WYSIWYG or Gutenberg Blocks) */}
        <main className="min-h-[30vh]">
          <DynamicContentRenderer
            editorMode={page.editor_mode || 'classic'}
            content={page.content}
            contentBlocks={page.content_blocks}
            onNavigate={onNavigate}
            onOpenModal={(svc) => {
              setSelectedService(svc || 'Growth Strategy');
              setLeadModalOpen(true);
            }}
          />
        </main>
      </div>
      <PageFooter onNavigate={onNavigate} />
      <CookieConsentBanner onNavigate={onNavigate} />
      <WhatsAppFloatingButton />

      {leadModalOpen && (
        <UniversalLeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          defaultService={selectedService}
        />
      )}
    </div>
  );
}
