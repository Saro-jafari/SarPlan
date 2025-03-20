import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
	try {
		// دریافت توکن از هدر Authorization
		const authHeader = req.headers.get('Authorization');
		if (!authHeader) {
			return new Response(JSON.stringify({ error: 'توکن احراز هویت باید ارسال شود.' }), { status: 400 });
		}
		const token = authHeader.split(' ')[1];

		let decodedToken;
		try {
			decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
		} catch (error) {
			return new Response(JSON.stringify({ error: 'توکن معتبر نیست.' }), { status: 401 });
		}

		// دریافت اطلاعات کاربر از جدول users
		const { data: userData, error: userFetchError } = await supabase.from('users').select('role_id').eq('id', decodedToken.id).single();

		if (userFetchError || !userData) {
			return new Response(JSON.stringify({ error: 'کاربر یافت نشد.' }), { status: 404 });
		}

		// دریافت نام نقش کاربر از جدول roles
		const { data: roleData, error: roleFetchError } = await supabase.from('roles').select('name').eq('id', userData.role_id).single();

		if (roleFetchError || !roleData) {
			return new Response(JSON.stringify({ error: 'نقش کاربر یافت نشد.' }), { status: 404 });
		}

		const userRole = roleData.name;

		// فقط مدیر یا مالک می‌توانند کاربران جدید را ثبت کنند
		if (userRole !== 'admin' && userRole !== 'owner') {
			return new Response(JSON.stringify({ error: 'شما اجازه ثبت‌نام کاربر جدید را ندارید.' }), { status: 403 });
		}

		// دریافت داده‌ها از بدن درخواست
		const { email, password, role } = await req.json();

		// بررسی کامل فیلدهای وارد شده
		if (!email || !password || !role) {
			return new Response(JSON.stringify({ error: 'ایمیل، رمز عبور و نقش باید وارد شوند.' }), { status: 400 });
		}

		// بررسی وجود نقش در جدول roles
		const { data: roleInfo, error: roleError } = await supabase.from('roles').select('id').eq('name', role).single();
		if (roleError || !roleInfo) {
			return new Response(JSON.stringify({ error: 'نقش نامعتبر است.' }), { status: 400 });
		}

		const roleId = roleInfo.id;

		// بررسی وجود کاربر با این ایمیل
		const { data: existingUser, error: existingUserError } = await supabase.from('users').select('id').eq('email', email).single();

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'کاربری با این ایمیل قبلاً ثبت شده است.' }), { status: 400 });
		}

		if (existingUserError && existingUserError.code !== 'PGRST116') {
			return new Response(JSON.stringify({ error: 'خطا در بررسی کاربر.' }), { status: 500 });
		}

		// هش کردن رمز عبور
		const hashedPassword = await bcrypt.hash(password, 10);

		// ثبت کاربر جدید
		const { data: newUser, error: insertError } = await supabase
			.from('users')
			.insert([
				{
					email,
					password: hashedPassword,
					role_id: roleId,
					is_verified: false,
				},
			])
			.select()
			.single();

		if (insertError) {
			console.error('خطا در درج کاربر:', insertError);
			return new Response(JSON.stringify({ error: 'خطا در ثبت‌نام کاربر.', details: insertError.message }), { status: 500 });
		}

		// ارسال ایمیل به کاربر با اطلاعات ورود
		await sendUserCredentials(email, password);

		return new Response(
			JSON.stringify({
				message: 'کاربر با موفقیت ثبت شد. اطلاعات ورود به ایمیل او ارسال شد.',
				user: { email: newUser.email, role },
			}),
			{ status: 200 },
		);
	} catch (err) {
	
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}

// تابع ارسال ایمیل به کاربر
async function sendUserCredentials(email: string, password: string) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'حساب کاربری شما ایجاد شد',
		text: `مدیر برای شما یک حساب کاربری ایجاد کرده است.\n\nایمیل: ${email}\nرمز عبور: ${password}\n\nلطفاً پس از ورود، رمز عبور خود را تغییر دهید.`,
	};

	await transporter.sendMail(mailOptions);
}
