'use client';
import { useState, useEffect } from 'react';
import { Search, CheckCircle, Calendar, Layers, Home, Plus, Menu, Trash2 } from 'lucide-react';
import { parseCookies } from 'nookies';

const Sidebar = ({ isOpen, toggleSidebar }) => {
	const [lists, setLists] = useState([]);
	const [newListName, setNewListName] = useState('');
	const [user, setUser] = useState(null);

	// دریافت اطلاعات کاربر از کوکی
	useEffect(() => {
		const cookies = parseCookies();
		if (cookies.userData) {
			const userData = JSON.parse(cookies.userData);
			setUser(userData);
		}
	}, []);

	// فچ کردن لیست‌ها بر اساس کاربر
	useEffect(() => {
		if (!user) return;
		const fetchLists = async () => {
			try {
				const response = await fetch(`/api/lists?userId=${user.id}`);
				const data = await response.json();
				setLists(data);
			} catch (error) {
				console.error('خطا در دریافت لیست‌ها:', error);
			}
		};
		fetchLists();
	}, [user]);

	// ایجاد لیست جدید
	const handleAddList = async () => {
		if (!newListName.trim() || !user) return;
		try {
			const response = await fetch(`/api/lists?userId=${user.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newListName, userId: user.id }),
			});
			if (!response.ok) throw new Error('ایجاد لیست جدید ناموفق بود.');
			const newList = await response.json();
			setLists(prev => [...prev, newList]);
			setNewListName('');
		} catch (error) {
			console.error('خطا در ایجاد لیست:', error);
		}
	};

	// حذف لیست
	const handleDeleteList = async id => {
		if (!user) return;
		try {
			const response = await fetch(`/api/lists/${id}?userId=${user.id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('حذف لیست ناموفق بود.');
			setLists(prev => prev.filter(list => list.id !== id));
		} catch (error) {
			console.error('خطا در حذف لیست:', error);
		}
	};

	return (
		<>
        
			{/* دکمه برای باز کردن منو در موبایل */}
			<button className="md:hidden p-2" onClick={toggleSidebar}>
				<Menu size={24} />
			</button>

			{/* سایدبار */}
			<div
				className={`fixed md:relative top-0 left-0 w-64 bg-gray-900 text-white min-h-screen p-4 transform transition-transform ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 md:block`}>
				{/* پروفایل */}
				<div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
					<div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-lg font-bold">
						{user ? (user.initials ? user.initials : user.name.charAt(0)) : 'U'}
					</div>
					<div>
						<p className="text-lg">{user ? user.name : 'کاربر مهمان'}</p>
						<p className="text-sm text-gray-400">{user ? user.email : 'ایمیل موجود نیست'}</p>
					</div>
				</div>

				{/* سرچ */}
				<div className="relative my-4">
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
					<input
						type="text"
						placeholder="جستجو..."
						className="w-full bg-gray-800 text-white rounded-md pl-10 pr-3 py-2 focus:outline-none"
					/>
				</div>

				{/* آیتم‌های منو */}
				<nav className="space-y-2">
					{menuItems.map((item, index) => (
						<div key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
							{item.icon}
							<span>{item.label}</span>
						</div>
					))}
				</nav>

				{/* لیست‌های کاربر */}
				<div className="mt-4 space-y-2">
					{lists.length > 0 ? (
						lists.map((list, index) => (
							<div key={index} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-800">
								<span>{list.name}</span>
								<button onClick={() => handleDeleteList(list.id)} className="text-red-500 hover:text-red-400">
									<Trash2 size={16} />
								</button>
							</div>
						))
					) : (
						<p className="text-gray-400 text-center">هیچ لیستی وجود ندارد.</p>
					)}
				</div>

				{/* اضافه کردن لیست جدید */}
				<div className="mt-4">
					<input
						type="text"
						value={newListName}
						onChange={e => setNewListName(e.target.value)}
						placeholder="نام لیست جدید..."
						className="w-full bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none"
					/>
					<button
						onClick={handleAddList}
						className="flex items-center space-x-2 text-teal-400 mt-2 p-2 hover:bg-gray-800 rounded-md w-full">
						<Plus size={16} />
						<span>ایجاد لیست جدید</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default function HomePage() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="flex">
			<Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
		</div>
	);
}

const menuItems = [
	{ label: 'برنامه روزانه', icon: <Home size={18} /> },
	{ label: 'برنامه‌ریزی‌شده', icon: <Calendar size={18} /> },
	{ label: 'همه وظایف', icon: <Layers size={18} /> },
	{ label: 'تکمیل شده‌ها', icon: <CheckCircle size={18} /> },
];
