'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		setError('');

		try {
			const res = await fetch('/api/resetPassword/reset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password }),
			});
			const data = await res.json();
			if (res.ok) {
				setMessage('رمز عبور شما با موفقیت تغییر یافت.');
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError('مشکلی پیش آمده، دوباره امتحان کنید.');
		}
		setLoading(false);
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-4 text-center">تغییر رمز عبور</h2>
			<p className="text-center text-gray-600 mb-6">رمز عبور جدید خود را وارد کنید.</p>
			<form onSubmit={handleSubmit}>
				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="رمز عبور جدید"
					required
					className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
				/>
				{message && <div className="mb-4 text-green-600">{message}</div>}
				{error && <div className="mb-4 text-red-600">{error}</div>}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
					{loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
				</button>
			</form>
		</div>
	);
}
