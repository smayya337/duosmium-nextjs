import { load } from 'js-yaml';
import { getAllResults, addResultFromObject, deleteAllResults } from '@/app/lib/results/async';
import { exportYAMLOrJSON } from '@/app/lib/results/helpers';

export async function DELETE(request: Request) {
	await deleteAllResults();
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const allResults = await getAllResults();
	return exportYAMLOrJSON(new URL(request.url), allResults, 'results');
}

export async function PATCH(request: Request) {
	return new Response(null, { status: 501 });
}

export async function POST(request: Request) {
	const body = request.body;
	if (body === null) {
		return new Response('No data provided!', { status: 400 });
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
	const fileName = await addResultFromObject(obj);
	return new Response(`Result ${fileName} created`, { status: 201 });
}

export async function PUT(request: Request) {
	return new Response(null, { status: 501 });
}
