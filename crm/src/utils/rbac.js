/**
 * GetIntoFeed Agency CRM — Role-Based Access Control (RBAC) Engine
 * Implements fine-grained permissions for all 8 agency personas with
 * Freelancer financial masking and Client tenant isolation.
 */

export const ROLES = {
  OWNER: 'OWNER',
  SALES_MANAGER: 'SALES_MANAGER',
  SALES_REP: 'SALES_REP',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  CREATIVE_LEAD: 'CREATIVE_LEAD',
  FREELANCER: 'FREELANCER',
  FINANCE: 'FINANCE',
  CLIENT: 'CLIENT'
};

export const PERMISSIONS = {
  // Leads & Pipeline
  VIEW_ALL_LEADS: 'view:all_leads',
  VIEW_ASSIGNED_LEADS: 'view:assigned_leads',
  EDIT_LEADS: 'edit:leads',
  DELETE_LEADS: 'delete:leads',
  REASSIGN_LEADS: 'reassign:leads',

  // Deals & Financials
  VIEW_PROFIT_MARGINS: 'view:profit_margins',
  CREATE_PROPOSALS: 'create:proposals',
  MANAGE_GST_INVOICES: 'manage:gst_invoices',
  TRIGGER_PAYMENT_LINKS: 'trigger:payment_links',

  // Creative & Client Delivery
  VIEW_REELS_PIPELINE: 'view:reels_pipeline',
  UPLOAD_CREATIVE_ASSETS: 'upload:creative_assets',
  APPROVE_REELS_CLIENT: 'approve:reels_client',

  // System & Administration
  MANAGE_SETTINGS: 'manage:settings',
  VIEW_ANALYTICS: 'view:analytics',
  MANAGE_RECIPES: 'manage:recipes'
};

const ROLE_PERMISSIONS_MAP = {
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  
  [ROLES.SALES_MANAGER]: [
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.VIEW_ASSIGNED_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.REASSIGN_LEADS,
    PERMISSIONS.CREATE_PROPOSALS,
    PERMISSIONS.TRIGGER_PAYMENT_LINKS,
    PERMISSIONS.VIEW_REELS_PIPELINE,
    PERMISSIONS.VIEW_ANALYTICS
  ],

  [ROLES.SALES_REP]: [
    PERMISSIONS.VIEW_ASSIGNED_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.CREATE_PROPOSALS,
    PERMISSIONS.TRIGGER_PAYMENT_LINKS,
    PERMISSIONS.VIEW_REELS_PIPELINE
  ],

  [ROLES.ACCOUNT_MANAGER]: [
    PERMISSIONS.VIEW_ASSIGNED_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.VIEW_REELS_PIPELINE,
    PERMISSIONS.UPLOAD_CREATIVE_ASSETS,
    PERMISSIONS.VIEW_ANALYTICS
  ],

  [ROLES.CREATIVE_LEAD]: [
    PERMISSIONS.VIEW_REELS_PIPELINE,
    PERMISSIONS.UPLOAD_CREATIVE_ASSETS
  ],

  [ROLES.FREELANCER]: [
    PERMISSIONS.VIEW_REELS_PIPELINE,
    PERMISSIONS.UPLOAD_CREATIVE_ASSETS
  ],

  [ROLES.FINANCE]: [
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.VIEW_PROFIT_MARGINS,
    PERMISSIONS.MANAGE_GST_INVOICES,
    PERMISSIONS.TRIGGER_PAYMENT_LINKS,
    PERMISSIONS.VIEW_ANALYTICS
  ],

  [ROLES.CLIENT]: [
    PERMISSIONS.VIEW_REELS_PIPELINE,
    PERMISSIONS.APPROVE_REELS_CLIENT
  ]
};

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(role, permission) {
  if (!role || !ROLE_PERMISSIONS_MAP[role]) return false;
  return ROLE_PERMISSIONS_MAP[role].includes(permission);
}

/**
 * Freelancer Data Masking: Masks sensitive financial margins, client phone numbers, and direct emails.
 */
export function maskSensitiveLeadData(lead, role) {
  if (role === ROLES.FREELANCER) {
    return {
      ...lead,
      phone: lead.phone ? `${lead.phone.slice(0, 7)}XXXXX` : '',
      email: lead.email ? `contact@client-portal.protected` : '',
      budget_monthly: '[Protected]',
      budget_formatted: '[Protected Margin]',
      profit_margin: null
    };
  }
  return lead;
}

/**
 * Client Tenant Isolation Filter: Ensures a client can only access deliverables belonging to their brand.
 */
export function filterClientTenantData(items, user) {
  if (user?.role === ROLES.CLIENT) {
    return items.filter((item) => item.client_id === user.clientId || item.company === user.company);
  }
  return items;
}
