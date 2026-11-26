/**
 * GetIntoFeed Agency CRM — Zero-Credential Telephony Adapter (Exotel/Twilio)
 * Powers 1-click agent click-to-call, call duration tracking, and call recording references.
 */

export class MockTelephonyAdapter {
  constructor() {
    this.calls = new Map();
  }

  async initiateCall({
    agentPhone = '+919811099999',
    customerPhone,
    customerName = 'Founder',
    leadId = null
  }) {
    const callSid = `call_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      call_sid: callSid,
      lead_id: leadId,
      agent_phone: agentPhone,
      customer_phone: customerPhone,
      customer_name: customerName,
      status: 'in-progress',
      direction: 'outbound-click-to-call',
      duration_seconds: 0,
      recording_url: `https://mock-telephony.getintofeed.com/recordings/${callSid}.mp3`,
      started_at: new Date().toISOString()
    };

    this.calls.set(callSid, record);

    // Auto complete mock call after 5 seconds
    setTimeout(() => {
      record.status = 'completed';
      record.duration_seconds = 142; // 2m 22s
      record.ended_at = new Date().toISOString();
      this.calls.set(callSid, record);
    }, 5000);

    return {
      success: true,
      call_sid: callSid,
      message: `Connecting ${agentPhone} to ${customerPhone} via Exotel bridge...`
    };
  }

  async getCallStatus(callSid) {
    if (!this.calls.has(callSid)) {
      throw new Error(`Call ${callSid} not found`);
    }
    return this.calls.get(callSid);
  }
}

export class ProductionTelephonyAdapter {
  constructor({ accountSid, apiKey, apiToken, callerId }) {
    this.accountSid = accountSid;
    this.apiKey = apiKey;
    this.apiToken = apiToken;
    this.callerId = callerId;
    this.authHeader = 'Basic ' + btoa(`${apiKey}:${apiToken}`);
  }

  async initiateCall({ agentPhone, customerPhone }) {
    const url = `https://api.exotel.com/v1/Accounts/${this.accountSid}/Calls/connect.json`;
    const formData = new URLSearchParams();
    formData.append('From', agentPhone);
    formData.append('To', customerPhone);
    formData.append('CallerId', this.callerId);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    return await res.json();
  }
}
