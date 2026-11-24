// Google Tag Manager Dynamic Tracking Engine for GetIntoFeed
// GTM Container: GTM-PHJF6JHM
// GA4 Property: G-LHVZY6EFW1
// Architecture: GTM is the sole analytics delivery layer.

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  if (window.location.pathname.startsWith('/admin')) return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: eventName,
    ...params
  });
}


// Lead conversion
// No fabricated monetary value.
// No PII.

export function trackLeadConversion(leadData = {}) {
  if (typeof window === 'undefined') return;

  if (window.location.pathname.startsWith('/admin')) return;

  trackEvent('generate_lead', {
    lead_id: leadData.id || `LEAD-${Date.now()}`,
    service_interested: leadData.service || 'Creative Growth',
    source: leadData.source || 'website_form'
  });
}


// Controlled SPA route tracking

export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;

  const targetPath = path || window.location.pathname;

  if (targetPath.startsWith('/admin')) return;

  window.dataLayer = window.dataLayer || [];

  // 1. Push virtual_pageview for custom GTM triggers
  window.dataLayer.push({
    event: 'virtual_pageview',
    page_path: targetPath,
    page_title: title || document.title,
    page_location: window.location.href
  });

  // 2. Push standard GA4 page_view for default tag ingestion
  window.dataLayer.push({
    event: 'page_view',
    page_path: targetPath,
    page_title: title || document.title,
    page_location: window.location.href
  });
}

// =========================================================================
// HIGH-INTENT USER ENGAGEMENT TRACKERS (WCAG / CONVERSION SIGNALS)
// =========================================================================

export function trackPhoneClick(phoneNumber = '+91 88103 56950', placement = 'header') {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/admin')) return;

  trackEvent('phone_click', {
    phone_number: phoneNumber,
    click_placement: placement,
    page_location: window.location.href
  });
}

export function trackWhatsAppClick(placement = 'floating_button') {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/admin')) return;

  trackEvent('whatsapp_click', {
    channel: 'whatsapp',
    click_placement: placement,
    page_location: window.location.href
  });
}

export function trackCtaClick(ctaText, placement = 'hero', destinationUrl = '') {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/admin')) return;

  trackEvent('cta_click', {
    cta_text: ctaText,
    click_placement: placement,
    destination_url: destinationUrl,
    page_location: window.location.href
  });
}

// 4-tier Scroll Depth Tracking: 25%, 50%, 75%, 90%
let scrollMilestones = new Set();

export function initScrollDepthTracking() {
  if (typeof window === 'undefined') return () => {};
  if (window.location.pathname.startsWith('/admin')) return () => {};

  scrollMilestones = new Set();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercentage = Math.round((window.scrollY / scrollHeight) * 100);
    const thresholds = [25, 50, 75, 90];

    for (const threshold of thresholds) {
      if (scrollPercentage >= threshold && !scrollMilestones.has(threshold)) {
        scrollMilestones.add(threshold);
        trackEvent('scroll_depth', {
          percent_scrolled: threshold,
          page_path: window.location.pathname,
          page_title: document.title
        });
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}
