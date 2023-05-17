import Script from 'next/script';
import React from 'react';
import SupabaseProvider from '@/app/supabase-provider';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';

export const metadata = {
	title: 'Duosmium Results'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const supabase = createServerComponentSupabaseClient({
		headers,
		cookies
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return (
		<html lang="en">
			<head>
				<link
					href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
					rel="stylesheet"
				></link>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'anonymous'} />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
					rel="stylesheet"
				/>
				<Script
					src={
						'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js'
					}
				></Script>
			</head>
			<body>
				<SupabaseProvider session={session}>{children}</SupabaseProvider>
			</body>
		</html>
	);
}
