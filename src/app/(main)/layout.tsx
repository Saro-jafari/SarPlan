import '@/globals.css';
import { ReactNode } from 'react';
import SessionWrapper from '@/components/SessionWrapper';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import LayoutWrapper from '@/components/LayoutWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="fa" dir="rtl">
			<head>
				<link
					rel="shortcut icon"
					href="https://sarodev.ir/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.767bab38.png&w=1920&q=75"
					type="image/x-icon"
				/>
				<title>سارپلن</title>
			</head>

			<body className="w-full h-screen ">
				<AuthProvider>
					<SessionWrapper>
						<Toaster />
						<LayoutWrapper>{children}</LayoutWrapper>
					</SessionWrapper>
				</AuthProvider>
			</body>
		</html>
	);
}
