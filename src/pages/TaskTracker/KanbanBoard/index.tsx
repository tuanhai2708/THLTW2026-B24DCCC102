import React, { useEffect } from 'react';
import { Badge, Button, Tag, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useModel } from 'umi';
import moment from 'moment';
import TaskForm from '../components/TaskForm';
import '../style.less';

interface ColumnConfig {
	id: 'todo' | 'inprogress' | 'done';
	title: string;
}

const columns: ColumnConfig[] = [
	{ id: 'todo', title: 'Cần làm' },
	{ id: 'inprogress', title: 'Đang làm' },
	{ id: 'done', title: 'Hoàn thành' },
];

const priorityMap: Record<string, string> = {
	Cao: 'priority-cao',
	'Trung bình': 'priority-trung-binh',
	Thấp: 'priority-thap',
};

const KanbanBoard: React.FC = () => {
	const { tasks, loadTasks, moveTask, reorderTasks, setVisible, setIsEdit, setEditingTask, deleteTask } =
		useModel('taskTracker');

	useEffect(() => {
		loadTasks();
	}, []);

	const handleDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		const newStatus = destination.droppableId as 'todo' | 'inprogress' | 'done';

		if (source.droppableId !== destination.droppableId) {
			moveTask(draggableId, newStatus);
		} else {
			// Reorder within the same column
			const columnTasks = tasks.filter((t) => t.status === newStatus);
			const otherTasks = tasks.filter((t) => t.status !== newStatus);
			const [movedTask] = columnTasks.splice(source.index, 1);
			columnTasks.splice(destination.index, 0, movedTask);
			reorderTasks([...otherTasks, ...columnTasks]);
		}
	};

	const openAdd = () => {
		setIsEdit(false);
		setEditingTask(undefined);
		setVisible(true);
	};

	const openEdit = (task: any) => {
		setIsEdit(true);
		setEditingTask(task);
		setVisible(true);
	};

	const isOverdue = (deadline: string, status: string) => {
		return status !== 'done' && deadline && moment(deadline).isBefore(moment(), 'day');
	};

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<h2 style={{ margin: 0 }}>Kanban Board</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>
					Thêm Task
				</Button>
			</div>

			<DragDropContext onDragEnd={handleDragEnd}>
				<div className='kanban-container'>
					{columns.map((col) => {
						const columnTasks = tasks.filter((t) => t.status === col.id);
						return (
							<div key={col.id} className={`kanban-column ${col.id}`}>
								<div className='kanban-column-header'>
									<h3>{col.title}</h3>
									<Badge count={columnTasks.length} />
								</div>

								<Droppable droppableId={col.id}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											style={{
												minHeight: 200,
												background: snapshot.isDraggingOver ? '#f0f5ff' : 'transparent',
												borderRadius: 6,
												padding: 4,
												transition: 'background 0.2s ease',
											}}
										>
											{columnTasks.length === 0 && !snapshot.isDraggingOver && (
												<div className='kanban-empty'>Kéo thả task vào đây</div>
											)}
											{columnTasks.map((task, index) => (
												<Draggable key={task.id} draggableId={task.id} index={index}>
													{(dragProvided, dragSnapshot) => (
														<div
															ref={dragProvided.innerRef}
															{...dragProvided.draggableProps}
															{...dragProvided.dragHandleProps}
															className={`kanban-task-card ${priorityMap[task.priority] || ''}`}
															style={{
																...dragProvided.draggableProps.style,
																opacity: dragSnapshot.isDragging ? 0.8 : 1,
															}}
														>
															<div className='task-name'>{task.name}</div>
															{task.description && (
																<div className='task-desc'>{task.description}</div>
															)}
															<div className='task-meta'>
																{task.deadline ? (
																	<span className={isOverdue(task.deadline, task.status) ? 'deadline-overdue' : ''}>
																		<ClockCircleOutlined style={{ marginRight: 4 }} />
																		{moment(task.deadline).format('DD/MM/YYYY')}
																		{isOverdue(task.deadline, task.status) && ' (Quá hạn)'}
																	</span>
																) : (
																	<span>Không có deadline</span>
																)}
																<Tag
																	color={
																		task.priority === 'Cao'
																			? 'red'
																			: task.priority === 'Trung bình'
																			? 'orange'
																			: 'green'
																	}
																	style={{ margin: 0, fontSize: 11 }}
																>
																	{task.priority}
																</Tag>
															</div>
															{task.tags && task.tags.length > 0 && (
																<div className='task-tags'>
																	{task.tags.map((tag) => (
																		<Tag key={tag} style={{ fontSize: 11, marginBottom: 2 }}>
																			{tag}
																		</Tag>
																	))}
																</div>
															)}
															<div className='task-actions'>
																<Tooltip title='Chỉnh sửa'>
																	<Button
																		type='text'
																		size='small'
																		icon={<EditOutlined />}
																		onClick={(e) => {
																			e.stopPropagation();
																			openEdit(task);
																		}}
																	/>
																</Tooltip>
																<Popconfirm
																	title='Xóa task này?'
																	onConfirm={(e) => {
																		e?.stopPropagation();
																		deleteTask(task.id);
																	}}
																	onCancel={(e) => e?.stopPropagation()}
																>
																	<Tooltip title='Xóa'>
																		<Button
																			type='text'
																			size='small'
																			danger
																			icon={<DeleteOutlined />}
																			onClick={(e) => e.stopPropagation()}
																		/>
																	</Tooltip>
																</Popconfirm>
															</div>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						);
					})}
				</div>
			</DragDropContext>

			<TaskForm />
		</div>
	);
};

export default KanbanBoard;
