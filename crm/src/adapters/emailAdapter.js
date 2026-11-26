/**
 * GetIntoFeed Agency CRM — Zero-Credential Email Adapter (Resend / AWS SES)
 * Manages proposals, onboarding confirmations, and GST invoice deliveries.
 */

export class MockEmailAdapter {
  constructor() {
    this.outbox = [];
  }

  async sendEmail({ to, subject, html, text, from = 'GetIntoFeed Studio <growth@getintofeed.com>' }) {
    const id = `email_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      id,
      from,
      to,
      subject,
      html,
      text,
      status: 'delivered',
      sent_at: new Date().toISOString()
    };
    this.outbox.push(record);
    return { success: true, id, status: 'delivered' };
  }

  getOutbox() {
    return this.outbox;
  }
}

export class ProductionEmailAdapter {
  constructor({ apiKey }) {
    this.apiKey = apiKey;
  }

  async sendEmail({ to, subject, html, from = 'GetIntoFeed <growth@getintofeed.com>' }) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject, html })
    });
    return await res.json();
  }
}
