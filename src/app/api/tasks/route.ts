// pages/api/tasks/index.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// گرفتن همه تسک‌ها
export async function GET() {
	try {
		const { data, error } = await supabase.from('tasks').select('*');
		if (error) {
			return NextResponse.json({ message: 'خطا در گرفتن تسک‌ها' }, { status: 500 });
		}
		return NextResponse.json({ tasks: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}

// افزودن یک تسک جدید
export async function POST(req: Request) {
	try {
		const { title, description, user_id } = await req.json();

		if (!title || !description || !user_id) {
			return NextResponse.json({ message: 'عنوان، توضیحات و شناسه کاربری الزامی است.' }, { status: 400 });
		}

		const { data, error } = await supabase.from('tasks').insert([
			{
				title,
				description,
				user_id,
			},
		]);

		if (error) {
			return NextResponse.json({ message: 'خطا در اضافه کردن تسک' }, { status: 500 });
		}

		return NextResponse.json({ message: 'تسک با موفقیت اضافه شد', task: data[0] }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}
