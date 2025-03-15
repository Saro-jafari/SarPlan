'use client';
import { useAuth } from '@/context/AuthProvider'; // دسترسی به اطلاعات وضعیت ورود کاربر
import Todo from '@/components/Todo'; // کامپوننت Todo
import { redirect } from 'next/navigation';

const Home = () => {
	const { user } = useAuth();

	if (!user) {
		redirect('/login');
		return null;
	}

	return (
		<>
			<Todo />
		</>
	);
};

export default Home;
