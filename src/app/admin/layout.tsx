'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import SideBarAdmin from '@/components/SideBarAdmin';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from 'next-themes';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const cookies = parseCookies();
		const token = cookies.token;

		if (!token) {
			router.replace('/access-denied');
			return;
		}

		try {
			const decoded: any = jwt.decode(token);
			if (!decoded || !decoded.role || (decoded.role !== 'admin' && decoded.role !== 'owner')) {
				router.replace('/access-denied');
				return;
			}
			setIsLoading(false);
		} catch (error) {
			router.replace('/access-denied');
		}
	}, [router]);

	if (isLoading) {
		return <div className="h-screen flex items-center justify-center text-xl">در حال بررسی دسترسی...</div>;
	}

	return (
		<div className="bg-white dark:bg-[#14162E] text-black dark:text-white">
			<AuthProvider>
				<ThemeProvider attribute="class">
					<div className="flex-1 overflow-auto">
						<SideBarAdmin />
						{children}
					</div>
				</ThemeProvider>
			</AuthProvider>
		</div>
	);
}
