import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// گرفتن اطلاعات یک دسته‌بندی خاص با شناسه categoryId
export async function GET({ params }: { params: { categoryId: string } }) {
	try {
		const { categoryId } = params;
		const { data, error } = await supabase.from('categories').select('id, name').eq('id', categoryId).single();

		if (error) {
			return NextResponse.json({ message: 'خطا در گرفتن دسته‌بندی' }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json({ message: 'دسته‌بندی پیدا نشد' }, { status: 404 });
		}

		return NextResponse.json({ category: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}

// به‌روزرسانی دسته‌بندی با شناسه categoryId
export async function PUT({ params, request }: { params: { categoryId: string }; request: Request }) {
	try {
		const { categoryId } = params;
		const { name } = await request.json();

		if (!name) {
			return NextResponse.json({ message: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
		}

		const { data, error } = await supabase.from('categories').update({ name }).eq('id', categoryId).single();

		if (error) {
			return NextResponse.json({ message: 'خطا در به‌روزرسانی دسته‌بندی' }, { status: 500 });
		}

		return NextResponse.json({ message: 'دسته‌بندی با موفقیت به‌روزرسانی شد', category: data });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}

// حذف یک دسته‌بندی با شناسه categoryId
export async function DELETE({ params }: { params: { categoryId: string } }) {
	try {
		const { categoryId } = params;

		const { data, error } = await supabase.from('categories').delete().eq('id', categoryId);

		if (error) {
			return NextResponse.json({ message: 'خطا در حذف دسته‌بندی' }, { status: 500 });
		}

		if (data.length === 0) {
			return NextResponse.json({ message: 'دسته‌بندی پیدا نشد' }, { status: 404 });
		}

		return NextResponse.json({ message: 'دسته‌بندی با موفقیت حذف شد' });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
	}
}
