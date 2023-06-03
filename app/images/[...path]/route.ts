import { getRouteHandlerClient } from "@/lib/global/supabase";
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function DELETE() {
	return new NextResponse(null, { status: 405 });
}

export async function GET(request: Request) {
	const supabase = getRouteHandlerClient(cookies);
	const url = new URL(request.url);
	const imagePath = url.pathname.replace('/images/', '');
	const output = await supabase.storage.from('images').download(imagePath);
	if (output.error) {
		if (output.error.message === 'The resource was not found') {
			return new NextResponse('Image ' + url.pathname + ' could not be found!', { status: 404 });
		}
		// @ts-ignore
		return new NextResponse(output.error.message, { status: output.error.status });
	} else {
		return new NextResponse(output.data);
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
