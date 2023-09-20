import { isAdmin } from '@/lib/auth/admin';
import { getCurrentUserID } from '@/lib/auth/helpers';
import { getRouteHandlerClient } from '@/lib/global/supabase';
import { addResultFromYAMLFile } from '@/lib/results/async';
import { ResultsAddQueue } from '@/lib/results/queue';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	// const supabase = getRouteHandlerClient(cookies);
	// if (!(await isAdmin(supabase))) {
	// 	return new Response(null, { status: 403 });
	// }
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
			// await addResultFromYAMLFile(file);
		}
	}
	return NextResponse.redirect(`${request.nextUrl.host}/results/upload`, 303);
}
