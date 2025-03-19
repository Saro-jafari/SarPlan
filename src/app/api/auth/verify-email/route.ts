import { supabase } from '@/utils/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'متد درخواست نامعتبر است.' });
	}

	const { token } = req.query;

	if (!token) {
		return res.status(400).json({ error: 'توکن درخواست شده موجود نیست.' });
	}

	try {
		// تایید توکن JWT
		const decoded = jwt.verify(token, JWT_SECRET);

		// جستجو کاربر با ایمیل یا ID موجود در توکن
		const { data: user, error } = await supabase.from('users').select('*').eq('email', decoded.email).single();

		if (error || !user) {
			return res.status(404).json({ error: 'کاربر پیدا نشد.' });
		}

		// اگر ایمیل قبلاً تایید شده باشد
		if (user.is_verified) {
			return res.status(200).json({ message: 'ایمیل شما قبلاً تایید شده است.' });
		}

		// به‌روزرسانی وضعیت تایید ایمیل کاربر
		const { error: updateError } = await supabase.from('users').update({ is_verified: true }).eq('email', decoded.email);

		if (updateError) {
			return res.status(500).json({ error: 'خطا در به‌روزرسانی وضعیت تایید ایمیل.' });
		}

		return res.status(200).json({ message: 'ایمیل شما با موفقیت تایید شد.' });
	} catch (error) {
		return res.status(400).json({ error: 'توکن معتبر نیست.' });
	}
}
