'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { authEnabled, SUPABASE_KEY, SUPABASE_URL } from './config';

let client: SupabaseClient | null = null;

/** Cliente do Supabase no navegador (um só por aba). Null quando não configurado. */
export function getSupabase(): SupabaseClient | null {
  if (!authEnabled) return null;
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}
