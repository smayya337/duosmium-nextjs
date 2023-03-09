import { deleteAllSchools, getAllSchools } from '@/app/lib/schools/async';
import { exportYAMLOrJSON } from '@/app/lib/results/helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE() {
	await deleteAllSchools();
	return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
	const allSchools = await getAllSchools();
	return exportYAMLOrJSON(new URL(request.url), allSchools, 'schools');
}

export async function PATCH() {
	return new NextResponse(null, { status: 501 });
}

export async function POST() {
	return new NextResponse(null, { status: 501 });
}

export async function PUT() {
	return new NextResponse(null, { status: 501 });
}
