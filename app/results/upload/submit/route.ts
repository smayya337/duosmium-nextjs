import { NextRequest, NextResponse } from 'next/server';
import { ResultsAddQueue } from '@/lib/results/queue';

export async function POST(request: NextRequest) {
	return new NextResponse(null, { status: 405 });
	// const data = await request.formData();
	// const allFiles = data.getAll('yaml');
	// const q = ResultsAddQueue.getInstance();
	// q.drain(function () {
	// 	console.log('All results have been added!');
	// });
	// for (const file of allFiles) {
	// 	if (file === null || typeof file === 'string') {
	// 		new NextResponse('Uploaded value is not a file!', { status: 400 });
	// 	} else {
	// 		// noinspection ES6MissingAwait
	// 		q.push(file);
	// 		// addResultFromYAMLFile(file);
	// 	}
	// }
	// return NextResponse.redirect(`${new URL(request.url).host}/results/upload`, 303);
}
