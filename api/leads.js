// Vercel Serverless Function: /api/leads
let inMemoryLeads = [];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.includes('growth2026') && req.query.token !== 'growth2026') {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin token' });
    }
    return res.status(200).json({ success: true, leads: inMemoryLeads });
  }

  if (req.method === 'POST') {
    const { name, email, phone, company, service, message, source } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const leadId = 'LEAD-' + Math.floor(100000 + Math.random() * 900000);
    const newLead = {
      id: leadId,
      name: (name || '').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      company: (company || '').trim(),
      service: service || 'General Growth Consultation',
      message: (message || '').trim(),
      source: source || 'website_form',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    inMemoryLeads.unshift(newLead);

    return res.status(201).json({
      success: true,
      leadId,
      message: 'Lead captured successfully on Vercel Serverless Engine.'
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
