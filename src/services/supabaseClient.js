import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const supabaseEnvValid = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseEnvValid) {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY.'
  );
}

const resolvedUrl = supabaseEnvValid
  ? supabaseUrl
  : 'https://placeholder.supabase.co';
const resolvedKey = supabaseEnvValid ? supabaseAnonKey : 'invalid-anon-key';

export const supabase = createClient(resolvedUrl, resolvedKey);
