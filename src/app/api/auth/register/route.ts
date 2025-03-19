import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
	try {
		const { email, password, role } = await req.json();

		if (!email || !password || !role) {
			return new Response(JSON.stringify({ error: 'ایمیل، رمز عبور و نقش باید وارد شوند.' }), { status: 400 });
		}

		// بررسی وجود نقش در جدول roles
		const { data: roleData, error: roleError } = await supabase.from('roles').select('id').eq('name', role).single();

		if (roleError || !roleData) {
			return new Response(JSON.stringify({ error: 'نقش نامعتبر است.' }), { status: 400 });
		}

		const roleId = roleData.id;

		// بررسی وجود کاربر با ایمیل مشابه
		const { data: existingUser, error: userError } = await supabase.from('users').select('*').eq('email', email).single();
		if (userError) {
			return new Response(JSON.stringify({ error: 'خطا در دریافت اطلاعات کاربر.' }), { status: 500 });
		}

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'کاربر با این ایمیل قبلاً ثبت‌نام کرده است.' }), { status: 400 });
		}

		// هش کردن رمز عبور
		const hashedPassword = await bcrypt.hash(password, 10);

		// ذخیره کاربر جدید در پایگاه داده با role_id
		const { data: newUser, error: insertError } = await supabase
			.from('users')
			.insert([
				{
					email,
					password: hashedPassword,
					role_id: roleId, // استفاده از role_id به جای role
					is_verified: false, // ایمیل تایید نشده است
				},
			])
			.single();

		if (insertError) {
			return new Response(JSON.stringify({ error: 'خطا در ثبت‌نام کاربر.' }), { status: 500 });
		}

		// تولید توکن تایید ایمیل
		const verificationToken = jwt.sign({ email: newUser.email, id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });

		// ارسال ایمیل تایید
		await sendVerificationEmail(newUser.email, verificationToken);

		return new Response(
			JSON.stringify({
				message: 'ثبت‌نام موفقیت‌آمیز! لطفاً ایمیل خود را تایید کنید.',
				user: { email: newUser.email, role: role }, // می‌توانید نقش را به صورت متنی برگردانید
			}),
			{ status: 200 },
		);
	} catch (err) {
		console.error('Error during registration:', err);
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}

async function sendVerificationEmail(email: string, token: string) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const verificationUrl = `http://localhost:3000/api/verify-email?token=${token}`;

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'تایید ایمیل برای ثبت‌نام',
		text: `برای تایید ثبت‌نام خود، لطفاً بر روی لینک زیر کلیک کنید: ${verificationUrl}`,
	};

	await transporter.sendMail(mailOptions);
}
