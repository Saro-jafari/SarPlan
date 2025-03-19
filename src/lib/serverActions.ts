'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface DecodedToken {
	email: string;
	role: string;
	id: string;
	exp: number;
}

export async function getUserFromToken() {
	const cookieStore = await cookies();
	const tokenCookie = cookieStore.get('token');

	if (!tokenCookie) {
		return null;
	}

	const token = tokenCookie.value;

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as DecodedToken;
		console.log('توکن دیکد شده:', decodedToken);

		if (decodedToken.exp * 1000 > Date.now()) {
			return { email: decodedToken.email, role: decodedToken.role, id: decodedToken.id };
		} else {
			console.error('توکن منقضی شده است.');
			return null;
		}
	} catch (error) {
		console.error('خطا در اعتبارسنجی توکن:', error);
		return null;
	}
}

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete('token');
}
