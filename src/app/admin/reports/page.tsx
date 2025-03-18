'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';

export default function Reports() {
	const [reports, setReports] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// فرض کنید که API یا دیتابیس برای گزارشات دارید
	useEffect(() => {
		async function fetchReports() {
			setIsLoading(true);
			const { data, error } = await supabase.from('reports').select('*');
			if (!error && data) {
				toast.loading('صبر داشته باش ');
				setReports(data);
			} else {
				toast.error('چیزی نبود فضولی کنی');
			}
			setIsLoading(false);
		}
		fetchReports();
	}, []);

	return (
		<div className="flex min-h-screen">
			{/* Main Content */}
			<div className="flex-1 p-6">
				<h1 className="text-2xl font-bold text-gray-800">گزارشات</h1>

				{isLoading ? (
					<div className="flex justify-center items-center mt-8">
						<div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-primary"></div>
					</div>
				) : (
					<>
						{/* Reports Table */}
						<div className="overflow-x-auto mt-6">
							<table className="min-w-full table-auto border-separate border-spacing-0 border border-gray-300 ">
								<thead>
									<tr className="bg-gray-100 flex items-center justify-around">
										<th className="p-2 text-left text-sm font-medium text-gray-600">عنوان گزارش</th>
										<th className="p-2 text-left text-sm font-medium text-gray-600">تاریخ</th>
										<th className="p-2 text-left text-sm font-medium text-gray-600">وضعیت</th>
									</tr>
								</thead>
								<tbody>
									{reports.map((report, index) => (
										<tr key={index} className="hover:bg-gray-50">
											<td className="p-3 text-sm text-gray-700 border-t border-gray-200">{report.title}</td>
											<td className="p-3 text-sm text-gray-700 border-t border-gray-200">{report.date}</td>
											<td className="p-3 text-sm text-gray-700 border-t border-gray-200">
												{report.status ? <span className="text-green-500">موفق</span> : <span className="text-red-500">ناموفق</span>}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
