'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false); // برای "مرا به خاطر بسپار"
	const [loading, setLoading] = useState(false); // وضعیت بارگذاری

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true); // شروع بارگذاری
		const toastId = toast.loading('در حال ورود...'); // نمایش لودینگ

		const res = await signIn('credentials', {
			redirect: false, // جلوگیری از ریدایرکت خودکار
			email,
			password,
			rememberMe,
		});

		setLoading(false); // اتمام بارگذاری
		toast.dismiss(toastId); // حذف لودینگ

		if (res?.error) {
			toast.error(res.error); // نمایش پیام خطا
		} else {
			toast.success('ورود موفقیت‌آمیز بود!');
			router.push('/dashboard');
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold text-center text-gray-700 mb-6">ورود به سیستم</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-600 py-2">
							ایمیل
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-600 py-2">
							رمز عبور
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="flex items-center">
						<input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="mx-2" />
						<label htmlFor="rememberMe" className="text-sm text-gray-600">
							مرا به خاطر بسپار
						</label>
					</div>
					<button
						type="submit"
						className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer">
						{loading ? 'در حال ورود...' : 'ورود'}
					</button>
				</form>
				<p className="my-6 text-sm text-center text-gray-600">
					اگر حساب کاربری ندارید، لطفاً با پشتیبانی تماس بگیرید:
					<br />
					<span className="block">
						<strong>تلفن:</strong>{' '}
						<a href="tel:09999845929" className="text-blue-500 hover:underline">
							09999845929
						</a>
					</span>
					<span className="block">
						<strong>ایمیل:</strong>{' '}
						<a href="mailto:Sarojafari2004@gmail.com" className="text-blue-500 hover:underline">
							Sarojafari2004@gmail.com
						</a>
					</span>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
