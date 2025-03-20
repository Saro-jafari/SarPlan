import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
	try {
		const { token, password } = await req.json();

		if (!token || !password) {
			return NextResponse.json({ message: 'اطلاعات ناقص است' }, { status: 400 });
		}

		// جستجوی کاربر بر اساس توکن
		const { data: user, error } = await supabase.from('users').select('id, reset_expires').eq('reset_token', token).single();

		if (error || !user) {
			return NextResponse.json({ message: 'توکن نامعتبر است' }, { status: 400 });
		}

		// بررسی تاریخ انقضای توکن
		if (new Date(user.reset_expires) < new Date()) {
			return NextResponse.json({ message: 'توکن منقضی شده است' }, { status: 400 });
		}

		// هش کردن رمز جدید
		const hashedPassword = await bcrypt.hash(password, 10);

		// به‌روزرسانی رمز عبور و حذف توکن از دیتابیس
		await supabase
			.from('users')
			.update({
				password: hashedPassword,
				reset_token: null,
				reset_expires: null,
			})
			.eq('id', user.id);

		return NextResponse.json({ message: 'رمز عبور با موفقیت تغییر کرد' }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در پردازش درخواست' }, { status: 500 });
	}
}
