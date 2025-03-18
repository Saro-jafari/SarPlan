// app/layout.tsx
import '@/globals.css';
import { ReactNode } from 'react';
import SessionWrapper from '@/components/SessionWrapper';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/NavBar';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="fa" dir="rtl" suppressHydrationWarning>
			<head>
				<link rel="shortcut icon" href="https://saro-resume-2004.storage.c2.liara.space/Logo/logo.webp" type="image/x-icon" />
				<title>سارپلن</title>
			</head>
			<body className="w-full h-screen dark:bg-[#14162E] bg-[#FFF] text-[#000] dark:text-[#fff] overflow-x-hidden">
				<ThemeProvider attribute="class">
					<AuthProvider>
						<Navbar />
						<SessionWrapper>
							<Toaster />
							<LayoutWrapper>{children}</LayoutWrapper>
						</SessionWrapper>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
