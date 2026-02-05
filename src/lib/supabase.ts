import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for production troubleshooting
console.log('Supabase Configuration Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Missing',
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'Missing'
});

const debugFetch: typeof fetch = async (input, init) => {
  const url = typeof input === 'string'
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url;
  const method = init?.method ?? 'GET';
  console.log('[Supabase fetch] request', method, url);
  try {
    const res = await fetch(input, init);
    console.log('[Supabase fetch] response', res.status, url);
    return res;
  } catch (error) {
    console.warn('[Supabase fetch] error', url, error);
    throw error;
  }
};

export const supabase = createClient<Database>(
  supabaseUrl!, 
  supabaseAnonKey!,
  {
    global: {
      fetch: debugFetch,
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);