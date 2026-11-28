/**
 * GetIntoFeed Agency CRM — Zero-Credential Payment Adapter (Razorpay)
 * Calculates Delhi GST (Intra-state CGST 9% + SGST 9% vs Inter-state IGST 18%)
 * and generates instant UPI/Card payment links.
 *
 * Prevents double-GST by distinguishing tax-exclusive base amounts
 * from pre-calculated tax-inclusive gross invoice totals (`gstIncluded: true` or `grossAmount`).
 */

export class MockPaymentAdapter {
  constructor() {
    this.payments = new Map();
  }

  /**
   * @param {Object} params
   * @param {number} [params.amount]
   * @param {number} [params.baseAmount]
   * @param {number} [params.grossAmount]
   * @param {boolean} [params.gstIncluded=false]
   * @param {string} [params.currency='INR']
   * @param {string} [params.customerName]
   * @param {string} [params.customerPhone]
   * @param {string} [params.customerEmail]
   * @param {string} [params.description]
   * @param {string} [params.stateCode='07']
   * @param {string} [params.sacCode='998361']
   */
  async createPaymentLink({
    amount,
    baseAmount: explicitBaseAmount = null,
    grossAmount: explicitGrossAmount = null,
    gstIncluded = false,
    currency = 'INR',
    customerName,
    customerPhone,
    customerEmail,
    description,
    stateCode = '07', // Delhi NCR default
    sacCode = '998361',
  }) {
    const isDelhiIntraState = stateCode === '07';
    let baseAmount;
    let totalGst;
    let totalAmount;

    if (explicitGrossAmount !== null && explicitGrossAmount !== undefined) {
      totalAmount = Math.round(Number(explicitGrossAmount));
      baseAmount =
        explicitBaseAmount !== null && explicitBaseAmount !== undefined
          ? Math.round(Number(explicitBaseAmount))
          : Math.round(totalAmount / 1.18);
      totalGst = totalAmount - baseAmount;
    } else if (gstIncluded) {
      totalAmount = Math.round(Number(amount ?? 0));
      baseAmount =
        explicitBaseAmount !== null && explicitBaseAmount !== undefined
          ? Math.round(Number(explicitBaseAmount))
          : Math.round(totalAmount / 1.18);
      totalGst = totalAmount - baseAmount;
    } else {
      baseAmount = Math.round(Number(explicitBaseAmount ?? amount ?? 0));
      totalGst = Math.round(baseAmount * 0.18);
      totalAmount = baseAmount + totalGst;
    }

    const cgst = isDelhiIntraState ? Math.floor(totalGst / 2) : 0;
    const sgst = isDelhiIntraState ? totalGst - cgst : 0;
    const igst = isDelhiIntraState ? 0 : totalGst;

    const id = `plink_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const paymentLink = `https://rzp.io/i/mock_${id}`;
    const upiQrString = `upi://pay?pa=getintofeed.agency@icici&pn=GetIntoFeed%20Studio&am=${totalAmount}&tr=${id}&cu=INR`;

    const record = {
      id,
      short_url: paymentLink,
      amount: totalAmount,
      base_amount: baseAmount,
      gst_included_input: Boolean(gstIncluded || explicitGrossAmount != null),
      tax_details: {
        sac_code: sacCode,
        is_intra_state: isDelhiIntraState,
        cgst,
        sgst,
        igst,
        gst_rate_percent: 18,
      },
      currency,
      status: 'created',
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      description,
      upi_qr: upiQrString,
      created_at: new Date().toISOString(),
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
    // Only non-empty mock signatures should pass in test harnesses
    return Boolean(razorpayPaymentId && razorpayOrderId && razorpaySignature?.startsWith('sig_mock'));
  }
}

export class ProductionPaymentAdapter {
  constructor({ keyId, keySecret }) {
    this.keyId = keyId;
    this.keySecret = keySecret;
    this.authHeader = 'Basic ' + btoa(`${keyId}:${keySecret}`);
  }

  async createPaymentLink({
    amount,
    baseAmount = null,
    grossAmount = null,
    gstIncluded = true,
    customerName,
    customerPhone,
    customerEmail,
    description,
  }) {
    let chargeInRupees;
    if (grossAmount !== null && grossAmount !== undefined) {
      chargeInRupees = Number(grossAmount);
    } else if (!gstIncluded && baseAmount !== null && baseAmount !== undefined) {
      chargeInRupees = Math.round(Number(baseAmount) * 1.18);
    } else {
      chargeInRupees = Number(amount);
    }

    const res = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(chargeInRupees * 100), // Razorpay in paise
        currency: 'INR',
        description,
        customer: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notify: { sms: true, email: true, whatsapp: true },
      }),
    });
    return await res.json();
  }

  async getPaymentStatus(paymentLinkId) {
    const res = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
      headers: { Authorization: this.authHeader },
    });
    return await res.json();
  }
}
