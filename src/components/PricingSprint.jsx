import React, { useState } from "react";
import { ArrowRight, Check, Flame, ShieldCheck, Sparkles, Zap } from "lucide-react";

const TIERS = [
  {
    id: "starter",
    name: "Starter Growth Sprint",
    subtitle: "For emerging startups & local market leaders ready for predictable leads.",
    monthlyPrice: 39000,
    quarterlyPrice: 33000,
    popular: false,
    deliverables: [
      "Targeted Google Search & Meta Ads setup",
      "Core SEO keyword clusters & On-Page optimization",
      "High-converting landing page audit & CRO fixes",
      "Bi-weekly performance sprints & budget reallocation",
      "Standard GA4 & lead tracking dashboard",
      "WhatsApp & email lead notifications"
    ],
    cta: "Start Starter Sprint"
  },
  {
    id: "scale",
    name: "Scale Engine",
    subtitle: "The full multi-channel growth system for D2C, B2B SaaS & high-growth brands.",
    monthlyPrice: 79000,
    quarterlyPrice: 67000,
    popular: true,
    badge: "Most Popular • 4.2x Avg ROAS",
    deliverables: [
      "Omnichannel Google, Meta & LinkedIn Ad campaigns",
      "Technical SEO + Programmatic content publishing",
      "Custom React landing page design & CRO development",
      "High-converting UGC, reel creatives & ad copy variations",
      "Weekly strategic sprint calls with Senior Lead",
      "Live real-time BI dashboard with multi-touch attribution",
      "Retention email & WhatsApp automation workflows"
    ],
    cta: "Ignite Scale Engine"
  },
  {
    id: "enterprise",
    name: "Enterprise Domination",
    subtitle: "For aggressive market leaders requiring dedicated growth squad and bespoke tech.",
    monthlyPrice: 149000,
    quarterlyPrice: 126000,
    popular: false,
    deliverables: [
      "Everything in Scale Engine with unlimited scale capacity",
      "Dedicated Full-Time Growth Squad (Strategist, Dev, Designer)",
      "High-velocity video production & 3D campaign assets",
      "Custom headless web app development & speed tuning (<1s)",
      "Full CRM integration (HubSpot, Salesforce, Zoho)",
      "Daily campaign tuning & proactive budget scaling",
      "Executive Slack/WhatsApp channel with 1-hour SLA"
    ],
    cta: "Dominate Your Market"
  }
];

export default function PricingSprint({ onSelectPackage }) {
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'quarterly'

  const formatPrice = (num) => `₹${num.toLocaleString("en-IN")}`;

  return (
    <section className="pricing-section" id="pricing-sprints">
      <div className="section-header-centered">
        <div className="badge-glow">
          <Zap size={14} /> Transparent Sprint Pricing
        </div>
        <h2>Predictable Growth Packages. Zero Hidden Retainers.</h2>
        <p>
          Choose the sprint tier that matches your commercial targets. All plans include direct access to senior strategists and measurable milestone deliverables.
        </p>

        <div className="billing-toggle-wrap">
          <button
            type="button"
            className={`billing-btn ${billingCycle === "monthly" ? "active" : ""}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Sprints
          </button>
          <button
            type="button"
            className={`billing-btn ${billingCycle === "quarterly" ? "active" : ""}`}
            onClick={() => setBillingCycle("quarterly")}
          >
            Quarterly Sprint Plan
            <span className="save-badge">Save 15%</span>
          </button>
        </div>
      </div>

      <div className="pricing-cards-grid">
        {TIERS.map((tier) => {
          const price = billingCycle === "quarterly" ? tier.quarterlyPrice : tier.monthlyPrice;
          return (
            <div
              key={tier.id}
              className={`pricing-card glass-card ${tier.popular ? "featured-card" : ""}`}
            >
              {tier.popular && (
                <div className="card-popular-badge">
                  <Flame size={13} /> {tier.badge}
                </div>
              )}

              <div className="card-top">
                <h3>{tier.name}</h3>
                <p className="card-subtitle">{tier.subtitle}</p>

                <div className="card-price-row">
                  <span className="price-val">{formatPrice(price)}</span>
                  <span className="price-sub">/ month {billingCycle === "quarterly" && "(billed quarterly)"}</span>
                </div>
              </div>

              <div className="card-divider" />

              <div className="card-features">
                <span className="features-label">What’s included in sprint:</span>
                <ul>
                  {tier.deliverables.map((item, idx) => (
                    <li key={idx}>
                      <Check size={16} className="feature-check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-cta">
                <button
                  type="button"
                  className={`button button-full ${tier.popular ? "button-glow" : "button-ghost"}`}
                  onClick={() => onSelectPackage && onSelectPackage(tier.name, formatPrice(price))}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pricing-guarantee-bar">
        <ShieldCheck size={20} className="emerald-icon" />
        <span>
          <strong>100% Growth Commitment:</strong> If we do not hit agreed strategic milestones in your first 45-day sprint, we work free until we do.
        </span>
      </div>
    </section>
  );
}
