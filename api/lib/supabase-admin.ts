/**
 * Server-side Supabase client for API routes.
 * Uses the service role key for database writes, while still
 * verifying the user's JWT from the Authorization header.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

/**
 * Create a Supabase client authenticated as the requesting user.
 * This ensures RLS policies are respected.
 */
export function createUserClient(authHeader: string | null): SupabaseClient {
  const token = authHeader?.replace("Bearer ", "") ?? "";

  return createClient(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}

/**
 * Admin client that bypasses RLS — use only for system operations.
 */
export function createAdminClient(): SupabaseClient {
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceKey);
}

/**
 * Extract user ID from a request's auth header by verifying the JWT
 * through Supabase's getUser() call.
 */
export async function getUserFromRequest(
  authHeader: string | null
): Promise<{ id: string; email: string } | null> {
  if (!authHeader) return null;

  const client = createUserClient(authHeader);
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) return null;
  return { id: user.id, email: user.email ?? "" };
}
