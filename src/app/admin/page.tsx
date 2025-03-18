'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface User {
	id: string;
	email: string;
	role: string;
}

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [newUserEmail, setNewUserEmail] = useState<string>('');
	const [newUserRole, setNewUserRole] = useState<string>('user');
	const [newUserPassword, setNewUserPassword] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		async function fetchUsers() {
			setIsLoading(true);
			try {
				const response = await fetch('/api/users');
				const data = await response.json();

				if (!response.ok) {
					toast.error(data.error || 'خطا در بارگیری لیست کاربران');
				} else if (data.users) {
					setUsers(data.users);
				}
			} catch (error) {
				toast.error('خطا در برقراری ارتباط با سرور');
			}
			setIsLoading(false);
		}
		fetchUsers();
	}, []);

	const deleteUser = async (id: string) => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/users/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});
			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || 'خطا در حذف کاربر');
			} else {
				setUsers(prev => prev.filter(user => user.id !== id)); // حذف بدون رفرش
				toast.success('کاربر با موفقیت حذف شد');
			}
		} catch (error) {
			toast.error('خطا در حذف کاربر');
		}
		setIsLoading(false);
	};

	const handleCreateUser = async () => {
		if (!newUserEmail || !newUserPassword || !newUserRole) {
			toast.error('لطفاً تمام فیلدها را پر کنید');
			return;
		}

		setIsLoading(true);

		// ارسال درخواست به بک‌اند برای ثبت کاربر جدید
		try {
			const response = await fetch('/api/users/add-user', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: newUserEmail,
					password: newUserPassword,
					role: newUserRole,
				}),
			});
			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || 'خطا در ثبت نام کاربر جدید');
			} else {
				// به‌روزرسانی لیست کاربران با کاربر جدید
				setUsers(prev => [...prev, data]);
				setNewUserEmail('');
				setNewUserPassword('');
				setNewUserRole('user');
				toast.success('کاربر جدید با موفقیت ثبت شد!');
			}
		} catch (error) {
			toast.error('خطا در ارسال درخواست');
		}

		setIsLoading(false);
	};

	return (
		<div className="flex min-h-screen dark:bg-[#677185]">
			<div className="flex-1 p-6">
				<h1 className="text-3xl font-bold text-black dark:text-white mb-6">مدیریت کاربران</h1>
				{/* Form to add a new user */}
				<div className="mt-6 mb-4 p-6 bg-[#939599] rounded-lg shadow-md border border-gray-200">
					<h2 className="text-xl font-semibold mb-4 text-gray-700 ">ثبت‌نام کاربر جدید</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="mb-4">
							<label htmlFor="email" className="block text-gray-600">
								ایمیل
							</label>
							<input
								id="email"
								type="email"
								value={newUserEmail}
								onChange={e => setNewUserEmail(e.target.value)}
								className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="ایمیل کاربر جدید"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="password" className="block text-gray-600">
								رمز عبور
							</label>
							<input
								id="password"
								type="password"
								value={newUserPassword}
								onChange={e => setNewUserPassword(e.target.value)}
								className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="رمز عبور کاربر جدید"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="role" className="block text-gray-600 cursor-pointer">
								نقش
							</label>
							<select
								id="role"
								value={newUserRole}
								onChange={e => setNewUserRole(e.target.value)}
								className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
								<option value="user">کاربر</option>
								<option value="admin">مدیر</option>
							</select>
						</div>
					</div>
					<button
						onClick={handleCreateUser}
						className="mt-6 px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 cursor-pointer">
						ثبت
					</button>
				</div>

				{/* Users Table */}
				<div className="overflow-x-auto mt-6">
					<table className="min-w-full table-auto border-separate border-spacing-0 border border-gray-300">
						<thead className="bg-blue-50">
							<tr>
								<th className="p-4 text-right text-sm font-medium text-gray-600">ایمیل</th>
								<th className="p-4 text-right text-sm font-medium text-gray-600">نقش</th>
								<th className="p-4 text-right text-sm font-medium text-gray-600">عملیات</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id} className="hover:bg-blue-50">
									<td className="p-4 text-sm text-gray-700 border-t border-gray-200">{user.email}</td>
									<td className="p-4 text-sm text-gray-700 border-t border-gray-200">{user.role}</td>
									<td className="p-4 text-sm text-gray-700 border-t border-gray-200">
										<button
											className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition cursor-pointer"
											onClick={() => deleteUser(user.id)}>
											حذف
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
