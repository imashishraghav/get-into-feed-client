/**
 * High-Converting Agency Omnichannel Quick Response Templates
 * Designed for GetIntoFeed performance marketing, video reels, SEO, and GST invoicing.
 * Supports English and Hinglish language localization.
 */

export const AGENCY_TEMPLATES = [
  {
    id: 'speed_to_lead_sla',
    title: '⚡ 5-Minute Speed-to-Lead Intro',
    category: 'First Response',
    channels: ['whatsapp', 'sms'],
    en: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'there';
      const company = lead.company || 'your brand';
      const service = lead.service_interest || 'growth marketing';
      return `Hi ${name}, Ashish here from GetIntoFeed Creative Performance Studio! 🚀\n\nI just received your inquiry regarding *${service}* for ${company}.\n\nAre you available for a quick 5-minute discovery call today to discuss scaling your sales and lowering your CAC?`;
    },
    hi: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'bhai';
      const service = lead.service_interest || 'digital marketing';
      return `Hi ${name}! GetIntoFeed team se Ashish bol raha hoon. Humne aapka inquiry dekha regarding *${service}*.\n\nAaj kal Delhi NCR me ads ka CAC badh raha hai. Kya hum aaj sham 10 minute ka quick audit call karein?`;
    }
  },
  {
    id: 'proposal_dispatch',
    title: '📄 30-Day Growth Sprint Proposal',
    category: 'Negotiation',
    channels: ['whatsapp', 'email'],
    en: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'there';
      return `Hi ${name}, your tailored 30-Day Growth Sprint proposal is ready!\n\nReview deliverables, sprint milestones, and target ROAS here: https://getintofeed.com/proposals/preview?id=${lead.id}\n\nLet me know if you have any questions before we initiate contract signing.`;
    },
    hi: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'ji';
      return `Hi ${name}, aapka customized 30-Day Growth Sprint proposal tayyar hai!\n\nAap yahan dekh sakte hain: https://getintofeed.com/proposals/preview?id=${lead.id}\n\nDeliverables ya pricing par koi doubt ho toh batayein.`;
    }
  },
  {
    id: 'gst_invoice_paylink',
    title: '🧾 Delhi GST Invoice & UPI Paylink',
    category: 'Billing',
    channels: ['whatsapp', 'email'],
    en: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'there';
      return `Hi ${name}, your GST Tax Invoice for this billing cycle has been generated.\n\nAmount: ${lead.budget_formatted || '₹75,000'} (incl. 18% GST)\nPay instantly via UPI / Card: https://rzp.io/i/mock_${lead.id}\n\nAutomated tax receipt will be dispatched immediately upon receipt.`;
    },
    hi: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'ji';
      return `Hi ${name}, aapka GST tax invoice generate ho gaya hai.\n\nPayable Amount: ${lead.budget_formatted || '₹75,000'} (including 18% GST)\nUPI QR se payment karne ka link: https://rzp.io/i/mock_${lead.id}\n\nPayment hote hi system auto-receipt bhej dega.`;
    }
  },
  {
    id: 'reels_review_ready',
    title: '🎬 9:16 Video Reels Ready for Approval',
    category: 'Delivery',
    channels: ['whatsapp'],
    en: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'there';
      return `Hi ${name}, the first batch of 4 thumb-stopping 9:16 reels for your brand is ready for review in FeedOS!\n\nWatch and 1-tap approve here: https://getintofeed.com/portal/reels?id=${lead.id}\n\nOur ad team will push approved reels live to Meta Advantage+ campaigns right away.`;
    },
    hi: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'ji';
      return `Hi ${name}, aapke brand ke 4 high-retention 9:16 reels review ke liye ready hain!\n\nAap phone pe dekh kar approve kar sakte hain: https://getintofeed.com/portal/reels?id=${lead.id}\n\nApprove hote hi hum ad campaign start kar denge!`;
    }
  },
  {
    id: 'festival_greeting',
    title: '🪔 Client Festival Greeting (Diwali / New Year)',
    category: 'Nurture',
    channels: ['whatsapp'],
    en: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'there';
      const company = lead.company || 'your team';
      return `Wishing you and everyone at ${company} a very Happy and Prosperous Festive Season! 🪔✨\n\nMay this year bring explosive growth, high ROAS, and soaring revenues!\n\nWarm regards,\nAshish & The GetIntoFeed Team`;
    },
    hi: (lead) => {
      const name = lead.name ? lead.name.split(' ')[0] : 'ji';
      const company = lead.company || 'aapki team';
      return `Aapko aur ${company} ki poori team ko tyohar ki dheron shubhkaamnayein! 🪔✨\n\nBhagwan kare aapka brand aur revenue tezi se grow kare!\n\nWarm regards,\nAshish & GetIntoFeed Team`;
    }
  }
];

export function openWhatsApp(phone, messageText) {
  if (!phone) {
    alert('No phone number recorded for this lead.');
    return;
  }
  const digits = phone.replace(/\D/g, '');
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  window.open(url, '_blank');
}
