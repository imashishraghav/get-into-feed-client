/**
 * GetIntoFeed Agency CRM — Meta Lead Ads Webhook Adapter
 * Normalizes Facebook & Instagram lead ad payloads into standard FeedOS lead entities.
 */

export class MetaLeadAdsAdapter {
  constructor({ appSecret = 'mock_secret', verifyToken = 'gif_meta_lead_token' } = {}) {
    this.appSecret = appSecret;
    this.verifyToken = verifyToken;
  }

  /**
   * Verify Meta Webhook Challenge during setup
   */
  verifyWebhookChallenge(mode, token, challenge) {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  /**
   * Parse & Normalize Incoming Meta Lead Ad Payload
   */
  normalizeLeadPayload(rawWebhookBody) {
    // Meta formats lead entries inside entry[].changes[]
    const entry = rawWebhookBody?.entry?.[0];
    const change = entry?.changes?.[0];
    const leadgenId = change?.value?.leadgen_id || `leadgen_${Date.now()}`;
    const formId = change?.value?.form_id || 'form_delhi_reels_01';
    const adId = change?.value?.ad_id || 'ad_meta_adv_plus_01';

    // If it's already normalized or simulated:
    const fieldData = change?.value?.field_data || [];
    const fieldsMap = {};
    fieldData.forEach((f) => {
      fieldsMap[f.name.toLowerCase()] = f.values?.[0] || '';
    });

    const fullName = fieldsMap.full_name || fieldsMap.name || 'Meta Inbound Founder';
    const rawPhone = fieldsMap.phone_number || fieldsMap.phone || '+919811012345';
    const email = fieldsMap.email || `lead_${leadgenId}@meta.inbound`;
    const company = fieldsMap.company_name || fieldsMap.company || 'D2C Brand';
    const city = fieldsMap.city || 'Gurugram';
    const bottleneck = fieldsMap.growth_bottleneck || fieldsMap.bottleneck || 'High Meta CAC; need Reels';

    // Normalize phone to +91
    const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10);
    const normalizedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;

    return {
      id: `lead_meta_${leadgenId}`,
      source: 'Meta Lead Ads',
      campaign: `meta_form_${formId}`,
      ad_id: adId,
      name: fullName,
      company,
      phone: normalizedPhone,
      email,
      city,
      locality: `${city} Sector`,
      service_interest: 'Performance Marketing & Paid Ads',
      budget_monthly: 100000,
      budget_formatted: '₹1.00 Lakh',
      bottleneck,
      stage: 'Lead Ingested',
      status: 'Lead Ingested',
      sla_seconds_remaining: 300, // Instant 5-min SLA trigger
      sla_status: 'active',
      created_at: new Date().toISOString()
    };
  }

  /**
   * Simulate a realistic Meta Lead Ad submission (Zero-Credential Mode)
   */
  simulateLeadSubmission({
    name = 'Sneha Kapur',
    company = 'GlowUp Skincare',
    phone = '9871123456',
    email = 'sneha@glowup.in',
    city = 'South Delhi',
    bottleneck = 'High Meta Ads CAC'
  } = {}) {
    const rawPayload = {
      entry: [
        {
          id: 'meta_page_getintofeed',
          changes: [
            {
              field: 'leadgen',
              value: {
                leadgen_id: `lead_${Date.now()}`,
                form_id: 'form_reels_sprint',
                ad_id: 'ad_advantage_plus',
                field_data: [
                  { name: 'full_name', values: [name] },
                  { name: 'company_name', values: [company] },
                  { name: 'phone_number', values: [phone] },
                  { name: 'email', values: [email] },
                  { name: 'city', values: [city] },
                  { name: 'growth_bottleneck', values: [bottleneck] }
                ]
              }
            }
          ]
        }
      ]
    };
    return this.normalizeLeadPayload(rawPayload);
  }
}
