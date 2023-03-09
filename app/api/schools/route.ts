import { deleteAllSchools, getAllSchools } from '@/app/lib/schools/async';
import { exportYAMLOrJSON } from '@/app/lib/results/helpers';

export async function DELETE(request: Request) {
	await deleteAllSchools();
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const allResults = await getAllSchools();
	return exportYAMLOrJSON(new URL(request.url), allResults, 'results');
}

export async function PATCH(request: Request) {
	return new Response(null, { status: 501 });
}

export async function POST(request: Request) {
	return new Response(null, { status: 501 });
}

export async function PUT(request: Request) {
	return new Response(null, { status: 501 });
}
