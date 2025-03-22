import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';

export async function POST(req: Request) {
	try {
		const { token, password } = await req.json();

		if (!token || !password) {
			return NextResponse.json({ message: 'اطلاعات ناقص است' }, { status: 400 });
		}

		const { data: user, error } = await supabase.from('users').select('id, reset_expires').eq('reset_token', token).single();

		if (error || !user) {
			console.log('⛔ User not found or error in query:', error);
			return NextResponse.json({ message: 'توکن نامعتبر است' }, { status: 400 });
		}

		console.log('📌 User from DB:', user);
		console.log('📌 Token Expiration (from DB):', user.reset_expires);
		console.log('📌 Current Time:', moment.tz('Asia/Tehran').format());

		// استفاده از moment برای تبدیل زمان انقضا و زمان فعلی به وقت تهران
		const tokenExpiration = moment.tz(user.reset_expires, 'Asia/Tehran').valueOf();
		const currentTime = moment.tz('Asia/Tehran').valueOf();

		console.log('📌 Token Expiration (MS):', tokenExpiration);
		console.log('📌 Current Time (MS):', currentTime);

		if (tokenExpiration < currentTime) {
			console.log('⛔ Token Expired!');
			return NextResponse.json({ message: 'توکن منقضی شده است' }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const { error: updateError } = await supabase
			.from('users')
			.update({
				password: hashedPassword,
				reset_token: null,
				reset_expires: null,
			})
			.eq('id', user.id);

		if (updateError) {
			console.log('⛔ Error updating user:', updateError);
			return NextResponse.json({ message: 'خطا در به‌روزرسانی رمز عبور' }, { status: 500 });
		}

		console.log('✅ Password updated successfully for user:', user.id);
		return NextResponse.json({ message: 'رمز عبور با موفقیت تغییر کرد' }, { status: 200 });
	} catch (error) {
		console.log('⛔ Unexpected error:', error);
		return NextResponse.json({ message: 'خطا در پردازش درخواست' }, { status: 500 });
	}
}
