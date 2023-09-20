import '@/styles/globals.css';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`
	},
	description: siteConfig.description,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	],
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png'
	}
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<html lang="en" suppressHydrationWarning className={'overflow-scroll scroll-pt-16'}>
				<head>
					<title>{siteConfig.name}</title>
				</head>
				<body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<div className="relative flex min-h-screen flex-col">
							<SiteHeader />
							<div className="flex-1 mx-auto py-8 max-w-90vw">{children}</div>
							{/* TODO: add a footer */}
						</div>
					</ThemeProvider>
				</body>
			</html>
		</>
	);
}
