import { NextRequest, NextResponse } from 'next/server';
import { ResultsAddQueue } from '@/lib/results/queue';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { getCurrentUserID } from '@/lib/auth/helpers';
import { isAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
	const supabase = createRouteHandlerSupabaseClient({
		headers,
		cookies
	});
	const user = await getCurrentUserID(supabase);
	if (user === null) {
		return new Response(null, { status: 401 });
	} else if (!(await isAdmin(user))) {
		return new Response(null, { status: 403 });
	}
	// return new NextResponse(null, { status: 405 });
	const data = await request.formData();
	const allFiles = data.getAll('yaml');
	const q = ResultsAddQueue.getInstance();
	q.drain(function () {
		console.log('All results have been added!');
	});
	for (const file of allFiles) {
		if (file === null || typeof file === 'string') {
			new NextResponse('Uploaded value is not a file!', { status: 400 });
		} else {
			// noinspection ES6MissingAwait
			q.push(file);
			// addResultFromYAMLFile(file);
		}
	}
	return NextResponse.redirect(`${request.nextUrl.host}/results/upload`, 303);
}
