import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { useTheme } from 'next-themes';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function UsersTable({ data, handleDelete, handleToggleActive }) {
	const { theme } = useTheme();
	const isDarkMode = theme === 'dark';

	function getRoleFromUserId(roleId) {
		const roles = {
			'29e847a2-1dd9-4ff5-bd4d-a59a6a9e1976': 'admin',
			'082c89e2-19b8-4e37-bbd2-eb4eabe7667f': 'user',
			'806d70f6-0715-40af-8ddb-fa3c4242f8b1': 'owner',
		};
		return roles[roleId];
	}

	const columnDefs = [
		{ field: 'email', headerName: 'ایمیل', flex: 1, minWidth: 180 },
		{
			field: 'role',
			headerName: 'نقش',
			width: 140,
			cellRenderer: params => getRoleFromUserId(params.data.role_id),
		},
		{
			field: 'is_verified',
			headerName: 'ایمیل تأیید شده',
			cellRenderer: params => (
				<span className={`text-lg ${params.value ? 'text-green-500' : 'text-red-500'}`}>{params.value ? <FaCheck /> : <FaTimes />}</span>
			),
			width: 140,
			cellClass: 'text-center',
		},
		{
			field: 'status',
			headerName: 'وضعیت',
			cellRenderer: params => (
				<button
					className={`px-2 py-1 text-xs font-semibold rounded-md transition shadow-md
                        ${params.data.status ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
					onClick={() => handleToggleActive(params.data.id, params.data.status)}>
					{params.data.status ? 'فعال' : 'غیرفعال'}
				</button>
			),
			width: 120,
			cellClass: 'text-center',
		},
		{
			field: 'actions',
			headerName: 'عملیات',
			cellRenderer: params => (
				<button
					className="px-2 py-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md transition shadow-md"
					onClick={() => handleDelete(params.data.id)}>
					حذف
				</button>
			),
			width: 100,
			cellClass: 'text-center',
		},
	];

	return (
		<div className="w-full overflow-auto">
			<div
				className={`ag-theme-alpine ${isDarkMode ? 'ag-theme-alpine-dark' : ''} mt-4 shadow-xl rounded-lg p-2 min-w-[600px]`}
				style={{ height: '500px' }}>
				<AgGridReact
					rowData={data}
					columnDefs={columnDefs}
					domLayout="autoHeight"
					pagination={true}
					paginationPageSize={10}
					modules={[ClientSideRowModelModule]}
					suppressHorizontalScroll={false}
					suppressCellFocus={true}
				/>
			</div>
		</div>
	);
}
