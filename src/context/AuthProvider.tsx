'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserFromToken, logoutAction } from '@/lib/serverActions';
import { useRouter } from 'next/navigation';

interface User {
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean; // وضعیت بارگذاری اضافه شد
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth باید در داخل AuthProvider استفاده شود');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true); // بارگذاری اولیه
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			const userData = await getUserFromToken();
			setUser(userData);
			setLoading(false); // پس از بارگذاری، بارگذاری تمام شده است
		};

		fetchUser();
	}, []);

	const logout = async () => {
		await logoutAction();
		setUser(null);
		router.push('/login'); // به صفحه لاگین هدایت می‌شود
	};

	return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
};
