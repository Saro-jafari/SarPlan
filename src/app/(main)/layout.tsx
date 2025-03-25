'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import { getUserFromToken } from '@/lib/serverActions';
import { ThemeProvider } from 'next-themes';
import { BiArrowToRight, BiArrowToLeft } from 'react-icons/bi';
import Link from 'next/link';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setSidebarOpen] = useState(false); // در موبایل بسته باشد
	const [role, setRole] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUser() {
			const userData = await getUserFromToken();
			if (!userData?.id) {
				router.replace('/access-denied');
			} else {
				setUser(userData);
				setRole(userData.role);
			}
			setIsLoading(false);
		}
		fetchUser();
	}, [router]);

	const handleLogout = async (): Promise<void> => {
		toast('رسید وقت خداحافظی', { icon: '👋😊' });
		try {
			const res = await fetch('/api/auth/logout', { method: 'POST' });
			if (res.ok) {
				router.push('/login');
			} else {
				toast.error('مشکلی پیش آمده است. دوباره تلاش کنید.');
			}
		} catch (error) {
			console.error('Logout error:', error);
			toast.error('مشکلی در ارتباط با سرور پیش آمده است.');
		}
	};

	if (isLoading) {
		return <div className="h-screen flex items-center justify-center text-xl">در حال بررسی دسترسی...</div>;
	}

	return (
		<div className="w-full h-screen dark:bg-[#14162E] bg-[#FFF] text-[#000] dark:text-[#fff] overflow-hidden flex">
			<ThemeProvider attribute="class">
				<AuthProvider>
					<DndProvider backend={HTML5Backend}>
						<Toaster />

						{/* دکمه باز کردن سایدبار در موبایل */}
						{!isSidebarOpen && (
							<button
								onClick={() => setSidebarOpen(true)}
								className="fixed top-4 right-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded">
								<BiArrowToLeft size={25} />
							</button>
						)}

						{/* Sidebar */}
						<aside
							className={`bg-gray-800 text-white fixed md:relative top-0 right-0 w-64 h-full p-4 z-50 transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? 'translate-x-0' : 'hidden md:block'}`}>
							{/* دکمه بستن سایدبار در موبایل */}
							<button
								onClick={() => setSidebarOpen(false)}
								className="absolute top-4 left-4 z-50 md:hidden bg-gray-700 text-white p-2 rounded">
								<BiArrowToRight size={25} />
							</button>

							<nav className="flex-1">
								<ul className="space-y-4">
									<p className="text-xl font-bold p-2">سارپلن</p>
									<li className="p-2 rounded hover:bg-gray-700 cursor-pointer">کارهایی که باید انجام بدم</li>
									<li className="p-2 rounded hover:bg-gray-700 cursor-pointer">
										<Link href="/user-dashboard/categories">دسته بندی کارهای من</Link>
									</li>
									<li className="p-2 rounded hover:bg-gray-700 cursor-pointer">گزارشات</li>
									{role === 'admin' && (
										<li className="p-2 rounded hover:bg-gray-700 cursor-pointer">
											<Link href="/admin">برو به پنل ادمین</Link>
										</li>
									)}
									<li className="p-2 rounded hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>
										خروج
									</li>
								</ul>
							</nav>
						</aside>

						{/* محتوای اصلی */}
						<main className="flex-1 p-6 overflow-y-auto">{children}</main>
					</DndProvider>{' '}
				</AuthProvider>
			</ThemeProvider>
		</div>
	);
}
