// Vercel Serverless Function: /api/applications
let inMemoryApps = [];

export default async function handler(req, res) {
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
    return res.status(200).json({ success: true, applications: inMemoryApps });
  }

  if (req.method === 'POST') {
    const { name, email, phone, role, resumeUrl } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const applicationId = 'APP-' + Math.floor(100000 + Math.random() * 900000);
    const newApp = {
      id: applicationId,
      name: (name || '').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      role: role || 'General Application',
      resumeUrl: resumeUrl || '',
      createdAt: new Date().toISOString()
    };

    inMemoryApps.unshift(newApp);

    return res.status(201).json({
      success: true,
      applicationId,
      message: 'Job application submitted successfully on Vercel.'
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
