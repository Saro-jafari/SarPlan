'use client';
import { useAuth } from '@/context/AuthProvider';
import Todo from '@/components/Todo'; 
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
