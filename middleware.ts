import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	try {
		const decoded: any = verify(token, secret);
		const userRole = decoded.role;
		const pathname = req.nextUrl.pathname;

		if (pathname.startsWith('/admin') && userRole !== 'admin') {
			return NextResponse.redirect(new URL('/403', req.url));
		}

		if (pathname.startsWith('/user-dashboard') && userRole === 'guest') {
			return NextResponse.redirect(new URL('/403', req.url));
		}

		if (pathname.startsWith('/login') && userRole !== 'guest') {
			return NextResponse.redirect(new URL('/user-dashboard', req.url));
		}
	} catch (error) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/user-dashboard/:path*', '/user-dashboard', '/login'],
};
