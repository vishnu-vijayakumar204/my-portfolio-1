import { createClient } from "@supabase/supabase-js";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  sort_order: number;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Safe to use anywhere (server or client): only allows what RLS permits,
// which is public read access to `projects`.
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Server-only: bypasses RLS with the service role key. Never import this
// from a Client Component or anything that ships to the browser.
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
