// Google Tag Manager, GA4 & Pixel Dynamic Tracking Engine for GetIntoFeed
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // 1. Automatic Universal Button & Link Click Interceptor
  // Ensures EVERY button and CTA click triggers GTM dataLayer and GA4
  document.addEventListener('click', (event) => {
    try {
      const target = event.target;
      if (!target) return;

      const clickable = target.closest('button, a, input[type="submit"], [role="button"], .cursor-pointer');
      if (!clickable) return;

      // Extract meaningful text label
      const rawText = clickable.innerText || clickable.getAttribute('aria-label') || clickable.getAttribute('title') || clickable.value || '';
      const buttonText = rawText.replace(/\s+/g, ' ').trim().slice(0, 60);

      // Extract destination URL if anchor tag
      const href = clickable.getAttribute('href') || clickable.dataset?.href || null;

      // Extract nearest semantic section / component container
      const section = clickable.closest('header, nav, footer, section, [id^="service"], [id^="contact"], [role="dialog"], .modal');
      const locationName = section?.id || section?.getAttribute('aria-label') || section?.tagName?.toLowerCase() || 'general';

      // Categorize button intent
      let buttonType = 'standard_button';
      const textLower = buttonText.toLowerCase();
      if (textLower.includes('project') || textLower.includes('audit') || textLower.includes('call') || textLower.includes('quote') || textLower.includes('consult')) {
        buttonType = 'conversion_cta';
      } else if (textLower.includes('whatsapp') || (href && href.includes('wa.me'))) {
        buttonType = 'whatsapp_cta';
      } else if (href && (href.startsWith('tel:') || textLower.includes('+91'))) {
        buttonType = 'phone_cta';
      } else if (clickable.closest('header, nav')) {
        buttonType = 'navigation_link';
      }

      const eventPayload = {
        event: 'button_click',
        button_text: buttonText || 'Icon / Unlabeled Button',
        button_type: buttonType,
        button_location: locationName,
        click_url: href,
        page_path: window.location.pathname,
        page_title: document.title
      };

      // Push to GTM dataLayer
      window.dataLayer.push(eventPayload);

      // If gtag is ready, also emit ga4 event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'button_click', {
          event_category: 'Button Interaction',
          event_label: buttonText,
          button_type: buttonType,
          button_location: locationName,
          link_url: href
        });

        // Dedicated event triggers for high-intent actions
        if (buttonType === 'conversion_cta') {
          window.gtag('event', 'cta_click', { cta_text: buttonText, location: locationName });
        } else if (buttonType === 'whatsapp_cta') {
          window.gtag('event', 'whatsapp_click', { button_text: buttonText });
        } else if (buttonType === 'phone_cta') {
          window.gtag('event', 'phone_call_click', { button_text: buttonText });
        }
      }
    } catch (err) {
      // Safe fallback: never block user click flow
      console.debug('[Analytics] Click capture silent exception:', err);
    }
  }, { passive: true });

  // 2. Intelligent Scroll Depth Tracking (25%, 50%, 75%, 90%)
  const milestonesReached = new Set();
  const checkScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const percent = Math.round((scrollTop / scrollHeight) * 100);
    const milestones = [25, 50, 75, 90];

    for (const m of milestones) {
      if (percent >= m && !milestonesReached.has(m)) {
        milestonesReached.add(m);
        window.dataLayer.push({
          event: 'scroll_depth',
          depth_threshold: m,
          page_path: window.location.pathname
        });
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'scroll', { percent_scrolled: m });
        }
      }
    }
  };
  window.addEventListener('scroll', checkScroll, { passive: true });

  console.log('⚡ [GetIntoFeed] GTM (GTM-PHJF6JHM) & GA4 (G-LHVZY6EFW1) behavior event bus active!');
}

// Helper: Custom Event Trigger
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    event: eventName,
    ...params,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Safe fallback for Meta/Facebook Pixel if added in GTM
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params);
  }
}

// Helper: High-Value Lead Conversion Event
export function trackLeadConversion(leadData = {}) {
  trackEvent('generate_lead', {
    currency: 'INR',
    value: 25000, // Nominal agency growth consultation value
    lead_id: leadData.id || ('LEAD-' + Date.now()),
    service_interested: leadData.service || 'Creative Growth',
    source: leadData.source || 'website_form',
    company: leadData.company || ''
  });

  // Also push standard contact conversion
  trackEvent('conversion', {
    send_to: 'G-LHVZY6EFW1',
    event_category: 'Lead Capture',
    event_label: leadData.service || 'Growth Lead'
  });
}

// Helper: Virtual Pageview for SPA routes
export function trackPageView(path, title) {
  trackEvent('page_view', {
    page_location: window.location.href,
    page_path: path || window.location.pathname,
    page_title: title || document.title
  });
}
