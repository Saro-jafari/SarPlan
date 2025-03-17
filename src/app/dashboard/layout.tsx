'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie'; // Import js-cookie

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	// Logout handler
	const handleLogout = () => {
		toast('رسید وقت خداحافظی', {
			icon: '👋😊',
		});

		// Remove the token from cookies
		Cookies.remove('token'); // Remove token cookie

		// Redirect to login page
		router.push('/login');
	};

	return (
		<div className="flex min-h-screen">

			<div className="w-64  text-white p-4">
				<h2 className="text-xl font-semibold mb-8">داشبورد</h2>
				<ul>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/dashboard">مدیریت کاربران</Link>
					</li>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/">رفتن به برنامه</Link>
					</li>
					<li className="mb-4 hover:bg-gray-700 p-2 rounded">
						<Link href="/dashboard/reports">گزارشات</Link>
					</li>
					{/* Logout button */}
					<li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={handleLogout}>
						خروج
					</li>
				</ul>
			</div>


			<div className="flex-1 ml-64 p-6 overflow-auto">
				{/* محتویات صفحه */}
				{children}
			</div>
		</div>
	);
}
