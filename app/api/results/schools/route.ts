import { exportYAMLOrJSON } from '@/lib/results/helpers';
import { getAllSchoolsAndRanks } from "@/lib/teams/async";
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'GET' } });
}

export async function GET(request: NextRequest) {
	const allTeams = await getAllSchoolsAndRanks();
	const output: object = {};
	for (const e of allTeams.entries()) {
		const k = e[0];
		const locString = `${k.name} (${k.city ? `${k.city}, ` : ''}${k.state ?? k.country})`;
		const v = Object.fromEntries(e[1]);
		// @ts-ignore
		output[locString] = {
			name: k.name,
			city: k.city,
			state: k.state,
			country: k.country,
			rankings: v
		}
	}
	return exportYAMLOrJSON(new URL(request.url), output, 'schools');
}

export async function PATCH() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'GET' } });
}

export async function POST(request: NextRequest) {
	return new NextResponse(null, { status: 405, headers: { Allow: 'GET' } });
}

export async function PUT() {
	return new NextResponse(null, { status: 405, headers: { Allow: 'GET' } });
}
