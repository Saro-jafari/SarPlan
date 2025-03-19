'use client';
import Link from 'next/link';

export default function AccessDenied() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
			<h1 className="text-2xl font-bold mb-4">🚫 دسترسی غیرمجاز</h1>
			<p className="mb-6">شما اجازه ورود به این بخش را ندارید.</p>
			<Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
				برو به صفحه لاگین
			</Link>
		</div>
	);
}
