import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return new Response(JSON.stringify({ error: 'ایمیل و رمز عبور باید وارد شوند.' }), { status: 400 });
		}

		// دریافت اطلاعات کاربر از پایگاه داده بر اساس ایمیل
		const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

		if (error || !user) {
			return new Response(JSON.stringify({ error: 'ایمیل یا رمز عبور اشتباه است.' }), { status: 401 });
		}

		// مقایسه رمز عبور وارد شده با رمز عبور ذخیره شده
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return new Response(JSON.stringify({ error: 'ایمیل یا رمز عبور اشتباه است.' }), { status: 401 });
		}

		// در اینجا می‌توانید توکن JWT یا سشن ایجاد کنید

		return new Response(
			JSON.stringify({
				message: 'ورود موفقیت‌آمیز!',
				user: { email: user.email, role: user.role }, // ارسال نقش کاربر
			}),
			{ status: 200 },
		);
	} catch (err) {
		console.error('Error during authentication:', err);
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}
