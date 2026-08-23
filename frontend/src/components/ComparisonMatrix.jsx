import React from "react";
import { Check, Flame, ShieldAlert, Sparkles, X } from "lucide-react";

const COMPARISON_POINTS = [
  {
    feature: "Commercial KPI Focus",
    traditional: "Vanity metrics (Impressions, reach, empty clicks)",
    getintofeed: "Commercial revenue, qualified pipeline & ROAS"
  },
  {
    feature: "Team Allocation",
    traditional: "Sales pitch by seniors, account managed by junior interns",
    getintofeed: "Direct execution by senior growth engineers & strategists"
  },
  {
    feature: "Turnaround & Speed",
    traditional: "2–4 week turnaround for single ad creatives or copy fixes",
    getintofeed: "48-hour agile sprint turnaround for tests and optimizations"
  },
  {
    feature: "Attribution & Reporting",
    traditional: "Static PDF reports sent once a month with selective numbers",
    getintofeed: "Real-time transparent dashboards (GA4, Meta, CRM data)"
  },
  {
    feature: "Website & Landing Pages",
    traditional: "Blame your website conversion; offer zero web/CRO help",
    getintofeed: "In-house React dev & landing page CRO sprints included"
  },
  {
    feature: "Partnership Flexibility",
    traditional: "Rigid 12-month lock-in contracts with hidden retainers",
    getintofeed: "90-day outcome sprints with transparent milestone deliverables"
  }
];

export default function ComparisonMatrix() {
  return (
    <section className="comparison-section">
      <div className="section-header-centered">
        <div className="badge-glow">
          <Sparkles size={14} /> The Growth Advantage
        </div>
        <h2>Why India’s Top Brands Switch to Get Into Feed</h2>
        <p>
          Most agencies optimize for billable hours. We engineer compounding revenue systems. See the difference.
        </p>
      </div>

      <div className="comparison-table-wrapper glass-card">
        <div className="comparison-table">
          <div className="table-header">
            <div className="col-feature">Strategic Dimension</div>
            <div className="col-traditional">
              <span className="badge-traditional">Old-School Agencies</span>
            </div>
            <div className="col-agency">
              <span className="badge-agency">
                <Flame size={14} /> Get Into Feed Growth Engine
              </span>
            </div>
          </div>

          <div className="table-rows">
            {COMPARISON_POINTS.map((row, idx) => (
              <div key={idx} className="table-row">
                <div className="cell-feature">
                  <strong>{row.feature}</strong>
                </div>
                <div className="cell-traditional">
                  <div className="diff-item negative">
                    <X size={16} className="red-icon" />
                    <span>{row.traditional}</span>
                  </div>
                </div>
                <div className="cell-agency">
                  <div className="diff-item positive">
                    <Check size={16} className="emerald-icon" />
                    <span>{row.getintofeed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
