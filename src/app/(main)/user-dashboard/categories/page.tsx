'use client';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FolderPlus, Upload, Folder as FolderIcon } from 'lucide-react';

interface Folder {
	id: number;
	title: string;
	children: Folder[];
}

interface FolderItemProps {
	folder: Folder;
	moveFolder: (draggedId: number, targetId: number) => void;
	addSubFolder: (parentId: number) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, moveFolder, addSubFolder }) => {
	const [isOpen, setIsOpen] = useState(false);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'FOLDER',
		item: { id: folder.id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const [, drop] = useDrop(() => ({
		accept: 'FOLDER',
		drop: (draggedItem: { id: number }) => moveFolder(draggedItem.id, folder.id),
	}));

	return (
		<div ref={node => drag(drop(node))} className={`p-2 border rounded-lg cursor-pointer ${isDragging ? 'opacity-50' : ''}`}>
			<div className="flex items-center justify-between" onClick={() => setIsOpen(!isOpen)}>
				<span className="flex items-center">
					<FolderIcon className="mr-2" /> {folder.title}
				</span>
				<div className="flex gap-2">
					<Upload className="cursor-pointer" title="Upload here" />
					<FolderPlus className="cursor-pointer" title="Add subfolder" onClick={() => addSubFolder(folder.id)} />
				</div>
			</div>
			{isOpen && folder.children.length > 0 && (
				<div className="ml-4 border-l pl-2 mt-2">
					{folder.children.map(subFolder => (
						<FolderItem key={subFolder.id} folder={subFolder} moveFolder={moveFolder} addSubFolder={addSubFolder} />
					))}
				</div>
			)}
		</div>
	);
};

const FolderList: React.FC = () => {
	const [folders, setFolders] = useState<Folder[]>([
		{ id: 1, title: 'Folder 1', children: [] },
		{ id: 2, title: 'Folder 2', children: [] },
	]);

	const moveFolder = (draggedId: number, targetId: number) => {
		console.log(`Move folder ${draggedId} to ${targetId}`);
	};

	const addSubFolder = (parentId: number) => {
		const newFolder: Folder = { id: Date.now(), title: 'New Subfolder', children: [] };

		// تابع بازگشتی برای یافتن فولدر مورد نظر و افزودن ساب‌فولدر
		const addFolderRecursive = (folders: Folder[]): Folder[] => {
			return folders.map(folder => {
				if (folder.id === parentId) {
					return { ...folder, children: [...folder.children, newFolder] };
				}
				return { ...folder, children: addFolderRecursive(folder.children) };
			});
		};

		setFolders(prevFolders => addFolderRecursive(prevFolders));
	};

	return (
		<div className="p-4 max-w-lg mx-auto">
			<h2 className="text-xl font-bold mb-4">Folders</h2>
			<div className="space-y-2">
				{folders.map(folder => (
					<FolderItem key={folder.id} folder={folder} moveFolder={moveFolder} addSubFolder={addSubFolder} />
				))}
			</div>
		</div>
	);
};

export default FolderList;
