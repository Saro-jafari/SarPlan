import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return new Response(JSON.stringify({ error: 'ایمیل و رمز عبور باید وارد شوند.' }), { status: 400 });
		}

		// یافتن کاربر در پایگاه داده همراه با وضعیت
		const { data: user, error } = await supabase.from('users').select('id, email, password, role_id, status').eq('email', email).single();

		if (error || !user) {
			return new Response(JSON.stringify({ error: 'کاربر یافت نشد.' }), { status: 404 });
		}

		if (!user.password) {
			return new Response(JSON.stringify({ error: 'رمز عبور تنظیم نشده است.' }), { status: 500 });
		}

		// بررسی وضعیت کاربر
		if (user.status === false) {
			return new Response(JSON.stringify({ error: 'شما اجازه ورود را ندارید یا دسترسی شما غیرفعال شده است.' }), { status: 403 });
		}

		// بررسی رمز عبور
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return new Response(JSON.stringify({ error: 'ایمیل یا رمز عبور اشتباه است.' }), { status: 401 });
		}

		// بررسی نقش کاربر
		if (!user.role_id) {
			return new Response(JSON.stringify({ error: 'نقش کاربر مشخص نشده است.' }), { status: 400 });
		}

		const { data: role, error: roleError } = await supabase.from('roles').select('name').eq('id', user.role_id).single();

		if (roleError) {
			return new Response(JSON.stringify({ error: 'مشکلی در دریافت نقش کاربر رخ داده است.' }), { status: 500 });
		}

		// ایجاد توکن
		const token = jwt.sign({ email: user.email, role: role.name, id: user.id }, JWT_SECRET, { expiresIn: '7d' });

		// تنظیم کوکی با استفاده از cookies().set()
		cookies().set({
			name: 'token',
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 روز
			sameSite: 'strict',
		});

		// اطلاعات اضافی بر اساس نقش کاربر
		let additionalData = {};
		if (role.name === 'admin') {
			additionalData = { message: 'شما مدیر سیستم هستید', adminDashboardData: 'اطلاعات مربوط به مدیر' };
		} else if (role.name === 'owner') {
			additionalData = { message: 'شما مالک سیستم هستید', ownerDashboardData: 'اطلاعات مربوط به مالک' };
		} else {
			additionalData = { message: 'شما یک کاربر عادی هستید' };
		}

		return new Response(
			JSON.stringify({
				message: 'ورود موفقیت‌آمیز!',
				user: { email: user.email, role: role.name },
				...additionalData,
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		console.error('Error during authentication:', err);
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}
