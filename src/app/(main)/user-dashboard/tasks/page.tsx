'use client';
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash, Edit, GripVertical } from 'lucide-react';

const Tasks = () => {
	const [tasks, setTasks] = useState([]);
	const [taskText, setTaskText] = useState('');
	const [category, setCategory] = useState('عمومی');
	const [searchText, setSearchText] = useState('');
	const [filterCategory, setFilterCategory] = useState('همه');
	const categories = ['عمومی', 'کار', 'شخصی', 'دانشگاه'];

	const addTask = () => {
		if (taskText.trim() === '') return;
		const newTask = {
			id: Date.now(),
			text: taskText,
			category,
			// استفاده از Intl.DateTimeFormat برای دریافت تاریخ شمسی
			date: new Date().toLocaleDateString('fa-IR-u-ca-persian', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}),
		};
		setTasks([...tasks, newTask]);
		setTaskText('');
	};

	const deleteTask = id => {
		setTasks(tasks.filter(task => task.id !== id));
	};

	const editTask = (id, newText) => {
		setTasks(tasks.map(task => (task.id === id ? { ...task, text: newText } : task)));
	};

	const onDragEnd = event => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = tasks.findIndex(task => task.id === active.id);
			const newIndex = tasks.findIndex(task => task.id === over.id);
			setTasks(arrayMove(tasks, oldIndex, newIndex));
		}
	};

	const filteredTasks = tasks.filter(
		task => (filterCategory === 'همه' || task.category === filterCategory) && task.text.toLowerCase().includes(searchText.toLowerCase()),
	);

	return (
		<section
			className={`flex flex-col max-w-3xl mx-auto p-4 rounded-md shadow-md
				dark:bg-gray-900 text-white bg-gray-100 text-black'
			}`}>
			<div className="flex gap-4 mb-4">
				<input
					type="text"
					className="p-2 flex-1 border rounded-sm bg-gray-200 dark:bg-gray-800"
					placeholder="متن تسک..."
					value={taskText}
					onChange={e => setTaskText(e.target.value)}
				/>
				<select className="p-2 border rounded-sm bg-gray-200 dark:bg-gray-800" value={category} onChange={e => setCategory(e.target.value)}>
					{categories.map(cat => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
				<button className="bg-blue-500 text-white p-2 rounded-sm" onClick={addTask}>
					افزودن
				</button>
			</div>

			<div className="flex gap-4 mb-4">
				<input
					type="text"
					className="p-2 flex-1 border rounded-sm bg-gray-200 dark:bg-gray-800"
					placeholder="جستجو..."
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
				/>
				<select
					className="p-2 border rounded-sm bg-gray-200 dark:bg-gray-800"
					value={filterCategory}
					onChange={e => setFilterCategory(e.target.value)}>
					<option value="همه">همه دسته‌بندی‌ها</option>
					{categories.map(cat => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
				<SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
					{filteredTasks.map(task => (
						<SortableTask key={task.id} task={task} onDelete={deleteTask} onEdit={editTask} />
					))}
				</SortableContext>
			</DndContext>
		</section>
	);
};

const SortableTask = ({ task, onDelete, onEdit }) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
	const [isEditing, setIsEditing] = useState(false);
	const [newText, setNewText] = useState(task.text);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-md rounded-md mb-2">
			<div className="flex items-center gap-2">
				{/* این قسمت به عنوان drag handle */}
				<div {...listeners} className="cursor-grab">
					<div {...listeners} className="cursor-grab">
						<GripVertical size={18} />
					</div>
				</div>
				{isEditing ? (
					<input
						className="border p-1 flex-1 bg-gray-200 dark:bg-gray-800"
						value={newText}
						onChange={e => setNewText(e.target.value)}
						onBlur={() => {
							onEdit(task.id, newText);
							setIsEditing(false);
						}}
						autoFocus
					/>
				) : (
					<p className="flex-1">
						{task.text}{' '}
						<span className="text-gray-500 text-sm">
							({task.category} - {task.date})
						</span>
					</p>
				)}
			</div>
			<div className="flex gap-2">
				<button onClick={() => setIsEditing(true)} className="text-blue-500">
					<Edit size={18} />
				</button>
				<button onClick={() => onDelete(task.id)} className="text-red-500">
					<Trash size={18} />
				</button>
			</div>
		</div>
	);
};

export default Tasks;
