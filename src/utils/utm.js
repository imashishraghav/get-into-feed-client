/**
 * GetIntoFeed UTM & Attribution Tracking Engine
 * Captures first-touch and session marketing attribution parameters
 * (UTMs, Google Click ID, Meta Click ID, Landing Page, Referrer)
 * and persists them across the browsing session for multi-touch lead capture.
 */

const STORAGE_KEY = "gif_lead_attribution";

/**
 * Parses query params from current URL and stores newly discovered attribution tags.
 * Preserves first-touch attribution while updating latest touch if new parameters exist.
 */
export function initAttributionTracking() {
  if (typeof window === "undefined") return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid"
    ];

    let hasNewTags = false;
    const newTags = {};

    for (const key of utmKeys) {
      const val = urlParams.get(key);
      if (val) {
        newTags[key] = val.trim();
        hasNewTags = true;
      }
    }

    // Retrieve existing attribution from sessionStorage / localStorage
    let stored = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {
      stored = {};
    }

    const currentUrl = window.location.href.split("?")[0];
    const referrer = document.referrer || "";

    // Save initial landing details if first visit
    if (!stored.landing_page) {
      stored.landing_page = currentUrl;
    }
    if (!stored.initial_referrer && referrer && !referrer.includes(window.location.hostname)) {
      stored.initial_referrer = referrer;
    }

    // Merge new tags (or preserve previous campaign if user is continuing session)
    if (hasNewTags) {
      stored = {
        ...stored,
        ...newTags,
        last_touch_page: currentUrl,
        last_touch_at: new Date().toISOString()
      };
    }

    const serialized = JSON.stringify(stored);
    try {
      sessionStorage.setItem(STORAGE_KEY, serialized);
    } catch {}
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch {}
  } catch (err) {
    console.debug("[Attribution] Init error:", err);
  }
}

/**
 * Returns current lead attribution metadata to attach to lead submissions.
 */
export function getAttributionData() {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // If nothing saved, check URL directly as fallback
      const urlParams = new URLSearchParams(window.location.search);
      return {
        utm_source: urlParams.get("utm_source") || null,
        utm_medium: urlParams.get("utm_medium") || null,
        utm_campaign: urlParams.get("utm_campaign") || null,
        utm_term: urlParams.get("utm_term") || null,
        utm_content: urlParams.get("utm_content") || null,
        gclid: urlParams.get("gclid") || null,
        fbclid: urlParams.get("fbclid") || null,
        referrer: document.referrer || null,
        landing_page: window.location.href.split("?")[0]
      };
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Helper to enrich any lead/inquiry submission payload with attribution fields.
 */
export function enrichWithAttribution(payload = {}) {
  const attr = getAttributionData();
  return {
    ...payload,
    utm_source: payload.utm_source || attr.utm_source || null,
    utm_medium: payload.utm_medium || attr.utm_medium || null,
    utm_campaign: payload.utm_campaign || attr.utm_campaign || null,
    utm_term: payload.utm_term || attr.utm_term || null,
    utm_content: payload.utm_content || attr.utm_content || null,
    gclid: payload.gclid || attr.gclid || null,
    fbclid: payload.fbclid || attr.fbclid || null,
    referrer: payload.referrer || attr.initial_referrer || document.referrer || "Direct Traffic",
    page_url: payload.page_url || (typeof window !== "undefined" ? window.location.href : "")
  };
}
