import { NextResponse, NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;

	// اگر توکن وجود نداشت، کاربر را به صفحه لاگین هدایت کن
	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	try {
		// بررسی توکن
		const decoded: any = verify(token, secret);
		const userRole = decoded.role; // گرفتن نقش کاربر از توکن
		const pathname = req.nextUrl.pathname;

		// **دسترسی به `/admin` فقط برای ادمین‌ها مجاز است**
		if (pathname.startsWith('/admin') && userRole !== 'admin') {
			return NextResponse.redirect(new URL('/403', req.url)); // صفحه عدم دسترسی
		}

		// **دسترسی به `/user-dashboard` فقط برای کاربران عادی و ادمین مجاز است**
		if (pathname.startsWith('/user-dashboard') && userRole === 'guest') {
			return NextResponse.redirect(new URL('/403', req.url)); // صفحه عدم دسترسی
		}
	} catch (error) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/user-dashboard/:path*', '/admin/:path*'],
};
