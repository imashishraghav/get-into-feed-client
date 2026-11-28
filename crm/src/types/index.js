import { z } from 'zod';

/**
 * FeedOS Domain Models & Shared Runtime Enums
 * Pure JavaScript + JSDoc typedefs + Zod boundaries (no TypeScript).
 */

export const RoleSchema = z.enum(['Admin', 'Sales', 'Editor', 'Finance', 'Client']);
export const PipelineStageSchema = z.enum([
  'Captured',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost',
]);
export const DealTypeSchema = z.enum(['Growth Sprint', 'Service Package', 'Retainer', 'One-off']);
export const Section393KeySchema = z.enum([
  'sec_393_item_1_ind',
  'sec_393_item_1_corp',
  'sec_393_item_4_tech',
  'sec_393_item_4_prof',
]);

/** @typedef {'Admin' | 'Sales' | 'Editor' | 'Finance' | 'Client'} Role */
/** @typedef {'Captured' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost'} PipelineStage */
/** @typedef {'Growth Sprint' | 'Service Package' | 'Retainer' | 'One-off'} DealType */
/** @typedef {'meta-ads' | 'google-ads' | 'seo' | 'website-cro' | 'reels-12' | 'commercial-video' | 'content-marketing' | 'graphic-design'} AgencyServiceId */
/** @typedef {'sec_393_item_1_ind' | 'sec_393_item_1_corp' | 'sec_393_item_4_tech' | 'sec_393_item_4_prof'} Section393TdsItem */

/**
 * @typedef {Object} ServiceLineItem
 * @property {string} id
 * @property {AgencyServiceId} serviceId
 * @property {string} name
 * @property {string} sacCode
 * @property {number} price - Amount in INR rupees/paise per caller context
 * @property {DealType} dealType
 * @property {string | null} [caReviewFlag]
 * @property {string} deliverablesSummary
 */

/**
 * @typedef {Object} DpdpConsentMetadata
 * @property {boolean} consentGiven
 * @property {string} consentSourceUrl
 * @property {string} consentPolicyVersion
 * @property {string} consentTimestamp
 * @property {string} [consentIp]
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - UUID v4
 * @property {string} [owner_id] - Immutable owner user ID
 * @property {string} [clientId]
 * @property {string} brand
 * @property {string} contact
 * @property {string} phone - E.164 +91 normalized phone
 * @property {string} email
 * @property {string} [gstin]
 * @property {string} stateCode - 2-digit GST state code (e.g., '07' for Delhi)
 * @property {string} [stateName]
 * @property {boolean} [isIntraState]
 * @property {PipelineStage} stage
 * @property {DealType} dealType
 * @property {number} dealValue
 * @property {AgencyServiceId[]} [selectedServices]
 * @property {ServiceLineItem[]} [lineItems]
 * @property {string} [lostReason]
 * @property {string} [lostNotes]
 * @property {string} owner
 * @property {string} source
 * @property {'Verified' | 'Needs Reply' | 'SLA Alert' | 'Proposal Reviewing' | 'Closed'} [status]
 * @property {string} slaDeadlineAt - ISO 8601 UTC timestamp
 * @property {number} [slaSecondsRemaining]
 * @property {boolean} slaResolved
 * @property {string} [firstContactedAt]
 * @property {'call' | 'whatsapp' | 'email'} [firstContactChannel]
 * @property {number} [speedToLeadSeconds]
 * @property {DpdpConsentMetadata} dpdpConsent
 * @property {number} [unpaidInvoice]
 * @property {string} [latestOutcome]
 * @property {string} [latestConcern]
 * @property {string} [latestRepAction]
 * @property {string} [latestFeedback]
 * @property {string} [nextFollowUp]
 * @property {boolean} [isDueToday]
 * @property {boolean} [isOverdue]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ActivityEvent
 * @property {string} id - UUID v4
 * @property {string} lead_id - Foreign key to Lead
 * @property {string} timestamp
 * @property {string} actor
 * @property {Role} actorRole
 * @property {'call' | 'whatsapp' | 'email' | 'system' | 'proposal' | 'invoice'} [channel]
 * @property {string} title
 * @property {string} detail
 * @property {Record<string, unknown>} [metadata]
 */

/**
 * @typedef {Object} Invoice
 * @property {string} id - UUID v4
 * @property {string} invoiceNumber - e.g., GIF/26-27/0101
 * @property {string} lead_id
 * @property {string} clientName
 * @property {string} [gstin]
 * @property {string} stateCode
 * @property {boolean} isIntraState
 * @property {number} baseAmount
 * @property {number} cgstRate
 * @property {number} cgstAmount
 * @property {number} sgstRate
 * @property {number} sgstAmount
 * @property {number} igstRate
 * @property {number} igstAmount
 * @property {number} totalGst
 * @property {number} grossAmount
 * @property {Section393TdsItem} sec393Item
 * @property {number} tdsRate
 * @property {number} tdsAmount
 * @property {number} netReceivable
 * @property {'Draft' | 'Sent' | 'Paid' | 'Overdue'} status
 * @property {string} dueDate
 * @property {string} sacCode
 * @property {string} issuedAt
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id - UUID v4
 * @property {string} timestamp
 * @property {string} actor
 * @property {Role} role
 * @property {string} action
 * @property {string} target
 * @property {string} ip
 * @property {string} [lead_id]
 */
