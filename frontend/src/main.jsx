import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: "#011422",
          color: "#ffffff",
          textAlign: "center"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "520px",
            backdropFilter: "blur(12px)"
          }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}>⚡</span>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "900", margin: "0 0 10px 0", color: "#ffffff" }}>
              Application Update Available
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6", margin: "0 0 24px 0" }}>
              Please click the button below to refresh and load the latest version.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                background: "#f15b29",
                color: "#ffffff",
                fontWeight: "800",
                fontSize: "0.95rem",
                padding: "12px 28px",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(241, 91, 41, 0.4)"
              }}
            >
              Refresh Application ↻
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

