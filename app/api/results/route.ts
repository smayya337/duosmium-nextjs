import { load } from 'js-yaml';
import {
	getAllCompleteResults,
	deleteAllResults,
	addResult,
	createResultDataInput
} from '@/app/lib/results/async';
import { exportYAMLOrJSON } from '@/app/lib/results/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { getInterpreter } from '@/app/lib/results/interpreter';

export async function DELETE() {
	await deleteAllResults();
	return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
	const allResults = await getAllCompleteResults();
	return exportYAMLOrJSON(new URL(request.url), allResults, 'results');
}

export async function PATCH() {
	return new NextResponse(null, { status: 405 });
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
	return new NextResponse(null, { status: 405 });
}
