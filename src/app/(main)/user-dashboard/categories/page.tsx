'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
	FcFolder,
	FcOpenedFolder,
	FcTodoList,
	FcPackage,
	FcEditImage,
	FcCalendar,
	FcClock,
	FcContacts,
	FcDocument,
	FcGlobe,
	FcHome,
	FcIdea,
	FcLike,
	FcLock,
	FcSettings,
	FcShop,
	FcSupport,
	FcSurvey,
	FcViewDetails,
} from 'react-icons/fc';

interface Icon {
	id: number;
	component: React.ComponentType; // تایپ کامپوننت React
}

const availableIcons = [
	{ id: 'folder', component: FcFolder },
	{ id: 'folder-open', component: FcOpenedFolder },
	{ id: 'list-alt', component: FcTodoList },
	{ id: 'box', component: FcPackage },
	{ id: 'pen', component: FcEditImage },
	{ id: 'calendar', component: FcCalendar },
	{ id: 'clock', component: FcClock },
	{ id: 'contacts', component: FcContacts },
	{ id: 'document', component: FcDocument },
	{ id: 'globe', component: FcGlobe },
	{ id: 'home', component: FcHome },
	{ id: 'idea', component: FcIdea },
	{ id: 'like', component: FcLike },
	{ id: 'lock', component: FcLock },
	{ id: 'settings', component: FcSettings },
	{ id: 'shop', component: FcShop },
	{ id: 'support', component: FcSupport },
	{ id: 'survey', component: FcSurvey },
	{ id: 'view-details', component: FcViewDetails },
];

const CategoryModal = ({ isOpen, onClose, onSave, title, initialData = null }) => {
	const [name, setName] = useState('');
	const [icon, setIcon] = useState(availableIcons[0]);
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setIcon(initialData.icon);
			setDescription(initialData.description);
		} else {
			setName('');
			setIcon(availableIcons[0]);
			setDescription('');
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleSave = () => {
		try {
			// بررسی اینکه آیا icon یک شیء است یا خیر
			console.log('Selected icon:', icon);

			const selectedIcon = icon?.component || availableIcons[0].component;

			// بررسی نام ورودی
			if (name.trim() === '') {
				toast.error('نام نمی‌تواند خالی باشد');
				return;
			}

			// آماده کردن داده‌ها برای ذخیره
			const data = initialData
				? { ...initialData, name, icon: selectedIcon, description }
				: { name, icon: selectedIcon, description, id: Date.now(), subCategories: [] };

			// ارسال داده‌ها برای ذخیره
			onSave(data);

			toast.success('با موفقیت ایجاد شد');

			// بستن پنجره
			onClose();
		} catch (error) {
			toast.error('عملیات ذخیره‌سازی با خطا مواجه شد، لطفاً دوباره تلاش کنید');
			console.error('Error saving data:', error);
		}
	};

	const getIconComponent = iconId => {
		const iconObj = availableIcons.find(item => item.id === iconId);
		if (!iconObj) return null;
		const IconComponent = iconObj.component;
		// مطمئن شوید که IconComponent یک کامپوننت React است
		return IconComponent ? <IconComponent /> : null;
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
				<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
				<div className="mb-4">
					<label className="block mb-1 text-gray-700 dark:text-gray-300">نام:</label>
					<input
						type="text"
						className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="نام مورد نظر"
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-1 text-gray-700 dark:text-gray-300">انتخاب آیکون:</label>
					<div className="grid grid-cols-5 gap-3">
						{availableIcons.map(({ id }) => (
							<button
								key={id}
								onClick={() => setIcon(id)}
								className={`text-2xl p-2 border rounded ${
									icon === id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
								}`}>
								{getIconComponent(id)}
							</button>
						))}
					</div>
				</div>
				<div className="mb-4">
					<label className="block mb-1 text-gray-700 dark:text-gray-300">توضیحات:</label>
					<textarea
						className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder="توضیحات"></textarea>
				</div>
				<div className="flex justify-end gap-2">
					<button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded">
						لغو
					</button>
					<button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
						ذخیره
					</button>
				</div>
			</div>
		</div>
	);
};

// کامپوننت نمایش هر دسته‌بندی به صورت بازگشتی
const CategoryItem = ({ category, openSubModal, openEditModal, deleteCategory }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="border p-4 rounded my-2 bg-white dark:bg-gray-800 shadow">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-2xl">{category.icon}</span>
					<h3 className="font-bold text-gray-800 dark:text-gray-100">{category.name}</h3>
				</div>
				<div className="flex items-center gap-2">
					<button onClick={() => openSubModal(category.id)} className="text-green-500 hover:text-green-700" title="افزودن زیر دسته">
						<FaPlus />
					</button>
					<button onClick={() => openEditModal(category)} className="text-yellow-500 hover:text-yellow-700" title="ویرایش">
						<FaEdit />
					</button>
					<button onClick={() => deleteCategory(category.id)} className="text-red-500 hover:text-red-700" title="حذف">
						<FaTrash />
					</button>
					<button onClick={() => setIsOpen(!isOpen)} className="text-sm text-blue-500">
						{isOpen ? 'بستن' : 'نمایش'}
					</button>
				</div>
			</div>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
			{isOpen && category.subCategories && category.subCategories.length > 0 && (
				<div className="mt-2 ml-4 border-l pl-4">
					{category.subCategories.map(sub => (
						<CategoryItem
							key={sub.id}
							category={sub}
							openSubModal={openSubModal}
							openEditModal={openEditModal}
							deleteCategory={deleteCategory}
						/>
					))}
				</div>
			)}
		</div>
	);
};

// کامپوننت اصلی مدیریت دسته‌بندی‌ها
const CategoryManager = () => {
	const [categories, setCategories] = useState([]);
	const [mainModalOpen, setMainModalOpen] = useState(false);
	const [subModalOpen, setSubModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [parentCategoryId, setParentCategoryId] = useState(null);
	const [editingCategory, setEditingCategory] = useState(null);

	// افزودن دسته‌بندی اصلی
	const addCategory = newCategory => {
		setCategories(prev => [...prev, newCategory]);
	};

	// افزودن زیر دسته به صورت بازگشتی
	const addSubCategory = (parentId, newSubCategory) => {
		const addSub = cats => {
			return cats.map(cat => {
				if (cat.id === parentId) {
					return { ...cat, subCategories: [...cat.subCategories, newSubCategory] };
				} else if (cat.subCategories && cat.subCategories.length > 0) {
					return { ...cat, subCategories: addSub(cat.subCategories) };
				}
				return cat;
			});
		};
		setCategories(prev => addSub(prev));
	};

	// ویرایش دسته‌بندی به صورت بازگشتی
	const updateCategory = updatedCategory => {
		const updateCat = cats => {
			return cats.map(cat => {
				if (cat.id === updatedCategory.id) {
					return updatedCategory;
				} else if (cat.subCategories && cat.subCategories.length > 0) {
					return { ...cat, subCategories: updateCat(cat.subCategories) };
				}
				return cat;
			});
		};
		setCategories(prev => updateCat(prev));
	};

	// حذف دسته‌بندی به صورت بازگشتی
	const deleteCategory = id => {
		const removeCat = cats => {
			return cats
				.filter(cat => cat.id !== id)
				.map(cat => ({
					...cat,
					subCategories: cat.subCategories ? removeCat(cat.subCategories) : [],
				}));
		};
		setCategories(prev => removeCat(prev));
	};

	const openSubModal = parentId => {
		setParentCategoryId(parentId);
		setSubModalOpen(true);
	};

	const openEditModal = category => {
		setEditingCategory(category);
		setEditModalOpen(true);
	};

	return (
		<div className="p-6 bg-gray-50 dark:bg-gray-900 h-auto max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">مدیریت دسته‌بندی</h1>
			<button
				onClick={() => setMainModalOpen(true)}
				className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2 mb-4 focus:outline-none">
				<FaPlus /> افزودن دسته‌بندی اصلی
			</button>
			<div>
				{categories.map(category => (
					<CategoryItem
						key={category.id}
						category={category}
						openSubModal={openSubModal}
						openEditModal={openEditModal}
						deleteCategory={deleteCategory}
					/>
				))}
			</div>

			<CategoryModal isOpen={mainModalOpen} onClose={() => setMainModalOpen(false)} onSave={addCategory} title="ایجاد دسته‌بندی اصلی" />

			<CategoryModal
				isOpen={subModalOpen}
				onClose={() => setSubModalOpen(false)}
				onSave={newSubCategory => addSubCategory(parentCategoryId, newSubCategory)}
				title="ایجاد زیر دسته"
			/>

			<CategoryModal
				isOpen={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				onSave={updateCategory}
				title="ویرایش دسته‌بندی"
				initialData={editingCategory}
			/>
		</div>
	);
};

export default CategoryManager;
