import { load } from 'js-yaml';
import { addResult, createResultDataInput } from '@/lib/results/async';
import { exportYAMLOrJSON } from '@/lib/results/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { getInterpreter } from '@/lib/results/interpreter';
import { deleteAllDeletableResults, getAllReadableCompleteResults } from '@/lib/results/filter';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { getCurrentUserID } from '@/lib/auth/helpers';

export async function DELETE() {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	await deleteAllDeletableResults(await getCurrentUserID(supabase));
	return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	const allResults = await getAllReadableCompleteResults(await getCurrentUserID(supabase));
	return exportYAMLOrJSON(new URL(request.url), allResults, 'results');
}

export async function PATCH() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'DELETE, GET, POST' } });
}

export async function POST(request: NextRequest) {
	const body = request.body;
	if (body === null) {
		return new NextResponse('No data provided!', { status: 400 });
	}
	let data = '';
	let readDone = false;
	const reader = body.getReader();
	while (!readDone) {
		await reader.read().then(({ done, value }) => {
			if (value === undefined) {
				readDone = done;
			}
			if (!readDone) {
				const fragment = new TextDecoder().decode(value);
				data += fragment;
			}
		});
	}
	let obj;
	try {
		// Why on earth does this load to a string first and then an object???
		obj = load(<string>load(data));
	} catch (e) {
		obj = JSON.parse(data);
	}
	const interpreter = await getInterpreter(obj);
	const result = await addResult(await createResultDataInput(interpreter));
	return new NextResponse(result.duosmiumId, { status: 201 });
}

export async function PUT() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'DELETE, GET, POST' } });
}
