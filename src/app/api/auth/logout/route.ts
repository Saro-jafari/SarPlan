export async function POST(req: Request) {
	try {
		const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;

		return new Response(JSON.stringify({ message: 'خروج موفقیت‌آمیز بود!' }), {
			status: 200,
			headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
		});
	} catch (err) {
		console.error('Error during logout:', err);
		return new Response(JSON.stringify({ error: 'مشکلی در پردازش درخواست پیش آمده است.' }), { status: 500 });
	}
}
