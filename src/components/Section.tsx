import React from 'react';
import { useDrop } from 'react-dnd';
import Task, { TaskType } from './Task';

export interface SectionProps {
	title: string;
	tasks: TaskType[];
	moveTask: (task: TaskType, toSection: string) => void;
}

const Section: React.FC<SectionProps> = ({ title, tasks, moveTask }) => {
	const [, ref] = useDrop({
		accept: 'TASK',
		drop: (item: TaskType & { index: number }) => {
			moveTask(item, title);
		},
	});

	return (
		<div ref={ref} className="p-4 border rounded-lg bg-[#14162E] min-h-62">
			<h3 className="font-bold">{title}</h3>
			<div className="mt-2 space-y-1">
				{tasks.map((task, index) => (
					<Task key={task.id} task={task} index={index} />
				))}
			</div>
		</div>
	);
};

export default Section;
