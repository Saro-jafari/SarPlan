'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			setMessage('توکن معتبر نیست.');
			setError(true);
			return;
		}

		const res = await fetch('/api/resetPassword/reset', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, password }),
		});

		const data = await res.json();
		setMessage(data.message);
		setError(!res.ok);

		if (res.ok) {
			setTimeout(() => router.push('/admin'), 3000);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-lg rounded-lg p-6 w-96">
				<h2 className="text-xl font-semibold text-gray-700 text-center mb-4">تعیین رمز جدید</h2>
				{message && <p className={`text-sm text-center mb-3 ${error ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
				<form onSubmit={handleSubmit} className="flex flex-col">
					<input
						type="password"
						placeholder="رمز جدید"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
					/>
					<button type="submit" className="bg-blue-500 text-white py-2 mt-4 rounded-md hover:bg-blue-600 transition-all">
						تغییر رمز
					</button>
				</form>
			</div>
		</div>
	);
}
