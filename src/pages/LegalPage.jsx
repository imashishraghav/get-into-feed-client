import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  FileText,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone
} from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";

export function CookiePolicyPage({ onNavigate }) {
  return <LegalPage type="cookies" onNavigate={onNavigate} />;
}

export function LegalPage({ type = "privacy", onNavigate }) {
  const [activeTab, setActiveTab] = useState(type);
  const [openSection, setOpenSection] = useState(() => (
    type === "privacy" ? "s1" :
    type === "terms" ? "t1" :
    type === "refund" ? "r1" :
    type === "disclaimer" ? "d1" :
    type === "nda" ? "n1" : "c1"
  ));

  const TABS = [
    { id: "privacy",    label: "Privacy Policy",        path: "/privacy"       },
    { id: "terms",      label: "Terms of Service",      path: "/terms"         },
    { id: "refund",     label: "Refund Policy",         path: "/refund-policy" },
    { id: "disclaimer", label: "Disclaimer",            path: "/disclaimer"    },
    { id: "nda",        label: "NDA & Confidentiality", path: "/nda"           },
    { id: "cookies",    label: "Cookie Policy",         path: "/cookie-policy" },
  ];

  const CONTENT = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "How we collect, use, and protect your personal data",
      effectiveDate: "November 2026",
      badge: "DPDP Act 2023 & GDPR Compliant",
      sections: [
        { id: "s1", heading: "1. Information We Collect", body: `When you interact with our website, request a quote, or submit a contact form, we may collect:\n\n**Identity & Contact Information:** Full name, email address, phone/WhatsApp number, company name, and job title.\n\n**Commercial Details:** Service requirements, estimated budget, project scope, and business goals submitted through our forms.\n\n**Technical & Behavioural Data:** IP address, browser type, device information, pages visited, time spent on site, referral source, and UTM parameters — collected through Google Analytics 4 and Microsoft Clarity.` },
        { id: "s2", heading: "2. How We Use Your Information", body: `We use collected data strictly for the following purposes:\n\n• To respond to your enquiries and deliver service proposals\n• To set up and manage your digital marketing campaigns\n• To communicate project updates, reports, and strategic recommendations\n• To improve our website's performance and user experience\n• To comply with applicable legal obligations under India's DPDP Act 2023\n\nWe do **not** use your data for unsolicited cold outreach or sell it to third-party advertisers.` },
        { id: "s3", heading: "3. Data Sharing & Third Parties", body: `Your personal data may be shared only with trusted service providers who help us deliver our work:\n\n• **Google LLC** — Analytics, Ads, and Search Console\n• **Meta Platforms Inc.** — Advertising campaigns and Conversions API (CAPI)\n• **Hostinger International** — Website hosting and email infrastructure\n• **Cloudflare Inc.** — CDN, DDoS protection, and performance optimization\n\nAll third parties are contractually bound to process your data only for the specified purposes. We do **not** sell, rent, or trade your personal information.` },
        { id: "s4", heading: "4. Your Rights", body: `Under DPDP Act 2023 (India) and GDPR (EU/UK), you have the following rights:\n\n• **Right to Access** — Request a copy of personal data we hold about you\n• **Right to Correction** — Ask us to correct inaccurate or incomplete data\n• **Right to Erasure** — Request deletion of your personal data\n• **Right to Withdraw Consent** — Withdraw consent for data processing at any time\n• **Right to Portability** — Receive your data in a structured, machine-readable format\n\nTo exercise any of these rights, contact us at **hello@getintofeed.com**.` },
        { id: "s5", heading: "5. Data Security & Retention", body: `We implement industry-standard security measures including SSL/TLS encryption, server-side session tokens, and access-controlled cloud infrastructure to protect your data.\n\nPersonal data collected via enquiry forms is retained for a maximum of **24 months** from the date of last interaction, after which it is securely deleted unless a contractual relationship requires longer retention.` },
        { id: "s6", heading: "6. Grievance Officer", body: `For any privacy-related concerns, data requests, or complaints:\n\n**Email:** hello@getintofeed.com\n**Phone:** +91 88103 56950\n**Address:** Delhi NCR, India\n\nWe will acknowledge your request within 72 hours and resolve it within 30 days.` },
      ]
    },
    terms: {
      title: "Terms of Service",
      subtitle: "The commercial agreement governing all our engagements",
      effectiveDate: "November 2026",
      badge: "Governed by Indian Law",
      sections: [
        { id: "t1", heading: "1. Acceptance of Terms", body: `By engaging GetIntoFeed for any service — through a signed proposal, verbal agreement, payment, or use of our website — you agree to be bound by these Terms of Service in full.` },
        { id: "t2", heading: "2. Services & Scope of Work", body: `GetIntoFeed provides digital marketing services including:\n\n• Google Ads campaign setup, management, and optimisation\n• Meta Ads (Facebook & Instagram) campaign execution\n• Search Engine Optimisation (SEO) and local search\n• Website design, landing page development, and CRO\n• Content creation, graphic design, and video production\n\nThe specific scope, deliverables, timeline, and fees are defined in the mutually signed **Service Agreement** or **Proposal Document**.` },
        { id: "t3", heading: "3. Payment Terms", body: `Unless otherwise agreed in writing:\n\n• **New Projects:** 50% advance payment is required before work commences. Remaining 50% due upon project delivery.\n• **Monthly Retainers:** Full monthly fee is due in advance at the start of each billing cycle.\n• **Late Payments:** Invoices unpaid beyond 7 days may incur a 2% per month late fee.\n\nAll fees are exclusive of GST (18%) and applicable ad platform spend.` },
        { id: "t4", heading: "4. Intellectual Property & Ownership", body: `Upon receipt of full and cleared payment, all creative deliverables — including ad copy, graphics, video edits, and website code — become the **100% intellectual property of the Client**.\n\nGetIntoFeed retains the right to showcase completed, non-confidential work in our portfolio unless the Client has executed a separate NDA.` },
        { id: "t5", heading: "5. Ad Platform Account Ownership", body: `The Client retains full ownership and administrative control of all ad platform accounts (Google Ads, Meta Business Manager, etc.) throughout and after the engagement.\n\nGetIntoFeed operates campaigns as a manager under Client-granted access and **will not** restrict access under any circumstance.` },
        { id: "t6", heading: "6. Client Responsibilities", body: `Successful campaign outcomes depend on timely Client cooperation, including:\n\n• Providing accurate business information, brand assets, and product details\n• Reviewing and approving ad creatives within 48 hours of submission\n• Maintaining funded ad platform accounts in good standing\n\nGetIntoFeed is not liable for underperformance caused by delayed approvals, restricted accounts, or withheld information.` },
        { id: "t7", heading: "7. Limitation of Liability", body: `GetIntoFeed's total liability to the Client shall not exceed the fees paid for the specific service in the most recent 30-day billing period. We are not liable for indirect, incidental, or consequential damages — including lost revenue, lost customers, or platform algorithm changes.` },
        { id: "t8", heading: "8. Governing Law & Jurisdiction", body: `These Terms of Service are governed by the laws of the **Republic of India**. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in **New Delhi, India**.` },
      ]
    },
    refund: {
      title: "Refund & Cancellation Policy",
      subtitle: "Clear, fair rules for project modifications and exits",
      effectiveDate: "November 2026",
      badge: "No Hidden Clauses",
      sections: [
        { id: "r1", heading: "1. Our Commitment to Fairness", body: `GetIntoFeed deploys senior strategists, creative directors, and campaign managers from Day 1 of every engagement. Our refund policy reflects the real allocation of skilled time and resources — it is designed to be **transparent and fair** to both parties.` },
        { id: "r2", heading: "2. Project Deposits (New Engagements)", body: `A **50% advance deposit** is required before any work commences.\n\n• If a Client cancels **before work begins** (within 24 hours of payment), a full refund of the deposit will be issued.\n• If cancellation occurs **after discovery or briefing** but before design/creative work begins, a **50% refund** of the deposit will be provided.\n• If cancellation occurs **after creative work has started**, the deposit is non-refundable as it covers strategist and designer hours already deployed.` },
        { id: "r3", heading: "3. Monthly Retainer Cancellations", body: `For ongoing monthly retainers:\n\n• Clients may cancel with **15 calendar days' written notice** before the next billing cycle begins.\n• If notice is given after the billing cycle has started, the current month's retainer fee is **non-refundable** but no further charges will be raised.\n• Mid-cycle cancellations do not entitle the Client to pro-rata refunds for unused days.` },
        { id: "r4", heading: "4. Deliverable Disputes", body: `If you believe a deliverable does not meet the agreed brief:\n\n• Submit written feedback within **5 business days** of delivery\n• GetIntoFeed will review and implement up to **2 rounds of revisions** at no additional cost\n• If the deliverable still does not meet the brief after good-faith revisions, a partial credit or refund (up to 25% of the milestone payment) may be offered at GetIntoFeed's discretion` },
        { id: "r5", heading: "5. Ad Platform Spend", body: `Ad platform budgets (Google Ads, Meta Ads, etc.) are paid directly by the Client to the respective platforms. GetIntoFeed has no control over and assumes no liability for ad spend refunds from Google, Meta, or any other platform.` },
        { id: "r6", heading: "6. How to Request a Refund", body: `To initiate a refund request, contact us in writing:\n\n**Email:** hello@getintofeed.com\n**Subject:** Refund Request — [Your Company Name] — [Service Name]\n\nAll requests will be reviewed within **5 business days** and a resolution communicated in writing.` },
      ]
    },
    disclaimer: {
      title: "Performance Disclaimer",
      subtitle: "Honest context around our results, claims, and projections",
      effectiveDate: "November 2026",
      badge: "Transparent by Default",
      sections: [
        { id: "d1", heading: "1. Nature of Marketing Results", body: `Digital marketing performance is inherently variable. Results depend on a combination of factors, many of which are outside the direct control of any agency:\n\n• Product-market fit and pricing competitiveness\n• Quality and speed of client sales follow-up\n• Ad platform algorithm updates (Google, Meta, etc.)\n• Competitive market conditions and seasonal demand\n• Landing page conversion quality and user experience` },
        { id: "d2", heading: "2. Case Studies & Benchmarks", body: `Any ROAS figures, lead counts, revenue numbers, or percentage improvements cited on our website represent **verified results achieved for specific clients** under specific market conditions, budget levels, and time periods.\n\nThese benchmarks are provided for context and illustrative purposes only. They are **not guarantees** of similar outcomes for future clients.` },
        { id: "d3", heading: "3. No Guarantee of Specific Results", body: `GetIntoFeed does not guarantee:\n\n• A specific number of leads, enquiries, or sales\n• A specific ROAS (return on ad spend) or ROI\n• First-page Google rankings within a defined timeframe\n• A defined cost per lead or customer acquisition cost\n\nWhat we **do** guarantee is senior-level strategic execution, weekly performance transparency, honest reporting, and continuous optimisation to improve results over time.` },
        { id: "d4", heading: "4. Platform Dependency", body: `Our services operate on and within third-party platforms whose algorithms, policies, and ad serving mechanisms change independently and without notice.\n\nGetIntoFeed is not liable for performance changes caused by:\n\n• Platform algorithm updates or policy changes\n• Account restrictions or bans imposed by the platform\n• iOS privacy changes affecting ad attribution\n• Force majeure events (elections, natural disasters, economic crises)` },
        { id: "d5", heading: "5. Forward-Looking Statements", body: `Any projections, forecasts, or growth estimates provided in proposals are based on historical data, industry benchmarks, and professional judgment. They are forward-looking in nature and subject to change.\n\nActual results may differ materially from projections. Clients should not make significant financial commitments solely based on projected marketing outcomes without independent financial advice.` },
      ]
    },
    nda: {
      title: "Confidentiality & NDA Policy",
      subtitle: "How we protect your business information and trade secrets",
      effectiveDate: "November 2026",
      badge: "Enterprise-Grade Confidentiality",
      sections: [
        { id: "n1", heading: "1. Our Default Confidentiality Commitment", body: `GetIntoFeed treats all client information as strictly confidential by default — no formal NDA is required to trigger this commitment.\n\nFrom the moment you share business details, ad account access, revenue data, or strategic plans with our team, we apply professional confidentiality standards equivalent to those in a formal NDA agreement.` },
        { id: "n2", heading: "2. What We Consider Confidential", body: `The following categories of information are treated as confidential:\n\n• Ad account performance data, ROAS figures, and campaign analytics\n• Business revenue, profit margins, and financial projections\n• Customer lists, CRM data, and lead databases\n• Unreleased product or service information\n• Pricing strategies and competitive positioning\n• Brand strategy briefs, creative directions, and go-to-market plans\n• Any information explicitly marked as "confidential" or "not for disclosure"` },
        { id: "n3", heading: "3. Permitted Disclosures", body: `Confidential information may only be shared with:\n\n• **Core team members** directly working on your campaign (on a strict need-to-know basis)\n• **Authorised subcontractors** who are bound by equivalent confidentiality obligations\n• **Legal or regulatory authorities** where disclosure is required by law\n\nWe will notify you promptly if we are legally compelled to disclose confidential information.` },
        { id: "n4", heading: "4. Portfolio & Case Study Usage", body: `Unless a formal signed NDA explicitly prohibits it, GetIntoFeed may reference a completed engagement in our portfolio or case studies. This may include the industry and business type, and general campaign outcomes expressed as percentage improvements.\n\nWe will never disclose specific revenue figures, client brand names, or identifiable business information without **explicit written permission**.` },
        { id: "n5", heading: "5. Formal Bilateral NDA", body: `For enterprise clients or any engagement involving particularly sensitive commercial information, we are happy to execute a **formal bilateral Non-Disclosure Agreement**.\n\nTo request a formal NDA before beginning discussions:\n\n**Email:** hello@getintofeed.com\n**Subject:** NDA Request — [Your Company Name]\n\nWe will respond with a draft bilateral NDA within 1 business day.` },
        { id: "n6", heading: "6. Duration of Confidentiality", body: `Our confidentiality obligations remain in effect:\n\n• During the entire period of engagement\n• For **3 years** following the conclusion of the engagement\n• Indefinitely for any information that constitutes a **trade secret** under applicable law` },
      ]
    },
    cookies: {
      title: "Cookie Policy",
      subtitle: "What cookies we use, why, and how to control them",
      effectiveDate: "November 2026",
      badge: "GDPR & IT Act Compliant",
      sections: [
        { id: "c1", heading: "1. What Are Cookies?", body: `Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you navigate the site, and serve relevant content.\n\nGetIntoFeed uses cookies and similar tracking technologies (pixels, local storage tokens) to improve your experience and measure the effectiveness of our marketing efforts.` },
        { id: "c2", heading: "2. Categories of Cookies We Use", body: `**Strictly Necessary Cookies**\nThese cookies are essential for the website to function. They enable core features such as security, session management, and load balancing. These cannot be disabled.\n\n**Analytics & Performance Cookies**\nUsed to understand how visitors interact with our website:\n• **Google Analytics 4** (ID: G-LHVZY6EFW1) — page views, session duration, traffic sources\n• **Google Tag Manager** (ID: GTM-PHJF6JHM) — tag management and event tracking\n• **Microsoft Clarity** — anonymised heatmaps and session recordings\n\n**Marketing & Attribution Cookies**\n• **Meta Pixel** — tracks conversions from Facebook and Instagram ads\n• **Meta CAPI tokens** — server-side deduplication for accurate attribution\n• **Google Ads Conversion Tracking** — measures enquiries and conversions from Search and Display ads` },
        { id: "c3", heading: "3. Cookie Retention Periods", body: `Different cookies have different lifespans:\n\n• **Session cookies** — deleted when you close your browser\n• **Analytics cookies (GA4)** — retained for up to 14 months\n• **Marketing pixels** — retained for up to 180 days\n• **Preference cookies** — retained for 12 months\n\nYou can clear cookies at any time through your browser settings.` },
        { id: "c4", heading: "4. Managing Your Cookie Preferences", body: `You have full control over non-essential cookies. You can:\n\n• **Accept all** — allow all cookie categories for the best site experience\n• **Reject optional** — only strictly necessary cookies will be stored\n• **Customise** — choose which categories to allow via our cookie preferences panel\n\nNote: Rejecting analytics and marketing cookies will not affect your ability to use our website.` },
        { id: "c5", heading: "5. Third-Party Cookies", body: `Some cookies are placed by third-party services embedded in our website. These third parties have their own privacy and cookie policies:\n\n• **Google LLC** — policies.google.com/privacy\n• **Meta Platforms Inc.** — facebook.com/privacy/policy\n• **Microsoft (Clarity)** — privacy.microsoft.com` },
      ]
    }
  };

  useEffect(() => {
    setActiveTab(type);
    setOpenSection(CONTENT[type]?.sections?.[0]?.id || null);
    window.scrollTo(0, 0);
  }, [type]);

  const current = CONTENT[activeTab] || CONTENT.privacy;

  const TAB_ICONS = {
    privacy:    <Lock className="w-3.5 h-3.5" />,
    terms:      <FileText className="w-3.5 h-3.5" />,
    refund:     <Shield className="w-3.5 h-3.5" />,
    disclaimer: <AlertCircle className="w-3.5 h-3.5" />,
    nda:        <ShieldCheck className="w-3.5 h-3.5" />,
    cookies:    <CheckCircle2 className="w-3.5 h-3.5" />,
  };

  function parseFormattedText(text) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  function renderBody(text) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      if (line.startsWith("• ")) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="text-slate-700 leading-relaxed text-sm">
              {parseFormattedText(line.slice(2))}
            </span>
          </div>
        );
      }
      if (/^\d+\. /.test(line)) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2">
            <span className="text-slate-700 leading-relaxed text-sm">
              {parseFormattedText(line)}
            </span>
          </div>
        );
      }
      if (line.startsWith("**") && line.endsWith("**") && line.indexOf("**", 2) === line.length - 2) {
        return (
          <p key={i} className="font-semibold text-slate-900 text-sm mt-3 mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      return (
        <p key={i} className="text-slate-600 leading-relaxed text-sm">
          {parseFormattedText(line)}
        </p>
      );
    });
  }

  return (
    <PageLayout onNavigate={onNavigate} fullWidth={true}>
      <div className="w-full max-w-full bg-white">
        {/* HERO HEADER */}
        <div className="bg-[#0B1426] text-white px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-[#d4ff00] mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span>Legal &amp; Compliance — GetIntoFeed</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 font-space">
              {current.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-6 font-sans">
              {current.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                Effective: {current.effectiveDate}
              </span>
              <span className="bg-[#d4ff00]/10 border border-[#d4ff00]/20 text-[#d4ff00] px-3 py-1 rounded-full font-semibold">
                {current.badge}
              </span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setOpenSection(CONTENT[tab.id]?.sections?.[0]?.id || null);
                    if (onNavigate) onNavigate(tab.path);
                  }}
                  className={`flex items-center gap-2 px-4 py-4 text-xs font-bold tracking-wide uppercase whitespace-nowrap border-b-2 transition-all cursor-pointer bg-transparent border-x-0 border-t-0 ${
                    activeTab === tab.id
                      ? "border-b-slate-900 text-slate-900"
                      : "border-b-transparent text-slate-500 hover:text-slate-800 hover:border-b-slate-300"
                  }`}
                >
                  <span>{TAB_ICONS[tab.id]}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* LEFT: Accordion Sections */}
            <div className="lg:col-span-8 space-y-4">
              {current.sections.map((sec) => {
                const isOpen = openSection === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`bg-white border rounded-2xl transition-all duration-200 ${
                      isOpen ? "border-slate-900 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : sec.id)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left bg-transparent border-none cursor-pointer gap-4"
                    >
                      <h2 className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-space">
                        {sec.heading}
                      </h2>
                      <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        isOpen
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-200 text-slate-500"
                      }`}>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-2">
                        {renderBody(sec.body)}
                        {activeTab === "cookies" && sec.id === "c4" && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                localStorage.removeItem("gif_cookie_consent");
                                window.location.reload();
                              }}
                              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-[#d4ff00] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl cursor-pointer border-none transition-colors"
                            >
                              <span>Reset Cookie Preferences</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT: Sticky Sidebar */}
            <aside className="lg:col-span-4 sticky top-20 self-start space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-space">Legal Documents</h3>
                <nav className="space-y-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setOpenSection(CONTENT[tab.id]?.sections?.[0]?.id || null);
                        if (onNavigate) onNavigate(tab.path);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left border-none cursor-pointer transition-all ${
                        activeTab === tab.id
                          ? "!bg-slate-950 !text-white shadow-sm"
                          : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{TAB_ICONS[tab.id]}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="bg-[#0B1426] text-white rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#d4ff00]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4ff00]">Need Clarity?</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Have a question about our terms, data handling, or want to request a formal NDA?
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <a href="mailto:hello@getintofeed.com" className="flex items-center gap-2 hover:text-[#d4ff00] transition-colors">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>hello@getintofeed.com</span>
                  </a>
                  <a href="tel:+918810356950" className="flex items-center gap-2 hover:text-[#d4ff00] transition-colors">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>+91 88103 56950</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate("/contact")}
                  className="w-full bg-[#d4ff00] hover:bg-[#c2ed00] text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border-none font-space"
                >
                  <span>Send us a message</span>
                  <span>↗</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 text-center">
                Last updated: {current.effectiveDate}<br />
                &copy; 2026 GetIntoFeed &middot; Delhi NCR, India
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default LegalPage;
