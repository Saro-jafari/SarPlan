import React from 'react';
import { useDrag } from 'react-dnd';

export interface TaskType {
	id: number;
	content: string;
}

export interface TaskProps {
	task: TaskType;
	index: number;
}

const ItemType = 'TASK';

const Task: React.FC<TaskProps> = ({ task, index }) => {
	const [, ref] = useDrag({
		type: ItemType,
		item: { index, ...task },
	});

	return (
		<div ref={ref} className="p-2 bg-white shadow rounded-md">
			{task.content}
		</div>
	);
};

export default Task;
