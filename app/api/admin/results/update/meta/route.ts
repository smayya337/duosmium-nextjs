import { isAdmin } from '@/lib/auth/admin';
import { getCurrentUserID } from '@/lib/auth/helpers';
import { regenerateAllColorsAndLogos } from '@/lib/results/async';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

export async function DELETE() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}

export async function GET() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}

export async function PATCH() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}

export async function POST() {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	const user = await getCurrentUserID(supabase);
	if (user === null) {
		return new Response(null, { status: 401 });
	} else if (!(await isAdmin(user))) {
		return new Response(null, { status: 403 });
	} else {
		return new Response(JSON.stringify(await regenerateAllColorsAndLogos()), { status: 200 });
	}
}

export async function PUT() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
