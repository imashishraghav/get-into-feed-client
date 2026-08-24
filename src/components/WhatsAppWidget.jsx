import React, { useState } from "react";
import { MessageSquare, PhoneCall, Sparkles, X, Zap } from "lucide-react";

export default function WhatsAppWidget({ onOpenAudit }) {
  const [open, setOpen] = useState(false);

  const phone = "919876543210";
  const defaultMsg = encodeURIComponent("Hi Get Into Feed team! I am interested in scaling our digital marketing (SEO, Ads, Creative & Web) with your agency. Can we discuss a custom growth sprint?");
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMsg}`;

  return (
    <div className="whatsapp-widget-container">
      {open && (
        <div className="whatsapp-popup glass-card step-fade">
          <div className="popup-top">
            <div className="popup-agent">
              <div className="agent-avatar">GF</div>
              <div>
                <strong>Get Into Feed Growth Desk</strong>
                <span className="online-indicator">
                  <span className="pulse-dot" /> Online • Replies in &lt; 15 mins
                </span>
              </div>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close chat popup"
            >
              <X size={16} />
            </button>
          </div>

          <div className="popup-msg-box">
            <p>
              👋 <strong>Namaste!</strong> Ready to unlock predictable leads, high ROAS, and top-tier creative for your brand?
            </p>
            <span className="timestamp">Active today</span>
          </div>

          <div className="popup-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="widget-action-btn whatsapp-btn"
            >
              <MessageSquare size={16} />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              type="button"
              className="widget-action-btn audit-btn"
              onClick={() => {
                setOpen(false);
                if (onOpenAudit) onOpenAudit();
              }}
            >
              <Sparkles size={16} />
              <span>Get Free 360° Audit</span>
            </button>

            <a
              href="tel:+919876543210"
              className="widget-action-btn call-btn"
            >
              <PhoneCall size={16} />
              <span>Schedule Quick Call</span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`floating-widget-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Open growth consultation chat"
      >
        <span className="trigger-pulse" />
        <MessageSquare size={24} className="widget-icon" />
        <span className="trigger-label">Talk to Growth Lead</span>
      </button>
    </div>
  );
}
