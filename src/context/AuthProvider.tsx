'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// تعریف نوع اطلاعات کاربر
interface User {
	email: string;
	role: string;
}

// تعریف نوع داده‌ای که در Context ذخیره می‌شود
interface AuthContextType {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
}

// ایجاد Context برای وضعیت لاگین
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// استفاده از Context برای ارائه اطلاعات
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth باید در داخل AuthProvider استفاده شود');
	}
	return context;
};

// فراهم کردن Context برای اپلیکیشن
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		// تلاش برای دریافت اطلاعات کاربر از کوکی‌ها
		const userData = Cookies.get('user');
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	const login = (user: User) => {
		setUser(user);
		// ذخیره اطلاعات کاربر در کوکی به مدت 7 روز (می‌توانید زمان را تغییر دهید)
		Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Strict' });
	};

	const logout = () => {
		setUser(null);
		// حذف کوکی
		Cookies.remove('user');
	};

	return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
