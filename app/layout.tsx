import Script from 'next/script';
import React from 'react';
import SupabaseProvider from '@/app/supabase-provider';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { colors, defaultColor } from '@/lib/colors/default';

export const metadata = {
	title: 'Duosmium Results'
};

const defaultColorHex = colors[defaultColor];

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
				<title>Duosmium Results</title>
				<link
					href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
					rel="stylesheet"
				/>
				<Script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js" />
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
					rel="stylesheet"
				/>
			</head>
			{/* @ts-ignore */}
			<body style={{ margin: 0, '--mdc-theme-primary': defaultColorHex }}>
				<SupabaseProvider session={session}>{children}</SupabaseProvider>
			</body>
		</html>
	);
}
