'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import SideBar from '@/components/SideBar';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isLoginPage = pathname === '/login';

	return (
		<section className="flex flex-col md:flex-row items-center justify-center min-h-screen">
			{!isLoginPage && <SideBar />}
			<main>{children}</main>
		</section>
	);
}
