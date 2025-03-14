import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
	try {
		// دریافت اطلاعات از درخواست
		const { id } = await request.json();
		if (!id) {
			return new Response(JSON.stringify({ error: 'شناسه کاربر ارسال نشده' }), { status: 400 });
		}

		// بررسی اینکه آیا کاربر لاگین کرده و اطلاعاتش را دریافت کرده‌ایم
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 401 });
		}

		// دریافت نقش کاربر از دیتابیس
		const { data: userData, error: userError } = await supabase.from('users').select('role').eq('id', user.id).single();

		if (userError || !userData) {
			return new Response(JSON.stringify({ error: 'خطا در بررسی نقش کاربر' }), { status: 500 });
		}

		// بررسی اینکه کاربر ادمین است یا نه
		if (userData.role !== 'admin') {
			return new Response(JSON.stringify({ error: 'شما مجاز به انجام این عملیات نیستید' }), { status: 403 });
		}

		// حذف کاربر از دیتابیس
		const { error } = await supabase.from('users').delete().eq('id', id);

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500 });
		}

		return new Response(JSON.stringify({ message: 'کاربر با موفقیت حذف شد' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'خطا در پردازش درخواست' }), { status: 500 });
	}
}
