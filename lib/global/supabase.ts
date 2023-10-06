import {
	createClientComponentClient,
	createRouteHandlerClient,
	createServerComponentClient
} from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import {cache} from "react";
import {cookies} from "next/headers";
import {Database} from "@/lib/global/types";

export const PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false
	}
});


// export function getServerComponentClient(cookies: () => any) {
// 	return createServerComponentClient(
// 		{
// 			cookies
// 		},
// 		{
// 			supabaseUrl: PUBLIC_SUPABASE_URL,
// 			supabaseKey: PUBLIC_SUPABASE_ANON_KEY
// 		}
// 	);
// }

export function getClientComponentClient() {
	return createClientComponentClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY
	});
}

export function getRouteHandlerClient(cookies: () => any) {
	return createRouteHandlerClient(
		{
			cookies
		},
		{
			supabaseUrl: PUBLIC_SUPABASE_URL,
			supabaseKey: PUBLIC_SUPABASE_ANON_KEY
		}
	);
}
