/**
 * GetIntoFeed - DetailPages Architectural Facade (Phase 3 Refactoring)
 * 
 * Individual page components and data models have been canonically modularized into:
 *   - src/pages/ (Individual page components)
 *   - src/data/catalog.js (Authoritative catalogs and getters)
 *   - src/utils/markdownRenderer.jsx (Markdown parser & TOC engine)
 *   - src/components/ (Shared Layout, ErrorBoundary, Modals, Toasts)
 * 
 * This file maintains 100% backward compatibility for all existing named imports.
 */

// 1. Data Catalogs & Persistence Getters
export * from "./data/catalog.js";

// 2. Blog Data & Getters
export { blogPostsCatalog, getStoredBlogPosts } from "./data/blogPosts.js";

// 3. Markdown & Article TOC Utilities
export * from "./utils/markdownRenderer.jsx";

// 4. Shared Layout & Global Modals
export {
  PageHeader,
  PageFooter,
  CookieConsentBanner,
  WhatsAppFloatingButton
} from "./components/Layout.jsx";
export { PageLayout } from "./components/PageLayout.jsx";
export { default as UniversalLeadModal } from "./components/UniversalLeadModal.jsx";

// 5. Canonical Page Components
export { AboutUsPage } from "./pages/AboutUsPage.jsx";
export { ServicesHubPage } from "./pages/ServicesHubPage.jsx";
export { PricingPage } from "./pages/PricingPage.jsx";
export { ContactPage } from "./pages/ContactPage.jsx";
export { LegalPage, CookiePolicyPage } from "./pages/LegalPage.jsx";
export { NotFoundPage } from "./pages/NotFoundPage.jsx";
export { ServiceDetailPage } from "./pages/ServiceDetailPage.jsx";
export { WorkPage } from "./pages/WorkPage.jsx";
export { CaseStudyDetailPage } from "./pages/CaseStudyDetailPage.jsx";
export { ReviewsPage, ClientsTestimonialsPage } from "./pages/ReviewsPage.jsx";
export { FeedNotesPage, BlogPage } from "./pages/BlogPage.jsx";
export { AuditToolPage } from "./pages/AuditToolPage.jsx";

// 6. Analytics & API Constants
export { trackLeadConversion, trackEvent } from "./utils/analytics.js";
export const API_URL = import.meta.env.VITE_API_URL || "";
