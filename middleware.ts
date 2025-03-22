import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;
	const pathname = req.nextUrl.pathname;

	console.log('Token:', token); // بررسی مقدار توکن

	// اگر در صفحه لاگین هستیم، نیازی به ریدایرکت به لاگین نیست
	if (pathname.startsWith('/login')) {
		if (!token) return NextResponse.next();

		try {
			const decoded: any = verify(token, secret);
			const userRole = decoded.role;

			// اگر کاربر لاگین کرده، اجازه نده در لاگین بماند
			if (userRole && userRole !== 'guest') {
				return NextResponse.redirect(new URL('/user-dashboard', req.url));
			}
		} catch (error) {
			console.error('JWT Verify Error:', error);
			return NextResponse.next();
		}
	}

	// اگر توکن وجود ندارد و مسیر لاگین نیست، کاربر را به لاگین هدایت کن
	if (!token) {
		const response = NextResponse.redirect(new URL('/login', req.url));
		response.cookies.delete('token'); // حذف کوکی توکن نامعتبر
		return response;
	}

	try {
		const decoded: any = verify(token, secret);
		console.log('Decoded Token:', decoded); // بررسی مقدار توکن

		const userRole = decoded.role;

		// دسترسی به صفحات ادمین فقط برای مدیر
		if (pathname.startsWith('/admin') && userRole !== 'admin') {
			return NextResponse.redirect(new URL('/403', req.url));
		}

		// کاربر مهمان نباید به داشبورد کاربر دسترسی داشته باشد
		if (pathname.startsWith('/user-dashboard') && userRole === 'guest') {
			return NextResponse.redirect(new URL('/403', req.url));
		}
	} catch (error) {
		console.error('JWT Verify Error:', error);
		const response = NextResponse.redirect(new URL('/login', req.url));
		response.cookies.delete('token'); // حذف توکن نامعتبر
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/user-dashboard/:path*', '/login'],
};
