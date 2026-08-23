// Vercel Serverless Function: /api/admin
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { password } = req.body || {};

    if (password === 'growth2026') {
      return res.status(200).json({
        success: true,
        token: 'growth2026',
        user: {
          username: 'admin',
          role: 'Administrator',
          agency: 'Get Into Feed',
          office: 'Noida Corporate HQ'
        }
      });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid admin passcode.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
