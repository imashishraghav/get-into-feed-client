import React, { useState, useEffect } from "react";
import { ArrowRight, Check, CheckCircle2, ChevronRight, Loader2, Sparkles, X, Zap } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BOTTLENECKS = [
  "Low ROAS / High Ad Spend Cost",
  "Unpredictable & Low Quality Leads",
  "High CAC on Meta & Google Ads",
  "Outdated Website / Low Conversion Rate",
  "Stagnant Organic Google Rankings & SEO",
  "Need Full-Funnel Digital Growth Strategy"
];

export default function AuditModal({ isOpen, onClose, initialData = {} }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bottlenecks: [],
    company: initialData.company || "",
    website: initialData.website || "",
    budget: initialData.budget || "Rs 50k - Rs 1L/month",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    city: "",
    service: initialData.service || "360° Growth Audit",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData.budget) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleBottleneck = (item) => {
    setFormData((prev) => {
      const exists = prev.bottlenecks.includes(item);
      return {
        ...prev,
        bottlenecks: exists
          ? prev.bottlenecks.filter((b) => b !== item)
          : [...prev.bottlenecks, item]
      };
    });
  };

  const update = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullMessage = `[360° Audit Request]\nGrowth Blockers: ${formData.bottlenecks.join(", ") || "General Growth Audit"}\nWebsite: ${formData.website || "N/A"}\nCity: ${formData.city || "India"}\nBudget: ${formData.budget}\nNotes: ${formData.message || "Ready for audit"}`;

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service || "360° Growth Audit",
          budget: formData.budget,
          message: fullMessage
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit audit request.");

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Network error. Please try again or reach out on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={resetAndClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetAndClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <div className="badge-glow">
                <Sparkles size={14} /> Free 360° Growth Diagnostic
              </div>
              <h2>Claim Your Custom Growth Plan</h2>
              <p>We analyze your ad accounts, website UX, and search visibility. Receive a detailed action plan within 24 hours.</p>

              <div className="modal-steps-indicator">
                <div className={`step-dot ${step >= 1 ? "active" : ""}`}>1. Growth Goals</div>
                <div className="step-line" />
                <div className={`step-dot ${step >= 2 ? "active" : ""}`}>2. Brand Details</div>
                <div className="step-line" />
                <div className={`step-dot ${step >= 3 ? "active" : ""}`}>3. Delivery</div>
              </div>
            </div>

            {step === 1 && (
              <div className="modal-body step-fade">
                <p className="step-question">What is currently holding your marketing back?</p>
                <div className="bottleneck-list">
                  {BOTTLENECKS.map((item) => {
                    const selected = formData.bottlenecks.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`bottleneck-btn ${selected ? "selected" : ""}`}
                        onClick={() => toggleBottleneck(item)}
                      >
                        <div className="btn-checkbox">
                          {selected && <Check size={14} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="modal-footer">
                  <span className="step-count">Step 1 of 3</span>
                  <button
                    type="button"
                    className="button button-glow"
                    onClick={() => setStep(2)}
                  >
                    Next: Brand Details <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="modal-body step-fade">
                <p className="step-question">Tell us about your brand</p>
                <div className="modal-form-grid">
                  <label className="modal-label">
                    <span>Brand / Business Name *</span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Acme Health or D2C Glow"
                      value={formData.company}
                      onChange={(e) => update("company", e.target.value)}
                    />
                  </label>

                  <label className="modal-label">
                    <span>Website or Instagram URL</span>
                    <input
                      type="text"
                      placeholder="https://yourbrand.com or @instagram"
                      value={formData.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </label>

                  <label className="modal-label full-width">
                    <span>Current / Planned Monthly Ad Spend</span>
                    <select
                      value={formData.budget}
                      onChange={(e) => update("budget", e.target.value)}
                    >
                      <option value="Rs 30k - Rs 50k/month">₹30,000 - ₹50,000 / month</option>
                      <option value="Rs 50k - Rs 1L/month">₹50,000 - ₹1,00,000 / month</option>
                      <option value="Rs 1L - Rs 3L/month">₹1,00,000 - ₹3,00,000 / month</option>
                      <option value="Rs 3L - Rs 10L+/month">₹3,00,000 - ₹10,00,000+ / month</option>
                      <option value="Enterprise Scale">₹10 Lakhs+ / month (Enterprise)</option>
                    </select>
                  </label>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button button-glow"
                    disabled={!formData.company.trim()}
                    onClick={() => setStep(3)}
                  >
                    Next: Final Step <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="modal-body step-fade">
                <p className="step-question">Where should we send your growth audit?</p>
                <div className="modal-form-grid">
                  <label className="modal-label">
                    <span>Your Full Name *</span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rohan Sharma"
                      value={formData.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </label>

                  <label className="modal-label">
                    <span>Work Email *</span>
                    <input
                      required
                      type="email"
                      placeholder="rohan@brand.com"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </label>

                  <label className="modal-label">
                    <span>WhatsApp / Phone Number *</span>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </label>

                  <label className="modal-label">
                    <span>City / Region</span>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru, Mumbai, Delhi"
                      value={formData.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </label>
                </div>

                {error && <div className="form-error-banner">{error}</div>}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="button button-glow"
                    disabled={loading || !formData.name || !formData.email || !formData.phone}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinner" /> Generating Audit...
                      </>
                    ) : (
                      <>
                        Claim Free 360° Audit <Zap size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="modal-success step-fade">
            <div className="success-icon-wrap">
              <CheckCircle2 size={56} className="emerald-glow" />
            </div>
            <h2>Growth Audit Request Received!</h2>
            <p>
              Our senior growth strategists are reviewing <strong>{formData.company || "your brand"}</strong>.
              We will email your custom 360° diagnostic report within 24 hours.
            </p>

            <div className="success-card">
              <span>🚀 Want instant feedback?</span>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Get Into Feed team! I just requested a 360° growth audit for ${formData.company || "my business"}. Can we discuss priority growth sprint slots?`)}`}
                target="_blank"
                rel="noreferrer"
                className="button button-whatsapp"
              >
                Fast-Track on WhatsApp <ArrowRight size={16} />
              </a>
            </div>

            <button type="button" className="button button-ghost" onClick={resetAndClose}>
              Back to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
