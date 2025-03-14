import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase'; // فرض بر این است که supabase تنظیم شده است

export async function GET() {
	try {
		const { data, error } = await supabase.from('users').select('*');
		if (error) {
			return NextResponse.json({ message: 'خطا در گرفتن اطلاعات کاربران' }, { status: 500 });
		}
		return NextResponse.json({ users: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}
