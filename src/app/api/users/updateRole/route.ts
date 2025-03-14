import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
	try {
		const { id, role } = await request.json();
		const { error } = await supabase.from('users').update({ role }).eq('id', id);
		if (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500 });
		}
		return new Response(JSON.stringify({ message: 'نقش کاربر با موفقیت تغییر کرد' }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: 'خطا در پردازش درخواست' }), { status: 500 });
	}
}
