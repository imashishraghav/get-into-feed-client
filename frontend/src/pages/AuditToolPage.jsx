import React from "react";
import ServiceDetailPage from "./ServiceDetailPage.jsx";

export function AuditToolPage({ onNavigate }) {
  return <ServiceDetailPage slug="performance-marketing" onNavigate={onNavigate} />;
}

export default AuditToolPage;
