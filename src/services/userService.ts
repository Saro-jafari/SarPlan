const BASE_URL = '/api/users'; // آدرس API در Next.js

// دریافت اطلاعات یک کاربر
export const getUser = async (userId: string) => {
	const res = await fetch(`${BASE_URL}/${userId}`);
	return res.json();
};

// حذف یک کاربر
export const deleteUser = async (userId: string) => {
	const res = await fetch(`${BASE_URL}/${userId}`, { method: 'DELETE' });
	return res.json();
};

// به‌روزرسانی اطلاعات کاربر
export const updateUser = async (userId: string, userData: any) => {
	const res = await fetch(`${BASE_URL}/${userId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData),
	});
	return res.json();
};
