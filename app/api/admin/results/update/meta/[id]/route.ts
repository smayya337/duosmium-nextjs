import { isAdmin } from '@/lib/auth/admin';
import { getCurrentUserID } from '@/lib/auth/helpers';
import { regenerateColorAndLogo } from '@/lib/results/async';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}

export async function GET() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}

export async function PATCH() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}

export async function POST(request: NextRequest) {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	const user = await getCurrentUserID(supabase);
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else if (user === null) {
		return new NextResponse(null, { status: 401 });
	} else if (!(await isAdmin(user))) {
		return new NextResponse(null, { status: 403 });
	} else {
		return new NextResponse(JSON.stringify(await regenerateColorAndLogo(duosmiumID)), {
			status: 200
		});
	}
}

export async function PUT() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
