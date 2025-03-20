'use client';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import Users from '@/app/admin/page';
import { useState, FC } from 'react';

const SideBarAdmin: FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

	const handleSidebarToggle = (): void => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleLogout = (): void => {
		toast('رسید وقت خداحافظی', {
			icon: '👋😊',
		});
		Cookies.remove('token');
		redirect('/login');
	};

	return (
		<div className="min-h-screen bg-[#14162E] flex">
			{/* دکمه toggle برای نمایش سایدبار در موبایل */}
			<button
				onClick={handleSidebarToggle}
				type="button"
				className="inline-flex items-center p-2 mt-2 mr-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
				<span className="sr-only">Open sidebar</span>
				<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
					<path
						clipRule="evenodd"
						fillRule="evenodd"
						d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
					/>
				</svg>
			</button>

			{/* Sidebar */}
			<aside
				id="separator-sidebar"
				className={`fixed top-0 right-0 z-40 w-64 h-screen p-4 transition-transform bg-[#14162E] text-white overflow-y-auto ${
					sidebarOpen ? 'translate-x-0' : 'translate-x-full'
				} sm:translate-x-0`}>
				<h2 className="text-xl font-semibold mb-8">داشبورد</h2>
				<ul>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/admin">مدیریت کاربران</Link>
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
			</aside>

			{/* محتوا */}
			<div className="flex-1 p-6 sm:mr-64">
				<Users />
			</div>
		</div>
	);
};

export default SideBarAdmin;
