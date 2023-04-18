import Script from 'next/script';

export const metadata = {
	title: 'Duosmium Results'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
					rel="stylesheet"
				></link>
				<Script
					src={
						'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js'
					}
				></Script>
			</head>
			<body>{children}</body>
		</html>
	);
}
