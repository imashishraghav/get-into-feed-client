/**
 * GetIntoFeed Agency CRM — Zero-Credential WhatsApp Adapter
 * Handles 1-tap WhatsApp follow-ups, templated messages, and simulated inbound chats.
 */

export class MockWhatsAppAdapter {
  constructor() {
    this.messages = [];
    this.subscribers = new Set();
  }

  async sendMessage({ to, message, templateName = null, metadata = {} }) {
    const formattedTo = to.startsWith('+') ? to : `+91${to.replace(/\D/g, '')}`;
    const entry = {
      id: `wam_mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      to: formattedTo,
      from: '+919811099999', // GetIntoFeed Agency Official
      direction: 'outbound',
      message,
      templateName,
      status: 'delivered',
      timestamp: new Date().toISOString(),
      metadata
    };

    this.messages.push(entry);
    this.notifySubscribers(entry);
    return { success: true, messageId: entry.id, status: 'delivered' };
  }

  async sendTemplate({ to, templateName, languageCode = 'en', components = [] }) {
    const templateTexts = {
      speed_to_lead_sla: 'Hi {{name}}, thanks for reaching out to GetIntoFeed! We saw your enquiry regarding {{service}}. Are you free for a quick 5-min discovery call today?',
      proposal_shared: 'Hi {{name}}, your tailored 30-Day Growth Sprint proposal is ready. Review here: {{link}}',
      gst_invoice_due: 'Hi {{name}}, your GST tax invoice {{invoice_number}} for ₹{{amount}} is generated. Pay seamlessly via UPI: {{payment_link}}'
    };

    let text = templateTexts[templateName] || `Notification: ${templateName}`;
    components.forEach((c) => {
      if (c.parameters) {
        c.parameters.forEach((p, idx) => {
          text = text.replace(new RegExp(`\\{\\{param_${idx + 1}\\}\\}`, 'g'), p.text || '');
        });
      }
    });

    return this.sendMessage({ to, message: text, templateName, metadata: { components, languageCode } });
  }

  async getChatHistory(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return this.messages.filter((m) => m.to.includes(cleanPhone) || m.from.includes(cleanPhone));
  }

  simulateIncomingMessage({ from, message, senderName = 'Client' }) {
    const entry = {
      id: `wam_mock_in_${Date.now()}`,
      to: '+919811099999',
      from: from.startsWith('+') ? from : `+91${from.replace(/\D/g, '')}`,
      direction: 'inbound',
      message,
      senderName,
      status: 'received',
      timestamp: new Date().toISOString()
    };
    this.messages.push(entry);
    this.notifySubscribers(entry);
    return entry;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(message) {
    this.subscribers.forEach((cb) => {
      try { cb(message); } catch (e) { console.error('WhatsApp subscriber error:', e); }
    });
  }
}

export class ProductionWhatsAppAdapter {
  constructor({ phoneNumberId, accessToken }) {
    this.phoneNumberId = phoneNumberId;
    this.accessToken = accessToken;
    this.baseUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  }

  async sendMessage({ to, message }) {
    const cleanPhone = to.replace(/\D/g, '');
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: message }
      })
    });
    return await res.json();
  }

  async sendTemplate({ to, templateName, languageCode = 'en_US', components = [] }) {
    const cleanPhone = to.replace(/\D/g, '');
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components
        }
      })
    });
    return await res.json();
  }
}
