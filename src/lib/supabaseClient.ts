import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Both must be set for auth to be enabled. With neither, the app runs in a
// no-auth mode (RequireAuth passes through, the API is expected to run with
// AUTH_DISABLED=true) — handy for local dev and CI.
export const isAuthEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isAuthEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const getAccessToken = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};
