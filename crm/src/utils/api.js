/**
 * GetIntoFeed CRM Portal API Client
 * Connects to FeedOS Laravel REST API (/api/v1) via same-origin or VITE_CRM_API_URL.
 */

const API_BASE = import.meta.env.VITE_CRM_API_URL || '/api/v1';

function getHeaders() {
  const token = localStorage.getItem('gif_crm_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.stats;
  } catch (err) {
    console.warn('API fetchStats error, using fallback:', err);
    return null;
  }
}

export async function fetchPipeline() {
  try {
    const res = await fetch(`${API_BASE}/pipeline`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.stages;
  } catch (err) {
    console.warn('API fetchPipeline error:', err);
    return [];
  }
}

export async function fetchLeads(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/leads?${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchLeads error:', err);
    return { data: [], pagination: {} };
  }
}

export async function createManualLead(leadData) {
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leadData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API createManualLead error:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchLead360(id) {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.lead;
  } catch (err) {
    console.warn('API fetchLead360 error:', err);
    return null;
  }
}

export async function updateLeadStage(id, stage, lostReason = '') {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}/stage`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ stage, lost_reason: lostReason })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API updateLeadStage error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateLeadDetails(id, fields) {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(fields)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API updateLeadDetails error:', err);
    return { success: false, error: err.message };
  }
}

export async function addLeadNote(id, content) {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API addLeadNote error:', err);
    return { success: false, error: err.message };
  }
}

export async function logLeadActivity(id, activityData) {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activityData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API logLeadActivity error:', err);
    return { success: false, error: err.message };
  }
}

export async function loginCrm(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('gif_crm_token', data.token);
      localStorage.setItem('gif_crm_user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('gif_crm_user');
    return raw ? JSON.parse(raw) : { name: 'Ashish Raghav', email: 'admin@getintofeed.com', role: 'Growth Director' };
  } catch {
    return { name: 'Ashish Raghav', email: 'admin@getintofeed.com', role: 'Growth Director' };
  }
}

export function logoutCrm() {
  localStorage.removeItem('gif_crm_token');
  localStorage.removeItem('gif_crm_user');
  window.location.reload();
}
