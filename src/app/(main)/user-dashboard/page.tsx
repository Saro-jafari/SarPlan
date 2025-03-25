'use client';
import { useState } from 'react';
import EisenhowerMatrix from '@/components/EisenhowerMatrix';
import PersianCalendar from '@/components/Calendar';

export default function Dashboard() {
	const [tasks, setTasks] = useState([
		{ id: '1', text: 'تسک ۱' },
		{ id: '2', text: 'تسک ۲' },
		{ id: '3', text: 'تسک ۳' },
	]);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
			{/* محتوی اصلی */}
			<div className="flex-1 p-4 md:ml-16 md:p-6 mt-10">
				<header className="flex justify-between items-center mb-4 text-white max-w-7xl mx-auto px-4">
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">+ تسک جدید</button>
				</header>

				<section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
					{/* ستون اول: تسک‌ها و تقویم */}
					<div className="space-y-8">
						<section className="bg-[#14162E] shadow-md rounded-lg p-4">
							<h2 className="text-lg font-bold text-white mb-4">تسک‌ها</h2>
							<ul className="space-y-2">
								{tasks.map(task => (
									<li
										key={task.id}
										className="p-4 border border-gray-600 rounded-md bg-[#2C3A59] text-white hover:bg-[#3C4A75] transition cursor-pointer shadow-md">
										{task.text}
									</li>
								))}
							</ul>
						</section>

						{/* تقویم زیر تسک‌ها */}
						<section className="bg-white shadow-md rounded-lg p-4">
							<PersianCalendar />
						</section>
					</div>

					{/* ستون دوم: ماتریس ایزنهاور */}
					<section className="bg-white shadow-md rounded-lg p-4">
						<EisenhowerMatrix />
					</section>
				</section>
			</div>
		</div>
	);
}
