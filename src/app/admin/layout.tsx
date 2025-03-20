'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBarAdmin from '@/components/SideBarAdmin';
import { AuthProvider } from '@/context/AuthProvider';
import { getUserFromToken } from '@/lib/serverActions';
import { ThemeProvider } from 'next-themes';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			const userData = await getUserFromToken();
			if (!userData || (userData.role !== 'admin' && userData.role !== 'owner')) {
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
