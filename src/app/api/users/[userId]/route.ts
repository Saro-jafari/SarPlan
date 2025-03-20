import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase'; // فرض بر این است که Supabase تنظیم شده است

// دریافت اطلاعات یک کاربر خاص
export async function GET({ params }: { params: { userId: string } }) {
	try {
		const { userId } = params; // دریافت userId از مسیر

		const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

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

// حذف یک کاربر خاص
export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
	try {
		const { userId } = params; // اینجا params از context است

		// بررسی موجودیت کاربر در دیتابیس
		const { data: existingUser, error: findError } = await supabase.from('users').select('id').eq('id', userId).single();

		if (findError || !existingUser) {
			// کاربر پیدا نشد
			return NextResponse.json({ message: 'کاربر مورد نظر یافت نشد' }, { status: 404 });
		}

		// حذف کاربر از دیتابیس
		const { error: deleteError } = await supabase.from('users').delete().eq('id', userId);

		if (deleteError) {
			// اگر خطایی در حذف کاربر وجود داشت، جزئیات خطا را ارسال کنید
			return NextResponse.json({ message: 'خطا در حذف کاربر', error: deleteError.message }, { status: 500 });
		}

		// در صورت موفقیت
		return NextResponse.json({ message: 'کاربر با موفقیت حذف شد' }, { status: 200 });
	} catch (error) {
		// مدیریت خطاهای پیش‌بینی نشده
		return NextResponse.json(
			{ message: 'خطا در پردازش درخواست', error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 },
		);
	}
}

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
	try {
		const { userId } = params;
		const body = await req.json();

		const { data: existingUser, error: findError } = await supabase.from('users').select('id').eq('id', userId).single();

		if (findError || !existingUser) {
			return NextResponse.json({ message: 'کاربر یافت نشد' }, { status: 404 });
		}

		// آپدیت اطلاعات کاربر
		const { data, error: updateError } = await supabase.from('users').update(body).eq('id', userId).select();

		if (updateError) {
			return NextResponse.json({ message: 'خطا در به‌روزرسانی کاربر' }, { status: 500 });
		}

		return NextResponse.json({ message: 'کاربر با موفقیت به‌روزرسانی شد', user: data }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: 'خطا در پردازش درخواست' }, { status: 500 });
	}
}
