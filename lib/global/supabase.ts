import { createClient } from '@supabase/supabase-js';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export function getServerComponentSupabaseClient(headers: () => any, cookies: () => any) {
	return createServerComponentSupabaseClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		headers,
		cookies
	});
}
