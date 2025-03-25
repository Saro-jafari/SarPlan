'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FC } from 'react';
import { BiX } from 'react-icons/bi';

interface SideBarAdminProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

const SideBarAdmin: FC<SideBarAdminProps> = ({ sidebarOpen, setSidebarOpen }) => {
	const router = useRouter();

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

	return (
		<>
			{sidebarOpen && (
				<div className="fixed inset-0 z-30 md:hidden" onClick={() => setSidebarOpen(false)}>
					<div className="absolute inset-0 bg-transparent backdrop-blur-md"></div>
				</div>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 right-0 z-40 w-64 h-full p-4 overflow-y-auto transition-transform
	bg-[#14162E]/80 backdrop-blur-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
	md:translate-x-0 md:static`}>
				{/* دکمه بستن منو برای موبایل */}
				<div className="flex items-center justify-between md:hidden">
					<button
						onClick={() => setSidebarOpen(false)}
						type="button"
						className="p-2 text-gray-500 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 absolute top-2 left-3">
						<BiX size={35} />
					</button>
				</div>
				{/* عنوان منو برای دسکتاپ */}
				<div className="hidden md:block">
					<h2 className="text-xl font-semibold mb-8">داشبورد</h2>
				</div>
				<ul className="space-y-4">
					<li className="hover:bg-gray-700 p-2 rounded">
						<Link href="/admin">مدیریت کاربران</Link>
					</li>
					<li className="hover:bg-gray-700 p-2 rounded">
						<Link href="/user-dashboard">رفتن به برنامه</Link>
					</li>
					<li className="hover:bg-gray-700 p-2 rounded">
						<Link href="/dashboard/reports">گزارشات</Link>
					</li>
					<li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={handleLogout}>
						خروج
					</li>
				</ul>
			</aside>
		</>
	);
};

export default SideBarAdmin;
