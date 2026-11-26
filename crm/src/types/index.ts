/**
 * FeedOS Strict Domain Models
 * GetIntoFeed Agency Operating System
 */

export type Role = 'Admin' | 'Sales' | 'Editor' | 'Finance' | 'Client';

export type PipelineStage = 
  | 'Captured' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal Sent' 
  | 'Won' 
  | 'Lost';

export type DealType = 
  | 'Growth Sprint' 
  | 'Service Package' 
  | 'Retainer' 
  | 'One-off';

export type AgencyServiceId = 
  | 'meta-ads'
  | 'google-ads'
  | 'seo'
  | 'website-cro'
  | 'reels-12'
  | 'commercial-video'
  | 'content-marketing'
  | 'graphic-design';

export interface ServiceLineItem {
  id: string;
  serviceId: AgencyServiceId;
  name: string;
  sacCode: string;
  price: number;
  dealType: DealType;
  caReviewFlag?: string;
  deliverablesSummary: string;
}

export interface DpdpConsentMetadata {
  consentGiven: boolean;
  consentSourceUrl: string;
  consentPolicyVersion: string;
  consentTimestamp: string;
  consentIp?: string;
}

export type Section393TdsItem = 
  | 'sec_393_item_1_contractor_ind'      // 1%
  | 'sec_393_item_1_contractor_corp'     // 2%
  | 'sec_393_item_4_technical_services'  // 2%
  | 'sec_393_item_4_professional_fees';  // 10%

export interface Lead {
  id: string; // UUID v4
  clientId?: string;
  brand: string;
  contact: string;
  phone: string;
  email: string;
  gstin?: string;
  stateCode: string; // '07' for Delhi, '09' for UP, '06' for Haryana, etc.
  stateName: string;
  isIntraState: boolean;
  stage: PipelineStage;
  dealType: DealType;
  dealValue: number;
  selectedServices: AgencyServiceId[];
  lineItems: ServiceLineItem[];
  lostReason?: string;
  lostNotes?: string;
  owner: string;
  source: string;
  status: 'Verified' | 'Needs Reply' | 'SLA Alert' | 'Proposal Reviewing' | 'Closed';
  
  // Speed to lead SLA
  slaDeadlineAt: string; // ISO 8601 UTC timestamp
  slaSecondsRemaining?: number;
  slaResolved: boolean;
  firstContactedAt?: string;
  firstContactChannel?: 'call' | 'whatsapp' | 'email';
  speedToLeadSeconds?: number;
  
  // DPDP Consent
  dpdpConsent: DpdpConsentMetadata;
  
  // Financial & Invoicing
  unpaidInvoice?: number;
  latestOutcome?: string;
  latestConcern?: string;
  latestRepAction?: string;
  latestFeedback?: string;
  nextFollowUp?: string;
  isDueToday?: boolean;
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string; // UUID v4
  lead_id: string; // Strict foreign key
  timestamp: string;
  actor: string;
  actorRole: Role;
  channel?: 'call' | 'whatsapp' | 'email' | 'system' | 'proposal' | 'invoice';
  title: string;
  detail: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string; // UUID v4
  invoiceNumber: string; // e.g., GIF/26-27/0101
  lead_id: string;
  clientName: string;
  gstin?: string;
  stateCode: string;
  isIntraState: boolean;
  baseAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
  grossAmount: number;
  
  // Income-tax Act 2025 Section 393 TDS
  sec393Item: Section393TdsItem;
  tdsRate: number;
  tdsAmount: number;
  netReceivable: number;
  
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  dueDate: string;
  sacCode: string;
  issuedAt: string;
}

export interface AuditLog {
  id: string; // UUID v4
  timestamp: string;
  actor: string;
  role: Role;
  action: string;
  target: string;
  ip: string;
  lead_id?: string;
}
