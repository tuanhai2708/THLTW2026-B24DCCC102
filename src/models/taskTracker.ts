import { useState } from 'react';
import moment from 'moment';

const STORAGE_KEY = 'taskTracker';

export interface TaskItem {
	id: string;
	name: string;
	description: string;
	deadline: string;
	priority: 'Cao' | 'Trung bình' | 'Thấp';
	status: 'todo' | 'inprogress' | 'done';
	tags: string[];
	createdAt: string;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const loadFromStorage = (): TaskItem[] => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

const saveToStorage = (tasks: TaskItem[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export default () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [editingTask, setEditingTask] = useState<TaskItem | undefined>(undefined);
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const loadTasks = () => {
		const data = loadFromStorage();
		setTasks(data);
	};

	const addTask = (task: Omit<TaskItem, 'id' | 'createdAt'>) => {
		const newTask: TaskItem = {
			...task,
			id: generateId(),
			createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
		};
		const updated = [...tasks, newTask];
		setTasks(updated);
		saveToStorage(updated);
	};

	const updateTask = (id: string, taskData: Partial<TaskItem>) => {
		const updated = tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t));
		setTasks(updated);
		saveToStorage(updated);
	};

	const deleteTask = (id: string) => {
		const updated = tasks.filter((t) => t.id !== id);
		setTasks(updated);
		saveToStorage(updated);
	};

	const moveTask = (taskId: string, newStatus: TaskItem['status']) => {
		const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
		setTasks(updated);
		saveToStorage(updated);
	};

	const reorderTasks = (updatedTasks: TaskItem[]) => {
		setTasks(updatedTasks);
		saveToStorage(updatedTasks);
	};

	// Stats
	const totalTasks = tasks.length;
	const doneTasks = tasks.filter((t) => t.status === 'done').length;
	const overdueTasks = tasks.filter(
		(t) => t.status !== 'done' && t.deadline && moment(t.deadline).isBefore(moment(), 'day'),
	).length;
	const todoTasks = tasks.filter((t) => t.status === 'todo').length;
	const inprogressTasks = tasks.filter((t) => t.status === 'inprogress').length;

	return {
		tasks,
		setTasks,
		visible,
		setVisible,
		editingTask,
		setEditingTask,
		isEdit,
		setIsEdit,
		loadTasks,
		addTask,
		updateTask,
		deleteTask,
		moveTask,
		reorderTasks,
		totalTasks,
		doneTasks,
		overdueTasks,
		todoTasks,
		inprogressTasks,
	};
};
