import React, { useState, useId } from "react";
import { ArrowRight, Calculator, CheckCircle2, DollarSign, Flame, Sparkles, TrendingUp, Zap } from "lucide-react";

const INDUSTRIES = [
  { id: "d2c", name: "D2C & E-Commerce", avgCpc: 18, convRate: 3.2, roasMultiplier: 4.8, badge: "High Velocity" },
  { id: "b2b", name: "B2B SaaS & Tech", avgCpc: 65, convRate: 4.5, roasMultiplier: 5.4, badge: "High LTV" },
  { id: "realestate", name: "Real Estate & Clinics", avgCpc: 42, convRate: 3.8, roasMultiplier: 6.2, badge: "High Ticket" },
  { id: "edtech", name: "EdTech & Education", avgCpc: 24, convRate: 5.1, roasMultiplier: 4.2, badge: "Volume Leads" },
  { id: "services", name: "Agencies & Consultancies", avgCpc: 35, convRate: 4.0, roasMultiplier: 4.6, badge: "Predictable" }
];

export default function RoiCalculator({ onClaimSprint }) {
  const [budget, setBudget] = useState(150000); // 1.5 Lakhs default
  const [selectedIndustry, setSelectedIndustry] = useState("d2c");
  const budgetInputId = useId();

  const currentInd = INDUSTRIES.find((i) => i.id === selectedIndustry) || INDUSTRIES[0];

  // Calculations based on industry benchmarks
  const estimatedClicks = Math.round(budget / currentInd.avgCpc);
  const estimatedLeads = Math.round(estimatedClicks * (currentInd.convRate / 100));
  const estimatedRevenue = Math.round(budget * currentInd.roasMultiplier);
  const estimatedRoas = currentInd.roasMultiplier.toFixed(1);

  const formatRupees = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakhs`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const handleClaim = () => {
    if (onClaimSprint) {
      onClaimSprint({
        budget: formatRupees(budget) + "/month",
        industry: currentInd.name,
        estimatedRevenue: formatRupees(estimatedRevenue),
        service: "Full-Funnel Growth Sprint"
      });
    }
  };

  return (
    <section className="roi-section" id="roi-calculator">
      <div className="roi-container">
        <div className="roi-header">
          <div className="badge-glow">
            <Calculator size={14} /> Interactive ROI Predictor
          </div>
          <h2>Calculate Your Growth Potential in 30 Seconds</h2>
          <p>
            Estimate your high-intent traffic, qualified leads, and projected return on ad spend (ROAS) with our proprietary growth engine.
          </p>
        </div>

        <div className="roi-grid">
          {/* Controls Column */}
          <div className="roi-card controls-card">
            <div className="control-group">
              <label htmlFor={budgetInputId} className="control-label">
                <span>Monthly Growth Budget</span>
                <strong className="accent-text">{formatRupees(budget)}</strong>
              </label>
              <div className="slider-container">
                <input
                  id={budgetInputId}
                  type="range"
                  min="30000"
                  max="2000000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="custom-range"
                  aria-label="Monthly Growth Budget Slider"
                />
                <div className="slider-ticks">
                  <span>₹30K</span>
                  <span>₹5 Lakhs</span>
                  <span>₹10 Lakhs</span>
                  <span>₹20 Lakhs+</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">
                <span>Select Your Industry</span>
                <span className="pill-badge">{currentInd.badge}</span>
              </span>
              <div className="industry-pill-grid">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    className={`industry-pill ${selectedIndustry === ind.id ? "active" : ""}`}
                    onClick={() => setSelectedIndustry(ind.id)}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="roi-trust-points">
              <div>
                <CheckCircle2 size={16} className="emerald-icon" />
                <span>Zero vanity metrics (clicks without intent)</span>
              </div>
              <div>
                <CheckCircle2 size={16} className="emerald-icon" />
                <span>Omnichannel attribution (Google, Meta, GA4)</span>
              </div>
              <div>
                <CheckCircle2 size={16} className="emerald-icon" />
                <span>Weekly sprint adjustments & creative refreshes</span>
              </div>
            </div>
          </div>

          {/* Forecast Output Column */}
          <div className="roi-card forecast-card">
            <div className="forecast-badge">
              <Sparkles size={14} /> 90-Day Sprint Forecast
            </div>

            <div className="forecast-headline">
              <span className="forecast-label">Projected Gross Revenue Lift</span>
              <strong className="forecast-big-stat">{formatRupees(estimatedRevenue)}</strong>
              <div className="roas-chip">
                <Flame size={14} /> Expected ROAS: <strong>{estimatedRoas}x</strong>
              </div>
            </div>

            <div className="forecast-breakdown-grid">
              <div className="stat-box">
                <span className="stat-label">Estimated High-Intent Visits</span>
                <strong className="stat-number">{estimatedClicks.toLocaleString("en-IN")}</strong>
                <span className="stat-sub">targeted prospective buyers</span>
              </div>

              <div className="stat-box">
                <span className="stat-label">Qualified Leads / Orders</span>
                <strong className="stat-number">{estimatedLeads.toLocaleString("en-IN")}</strong>
                <span className="stat-sub">at ~{currentInd.convRate}% funnel conversion</span>
              </div>
            </div>

            <div className="forecast-action">
              <button
                type="button"
                className="button button-glow button-full"
                onClick={handleClaim}
              >
                <span>Claim This Growth Plan</span>
                <ArrowRight size={18} />
              </button>
              <p className="forecast-note">
                ⚡ Based on live performance benchmarks from 180+ active Indian brands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
