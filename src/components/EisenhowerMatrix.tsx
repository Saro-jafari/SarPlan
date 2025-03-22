'use client';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Section from './Section';
import { TaskType } from './Task';

interface TasksState {
	[key: string]: TaskType[];
}

const EisenhowerMatrix: React.FC = () => {
	const [tasks, setTasks] = useState<TasksState>({
		'مهم و فوری': [{ id: 1, content: 'کار ۱' }],
		'مهم ولی غیرفوری': [{ id: 2, content: 'کار ۲' }],
		'غیرمهم ولی فوری': [{ id: 3, content: 'کار ۳' }],
		'غیرمهم و غیرفوری': [{ id: 4, content: 'کار ۴' }],
	});

	const moveTask = (task: TaskType, toSection: string) => {
		setTasks(prevTasks => {
			const newTasks: TasksState = { ...prevTasks };
			// حذف تسک از بخش‌های قبلی
			Object.keys(newTasks).forEach(section => {
				newTasks[section] = newTasks[section].filter(t => t.id !== task.id);
			});
			// افزودن تسک به بخش جدید
			newTasks[toSection].push(task);
			return newTasks;
		});
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="grid md:grid-cols-2  gap-4 mt-6 ">
				{Object.keys(tasks).map(section => (
					<Section key={section} title={section} tasks={tasks[section]} moveTask={moveTask} />
				))}
			</div>
		</DndProvider>
	);
};

export default EisenhowerMatrix;
