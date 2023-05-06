import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/app/lib/global/types';
import { User } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '@/app/lib/global/supabase';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareSupabaseClient<Database>(
		{ req, res },
		{ supabaseUrl: PUBLIC_SUPABASE_URL, supabaseKey: PUBLIC_SUPABASE_ANON_KEY }
	);
	const ses = await supabase.auth.getSession();
	if (ses.error) {
		return new NextResponse(ses.error.message, {
			status: ses.error.status,
			statusText: ses.error.name
		});
	}
	const user = ses.data.session?.user;
	const actualPath = await authorizeUser(user, req);
	if (actualPath) {
		return actualPath;
	}
	return res;
}

async function authorizeUser(user: User | undefined, req: NextRequest) {
	let res = null;
	const pathName = req.nextUrl.pathname;
	// TODO: allow admins to do anything
	if (pathName.startsWith('/api')) {
		res = await apiAuthorization(user, req);
	}
	// TODO: flesh this out
	return res;
}

async function apiAuthorization(user: User | undefined, req: NextRequest) {
	if (req.method !== 'GET') {
		// TODO: authorize as needed
		return new NextResponse(null, { status: 401 });
	}
	return null;
}
