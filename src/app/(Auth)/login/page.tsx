'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoginLayout from '../../(main)/layout';
import Image from 'next/image';

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

		const res = await signIn('credentials', {
			redirect: false,
			email,
			password,
			rememberMe,
		});

		setLoading(false);
		toast.dismiss(toastId);

		if (res?.error) {
			toast.error(res.error);
		} else {
			toast.success('ورود موفقیت‌آمیز بود!');
			router.push('/dashboard');
		}
	};

	return (
		<LoginLayout>
			<div className="grid md:grid-cols-2 md:min-h-screen md:w-screen ">
				{/* فرم لاگین */}
				<div className="flex justify-center items-center bg-[#f9f9f9] dark:bg-transparent text-[#262728] ">
					<div className="w-full max-w-lg p-8  rounded-lg">
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
									className="w-full px-4 py-3 rounded-lg text-[#4F555A] bg-[#EAF0F7]  border-white border-3 focus:border-[#4461F2] focus:outline-none "
								/>
							</div>
							<div>
								<label htmlFor="password" className="block text-sm font-medium  dark:text-white py-2">
									رمز عبور
								</label>
								<input
									type="password"
									id="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
									className="w-full px-4 py-3 rounded-lg text-[#4F555A] bg-[#EAF0F7]  border-white border-3 focus:border-[#4461F2] focus:outline-none"
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
								className="w-full py-3  text-white rounded-lg transition duration-300 cursor-pointer bg-[#4461f2] shadow-lg hover:shadow-xl">
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

				{/* تصویر */}
				<div className="hidden md:flex ">
					<Image src="/Picture.svg" height={400} width={400} alt="img" className="max-w-full h-auto" />
				</div>
			</div>
		</LoginLayout>
	);
};

export default LoginPage;
