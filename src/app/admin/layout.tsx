'use client';
import SideBarAdmin from '@/components/SideBarAdmin';
import '@/globals.css';

import { ThemeProvider } from 'next-themes';

export default function DashboardLayout() {
	return (
		<html lang="fa" dir="rtl">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>سارپلن</title>
			</head>
			<body className="bg-white dark:bg-[#14162E] text-black dark:text-white">
				<ThemeProvider attribute="class">
					<div className="flex-1  overflow-auto">
						<SideBarAdmin />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
