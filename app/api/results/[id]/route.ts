import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { deleteResult, getCompleteResult, resultExists } from '@/app/lib/results/async';
import { exportYAMLOrJSON } from '@/app/lib/results/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { canDelete, canRead } from '@/app/lib/auth/results';
import { headers, cookies } from 'next/headers';
import { getCurrentUserID } from '@/app/lib/auth/helpers';

export async function DELETE(request: NextRequest) {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else {
		const exists = await resultExists(duosmiumID);
		const deletable = await canDelete(await getCurrentUserID(supabase), duosmiumID);
		if (!(exists && deletable)) {
			return new NextResponse('Result ' + duosmiumID + ' does not exist!', { status: 404 });
		}
		try {
			await deleteResult(duosmiumID);
		} catch (e) {
			return new NextResponse('Server Error', { status: 500 });
		}
	}
	return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else {
		const exists = await resultExists(duosmiumID);
		const readable = await canRead(await getCurrentUserID(supabase), duosmiumID);
		// I suppose if it's not readable we should return a 403, but we don't want them to know it exists
		if (!(exists && readable)) {
			return new NextResponse('Result ' + duosmiumID + ' does not exist!', { status: 404 });
		}
		try {
			const result = await getCompleteResult(duosmiumID);
			return exportYAMLOrJSON(url, result, duosmiumID);
		} catch (e) {
			return new NextResponse('Server Error', { status: 500 });
		}
	}
}

export async function PATCH() {
	return new NextResponse(null, { status: 405 });
}

export async function POST() {
	return new NextResponse(null, { status: 405 });
}

export async function PUT() {
	return new NextResponse(null, { status: 405 });
}
