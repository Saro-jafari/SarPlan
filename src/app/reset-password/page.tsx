'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
	const router = useRouter();
	const { token } = router.query;

	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await fetch('/api/resetPassword/reset', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, password }),
		});

		const data = await res.json();
		setMessage(data.message);

		if (res.ok) {
			setTimeout(() => router.push('/login'), 3000);
		}
	};

	return (
		<div>
			<h2>تعیین رمز جدید</h2>
			{message && <p>{message}</p>}
			<form onSubmit={handleSubmit}>
				<input type="password" placeholder="رمز جدید" value={password} onChange={e => setPassword(e.target.value)} required />
				<button type="submit">تغییر رمز</button>
			</form>
		</div>
	);
}
