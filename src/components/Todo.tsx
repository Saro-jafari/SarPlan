'use client';
import { useState } from 'react';

const Todo = () => {
	// State برای وظایف و ورودی‌ها
	const [tasks, setTasks] = useState({
		urgentImportant: [],
		importantNotUrgent: [],
		urgentNotImportant: [],
		notUrgentNotImportant: [],
	});

	const [inputs, setInputs] = useState({
		urgentImportant: '',
		importantNotUrgent: '',
		urgentNotImportant: '',
		notUrgentNotImportant: '',
	});

	// تابع برای اضافه کردن وظیفه
	const handleAddTask = category => {
		if (inputs[category].trim() === '') return;

		setTasks(prev => ({
			...prev,
			[category]: [...prev[category], inputs[category]],
		}));

		setInputs(prev => ({
			...prev,
			[category]: '',
		}));
	};

	const categories = [
		{ label: 'مهم و فوری', key: 'urgentImportant', bgColor: 'bg-red-500' },
		{ label: 'مهم اما غیر فوری', key: 'importantNotUrgent', bgColor: 'bg-red-500' },
		{ label: 'غیر مهم اما فوری', key: 'urgentNotImportant', bgColor: 'bg-green-500' },
		{ label: 'غیر مهم و غیر فوری', key: 'notUrgentNotImportant', bgColor: 'bg-blue-500' },
	];

	return (
		<div className="flex justify-center items-center  bg-gray-100 p-5">
			<div className="grid md:grid-cols-2 grid-cols-1 md:grid-rows-2 gap-6 w-full max-w-4xl">
				{categories.map(({ label, key }) => (
					<div key={key} className={`p-5 rounded-xl shadow-md bg-white border-l-8  border-opacity-70`}>
						<h3 className="text-lg font-bold mb-3">{label}</h3>
						<div className="flex items-center space-x-2">
							<input
								type="text"
								value={inputs[key]}
								onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
								placeholder="اضافه کردن وظیفه..."
								className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
							/>
							<button
								onClick={() => handleAddTask(key)}
								className="px-4 py-2 text-white rounded-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700">
								اضافه
							</button>
						</div>
						<ul className="mt-4 space-y-2">
							{tasks[key].map((task, index) => (
								<li key={index} className="p-2 bg-gray-200 rounded-lg shadow-sm">
									{task}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default Todo;
