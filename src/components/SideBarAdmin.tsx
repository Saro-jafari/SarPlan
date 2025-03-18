'use client';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import Users from '@/app/dashboard/page';

const SideBarAdmin = () => {
	const handleLogout = () => {
		toast('رسید وقت خداحافظی', {
			icon: '👋😊',
		});

		// حذف توکن از کوکی‌ها
		Cookies.remove('token');

		// هدایت به صفحه ورود
		redirect('/login');
	};

	return (
		<div className="flex min-h-screen bg-[#14162E]">
			{/* Sidebar */}
			<div className="w-64 md:w-20 lg:w-64 text-white p-4">
				<h2 className="text-xl font-semibold mb-8">داشبورد</h2>
				<ul>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/dashboard">مدیریت کاربران</Link>
					</li>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/user-dashboard">رفتن به برنامه</Link>
					</li>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/dashboard/reports">گزارشات</Link>
					</li>
					{/* دکمه خروج */}
					<li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={handleLogout} aria-label="Logout">
						خروج
					</li>
				</ul>
			</div>

			{/* محتوا */}
			<div className="flex-1 p-6 overflow-auto">
				<Users />
			</div>
		</div>
	);
};

export default SideBarAdmin;
