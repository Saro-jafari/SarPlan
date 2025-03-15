import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
	'b22a63cbf14f5df624cecde0565cad91f5cac7cfe2b14f6fbbe0bb5cb3d764676551a4e125a4a1830384048cf20099ace924f347159c85b2ddd8c44b8e6d7373';
console.log(JWT_SECRET, 'token');

export async function POST(req: Request) {
	try {
		// دریافت توکن از هدر درخواست
		const token = req.headers.get('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return new Response(JSON.stringify({ error: 'توکن JWT موجود نیست.' }), { status: 401 });
		}

		// بررسی صحت توکن و استخراج نقش کاربر
		let decoded: any;
		try {
			decoded = jwt.verify(token, JWT_SECRET);
		} catch (err) {
			return new Response(JSON.stringify({ error: 'توکن نامعتبر است.' }), { status: 401 });
		}

		// اگر کاربر ادمین نباشد، درخواست رد شود
		if (decoded.role !== 'admin') {
			return new Response(JSON.stringify({ error: 'شما مجوز لازم برای اضافه کردن کاربر جدید را ندارید.' }), { status: 403 });
		}

		// دریافت داده‌های کاربر جدید
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

		// بررسی صحت ایمیل
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
