import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { sendEmail } from '@/utils/emailService';
import crypto from 'crypto';

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ message: 'ایمیل را وارد کنید' }, { status: 400 });
		}

		// جستجوی کاربر بر اساس ایمیل
		const { data: user, error } = await supabase.from('users').select('id').eq('email', email).single();

		if (error || !user) {
			return NextResponse.json({ message: 'کاربری با این ایمیل یافت نشد' }, { status: 404 });
		}

		// تولید توکن ریست پسورد
		const resetToken = crypto.randomBytes(32).toString('hex');
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1); // 1 ساعت اعتبار

		// ذخیره توکن و زمان انقضا در دیتابیس
		await supabase
			.from('users')
			.update({
				reset_token: resetToken,
				reset_expires: expiresAt.toISOString(),
			})
			.eq('id', user.id);

		// لینک ریست پسورد
		const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

		// ارسال ایمیل به کاربر
		await sendEmail(email, resetLink);

		return NextResponse.json({ message: 'لینک بازیابی رمز عبور ارسال شد' }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در پردازش درخواست' }, { status: 500 });
	}
}
