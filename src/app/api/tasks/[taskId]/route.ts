// pages/api/tasks/[taskId].ts
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// گرفتن اطلاعات یک تسک خاص
export async function GET({ params }: { params: { taskId: string } }) {
	try {
		const { taskId } = params;
		const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single(); // پیدا کردن تسک خاص با `taskId`

		if (error) {
			return NextResponse.json({ message: 'خطا در گرفتن تسک' }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json({ message: 'تسک پیدا نشد' }, { status: 404 });
		}

		return NextResponse.json({ task: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}

// به‌روزرسانی وضعیت تسک
export async function PUT({ params, request }: { params: { taskId: string }; request: Request }) {
	try {
		const { taskId } = params;
		const { status } = await request.json();

		if (!status) {
			return NextResponse.json({ message: 'وضعیت تسک الزامی است.' }, { status: 400 });
		}

		const { data, error } = await supabase.from('tasks').update({ status }).eq('id', taskId).single(); // به‌روزرسانی وضعیت تسک

		if (error) {
			return NextResponse.json({ message: 'خطا در به‌روزرسانی تسک' }, { status: 500 });
		}

		return NextResponse.json({ message: 'وضعیت تسک با موفقیت به‌روزرسانی شد', task: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}

// حذف یک تسک خاص
export async function DELETE({ params }: { params: { taskId: string } }) {
	try {
		const { taskId } = params;

		const { data, error } = await supabase.from('tasks').delete().eq('id', taskId).single(); // حذف تسک با `taskId`

		if (error) {
			return NextResponse.json({ message: 'خطا در حذف تسک' }, { status: 500 });
		}

		return NextResponse.json({ message: 'تسک با موفقیت حذف شد' });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}
