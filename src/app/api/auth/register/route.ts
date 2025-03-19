import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// تابع ثبت‌نام
export async function POST(req: Request) {
	try {
		const { email, password, role } = await req.json();

		// چک کردن پارامترهای ورودی
		if (!email || !password || !role) {
			return new Response(JSON.stringify({ error: 'ایمیل، رمز عبور و نقش باید وارد شوند.' }), { status: 400 });
		}

		// چک کردن نقش کاربر: فقط ادمین یا مالک می‌توانند کاربر جدید با نقش خاص بسازند
		if (role !== 'admin' && role !== 'owner' && role !== 'user') {
			return new Response(JSON.stringify({ error: 'نقش نامعتبر است.' }), { status: 400 });
		}

		// بررسی وجود کاربر با ایمیل مشابه
		const { data: existingUser, error: userError } = await supabase.from('users').select('*').eq('email', email).single();
		if (existingUser) {
			return new Response(JSON.stringify({ error: 'کاربر با این ایمیل قبلاً ثبت‌نام کرده است.' }), { status: 400 });
		}

		// هش کردن رمز عبور
		const hashedPassword = await bcrypt.hash(password, 10);

		// ذخیره کاربر جدید در پایگاه داده
		const { data: newUser, error: insertError } = await supabase
			.from('users')
			.insert([
				{
					email,
					password: hashedPassword,
					role, // نقش کاربر (ادمین، مالک، یا کاربر معمولی)
				},
			])
			.single();

		if (insertError) {
			return new Response(JSON.stringify({ error: 'خطا در ثبت‌نام کاربر.' }), { status: 500 });
		}

		// تولید توکن JWT برای کاربر جدید
		const token = jwt.sign(
			{ email: newUser.email, role: newUser.role, id: newUser.id },
			JWT_SECRET,
			{ expiresIn: '1d' }, // اعتبار توکن ۲۴ ساعت
		);

		const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict; ${
			process.env.NODE_ENV === 'production' ? 'Secure;' : ''
		}`;

		// بازگشت به همراه اطلاعات کاربر و توکن
		return new Response(
			JSON.stringify({
				message: 'ثبت‌نام موفقیت‌آمیز!',
				user: { email: newUser.email, role: newUser.role },
			}),
			{
				status: 200,
				headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
			},
		);
	} catch (err) {
		console.error('Error during registration:', err);
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}
