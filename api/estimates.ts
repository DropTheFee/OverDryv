import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: 'Missing Supabase env vars' });
    return;
  }

  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader : undefined;
  const targetUrl =
    `${supabaseUrl}/rest/v1/estimates` +
    '?select=*,profiles!customer_id(first_name,last_name,email),vehicles!vehicle_id(year,make,model,license_plate)' +
    '&order=created_at.desc';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: bearer ?? `Bearer ${supabaseAnonKey}`,
      },
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reach Supabase' });
  }
}
