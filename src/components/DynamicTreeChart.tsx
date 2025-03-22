'use client';
import React, { useState } from 'react';
import Tree from 'react-d3-tree';

export type TreeNode = {
	name: string;
	children?: TreeNode[];
};

const initialData: TreeNode = {
	name: 'دسته‌بندی‌ها',
	children: [
		{
			name: 'ریاضی',
			children: [{ name: 'آیتم ۱' }, { name: 'آیتم ۲' }],
		},
		{
			name: ' عربی',
			children: [{ name: 'آیتم ۳' }],
		},
		{
			name: 'دسته ۳',
			children: [],
		},
	],
};

// تابع کمکی برای افزودن گره به درخت
const addNodeToTree = (node: TreeNode, parentName: string, newNode: TreeNode): boolean => {
	if (node.name === parentName) {
		if (node.children) {
			node.children.push(newNode);
		} else {
			node.children = [newNode];
		}
		return true;
	}
	if (node.children) {
		for (let child of node.children) {
			if (addNodeToTree(child, parentName, newNode)) {
				return true;
			}
		}
	}
	return false;
};

// تابع کمکی برای حذف گره از درخت (حذف اولین مورد مطابق)
const removeNodeFromTree = (node: TreeNode, targetName: string): boolean => {
	if (!node.children) return false;

	const index = node.children.findIndex(child => child.name === targetName);
	if (index !== -1) {
		node.children.splice(index, 1);
		return true;
	}
	for (let child of node.children) {
		if (removeNodeFromTree(child, targetName)) {
			return true;
		}
	}
	return false;
};

const EditableTreeChart: React.FC = () => {
	const [treeData, setTreeData] = useState<TreeNode>(initialData);
	const [addParent, setAddParent] = useState('');
	const [addNodeName, setAddNodeName] = useState('');
	const [removeNodeName, setRemoveNodeName] = useState('');

	// Handler افزودن گره
	const handleAddNode = () => {
		if (!addParent || !addNodeName) return;
		// کپی عمیق از درخت برای بروزرسانی state
		const newTree = JSON.parse(JSON.stringify(treeData)) as TreeNode;
		const added = addNodeToTree(newTree, addParent, { name: addNodeName });
		if (added) {
			setTreeData(newTree);
			setAddParent('');
			setAddNodeName('');
		} else {
			alert(`والد با نام "${addParent}" یافت نشد.`);
		}
	};

	// Handler حذف گره
	const handleRemoveNode = () => {
		if (!removeNodeName) return;
		const newTree = JSON.parse(JSON.stringify(treeData)) as TreeNode;
		const removed = removeNodeFromTree(newTree, removeNodeName);
		if (removed) {
			setTreeData(newTree);
			setRemoveNodeName('');
		} else {
			alert(`گره با نام "${removeNodeName}" یافت نشد.`);
		}
	};

	return (
		<div className="p-4 bg-white min-h-screen text-[#fff]  rounded-lg">
			<h2 className="text-2xl font-bold mb-6 text-center">ویرایش درخت دسته‌بندی</h2>
			<section className="grid grid-cols-2 gap-x-9 ">
				{/* فرم افزودن گره */}
				<div className="mb-6 border p-4 rounded-lg shadow-xl border-none bg-[#14162E]">
					<h3 className="text-xl font-semibold mb-4">افزودن گره</h3>
					<div className="flex flex-col gap-4 ">
						<input
							type="text"
							value={addParent}
							onChange={e => setAddParent(e.target.value)}
							placeholder="نام والد (مثلاً 'دسته ۱')"
							className="border border-blue-400 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							type="text"
							value={addNodeName}
							onChange={e => setAddNodeName(e.target.value)}
							placeholder="نام گره جدید"
							className="border border-blue-400 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button onClick={handleAddNode} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
							افزودن گره
						</button>
					</div>
				</div>

				{/* فرم حذف گره */}
				<div className="mb-6 border p-4 rounded-lg shadow-md bg-[#14162E]">
					<h3 className="text-xl font-semibold mb-4">حذف گره</h3>
					<div className="flex flex-col gap-4">
						<input
							type="text"
							value={removeNodeName}
							onChange={e => setRemoveNodeName(e.target.value)}
							placeholder="نام گره برای حذف (مثلاً 'آیتم ۱')"
							className="border border-red-400 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
						<button onClick={handleRemoveNode} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-md">
							حذف گره
						</button>
					</div>
				</div>
			</section>

			{/* نمایش درخت */}
			<div id="treeWrapper" style={{ width: '100%', height: '500px' }} className="bg-[#14162E]  shadow-lg rounded-lg">
				<Tree data={treeData} orientation="vertical"  />
			</div>
		</div>
	);
};

export default EditableTreeChart;
