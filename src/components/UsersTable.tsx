import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { useTheme } from 'next-themes';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function UsersTable({ data, handleDelete, handleToggleActive }) {
	const { theme } = useTheme();
	const isDarkMode = theme === 'dark';
	function getRoleFromUserId(roleId: string) {
		const roles = {
			'29e847a2-1dd9-4ff5-bd4d-a59a6a9e1976': 'admin',
			'082c89e2-19b8-4e37-bbd2-eb4eabe7667f': 'user',
			'806d70f6-0715-40af-8ddb-fa3c4242f8b1': 'owner',
		};
		return roles[roleId];
	}

	const columnDefs = [
		{
			field: 'email',
			headerName: 'ایمیل',
			flex: 1,
			cellClass: isDarkMode ? 'text-gray-200' : 'text-gray-800',
		},
		{
			field: 'role',
			headerName: 'نقش',
			with: 140,
			cellRenderer: params => {
				const roleName = getRoleFromUserId(params.data.role_id);
				return <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{roleName}</span>;
			},
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
			cellRenderer: params => {
				const { status, id } = params.data;
				return (
					<button
						className={`px-4 py-2 text-sm font-semibold rounded-md transition shadow-md
                        ${status ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
						onClick={() => handleToggleActive(id, status)}>
						{status ? 'فعال' : 'غیرفعال'}
					</button>
				);
			},
			width: 140,
			cellClass: 'text-center',
		},
		{
			field: 'actions',
			headerName: 'عملیات',
			cellRenderer: params => (
				<button
					className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md transition shadow-md"
					onClick={() => handleDelete(params.data.id)}>
					حذف
				</button>
			),
			width: 120,
			cellClass: 'text-center',
		},
	];

	return (
		<div
			className={`ag-theme-alpine ${isDarkMode ? 'ag-theme-alpine-dark' : ''} mt-6 shadow-xl rounded-lg p-4 bg-white dark:bg-gray-800`}
			style={{ width: '100%', height: '600px' }}>
			<AgGridReact
				rowData={data}
				columnDefs={columnDefs}
				domLayout="autoHeight"
				pagination={true}
				paginationPageSize={12}
				modules={[ClientSideRowModelModule]}
			/>
		</div>
	);
}
