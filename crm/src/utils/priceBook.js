/**
 * Price Book & Compliance Reference
 * GetIntoFeed Agency Operating System (FeedOS)
 *
 * Includes SAC codes, CA Review Flags, and Section 393 TDS configurations.
 */

/**
 * @typedef {Object} SacEntry
 * @property {string} code
 * @property {string} name
 * @property {string} serviceId
 * @property {number} defaultRateGst - Standard 18% GST
 * @property {string | null} caReviewFlag - Compliance notice requiring CA sign-off
 * @property {string} description
 */

/**
 * @typedef {Object} Section393ItemConfig
 * @property {string} id
 * @property {string} statutoryReference
 * @property {string} formerSectionLabel
 * @property {'Contractor' | 'Technical Services' | 'Professional Fees'} category
 * @property {'Individual/HUF' | 'Company/Firm/LLP' | 'Any Corporate'} payerType
 * @property {number} ratePercent
 * @property {string} description
 */

/** @type {Record<string, SacEntry>} */
export const SAC_PRICE_BOOK = {
  'meta-ads': {
    code: '998361',
    name: 'Advertising & Media Placement Services',
    serviceId: 'meta-ads',
    defaultRateGst: 18,
    caReviewFlag: null,
    description: 'Meta Ads, Paid Social & Performance Marketing campaign execution.',
  },
  'google-ads': {
    code: '998361',
    name: 'Search Engine Advertising & Media Buying',
    serviceId: 'google-ads',
    defaultRateGst: 18,
    caReviewFlag: null,
    description: 'Google Search, Performance Max, YouTube Ads management.',
  },
  seo: {
    code: '998314',
    name: 'Information Technology & Search Optimization Consulting',
    serviceId: 'seo',
    defaultRateGst: 18,
    caReviewFlag: null,
    description: 'Technical SEO audits, on-page optimization, backlink strategy.',
  },
  'website-cro': {
    code: '998313',
    name: 'Information Technology Consulting & System Analysis',
    serviceId: 'website-cro',
    defaultRateGst: 18,
    caReviewFlag:
      'CA REVIEW REQUIRED: 998313 covers IT consulting/software design. If custom website development includes hosting, maintenance, or domain provisioning, verify if SAC 998314 or 998315 applies.',
    description: 'Custom React/Next.js/WordPress websites, high-converting CRO landing pages.',
  },
  'reels-12': {
    code: '998366',
    name: 'Other Professional, Technical & Design Services',
    serviceId: 'reels-12',
    defaultRateGst: 18,
    caReviewFlag:
      'CA REVIEW REQUIRED: 998366 is formally designated for design services / sound recording. Commercial video shooting, scriptwriting & 9:16 post-production often fall under SAC 999612 (Motion picture/video production) or 998365. Confirm with Chartered Accountant before final GST return filing.',
    description: 'Reels batch production: hook ideation, shoot direction & editing.',
  },
  'commercial-video': {
    code: '998366',
    name: 'Commercial Video Production & Motion Pictures',
    serviceId: 'commercial-video',
    defaultRateGst: 18,
    caReviewFlag:
      'CA REVIEW REQUIRED: High-value commercial ad films / brand shoots may attract SAC 999612 instead of 998366. Verify with CA.',
    description: 'Brand commercials, founder story shoots, product launch cinematography.',
  },
  'content-marketing': {
    code: '998365',
    name: 'Market Research, PR & Content Strategy Services',
    serviceId: 'content-marketing',
    defaultRateGst: 18,
    caReviewFlag: null,
    description: 'Editorial blogs, founder LinkedIn ghostwriting, ad copywriting.',
  },
  'graphic-design': {
    code: '998366',
    name: 'Graphic Design & Visual Brand Identity',
    serviceId: 'graphic-design',
    defaultRateGst: 18,
    caReviewFlag: null,
    description: 'Brand guidelines, performance ad creatives, packaging & typography.',
  },
};

/**
 * Income-tax Act, 2025 Section 393 Withholding Tax (TDS) Table Items.
 *
 * @type {Record<string, Section393ItemConfig>}
 */
export const SECTION_393_TDS_RATES = {
  sec_393_item_1_ind: {
    id: 'sec_393_item_1_ind',
    statutoryReference: 'Income-tax Act 2025 Sec 393 Table Item 1',
    formerSectionLabel: 'Former 194C (Individual/HUF)',
    category: 'Contractor',
    payerType: 'Individual/HUF',
    ratePercent: 1.0,
    description:
      'Deduction on contract payments for advertising/creative services by Individual or HUF payers (1%).',
  },
  sec_393_item_1_corp: {
    id: 'sec_393_item_1_corp',
    statutoryReference: 'Income-tax Act 2025 Sec 393 Table Item 1',
    formerSectionLabel: 'Former 194C (Corporate/LLP)',
    category: 'Contractor',
    payerType: 'Company/Firm/LLP',
    ratePercent: 2.0,
    description:
      'Standard contract deduction for media execution and advertising production by Corporate entities (2%).',
  },
  sec_393_item_4_tech: {
    id: 'sec_393_item_4_tech',
    statutoryReference: 'Income-tax Act 2025 Sec 393 Table Item 4',
    formerSectionLabel: 'Former 194J (Fees for Technical Services)',
    category: 'Technical Services',
    payerType: 'Any Corporate',
    ratePercent: 2.0,
    description:
      'Fees for technical services including software engineering, web development, and digital ad ops (2%).',
  },
  sec_393_item_4_prof: {
    id: 'sec_393_item_4_prof',
    statutoryReference: 'Income-tax Act 2025 Sec 393 Table Item 4',
    formerSectionLabel: 'Former 194J (Professional Fees)',
    category: 'Professional Fees',
    payerType: 'Any Corporate',
    ratePercent: 10.0,
    description:
      'Professional consultancy, creative direction, brand architecture & high-level advisory fees (10%).',
  },
};

/**
 * Standard 8 Agency Services with Base Pricing & Default Deal Types.
 */
export const AGENCY_SERVICES = [
  {
    id: 'meta-ads',
    name: 'Meta Ads & Paid Social',
    dealTypes: ['Growth Sprint', 'Retainer'],
    basePrice: 45000,
    sac: '998361',
    deliverables: 'Audience testing, CBO funnels, weekly ROAS optimization',
  },
  {
    id: 'google-ads',
    name: 'Google Ads & Performance Max',
    dealTypes: ['Growth Sprint', 'Retainer'],
    basePrice: 45000,
    sac: '998361',
    deliverables: 'Search campaigns, negative keyword hygiene, conversion tracking',
  },
  {
    id: 'seo',
    name: 'Search Engine Optimization',
    dealTypes: ['Growth Sprint', 'Retainer'],
    basePrice: 35000,
    sac: '998314',
    deliverables: 'Technical audit, 4 target keyword clusters, on-page optimization',
  },
  {
    id: 'website-cro',
    name: 'Website Design & CRO Development',
    dealTypes: ['Service Package', 'One-off'],
    basePrice: 85000,
    sac: '998313',
    deliverables: 'Custom Next.js/Tailwind landing page, Mobile 95+ PageSpeed, form capture',
  },
  {
    id: 'reels-12',
    name: '12 Monthly Reels Production',
    dealTypes: ['Growth Sprint', 'Retainer'],
    basePrice: 75000,
    sac: '998366',
    deliverables: '12 high-retention 9:16 vertical reels, scripting, shoot direction, color grading',
  },
  {
    id: 'commercial-video',
    name: 'Commercial Video Production',
    dealTypes: ['Service Package', 'One-off'],
    basePrice: 120000,
    sac: '998366',
    deliverables: 'Full-day cinema shoot, 4K camera package, sound design, founder hero film',
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing & Copywriting',
    dealTypes: ['Growth Sprint', 'Retainer'],
    basePrice: 30000,
    sac: '998365',
    deliverables: '8 SEO articles, 12 LinkedIn executive posts, email marketing newsletter',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design & Visual Identity',
    dealTypes: ['Service Package', 'Retainer'],
    basePrice: 35000,
    sac: '998366',
    deliverables: '24 static feed ad creatives, brand styleguide, typography & palette',
  },
];
