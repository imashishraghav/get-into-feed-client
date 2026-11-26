/**
 * GetIntoFeed Agency CRM — Client Delivery & Service Modules Seed Data
 * Real-world delivery tracking for Delhi NCR creative & performance marketing clients.
 */

export const ACTIVE_PROJECTS = [
  {
    id: 'proj_singhania_01',
    leadId: 'lead_01',
    clientName: 'Ananya Singhania',
    clientCompany: 'Singhania Couture',
    clientEmail: 'ananya@singhaniacouture.com',
    clientPhone: '+91 98188 11223',
    servicePackage: '30-Day Creative Performance Sprint',
    monthlyRetainer: 79000,
    sprintStart: '2026-11-01',
    sprintEnd: '2026-11-30',
    status: 'active',
    health: 'excellent', // excellent | good | at_risk
    assignedTeam: {
      accountManager: 'Ashish (Founder)',
      performanceLead: 'Priya Sharma',
      creativeEditor: 'Rahul Verma',
      seoSpecialist: 'Sneha Rao'
    },
    // Creative Delivery: 12 Reels Studio
    reelsDeliverables: [
      {
        id: 'reel_singh_01',
        title: 'Reel #01: "Why 90% Buy The Wrong Silk" (Problem Hook)',
        duration: '00:26',
        currentVersion: 'v2',
        status: 'approved',
        driveLink: 'https://cdn.getintofeed.com/creatives/singhania/reel_01_v2.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=60',
        versions: ['v1', 'v2'],
        clientRating: 5,
        comments: [
          {
            id: 'c_01',
            timestamp: '00:04',
            author: 'Ashish (Founder)',
            text: 'Enlarge hook typography, cut first 0.5s pause to increase initial hook rate.',
            resolved: true
          },
          {
            id: 'c_02',
            timestamp: '00:18',
            author: 'Ananya Singhania',
            text: 'Loved the embroidery close-up! Lighting is vibrant. Approved!',
            resolved: true
          }
        ]
      },
      {
        id: 'reel_singh_02',
        title: 'Reel #02: "Behind The Loom — 140 Hours of Hand Zari"',
        duration: '00:32',
        currentVersion: 'v2',
        status: 'pending_approval',
        driveLink: 'https://cdn.getintofeed.com/creatives/singhania/reel_02_v2.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=60',
        versions: ['v1', 'v2'],
        comments: [
          {
            id: 'c_03',
            timestamp: '00:11',
            author: 'Ananya Singhania',
            text: 'Can we add subtle classical sitar rhythm in the background beat here?',
            resolved: false
          }
        ]
      },
      {
        id: 'reel_singh_03',
        title: 'Reel #03: "Bride Real Reaction in South Extension"',
        duration: '00:28',
        currentVersion: 'v1',
        status: 'in_production',
        driveLink: 'https://cdn.getintofeed.com/creatives/singhania/reel_03_v1.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&auto=format&fit=crop&q=60',
        versions: ['v1'],
        comments: [
          {
            id: 'c_04',
            timestamp: '00:02',
            author: 'Rahul Verma (Editor)',
            text: 'Rough cut ready for internal sound design review.',
            resolved: false
          }
        ]
      },
      {
        id: 'reel_singh_04',
        title: 'Reel #04: "3 Ways To Style A Velvet Shawl This Winter"',
        duration: '00:22',
        currentVersion: 'v3',
        status: 'approved',
        driveLink: 'https://cdn.getintofeed.com/creatives/singhania/reel_04_v3.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=60',
        versions: ['v1', 'v2', 'v3'],
        clientRating: 5,
        comments: [
          {
            id: 'c_05',
            timestamp: '00:08',
            author: 'Ananya Singhania',
            text: 'Final master looks gorgeous. Ready for Meta Advantage+ ads!',
            resolved: true
          }
        ]
      }
    ],
    // Performance Marketing & Paid Ads Module
    paidAds: {
      monthlyBudget: 250000,
      spentToDate: 178400,
      pacingPercent: 71.4,
      blendedRoas: 4.35,
      targetRoas: 3.80,
      revenueGenerated: 776040,
      totalOrders: 472,
      cpa: 378,
      targetCpa: 450,
      metaRoas: 4.52,
      googleRoas: 3.94,
      creativeFatigueAlerts: [
        {
          id: 'alert_fatigue_01',
          adName: 'Reel #01 Silk Hook (Meta Advantage+)',
          frequency: 3.94,
          ctrTrend: -26.5,
          severity: 'HIGH',
          message: 'Frequency crossed 3.9. CTR dipped 26.5% over the last 48 hours.',
          recommendedAction: 'Rotate with Reel #04 Master or duplicate ad set with fresh audience exclusions.'
        }
      ]
    },
    // SEO & Organic Search Module
    seo: {
      trackedKeywords: [
        { keyword: 'luxury bridal lehenga south delhi', rank: 2, previousRank: 5, searchVolume: 2400, change: '+3' },
        { keyword: 'designer boutique south extension delhi', rank: 1, previousRank: 2, searchVolume: 3600, change: '+1' },
        { keyword: 'handcrafted pure banarasi saree online', rank: 3, previousRank: 8, searchVolume: 5400, change: '+5' },
        { keyword: 'couture bridal lehenga under 2 lakh', rank: 4, previousRank: 9, searchVolume: 1900, change: '+5' }
      ],
      organicClicks: 14280,
      clicksGrowthMoM: '+34.2%',
      organicImpressions: 245000,
      avgCtr: '5.83%',
      delhiLocalRank: 'Top 3 Map Pack in South Delhi & Gurugram'
    },
    // Web Development & CRO Module
    webCro: {
      siteUrl: 'https://singhaniacouture.com',
      stagingUrl: 'https://staging-singhania.getintofeed.agency',
      techStack: 'Next.js App Router + Shopify Headless',
      speedScore: 97,
      accessibilityScore: 100,
      seoScore: 100,
      bestPracticesScore: 96,
      lcp: '1.1s (Mobile 4G)',
      activeCroExperiment: {
        name: 'Sticky 1-Tap "Shop The Reel Look" Video Drawer',
        status: 'winning',
        conversionUplift: '+19.4%',
        signOffStatus: 'client_approved'
      }
    }
  },
  {
    id: 'proj_zenpure_02',
    leadId: 'lead_02',
    clientName: 'Devansh Taneja',
    clientCompany: 'ZenPure Organics',
    clientEmail: 'devansh@zenpure.in',
    clientPhone: '+91 99100 55443',
    servicePackage: 'Short-Form Video & Reels Studio',
    monthlyRetainer: 49000,
    sprintStart: '2026-11-05',
    sprintEnd: '2026-12-05',
    status: 'active',
    health: 'good',
    assignedTeam: {
      accountManager: 'Ashish (Founder)',
      performanceLead: 'Priya Sharma',
      creativeEditor: 'Rahul Verma',
      seoSpecialist: 'Sneha Rao'
    },
    reelsDeliverables: [
      {
        id: 'reel_zen_01',
        title: 'Reel #01: "Why Your Whey Protein Makes You Bloated"',
        duration: '00:24',
        currentVersion: 'v2',
        status: 'approved',
        driveLink: 'https://cdn.getintofeed.com/creatives/zenpure/reel_01.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=60',
        versions: ['v1', 'v2'],
        comments: []
      },
      {
        id: 'reel_zen_02',
        title: 'Reel #02: "Cold-Pressed Shilajit Himalayan Sourcing"',
        duration: '00:29',
        currentVersion: 'v1',
        status: 'pending_approval',
        driveLink: 'https://cdn.getintofeed.com/creatives/zenpure/reel_02.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=60',
        versions: ['v1'],
        comments: [
          {
            id: 'c_zen_01',
            timestamp: '00:07',
            author: 'Devansh Taneja',
            text: 'Add Lab Test Certificate overlay sticker here.',
            resolved: false
          }
        ]
      }
    ],
    paidAds: {
      monthlyBudget: 150000,
      spentToDate: 92000,
      pacingPercent: 61.3,
      blendedRoas: 3.85,
      targetRoas: 3.50,
      revenueGenerated: 354200,
      totalOrders: 312,
      cpa: 295,
      targetCpa: 350,
      metaRoas: 3.92,
      googleRoas: 3.65,
      creativeFatigueAlerts: []
    },
    seo: {
      trackedKeywords: [
        { keyword: 'organic plant protein powder india', rank: 4, previousRank: 7, searchVolume: 4200, change: '+3' },
        { keyword: 'authentic himalayan shilajit resin', rank: 3, previousRank: 6, searchVolume: 6100, change: '+3' }
      ],
      organicClicks: 8940,
      clicksGrowthMoM: '+28.1%',
      organicImpressions: 165000,
      avgCtr: '5.41%',
      delhiLocalRank: 'Top 5 NCR Organic Wellness Brands'
    },
    webCro: {
      siteUrl: 'https://zenpure.in',
      stagingUrl: 'https://staging-zenpure.getintofeed.agency',
      techStack: 'Next.js App Router + Razorpay Headless Checkout',
      speedScore: 98,
      accessibilityScore: 100,
      seoScore: 100,
      bestPracticesScore: 98,
      lcp: '0.9s (Mobile 4G)',
      activeCroExperiment: {
        name: '1-Click UPI Quick-Checkout Bottom Sheet',
        status: 'winning',
        conversionUplift: '+22.6%',
        signOffStatus: 'client_approved'
      }
    }
  }
];

export function getProjectByLeadId(leadId) {
  return ACTIVE_PROJECTS.find((p) => p.leadId === leadId) || ACTIVE_PROJECTS[0];
}

export function getProjectById(projId) {
  return ACTIVE_PROJECTS.find((p) => p.id === projId) || ACTIVE_PROJECTS[0];
}
