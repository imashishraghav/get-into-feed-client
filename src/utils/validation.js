/**
 * GetIntoFeed - Unified Form Validation & Security Utilities
 * Enforces production-grade validation, Indian 10-digit mobile standards,
 * RFC-compliant emails, and honeypot anti-spam verification.
 */

export function sanitizeInput(str = "") {
  if (typeof str !== "string") return "";
  return str.trim();
}

/**
 * Validates Indian 10-digit mobile numbers or international phone numbers.
 * @param {string} phone 
 * @param {string} countryCode e.g. "+91"
 * @returns {{ isValid: boolean, error?: string, cleaned: string }}
 */
export function validatePhone(phone, countryCode = "+91") {
  const raw = sanitizeInput(phone);
  if (!raw) {
    return { isValid: false, error: "Phone number is required", cleaned: "" };
  }

  // Strip spaces, dashes, parentheses, dots
  const digitsOnly = raw.replace(/\D/g, "");

  // If country is India (+91)
  if (countryCode === "+91" || countryCode === "91" || countryCode === "") {
    // If user typed 12 digits starting with 91, strip 91
    let indianDigits = digitsOnly;
    if (indianDigits.length === 12 && indianDigits.startsWith("91")) {
      indianDigits = indianDigits.slice(2);
    } else if (indianDigits.length === 11 && indianDigits.startsWith("0")) {
      indianDigits = indianDigits.slice(1);
    }

    if (indianDigits.length !== 10) {
      return {
        isValid: false,
        error: "Please enter a valid 10-digit Indian mobile number",
        cleaned: digitsOnly
      };
    }

    // Must start with 6, 7, 8, or 9 for Indian cellular networks
    if (!/^[6-9]\d{9}$/.test(indianDigits)) {
      return {
        isValid: false,
        error: "Indian mobile numbers must start with 6, 7, 8, or 9",
        cleaned: indianDigits
      };
    }

    return { isValid: true, cleaned: indianDigits };
  }

  // International phone validation: 7 to 15 digits (ITU-T E.164 recommendation)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: "Please enter a valid international phone number (7-15 digits)",
      cleaned: digitsOnly
    };
  }

  return { isValid: true, cleaned: digitsOnly };
}

/**
 * Validates email address with standard RFC-compliant pattern.
 * @param {string} email 
 * @returns {{ isValid: boolean, error?: string, cleaned: string }}
 */
export function validateEmail(email) {
  const cleaned = sanitizeInput(email).toLowerCase();
  if (!cleaned) {
    return { isValid: false, error: "Email address is required", cleaned: "" };
  }

  // Standard production email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(cleaned)) {
    return { isValid: false, error: "Please enter a valid email address", cleaned };
  }

  return { isValid: true, cleaned };
}

/**
 * Validates a client name.
 * @param {string} name 
 * @returns {{ isValid: boolean, error?: string, cleaned: string }}
 */
export function validateName(name) {
  const cleaned = sanitizeInput(name);
  if (!cleaned) {
    return { isValid: false, error: "Name is required", cleaned: "" };
  }
  if (cleaned.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters", cleaned };
  }
  if (cleaned.length > 100) {
    return { isValid: false, error: "Name cannot exceed 100 characters", cleaned };
  }
  return { isValid: true, cleaned };
}

/**
 * Validates lead generation form inputs.
 * @param {object} params
 * @returns {{ isValid: boolean, errors: Record<string, string>, cleanedData: object }}
 */
export function validateLeadForm({ name, phone, email, countryCode = "+91" }) {
  const errors = {};
  const nameRes = validateName(name);
  if (!nameRes.isValid) errors.name = nameRes.error;

  const phoneRes = validatePhone(phone, countryCode);
  if (!phoneRes.isValid) errors.phone = phoneRes.error;

  const emailRes = validateEmail(email);
  if (!emailRes.isValid) errors.email = emailRes.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedData: {
      name: nameRes.cleaned,
      phone: phoneRes.cleaned,
      email: emailRes.cleaned,
      countryCode
    }
  };
}

/**
 * Checks if honeypot fields were triggered by automated spam bots.
 * @param {object} formValues 
 * @returns {boolean}
 */
export function isHoneypotTriggered(formValues = {}) {
  const hp1 = formValues.hp_field || "";
  const hp2 = formValues.bot_check || "";
  const hp3 = formValues.website_url_check || "";
  return Boolean(hp1.trim() || hp2.trim() || hp3.trim());
}
