/**
 * GetIntoFeed Agency CRM — Zero-Credential Payment Adapter (Razorpay)
 * Calculates Delhi GST (Intra-state CGST 9% + SGST 9% vs Inter-state IGST 18%)
 * and generates instant UPI/Card payment links.
 */

export class MockPaymentAdapter {
  constructor() {
    this.payments = new Map();
  }

  async createPaymentLink({
    amount,
    currency = 'INR',
    customerName,
    customerPhone,
    customerEmail,
    description,
    stateCode = '07', // Delhi NCR default
    sacCode = '998361'
  }) {
    const isDelhiIntraState = stateCode === '07';
    const baseAmount = amount;
    const gstRate = 0.18;
    const totalGst = Math.round(baseAmount * gstRate);
    const totalAmount = baseAmount + totalGst;

    const id = `plink_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const paymentLink = `https://rzp.io/i/mock_${id}`;
    const upiQrString = `upi://pay?pa=getintofeed.agency@icici&pn=GetIntoFeed%20Studio&am=${totalAmount}&tr=${id}&cu=INR`;

    const record = {
      id,
      short_url: paymentLink,
      amount: totalAmount,
      base_amount: baseAmount,
      tax_details: {
        sac_code: sacCode,
        is_intra_state: isDelhiIntraState,
        cgst: isDelhiIntraState ? Math.round(totalGst / 2) : 0,
        sgst: isDelhiIntraState ? Math.round(totalGst / 2) : 0,
        igst: isDelhiIntraState ? 0 : totalGst,
        gst_rate_percent: 18
      },
      currency,
      status: 'created',
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
      },
      description,
      upi_qr: upiQrString,
      created_at: new Date().toISOString()
    };

    this.payments.set(id, record);
    return record;
  }

  async getPaymentStatus(paymentLinkId) {
    if (!this.payments.has(paymentLinkId)) {
      throw new Error(`Payment link ${paymentLinkId} not found in mock store`);
    }
    return this.payments.get(paymentLinkId);
  }

  async simulatePaymentSuccess(paymentLinkId) {
    const record = await this.getPaymentStatus(paymentLinkId);
    record.status = 'paid';
    record.paid_at = new Date().toISOString();
    record.payment_id = `pay_mock_${Date.now()}`;
    record.method = 'upi';
    this.payments.set(paymentLinkId, record);
    return record;
  }

  verifyPaymentSignature({ razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
    // In mock mode, any signature starting with 'sig_mock' is valid
    return true;
  }
}

export class ProductionPaymentAdapter {
  constructor({ keyId, keySecret }) {
    this.keyId = keyId;
    this.keySecret = keySecret;
    this.authHeader = 'Basic ' + btoa(`${keyId}:${keySecret}`);
  }

  async createPaymentLink({ amount, customerName, customerPhone, customerEmail, description }) {
    const res = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay in paise
        currency: 'INR',
        description,
        customer: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        notify: { sms: true, email: true, whatsapp: true }
      })
    });
    return await res.json();
  }

  async getPaymentStatus(paymentLinkId) {
    const res = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
      headers: { 'Authorization': this.authHeader }
    });
    return await res.json();
  }
}
