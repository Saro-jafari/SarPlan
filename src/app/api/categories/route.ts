// pages/api/categories/index.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// گرفتن همه دسته‌بندی‌ها
export async function GET() {
  try {
    const { data, error } = await supabase.from('categories').select('id, name');
    if (error) {
      return NextResponse.json({ message: 'خطا در گرفتن دسته‌بندی‌ها' }, { status: 500 });
    }
    return NextResponse.json({ categories: data });
  } catch (error) {
    return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
  }
}

// افزودن یک دسته‌بندی جدید
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
    }

    const { data, error } = await supabase.from('categories').insert([{ name }]);

    if (error) {
      return NextResponse.json({ message: 'خطا در اضافه کردن دسته‌بندی' }, { status: 500 });
    }

    return NextResponse.json({ message: 'دسته‌بندی با موفقیت اضافه شد', category: data[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'خطا در سرور' }, { status: 500 });
  }
}
