import React, { useState } from "react";
import { PageHeader, PageFooter, CookieConsentBanner } from "./Layout.jsx";
import UniversalLeadModal from "./UniversalLeadModal.jsx";
import ToastContainer from "./Toast.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

export function PageLayout({
  children,
  onNavigate,
  activeNav = "",
  fullWidth = false,
  hideHeader = false,
  leadModalOpen: externalLeadModalOpen,
  setLeadModalOpen: externalSetLeadModalOpen,
  selectedService: externalSelectedService,
  setSelectedService: externalSetSelectedService
}) {
  const [internalLeadModalOpen, internalSetLeadModalOpen] = useState(false);
  const leadModalOpen = externalLeadModalOpen !== undefined ? externalLeadModalOpen : internalLeadModalOpen;
  const setLeadModalOpen = externalSetLeadModalOpen !== undefined ? externalSetLeadModalOpen : internalSetLeadModalOpen;

  const [internalSelectedService, internalSetSelectedService] = useState("General Growth Consultation");
  const selectedService = externalSelectedService !== undefined ? externalSelectedService : internalSelectedService;
  const setSelectedService = externalSetSelectedService !== undefined ? externalSetSelectedService : internalSetSelectedService;

  return (
    <ErrorBoundary>
      <div className={`antialiased selection:bg-[#d4ff00] selection:text-slate-950 ${hideHeader ? 'bg-[#ffffff]' : 'bg-[#FAFAFA]'} font-inter relative min-h-screen text-[#09090B] flex flex-col justify-between overflow-x-clip`}>
        {/* 1. Universal Branded Header */}
        {!hideHeader && (
          <PageHeader
            onNavigate={onNavigate}
            activeNav={activeNav}
            onOpenLeadModal={() => setLeadModalOpen(true)}
          />
        )}

        {/* 2. Main Page Content Slot */}
        {fullWidth ? (
          <main className="flex-1 w-full overflow-x-clip">
            {children}
          </main>
        ) : (
          <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-16 overflow-x-clip">
            {children}
          </main>
        )}

        {/* 3. Global Branded Footer */}
        <PageFooter onNavigate={onNavigate} />

        {/* 4. Universal Branded Quick Consultation Modal */}
        <UniversalLeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />

        {/* 5. Global Cookie & Privacy Preferences Banner */}
        <CookieConsentBanner onNavigate={onNavigate} />

        {/* 6. Global Interactive Toast Notification System */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default PageLayout;
