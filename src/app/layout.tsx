import SessionWrapper from '@/components/SessionWrapper';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

			<body>
				<Toaster />
				<SessionWrapper>{children}</SessionWrapper>
			</body>
		</html>
	);
}
