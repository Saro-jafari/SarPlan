'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Navbar from '@/components/NavBar';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const toastId = toast.loading('در حال ورود...');

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error);
				return;
			}
			console.log('Navigating to /admin');

			router.push('/admin');

			// 🔹 بعد نمایش پیام موفقیت
			toast.success(data.message);
		} catch (error) {
			console.error('Error during login:', error);
			toast.error(error.message);
		} finally {
			setLoading(false);
			toast.dismiss(toastId);
		}
	};

	return (
		<div className="overflow-x-hidden">
			<Navbar />
			<div className="grid md:grid-cols-2 md:min-h-screen md:w-screen w-full h-screen dark:bg-[#14162E] bg-[#FFF] text-[#000] dark:text-[#fff] ">
				{/* فرم لاگین */}
				<div className="flex justify-center items-center bg-[#f9f9f9] dark:bg-transparent text-[#262728] ">
					<div className="w-full max-w-lg p-8 rounded-lg">
						<h1 className="text-3xl font-bold text-center mb-6 dark:text-white">ورود به سیستم</h1>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-secondary dark:text-white py-2">
									ایمیل
								</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
									className="w-full px-4 py-3 rounded-lg text-[#4F555A] bg-[#EAF0F7] border-white border-3 focus:border-[#4461F2] focus:outline-none"
								/>
							</div>
							<div>
								<label htmlFor="password" className="block text-sm font-medium dark:text-white py-2">
									رمز عبور
								</label>
								<input
									type="text"
									id="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
									className="w-full px-4 py-3 rounded-lg text-[#4F555A] bg-[#EAF0F7] border-white border-3 focus:border-[#4461F2] focus:outline-none "
								/>
							</div>
							<div className="flex items-center">
								<input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="mx-2" />
								<label htmlFor="rememberMe" className="text-sm dark:text-white cursor-pointer">
									مرا به خاطر بسپار
								</label>
							</div>
							<button
								type="submit"
								className="w-full py-3 text-white rounded-lg transition duration-300 cursor-pointer bg-[#4461f2] shadow-lg hover:shadow-xl">
								{loading ? 'در حال ورود...' : 'ورود'}
							</button>
						</form>
						<p className="my-6 text-sm text-center text-secondary font-semibold dark:text-white">
							اگر حساب کاربری ندارید، لطفاً با پشتیبانی تماس بگیرید:
							<br />
							<span className="block">
								<strong>تلفن:</strong>{' '}
								<a href="tel:09999845929" className="font-bold dark:text-white hover:underline">
									09999845929
								</a>
							</span>
							<span className="block">
								<strong>ایمیل:</strong>{' '}
								<a href="mailto:Sarojafari2004@gmail.com" className="font-medium dark:text-white hover:underline">
									Sarojafari2004@gmail.com
								</a>
							</span>
						</p>
					</div>
				</div>

				{/* بخش تصویر */}
				<div className="hidden md:flex bg-[#f9f9f9] dark:bg-transparent">
					<Image src="/Picture.svg" height={400} width={400} alt="img" className="max-w-full h-auto" loading="lazy" />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
