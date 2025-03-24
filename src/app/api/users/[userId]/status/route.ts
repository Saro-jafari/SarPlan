import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req, { params }) {
	try {
		// دریافت توکن از کوکی‌ها
		const cookieStore = await cookies();
		const token = cookieStore.get('token')?.value;

		if (!token) {
			return NextResponse.json({ message: 'توکن معتبر نیست' }, { status: 401 });
		}

		// دیکد کردن توکن JWT
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return NextResponse.json({ message: 'توکن معتبر نیست' }, { status: 401 });
		}

		const userIdFromToken = decoded.id;

		// بررسی نقش کاربر
		const { data: user, error: userError } = await supabase.from('users').select('id, role_id').eq('id', userIdFromToken).single();

		if (userError || !user) {
			return NextResponse.json({ message: 'کاربر یافت نشد' }, { status: 404 });
		}

		// دریافت اطلاعات نقش از جدول roles
		const { data: role, error: roleError } = await supabase.from('roles').select('name').eq('id', user.role_id).single();

		if (roleError || !role) {
			return NextResponse.json({ message: 'نقش کاربر یافت نشد' }, { status: 404 });
		}

		// بررسی اینکه آیا کاربر مجوز تغییر وضعیت دارد (فقط ادمین یا مالک)
		if (role.name !== 'admin' && role.name !== 'owner') {
			return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
		}

		// منتظر ماندن برای دریافت params
		const { userId: targetUserId } = await params; // شناسه کاربر هدف از پارامترها

		if (!targetUserId || targetUserId === 'status') {
			return NextResponse.json({ message: 'شناسه کاربر نامعتبر است' }, { status: 400 });
		}

		// بررسی اینکه کاربر در حال تلاش برای تغییر وضعیت خودش نباشد
		if (targetUserId === userIdFromToken) {
			return NextResponse.json({ message: 'شما نمی‌توانید وضعیت خود را تغییر دهید' }, { status: 403 });
		}

		// دریافت اطلاعات وضعیت کاربر
		const { data: targetUser, error: fetchError } = await supabase.from('users').select('id, status').eq('id', targetUserId).single();

		if (fetchError || !targetUser) {
			return NextResponse.json({ message: 'کاربر یافت نشد' }, { status: 404 });
		}

		// معکوس کردن وضعیت (اگر true باشد، به false تبدیل شود و بالعکس)
		const boolStatus = targetUser.status === true ? false : true;

		const { error: updateError, data: updatedUser } = await supabase
			.from('users')
			.update({ status: boolStatus })
			.eq('id', targetUserId)
			.select();

		if (updateError) {
			return NextResponse.json({ message: 'به‌روزرسانی وضعیت کاربر ناموفق بود' }, { status: 500 });
		}

		if (updatedUser && updatedUser.length > 0) {
			return NextResponse.json({ message: 'وضعیت کاربر با موفقیت به‌روزرسانی شد' }, { status: 200 });
		} else {
			// رکورد تغییر نکرده است
			return NextResponse.json({ message: 'هیچ تغییری در وضعیت کاربر اعمال نشد' }, { status: 200 });
		}
	} catch (error) {
		return NextResponse.json({ message: 'خطای داخلی سرور' }, { status: 500 });
	}
}
