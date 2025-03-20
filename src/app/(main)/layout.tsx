'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import { getUserFromToken } from '@/lib/serverActions';
import { ThemeProvider } from 'next-themes';

import SideBar from '@/components/SideBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const isLoginPage = pathname === '/login';
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			const userData = await getUserFromToken();
			if (!userData?.id) {
				router.replace('/access-denied');
			} else {
				setUser(userData);
			}
			setIsLoading(false);
		}

		fetchUser();
	}, [router]);

	if (isLoading) {
		return <div className="h-screen flex items-center justify-center text-xl">در حال بررسی دسترسی...</div>;
	}

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
