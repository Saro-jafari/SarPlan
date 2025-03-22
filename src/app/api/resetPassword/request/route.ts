import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { sendEmail } from '@/utils/emailService';
import crypto from 'crypto';
import moment from 'moment-timezone';

export async function POST(req: Request) {
	try {
		const { email } = await req.json();
		if (!email) {
			return NextResponse.json({ message: 'ایمیل را وارد کنید' }, { status: 400 });
		}

		const { data: user, error } = await supabase.from('users').select('id').eq('email', email).single();
		if (error || !user) {
			return NextResponse.json({ message: 'کاربری با این ایمیل یافت نشد' }, { status: 404 });
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		// محاسبه زمان انقضا به وقت ایران (با آفلود +03:30) به مدت 1 ساعت
		const expiresAt = moment().tz('Asia/Tehran').add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

		await supabase
			.from('users')
			.update({
				reset_token: resetToken,
				reset_expires: expiresAt,
			})
			.eq('id', user.id);

		const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
		await sendEmail(email, resetLink);

		return NextResponse.json({ message: 'لینک بازیابی رمز عبور ارسال شد' }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در پردازش درخواست' }, { status: 500 });
	}
}
