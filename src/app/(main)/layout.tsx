'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/NavBar';
import SideBar from '@/components/SideBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const isLoginPage = pathname === '/login';
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
			if (!decoded || !decoded.role) {
				router.replace('/access-denied');
				return;
			}

			// فرض کنیم برای داشبورد یوزر نقش باید "user" باشد
			if (decoded.role !== 'user') {
				router.replace('/access-denied');
				return;
			}

			setIsLoading(false);
		} catch (error) {
			router.replace('/access-denied');
		}
	}, [router]);

	if (isLoading) return <div className="h-screen flex items-center justify-center text-xl">در حال بررسی دسترسی...</div>;

	return (
		<div className="w-full h-screen dark:bg-[#14162E] bg-[#FFF] text-[#000] dark:text-[#fff] overflow-x-hidden">
			<ThemeProvider attribute="class">
				<AuthProvider>
					<Toaster />
					<section className="flex flex-col md:flex-row items-center justify-center min-h-screen">
						{!isLoginPage && <SideBar />}
						<main>{children}</main>
					</section>
				</AuthProvider>
			</ThemeProvider>
		</div>
	);
}
