'use client';
import React, { useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';


export default function PersianCalendar() {
	const [value, setValue] = useState(new Date());

	return (
		<div className="w-full max-w-[500px] p-4 bg-[#fff] rounded-xl shadow-lg text-white ">
			{/* Flexbox برای چینش دکمه‌ها و تقویم */}
			<div className="flex flex-col md:flex-row gap-6">
				{/* ستون دکمه‌ها */}
				<div className="flex flex-col gap-2">
					<button
						className="text-white px-6 py-3 rounded-lg shadow-md bg-[#25295af5] cursor-pointer hover:bg-[#14162e]"
						onClick={() => setValue(undefined)}>
						DESELECT
					</button>

					<button
						className="text-white px-6 py-3 rounded-lg shadow-md bg-[#25295af5] cursor-pointer hover:bg-[#14162e]"
						onClick={() => setValue(new Date())}>
						TODAY
					</button>
				</div>

				{/* ستون تقویم */}
				<div className="overflow-hidden max-w-full">
					<Calendar
						className="grid grid-cols-1"
						calendar={persian}
						locale={persian_fa}
						value={value}
						numberOfMonths={1}
						onChange={setValue}
					/>
				</div>
			</div>
		</div>
	);
}
