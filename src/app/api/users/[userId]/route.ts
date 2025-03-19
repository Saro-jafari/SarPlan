// pages/api/users/[userId].ts
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase'; // فرض بر این است که supabase تنظیم شده است

export async function GET({ params }: { params: { userId: string } }) {
	try {
		const { userId } = params; // دریافت userId از مسیر URL

		const { data, error } = await supabase.from('users').select('*').eq('id', userId).single(); // گرفتن اطلاعات کاربر خاص با استفاده از userId

		if (error) {
			return NextResponse.json({ message: 'خطا در گرفتن اطلاعات کاربر' }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 });
		}

		return NextResponse.json({ user: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}
