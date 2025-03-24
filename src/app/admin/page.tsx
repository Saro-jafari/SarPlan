'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/serverActions';

import UsersTable from '@/components/UsersTable';

interface User {
	id: string;
	email: string;
	is_verified: boolean;
	role_id: string;
}

export default function Users() {
	const [newUserEmail, setNewUserEmail] = useState<string>('');
	const [newUserRole, setNewUserRole] = useState<string>('user');
	const [newUserPassword, setNewUserPassword] = useState<string>('');
	const [recoveryEmail, setRecoveryEmail] = useState<string>('');
	const { user, loading } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		if (loading) return;
		if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
			router.push('/login');
			toast.error('دسترسی غیرمجاز');
		} else {
			const fetchUsers = async () => {
				const loadingToast = toast.loading('در حال بارگذاری کاربران...');
				try {
					const response = await fetch('/api/users');
					const data = await response.json();
					if (!response.ok) {
						toast.error(data.error || 'خطا در بارگیری لیست کاربران');
					} else if (data.users) {
						setUsers(data.users);
						toast.success('اطلاعات کاربران با موفقیت بارگذاری شد.');
					}
				} catch (error) {
					toast.error('خطا در برقراری ارتباط با سرور');
				}
				toast.dismiss(loadingToast);
			};
			fetchUsers();
		}
	}, [user, loading, router]);
	console.log(newUserRole, 'role');
	const handleCreateUser = async () => {
		if (!newUserEmail || !newUserPassword || !newUserRole) {
			toast.error('لطفاً تمام فیلدها را پر کنید');
			return;
		}

		const loadingCreate = toast.loading('در حال ثبت کاربر جدید...');
		try {
			const token = await getCookie();
			if (!token) {
				toast.error('توکن احراز هویت موجود نیست.');
				return;
			}

			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					email: newUserEmail,
					password: newUserPassword,
					role: newUserRole,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || data.message || 'خطایی رخ داده است.');
			} else {
				setUsers(prev => [...prev, data]);
				setNewUserEmail('');
				setNewUserPassword('');
				setNewUserRole('user');
				toast.success(data.message);
			}
		} catch (error: any) {
			toast.error(error.message || 'خطا در ارسال درخواست');
		} finally {
			toast.dismiss(loadingCreate);
		}
	};

	const handlePasswordRecovery = async () => {
		if (!recoveryEmail) {
			toast.error('لطفاً ایمیل خود را وارد کنید');
			return;
		}

		const loadingRecovery = toast.loading('در حال ارسال درخواست بازیابی رمز...');
		try {
			const response = await fetch('/api/resetPassword/request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: recoveryEmail }),
			});
			const data = await response.json();
			if (!response.ok) {
				toast.error(data.error || data.message || 'خطایی رخ داده است.');
			} else {
				toast.success(data.message || 'ایمیل بازیابی رمز ارسال شد.');
			}
		} catch (error: any) {
			toast.error(error.message || 'خطا در ارسال درخواست');
		} finally {
			toast.dismiss(loadingRecovery);
		}
	};
	const handleDelete = async (id: string) => {
		const loadingDelete = toast.loading('در حال حذف کاربر...');
		try {
			const response = await fetch(`/api/users/${id}`, {
				method: 'DELETE',
			});
			console.log(response, 'res');
			if (response.ok) {
				setUsers(prev => prev.filter(user => user.id !== id));
				toast.success('کاربر با موفقیت حذف شد.');
			} else {
				const data = await response.json();
				toast.error(data.message || 'خطا در حذف کاربر');
			}
		} catch (error) {
			toast.error('خطا در حذف کاربر');
		} finally {
			toast.dismiss(loadingDelete);
		}
	};

	const handleToggleActive = async (id, currentStatus) => {
		// 🔄 نمایش لودینگ
		const loadingToast = toast.loading('در حال به‌روزرسانی وضعیت...');

		// معکوس کردن وضعیت (true به false و بالعکس)
		const newStatus = currentStatus === true ? false : true;

		try {
			const res = await fetch(`/api/users/${id}/status`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			});

			const data = await res.json(); // دریافت پیام از سرور

			// ❌ بستن لودینگ
			toast.dismiss(loadingToast);

			if (res.ok) {
				// به‌روزرسانی وضعیت کاربر در لیست
				setUsers(prevUsers => prevUsers.map(user => (user.id === id ? { ...user, status: newStatus } : user)));
				toast.success(data.message); // ✅ پیام موفقیت
			} else {
				toast.error(data.message); // ❌ پیام خطا از سرور
			}
		} catch (error) {
			toast.dismiss(loadingToast); // ❌ بستن لودینگ
			toast.error('خطای شبکه! لطفاً اتصال خود را بررسی کنید'); // 🌐 پیام خطای ارتباطی
		}
	};

	return (
		<>
			{loading ? (
				<div className="bg-white h-screen">loading</div>
			) : (
				<div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
					<div className="flex-1 p-6 h-full">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">مدیریت کاربران</h1>
						<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* فرم ثبت‌نام کاربر جدید */}
							<div className="p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-600">
								<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">ثبت‌نام کاربر جدید</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<label htmlFor="email-new" className="block text-gray-600 dark:text-gray-300">
											ایمیل
										</label>
										<input
											id="email-new"
											type="email"
											value={newUserEmail}
											onChange={e => setNewUserEmail(e.target.value)}
											className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="ایمیل کاربر جدید"
										/>
									</div>
									<div>
										<label htmlFor="password-new" className="block text-gray-600 dark:text-gray-300">
											رمز عبور
										</label>
										<input
											id="password-new"
											type="password"
											value={newUserPassword}
											onChange={e => setNewUserPassword(e.target.value)}
											className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="رمز عبور کاربر جدید"
										/>
									</div>
									<div>
										<label htmlFor="role-new" className="block text-gray-600 dark:text-gray-300">
											نقش
										</label>
										<select
											id="role-new"
											value={newUserRole}
											onChange={e => setNewUserRole(e.target.value)}
											className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
											<option value="user">کاربر</option>
											<option value="admin">مدیر</option>
											<option value="owner">مالک</option>
										</select>
									</div>
									<div className="col-span-2">
										<button
											onClick={handleCreateUser}
											className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
											ثبت‌نام
										</button>
									</div>
								</div>
							</div>

							{/* فرم بازیابی رمز عبور */}
							<div className="p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-600">
								<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">بازیابی رمز عبور</h2>
								<div>
									<label htmlFor="email-recovery" className="block text-gray-600 dark:text-gray-300">
										ایمیل
									</label>
									<input
										id="email-recovery"
										type="email"
										value={recoveryEmail}
										onChange={e => setRecoveryEmail(e.target.value)}
										className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="ایمیل برای بازیابی رمز عبور"
									/>
								</div>
								<div className="mt-4">
									<button
										onClick={handlePasswordRecovery}
										className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
										بازیابی رمز عبور
									</button>
								</div>
							</div>
						</section>

						{/* لیست کاربران */}
						<section className="mt-6">
							<UsersTable data={users} handleDelete={handleDelete} handleToggleActive={handleToggleActive} />
						</section>
					</div>
				</div>
			)}
		</>
	);
}
