/**
 * GetIntoFeed Agency CRM — Zero-Credential E-Signature Adapter (Digio/Leegality)
 * Facilitates legally binding digital contract signing for agency retainers.
 */

export class MockEsignAdapter {
  constructor() {
    this.agreements = new Map();
  }

  async createAgreement({
    title,
    documentUrl,
    signerName,
    signerEmail,
    signerPhone,
    contractValue = 0,
    retainerMonths = 1
  }) {
    const agreementId = `dgo_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const signingUrl = `https://app.digio.in/mock-sign/${agreementId}`;

    const agreement = {
      id: agreementId,
      title,
      document_url: documentUrl || `https://getintofeed.com/contracts/preview_${agreementId}.pdf`,
      signing_url: signingUrl,
      status: 'pending_signature',
      signer: {
        name: signerName,
        email: signerEmail,
        phone: signerPhone
      },
      contract_value: contractValue,
      retainer_months: retainerMonths,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString()
    };

    this.agreements.set(agreementId, agreement);
    return agreement;
  }

  async getSigningStatus(agreementId) {
    if (!this.agreements.has(agreementId)) {
      throw new Error(`Agreement ${agreementId} not found`);
    }
    return this.agreements.get(agreementId);
  }

  async simulateSigned(agreementId) {
    const agreement = await this.getSigningStatus(agreementId);
    agreement.status = 'signed';
    agreement.signed_at = new Date().toISOString();
    agreement.audit_trail = {
      ip_address: '103.21.124.50',
      device: 'Chrome / macOS (Delhi NCR)',
      aadhaar_ref: 'XXXX-XXXX-4921',
      certificate_authority: 'eMudhra / Controller of Certifying Authorities'
    };
    this.agreements.set(agreementId, agreement);
    return agreement;
  }
}

export class ProductionEsignAdapter {
  constructor({ clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);
  }

  async createAgreement({ title, signerEmail, signerPhone }) {
    const res = await fetch('https://ext.digio.in/v2/client/document/uploadpdf', {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signers: [{ identifier: signerEmail, name: title, reason: 'Agreement Acceptance' }]
      })
    });
    return await res.json();
  }
}
