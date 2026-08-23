import React from "react";
import { Award, CheckCircle2, ShieldCheck, Sparkles, Star } from "lucide-react";

const TRUST_BADGES = [
  { label: "Google Premier Partner", icon: Award, sub: "Top 3% Agencies 2026" },
  { label: "Meta Business Partner", icon: Sparkles, sub: "Certified Media Agency" },
  { label: "Clutch 4.9 ★★★★★", icon: Star, sub: "184+ Verified Reviews" },
  { label: "LinkedIn Marketing Partner", icon: CheckCircle2, sub: "B2B Growth Specialist" },
  { label: "Shopify Partner", icon: ShieldCheck, sub: "High-Converting D2C" },
  { label: "HubSpot Certified", icon: Award, sub: "Inbound & CRM Funnels" },
  { label: "₹120Cr+ Revenue Generated", icon: Sparkles, sub: "Across 180+ Indian Brands" }
];

export default function TrustMarquee() {
  return (
    <section className="trust-marquee-wrapper" aria-label="Certifications and Trust Badges">
      <div className="trust-title-strip">
        <span>Trusted By Fast-Growing Indian & Global Brands</span>
      </div>

      <div className="marquee-track">
        <div className="marquee-content">
          {[...TRUST_BADGES, ...TRUST_BADGES].map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="marquee-item">
                <div className="marquee-icon-box">
                  <Icon size={18} />
                </div>
                <div className="marquee-text">
                  <strong>{badge.label}</strong>
                  <small>{badge.sub}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
