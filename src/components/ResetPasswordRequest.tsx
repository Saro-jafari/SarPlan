'use client';
import { useState } from 'react';

export default function ResetPasswordRequest() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		setError('');

		try {
			const res = await fetch('/api/resetPassword/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (res.ok) {
				setMessage(data.message);
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
			<h2 className="text-2xl font-bold mb-4 text-center">بازیابی رمز عبور</h2>
			<p className="text-center text-gray-600 mb-6">ایمیل خود را وارد کنید تا لینک بازیابی برای شما ارسال شود.</p>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="ایمیل"
					required
					className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
				/>
				{message && <div className="mb-4 text-green-600">{message}</div>}
				{error && <div className="mb-4 text-red-600">{error}</div>}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
					{loading ? 'در حال ارسال...' : 'ارسال لینک'}
				</button>
			</form>
		</div>
	);
}
