import { isAdmin } from '@/lib/auth/admin';
import { getRouteHandlerClient } from '@/lib/global/supabase';
import { deleteResult, getCompleteResult, resultExists } from '@/lib/results/async';
import { exportYAMLOrJSON } from '@/lib/results/helpers';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
	const supabase = getRouteHandlerClient(cookies);
	if (!(await isAdmin(supabase))) {
		return new Response(null, { status: 403 });
	}
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else if (!(await resultExists(duosmiumID))) {
		return new NextResponse('Result does not exist!', { status: 404 });
	}
	try {
		await deleteResult(duosmiumID);
	} catch (e) {
		return new NextResponse('Server Error', { status: 500 });
	}
	return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else if (!(await resultExists(duosmiumID))) {
		return new NextResponse('Result does not exist!', { status: 404 });
	}
	try {
		const result = await getCompleteResult(duosmiumID);
		return exportYAMLOrJSON(url, result, duosmiumID);
	} catch (e) {
		return new NextResponse('Server Error', { status: 500 });
	}
}

export async function PATCH() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'DELETE, GET' } });
}

export async function POST() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'DELETE, GET' } });
}

export async function PUT() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'DELETE, GET' } });
}
