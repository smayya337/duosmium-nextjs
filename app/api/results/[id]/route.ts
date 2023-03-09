import { deleteResult, getResult } from '@/app/lib/results/async';
import { exportYAMLOrJSON, MONGO_ID_REGEX } from '@/app/lib/results/helpers';

export async function DELETE(request: Request) {
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new Response('No result specified!', { status: 400 });
	} else {
		try {
			await deleteResult(duosmiumID);
		} catch (e) {
			return new Response('Result ' + duosmiumID + ' does not exist!', { status: 404 });
		}
	}
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new Response('No result specified!', { status: 400 });
	} else {
		try {
			const result = await getResult(duosmiumID);
			return exportYAMLOrJSON(url, result, duosmiumID);
		} catch (e) {
			return new Response('Result ' + duosmiumID + ' does not exist!', { status: 404 });
		}
	}
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
