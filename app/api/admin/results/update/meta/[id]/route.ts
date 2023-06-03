import { isAdmin } from '@/lib/auth/admin';
import { getRouteHandlerClient } from '@/lib/global/supabase';
import { regenerateColorAndLogo } from '@/lib/results/async';
import { cookies } from 'next/headers';
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
	const supabase = getRouteHandlerClient(cookies);
	if (!(await isAdmin(supabase))) {
		return new Response(null, { status: 403 });
	}
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	}
	return new NextResponse(JSON.stringify(await regenerateColorAndLogo(duosmiumID)), {
		status: 200
	});
}

export async function PUT() {
	return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
