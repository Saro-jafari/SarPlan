'use client';
import React, { useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DatePickerHeader from 'react-multi-date-picker/plugins/date_picker_header';

export default function PersianCalendar() {
	const [value, setValue] = useState(new Date());

	return (
		<div className="w-fit p-4 bg-[#fff] rounded-xl shadow-lg text-white">
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
				<div>
					<Calendar
						className="grid grid-cols-1 "
						calendar={persian}
						locale={persian_fa}
						value={value}
						numberOfMonths={1}
						onChange={setValue}
						plugins={[<DatePickerHeader />]}
					/>
				</div>
			</div>
		</div>
	);
}
