import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';

// تعریف نوع برای اطلاعات کاربر در توکن
interface CustomUser extends User {
	role: string; // اضافه کردن نقش به نوع کاربر
}

interface CustomSession extends Session {
	user: CustomUser; // اضافه کردن نقش به سشن
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async credentials => {
				if (!credentials?.email || !credentials?.password) {
					console.error('Missing email or password');
					return null; // ورودی ناقص
				}

				const { email, password } = credentials;

				// پیدا کردن کاربر با ایمیل
				const { data: user, error } = await supabase
					.from('users')
					.select('id, email, password, role') // role نیز باید از دیتابیس گرفته شود
					.eq('email', email)
					.single();

				// اگر خطایی در دریافت کاربر رخ دهد
				if (error || !user) {
					console.error('Error finding user: ', error);
					return null; // کاربر پیدا نشد
				}

				// بررسی رمز عبور
				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) {
					console.error('Invalid password');
					return null; // رمز عبور نادرست
				}

				// برگشت کاربر با نقش
				return {
					id: user.id,
					email: user.email,
					role: user.role, // اضافه کردن نقش کاربر
				} as CustomUser;
			},
		}),
	],
	pages: {
		signIn: '/login', // مسیر صفحه لاگین
	},
	session: {
		strategy: 'jwt', // استفاده از JWT برای مدیریت سشن
	},
	callbacks: {
		async jwt({ token, user }) {
			// بررسی اینکه کاربر وارد شده باشد
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.role = user.role; // نقش را نیز به توکن اضافه می‌کنیم
			}
			return token;
		},
		async session({ session, token }) {
			if (session && token) {
				session.user.id = token.id as number;
				session.user.email = token.email as string;
				session.user.role = token.role as string;
			}
			return session as CustomSession;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
