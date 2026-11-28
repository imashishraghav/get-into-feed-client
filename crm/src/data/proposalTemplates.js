/**
 * GetIntoFeed Agency CRM — Pre-Built Proposal Templates
 * Tailored packages for 30-Day Growth Sprints, Reels Studio, and Full-Funnel Retainers.
 */

export const PROPOSAL_TEMPLATES = [
  {
    id: 'sprint_30d_performance',
    title: '30-Day Creative Performance Growth Sprint',
    service: 'Performance Marketing & Paid Ads',
    monthlyFee: 79000,
    formattedFee: '₹79,000 / month',
    duration: '30-Day Sprint (No mandatory long-term lock-in)',
    targetRoas: '3.5x – 5.0x Blended ROAS',
    overview: 'High-intensity creative performance sprint engineered to scale conversions and aggressively lower your customer acquisition cost (CAC).',
    deliverables: [
      'Full Meta (Facebook/Instagram) & Google Ads Campaign Architecture',
      '12 Thumb-Stopping 9:16 Vertical Video Reels (Scripted, edited & sound-designed)',
      'Meta Advantage+ Shopping & Catalog Ads Setup with Custom Creative Hooks',
      'Continuous Landing Page Conversion Rate Optimization (CRO) recommendations',
      'Real-Time Live Looker Studio & GA4 Attribution Dashboard',
      'Weekly Strategy Sync with Founder Ashish & Dedicated Performance Lead'
    ],
    terms: 'Billed 100% upfront on mutual sign-off. Ad spend paid directly to ad platforms. 30-day review upon sprint completion.'
  },
  {
    id: 'reels_studio_12',
    title: '12 Thumb-Stopping 9:16 Video Reels Studio Sprint',
    service: 'Short-Form Video & Reels',
    monthlyFee: 49000,
    formattedFee: '₹49,000 / month',
    duration: 'Monthly Creative Sprint',
    targetRoas: 'High Retention & Organic Virality',
    overview: 'End-to-end vertical video production studio providing high-retention, conversion-focused short-form content for Instagram Reels, YouTube Shorts, and TikTok.',
    deliverables: [
      '12 Original 9:16 Vertical Reels (High-hook scripting & sound engineering)',
      '1 Full-Day In-Person Delhi NCR Shoot (Studio or Client HQ)',
      'Frame.io Style Real-Time Timestamped Client Review & Approval Portal',
      'Trending Audio Selection & Subtitle Typography Optimization',
      'Delivered in 3 Weekly Batches of 4 Reels'
    ],
    terms: 'Billed 50% on contract execution, 50% upon delivery of batch #2.'
  },
  {
    id: 'full_funnel_growth',
    title: 'Enterprise Full-Funnel Growth Suite (Ads + Reels + Next.js CRO)',
    service: 'Full-Funnel Agency Retainer',
    monthlyFee: 129000,
    formattedFee: '₹1,29,000 / month',
    duration: '60-Day Scaling Sprints',
    targetRoas: '4.0x+ Scale with Omnichannel Domination',
    overview: 'Our flagship all-in-one growth partnership for funded D2C brands, luxury real estate, and rapid-scale Indian enterprises.',
    deliverables: [
      'Omnichannel Paid Media Management (Meta, Google Search/Shopping, YouTube)',
      '20 High-Converting 9:16 Reels + Static Ad Creatives',
      'Next.js Headless Web Architecture, Page Speed & Conversion Optimization',
      'Server-Side Tracking (GTM Server Container, Meta CAPI & GA4)',
      'Dedicated Senior Account Manager & 24/7 Priority WhatsApp Bridge'
    ],
    terms: 'Billed monthly in advance. Requires 15-day notice before sprint conclusion.'
  }
];

export function generateTokenizedProposal({ lead, templateId = 'sprint_30d_performance', customFee = null }) {
  const template = PROPOSAL_TEMPLATES.find((t) => t.id === templateId) || PROPOSAL_TEMPLATES[0];
  const fee = customFee || template.monthlyFee;
  const token = `prop_${lead.id}_${Date.now().toString(36)}`;
  const publicUrl = `https://getintofeed.com/proposals/view?token=${token}`;

  return {
    token,
    public_url: publicUrl,
    lead_id: lead.id,
    lead_name: lead.name,
    company: lead.company,
    title: `${template.title} — ${lead.company}`,
    template_id: template.id,
    monthly_fee: fee,
    formatted_fee: `₹${(fee / 100000).toFixed(2)} Lakh / mo`,
    deliverables: template.deliverables,
    target_roas: template.targetRoas,
    terms: template.terms,
    status: 'sent',
    view_count: 0,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString()
  };
}
