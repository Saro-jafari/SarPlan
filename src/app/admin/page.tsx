'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/serverActions';
import { deleteUser } from '@/services/userService';
import UsersTable from '@/components/UsersTable';

interface User {
	id: string;
	email: string;
	role: string;
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

	// Handle deleting a user
	const handleDelete = async (id: string) => {
		const loadingDelete = toast.loading('در حال حذف کاربر...');
		try {
			const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
			if (response.ok) {
				setUsers(prev => prev.filter(user => user.id !== id));
				toast.success('کاربر با موفقیت حذف شد.');
			} else {
				const data = await response.json();
				toast.error(data.error || 'خطا در حذف کاربر');
			}
		} catch (error) {
			toast.error('خطا در حذف کاربر');
		} finally {
			toast.dismiss(loadingDelete);
		}
	};

	const handleToggleActive = async (id, newStatus) => {
		try {
			const res = await fetch(`/api/users/${id}/status`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			});

			if (res.ok) {
				setUsers(prevUsers => prevUsers.map(user => (user.id === id ? { ...user, status: newStatus } : user)));
			} else {
				console.error('Failed to update user status');
			}
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	return (
		<>
			{loading ? (
				<div className="bg-white h-screen">loading</div>
			) : (
				<div className="flex min-h-screen dark:bg-[#677185]">
					<div className="flex-1 p-6">
						<h1 className="text-3xl font-bold text-black dark:text-white mb-6">مدیریت کاربران</h1>
						<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* فرم ثبت‌نام کاربر جدید */}
							<div className="mt-6 mb-4 p-6 bg-[#939599] rounded-lg shadow-md border border-gray-200">
								<h2 className="text-xl font-semibold mb-4 text-gray-700">ثبت‌نام کاربر جدید</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div className="mb-4">
										<label htmlFor="email-new" className="block text-gray-600">
											ایمیل
										</label>
										<input
											id="email-new"
											type="email"
											value={newUserEmail}
											onChange={e => setNewUserEmail(e.target.value)}
											className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="ایمیل کاربر جدید"
										/>
									</div>
									<div className="mb-4">
										<label htmlFor="password-new" className="block text-gray-600">
											رمز عبور
										</label>
										<input
											id="password-new"
											type="password"
											value={newUserPassword}
											onChange={e => setNewUserPassword(e.target.value)}
											className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="رمز عبور کاربر جدید"
										/>
									</div>
									<div className="mb-4">
										<label htmlFor="role-new" className="block text-gray-600 cursor-pointer">
											نقش
										</label>
										<select
											id="role-new"
											value={newUserRole}
											onChange={e => setNewUserRole(e.target.value)}
											className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
											<option value="user">کاربر</option>
											<option value="admin">مدیر</option>
											<option value="owner">مالک</option>
										</select>
									</div>
									<div className="mb-4 col-span-2">
										<button
											onClick={handleCreateUser}
											className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
											ثبت‌نام
										</button>
									</div>
								</div>
							</div>

							{/* فرم بازیابی رمز عبور */}
							<div className="mt-6 mb-4 p-6 bg-[#939599] rounded-lg shadow-md border border-gray-200">
								<h2 className="text-xl font-semibold mb-4 text-gray-700">بازیابی رمز عبور</h2>
								<div className="mb-4">
									<label htmlFor="email-recovery" className="block text-gray-600">
										ایمیل
									</label>
									<input
										id="email-recovery"
										type="email"
										value={recoveryEmail}
										onChange={e => setRecoveryEmail(e.target.value)}
										className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="ایمیل برای بازیابی رمز عبور"
									/>
								</div>
								<div className="mb-4">
									<button
										onClick={handlePasswordRecovery}
										className="w-full py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
										بازیابی رمز عبور
									</button>
								</div>
							</div>

							{/* لیست کاربران */}
							<UsersTable data={users} handleDelete={handleDelete} handleToggleActive={handleToggleActive} />
						</section>
					</div>
				</div>
			)}
		</>
	);
}
