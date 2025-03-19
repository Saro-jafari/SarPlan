import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
	try {
		const { data, error } = await supabase.from('users').select('*');
		if (error) {
			console.error('Supabase Error:', error); // چاپ جزئیات خطا
			return NextResponse.json({ message: 'خطا در گرفتن اطلاعات کاربران' }, { status: 500 });
		}
		return NextResponse.json({ users: data });
	} catch (error) {
		console.error('Server Error:', error); // چاپ جزئیات خطای سرور
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}
