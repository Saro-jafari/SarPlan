'use client';
import { useState } from 'react';
import SidebarWithGroups from './sideBar';

const Home = () => {
	// ایجاد state برای وظایف هر بخش
	const [tasks, setTasks] = useState({
		urgentImportant: [],
		importantNotUrgent: [],
		urgentNotImportant: [],
		notUrgentNotImportant: [],
	});

	// ایجاد state برای ورودی هر بخش
	const [inputs, setInputs] = useState({
		urgentImportant: '',
		importantNotUrgent: '',
		urgentNotImportant: '',
		notUrgentNotImportant: '',
	});

	// تابع برای اضافه کردن وظیفه به هر بخش
	const handleAddTask = category => {
		const taskInput = inputs[category];
		if (taskInput.trim() === '') return;

		setTasks(prev => ({
			...prev,
			[category]: [...prev[category], taskInput],
		}));

		// پاک کردن ورودی بعد از اضافه کردن وظیفه
		setInputs(prev => ({
			...prev,
			[category]: '',
		}));
	};

	const categories = [
		{ label: 'مهم و فوری', key: 'urgentImportant', bgColor: 'bg-gray-200' },
		{ label: 'مهم اما غیر فوری', key: 'importantNotUrgent', bgColor: 'bg-yellow-200' },
		{ label: 'غیر مهم اما فوری', key: 'urgentNotImportant', bgColor: 'bg-green-200' },
		{ label: 'غیر مهم و غیر فوری', key: 'notUrgentNotImportant', bgColor: 'bg-red-200' },
	];

	return (
		<div className="flex h-screen">
			{/* سایدبار */}
			<SidebarWithGroups />

			{/* محتوای اصلی */}
			<div className="grid grid-cols-2 grid-rows-2 gap-8 w-[600px] h-[600px] p-5 ml-[250px]">
				{categories.map(({ label, key, bgColor }) => (
					<div key={key} className={`border p-5 text-center ${bgColor}`}>
						<h3>{label}</h3>
						<input
							type="text"
							value={inputs[key]}
							onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
							placeholder="اضافه کردن وظیفه..."
							className="w-[90%] p-3 my-2"
						/>
						<button onClick={() => handleAddTask(key)} className="p-3 bg-green-500 text-white rounded">
							اضافه کردن
						</button>
						<ul className="mt-3">
							{tasks[key].map((task, index) => (
								<li key={index}>{task}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
