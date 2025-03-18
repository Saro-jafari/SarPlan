import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return new Response(JSON.stringify({ error: 'ایمیل و رمز عبور باید وارد شوند.' }), { status: 400 });
		}

		const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

		if (error || !user) {
			return new Response(JSON.stringify({ error: 'ایمیل یا رمز عبور اشتباه است.' }), { status: 401 });
		}

		// مقایسه رمز عبور وارد شده با رمز عبور ذخیره شده
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return new Response(JSON.stringify({ error: 'ایمیل یا رمز عبور اشتباه است.' }), { status: 401 });
		}

		// تولید توکن JWT با اطلاعات کاربر
		const token = jwt.sign(
			{ email: user.email, role: user.role, id: user.id },
			JWT_SECRET,
			{ expiresIn: '7d' }, // اعتبار توکن یک هفته
		);

		const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict; ${
			process.env.NODE_ENV === 'production' ? 'Secure;' : ''
		}`;

		return new Response(
			JSON.stringify({
				message: 'ورود موفقیت‌آمیز!',
				user: { email: user.email, role: user.role },
			}),
			{
				status: 200,
				headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
			},
		);
	} catch (err) {
		console.error('Error during authentication:', err);
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}
