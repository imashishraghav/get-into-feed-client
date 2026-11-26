/**
 * GetIntoFeed Agency CRM — Unified Adapter Registry & Factory
 * Guarantees 100% operation with ZERO third-party credentials.
 */

import { MockWhatsAppAdapter, ProductionWhatsAppAdapter } from './whatsAppAdapter.js';
import { MockPaymentAdapter, ProductionPaymentAdapter } from './paymentAdapter.js';
import { MockEsignAdapter, ProductionEsignAdapter } from './esignAdapter.js';
import { MockTelephonyAdapter, ProductionTelephonyAdapter } from './telephonyAdapter.js';
import { MockEmailAdapter, ProductionEmailAdapter } from './emailAdapter.js';

// Default to MOCK mode unless explicitly overridden in .env
const useMocks = import.meta.env?.VITE_USE_MOCK_ADAPTERS !== 'false';

export const whatsAppAdapter = useMocks
  ? new MockWhatsAppAdapter()
  : new ProductionWhatsAppAdapter({
      phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_ID,
      accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN
    });

export const paymentAdapter = useMocks
  ? new MockPaymentAdapter()
  : new ProductionPaymentAdapter({
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
      keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET
    });

export const esignAdapter = useMocks
  ? new MockEsignAdapter()
  : new ProductionEsignAdapter({
      clientId: import.meta.env.VITE_DIGIO_CLIENT_ID,
      clientSecret: import.meta.env.VITE_DIGIO_CLIENT_SECRET
    });

export const telephonyAdapter = useMocks
  ? new MockTelephonyAdapter()
  : new ProductionTelephonyAdapter({
      accountSid: import.meta.env.VITE_EXOTEL_ACCOUNT_SID,
      apiKey: import.meta.env.VITE_EXOTEL_API_KEY,
      apiToken: import.meta.env.VITE_EXOTEL_API_TOKEN,
      callerId: import.meta.env.VITE_EXOTEL_CALLER_ID
    });

export const emailAdapter = useMocks
  ? new MockEmailAdapter()
  : new ProductionEmailAdapter({
      apiKey: import.meta.env.VITE_RESEND_API_KEY
    });

export const isRunningInMockMode = useMocks;
