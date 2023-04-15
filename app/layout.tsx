import { Roboto } from 'next/font/google';

export const metadata = {
	title: 'Duosmium Results'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
