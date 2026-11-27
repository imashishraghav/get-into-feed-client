import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./styles.css";

// Automatically recover from stale Vite chunk imports after deployment
window.addEventListener("vite:preloadError", () => {
  console.warn("Vite chunk preload error detected. Auto-reloading fresh bundle...");
  window.location.reload();
});

window.addEventListener("unhandledrejection", (event) => {
  const msg = event?.reason?.message || "";
  if (
    msg.includes("dynamically imported module") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("Failed to fetch dynamically imported module")
  ) {
    console.warn("Stale dynamic chunk detected. Auto-reloading page...");
    window.location.reload();
  }
});

function mountApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      createRoot(rootElement).render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>
      );
    } catch (err) {
      console.error("Critical mounting error:", err);
      if (!sessionStorage.getItem("app_mount_retry")) {
        sessionStorage.setItem("app_mount_retry", "1");
        window.location.reload();
      }
    }
  } else {
    window.addEventListener("DOMContentLoaded", mountApp, { once: true });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountApp, { once: true });
} else {
  mountApp();
}
