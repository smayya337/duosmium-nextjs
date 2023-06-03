import { isAdmin } from '@/lib/auth/admin';
import { getRouteHandlerClient } from '@/lib/global/supabase';
import { regenerateAllColorsAndLogos } from '@/lib/results/async';
import { cookies } from 'next/headers';

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
	// const supabase = getRouteHandlerClient(cookies);
	// if (!(await isAdmin(supabase))) {
	// 	return new Response(null, { status: 403 });
	// }
	return new Response(JSON.stringify(await regenerateAllColorsAndLogos()), { status: 200 });
}

export async function PUT() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
