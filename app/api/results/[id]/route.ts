import { deleteResult, getCompleteResult, resultExists } from '@/app/lib/results/async';
import { exportYAMLOrJSON } from '@/app/lib/results/helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else {
		if ((await resultExists(duosmiumID)) === false) {
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
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new NextResponse('No result specified!', { status: 400 });
	} else {
		if ((await resultExists(duosmiumID)) === false) {
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
