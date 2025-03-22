'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import { getUserFromToken } from '@/lib/serverActions';
import { ThemeProvider } from 'next-themes';
import { BiArrowToRight, BiArrowToLeft } from 'react-icons/bi';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setSidebarOpen] = useState(true);
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
					<Toaster />
					<aside
						className={`bg-gray-800 text-white transition-all duration-500 ease-in-out fixed top-0 right-0 bottom-0 ${
							isSidebarOpen ? 'w-64' : 'w-16'
						}`}>
						<div className="relative h-full">
							<button
								onClick={() => setSidebarOpen(!isSidebarOpen)}
								className="absolute left-0 transform -translate-x-full top-0 bg-[#1E2939] text-white p-2 focus:outline-none cursor-pointer">
								{isSidebarOpen ? <BiArrowToRight size={35} /> : <BiArrowToLeft size={35} />}
							</button>
							<div className="flex flex-col h-full p-4">
								{isSidebarOpen && (
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
								)}
							</div>
						</div>
					</aside>


					<main className="flex-1 p-6 overflow-y-auto">{children}</main>
				</AuthProvider>
			</ThemeProvider>
		</div>
	);
}
