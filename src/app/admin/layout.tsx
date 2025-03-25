'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBarAdmin from '@/components/SideBarAdmin';
import { AuthProvider } from '@/context/AuthProvider';
import { getUserFromToken } from '@/lib/serverActions';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { BiMenu, BiX } from 'react-icons/bi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
		<div className="bg-white dark:bg-[#14162E] text-black dark:text-white min-h-screen">
			<Toaster />
			<AuthProvider>
				<ThemeProvider attribute="class">
					{/* دکمه منو برای موبایل */}
					<div className="md:hidden p-4 flex justify-between items-center bg-white dark:bg-[#14162E] shadow">
						<button onClick={() => setMobileSidebarOpen(true)} className="text-gray-700 dark:text-gray-300 focus:outline-none">
							<BiMenu size={35} />
						</button>
						<h1 className="text-lg font-semibold">داشبورد مدیریت</h1>
					</div>

					{/* Sidebar موبایل */}
					{isMobileSidebarOpen && (
						<div className="fixed inset-0 z-40 bg-transparent bg-opacity-50 flex">
							<SideBarAdmin sidebarOpen={isMobileSidebarOpen} setSidebarOpen={setMobileSidebarOpen} />
						</div>
					)}

					<div className="flex">
						{/* Sidebar در دسکتاپ */}
						<div className="hidden md:block md:w-64">
							<SideBarAdmin sidebarOpen={true} setSidebarOpen={() => {}} />
						</div>

						<div className="flex-1 overflow-auto p-4">{children}</div>
					</div>
				</ThemeProvider>
			</AuthProvider>
		</div>
	);
}
