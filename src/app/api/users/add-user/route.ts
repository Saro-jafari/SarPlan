import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
	try {
		// دریافت داده‌ها از درخواست
		const { email, password, role } = await req.json();

		// بررسی وجود کاربر با همین ایمیل
		const { data: existingUser, error: existingUserError } = await supabase.from('users').select('*').eq('email', email).single();

		if (existingUserError && existingUserError.code !== 'PGRST116') {
			return new Response(JSON.stringify({ error: 'خطا در بررسی وجود کاربر قبلی.' }), { status: 500 });
		}

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'این ایمیل قبلاً ثبت شده است.' }), { status: 400 });
		}

		// بررسی صحت داده‌ها (ایمیل و رمز عبور و نقش)
		if (!email || !password || !role) {
			return new Response(JSON.stringify({ error: 'لطفاً تمام فیلدها را پر کنید.' }), { status: 400 });
		}

		// بررسی صحت ایمیل (در صورت لزوم)
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(email)) {
			return new Response(JSON.stringify({ error: 'فرمت ایمیل وارد شده اشتباه است.' }), { status: 400 });
		}

		// هش کردن رمز عبور
		const hashedPassword = await bcrypt.hash(password, 10);

		// ذخیره اطلاعات کاربر جدید در دیتابیس
		const { data, error } = await supabase.from('users').insert([{ email, password: hashedPassword, role }]);

		if (error) {
			return new Response(JSON.stringify({ error: 'خطا در ثبت کاربر جدید.' }), { status: 500 });
		}

		// بازگشت پیام موفقیت
		return new Response(JSON.stringify({ message: 'کاربر با موفقیت ثبت شد!' }), { status: 201 });
	} catch (error) {
		// اگر خطای غیرمنتظره‌ای پیش آمد
		return new Response(JSON.stringify({ error: 'خطا در انجام درخواست' }), { status: 500 });
	}
}
