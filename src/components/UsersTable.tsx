import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// وارد کردن ماژول‌های مورد نیاز
import { ClientSideRowModelModule } from 'ag-grid-community';

export default function UsersTable({ data, handleDelete, handleToggleActive }) {
	const columnDefs = [
		{ field: 'email', headerName: 'ایمیل', flex: 1 },
		{ field: 'role', headerName: 'نقش', flex: 1 },
		{
			field: 'status',
			headerName: 'وضعیت',
			cellRenderer: params => {
				const { status, id } = params.data;
				console.log('Row Data:', params.data); // 🔍 بررسی مقدار کامل
				console.log('User ID:', id, 'Status:', status); // 🟢 مقدار دقیق را لاگ کن

				return (
					<button
						className={`px-4 py-2 rounded-lg ${status ? 'bg-green-500' : 'bg-gray-500'} text-white hover:bg-opacity-80`}
						onClick={() => handleToggleActive(id, !status)}>
						{status ? 'فعال' : 'غیرفعال'}
					</button>
				);
			},
			width: 150,
		},
		{
			field: 'actions',
			headerName: 'عملیات',
			cellRenderer: params => (
				<button
					className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition cursor-pointer"
					onClick={() => handleDelete(params.data.id)}>
					حذف
				</button>
			),
			width: 120,
		},
	];

	return (
		<div className="ag-theme-alpine mt-6" style={{ height: 500, width: '100%' }}>
			<AgGridReact
				rowData={data}
				columnDefs={columnDefs}
				domLayout="autoHeight"
				pagination={true}
				paginationPageSize={5}
				modules={[ClientSideRowModelModule]} // فقط این ماژول کافی است
			/>
		</div>
	);
}
