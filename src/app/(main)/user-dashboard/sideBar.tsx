'use client';
import { useState } from 'react';

// ساختار داده برای گروه‌ها، زیرگروه‌ها و ایتم‌ها
const initialCategories = [
	{
		id: 1,
		name: 'گروه اول',
		subcategories: [
			{ id: 101, name: 'زیرگروه 1', items: ['ایتم 1', 'ایتم 2'] },
			{ id: 102, name: 'زیرگروه 2', items: ['ایتم 3'] },
		],
	},
	{
		id: 2,
		name: 'گروه دوم',
		subcategories: [{ id: 201, name: 'زیرگروه 1', items: ['ایتم 4'] }],
	},
];

const SidebarWithGroups = () => {
	const [categories, setCategories] = useState(initialCategories);
	const [newGroup, setNewGroup] = useState('');
	const [newSubgroup, setNewSubgroup] = useState('');
	const [newItem, setNewItem] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState(null);

	// اضافه کردن گروه جدید
	const handleAddGroup = () => {
		if (!newGroup.trim()) return;
		const newCategory = {
			id: categories.length + 1,
			name: newGroup,
			subcategories: [],
		};
		setCategories(prev => [...prev, newCategory]);
		setNewGroup('');
	};

	// اضافه کردن زیرگروه به یک گروه
	const handleAddSubgroup = () => {
		if (!newSubgroup.trim() || selectedCategory === null) return;
		const updatedCategories = categories.map(category => {
			if (category.id === selectedCategory) {
				const newSubcategory = {
					id: category.subcategories.length + 1 + 100,
					name: newSubgroup,
					items: [],
				};
				return { ...category, subcategories: [...category.subcategories, newSubcategory] };
			}
			return category;
		});
		setCategories(updatedCategories);
		setNewSubgroup('');
	};

	// اضافه کردن ایتم به یک زیرگروه
	const handleAddItem = () => {
		if (!newItem.trim() || selectedSubcategory === null) return;
		const updatedCategories = categories.map(category => {
			if (category.id === selectedCategory) {
				const updatedSubcategories = category.subcategories.map(subcategory => {
					if (subcategory.id === selectedSubcategory) {
						return {
							...subcategory,
							items: [...subcategory.items, newItem],
						};
					}
					return subcategory;
				});
				return { ...category, subcategories: updatedSubcategories };
			}
			return category;
		});
		setCategories(updatedCategories);
		setNewItem('');
	};

	return (
		<div className="flex">
			{/* سایدبار */}
			<div className="w-1/4 p-5 bg-gray-200 h-screen">
				<h2 className="text-2xl font-bold">گروه‌ها</h2>
				<div className="mt-5">
					{/* فرم ایجاد گروه جدید */}
					<input
						type="text"
						value={newGroup}
						onChange={e => setNewGroup(e.target.value)}
						placeholder="نام گروه جدید..."
						className="w-full p-2 mb-2 border border-gray-400 rounded"
					/>
					<button onClick={handleAddGroup} className="w-full p-2 bg-blue-500 text-white rounded">
						اضافه کردن گروه
					</button>
				</div>

				<ul className="mt-5">
					{categories.map(category => (
						<li key={category.id} className="mt-3">
							<div className="cursor-pointer font-bold" onClick={() => setSelectedCategory(category.id)}>
								{category.name}
							</div>
							{selectedCategory === category.id && (
								<div className="ml-4">
									{/* فرم ایجاد زیرگروه */}
									<input
										type="text"
										value={newSubgroup}
										onChange={e => setNewSubgroup(e.target.value)}
										placeholder="نام زیرگروه جدید..."
										className="w-full p-2 mb-2 border border-gray-400 rounded"
									/>
									<button onClick={handleAddSubgroup} className="w-full p-2 bg-green-500 text-white rounded">
										اضافه کردن زیرگروه
									</button>

									{/* نمایش زیرگروه‌ها */}
									{category.subcategories.map(subcategory => (
										<div key={subcategory.id} className="mt-3">
											<div className="cursor-pointer font-semibold" onClick={() => setSelectedSubcategory(subcategory.id)}>
												{subcategory.name}
											</div>
											{selectedSubcategory === subcategory.id && (
												<div className="ml-4">
													{/* فرم ایجاد ایتم */}
													<input
														type="text"
														value={newItem}
														onChange={e => setNewItem(e.target.value)}
														placeholder="ایتم جدید..."
														className="w-full p-2 mb-2 border border-gray-400 rounded"
													/>
													<button onClick={handleAddItem} className="w-full p-2 bg-red-500 text-white rounded">
														اضافه کردن ایتم
													</button>

													{/* نمایش ایتم‌ها */}
													<ul className="mt-2">
														{subcategory.items.map((item, index) => (
															<li key={index}>{item}</li>
														))}
													</ul>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</li>
					))}
				</ul>
			</div>

			{/* محتوای اصلی */}
			<div className="w-3/4 p-5">
				<h2 className="text-2xl font-bold">انتخاب گروه و زیرگروه</h2>
				<p className="mt-2">از سایدبار برای انتخاب گروه و زیرگروه استفاده کنید.</p>
			</div>
		</div>
	);
};

export default SidebarWithGroups;
