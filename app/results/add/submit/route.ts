import { addResultFromYAMLFile } from '@/app/lib/results/async';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const data = await request.formData();
	const allFiles = data.getAll('yaml');
	for (const file of allFiles) {
		if (file === null || typeof file === 'string') {
			new Response('Uploaded value is not a file!', { status: 400 });
		} else {
			// noinspection ES6MissingAwait
			addResultFromYAMLFile(file);
		}
	}

	return NextResponse.redirect(`${new URL(request.url).host}/results/add`, 303);
}
