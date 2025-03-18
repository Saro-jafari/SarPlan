
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="fa" dir="rtl" suppressHydrationWarning>
			<head>
				<title>سارپلن</title>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system">
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
