import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase'; // فرض بر این است که Supabase تنظیم شده است
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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
export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		// دریافت توکن از کوکی‌ها
		const cookieStore = await cookies();
		const token = cookieStore.get('token')?.value;

		if (!token) {
			return NextResponse.json({ message: 'توکن معتبر نیست.' }, { status: 401 });
		}

		// دیکد کردن توکن JWT
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log(decoded, 'Decoded Token'); // بررسی محتویات توکن
		} catch (err) {
			return NextResponse.json({ message: 'توکن معتبر نیست.' }, { status: 401 });
		}

		// استخراج id از توکن دیکد شده
		const userIdFromToken = decoded.id;

		console.log('User ID from token:', userIdFromToken); // نمایش id از توکن

		// چک کردن اطلاعات کاربر
		const { data: user, error: userError } = await supabase.from('users').select('id, role_id').eq('id', userIdFromToken).single();

		console.log('User:', user); // بررسی اطلاعات کاربر

		if (userError || !user) {
			return NextResponse.json({ message: 'کاربر یافت نشد یا غیرمجاز است.' }, { status: 403 });
		}

		// چک کردن نقش کاربر از جدول roles
		const { data: role, error: roleError } = await supabase.from('roles').select('name').eq('id', user.role_id).single();

		if (roleError || !role) {
			return NextResponse.json({ message: 'نقش کاربر یافت نشد یا غیرمجاز است.' }, { status: 403 });
		}

		console.log('Role:', role); // نمایش نقش کاربر

		// بررسی اینکه آیا کاربر مجوز حذف دارد
		const { userId } = await params; // استفاده از await برای دریافت پارامتر
		if (user.id === userId) {
			return NextResponse.json({ message: 'شما نمی‌توانید خودتان را حذف کنید!' }, { status: 403 });
		}

		// بررسی دسترسی نقش‌ها
		if (role.name !== 'admin' && role.name !== 'owner') {
			return NextResponse.json({ message: 'دسترسی غیرمجاز.' }, { status: 403 });
		}

		// حذف کاربر از دیتابیس
		const { error: deleteError } = await supabase.from('users').delete().eq('id', userId);

		if (deleteError) {
			return NextResponse.json({ message: 'خطا در حذف کاربر', error: deleteError.message }, { status: 500 });
		}

		return NextResponse.json({ message: 'کاربر با موفقیت حذف شد' }, { status: 200 });
	} catch (error) {
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
