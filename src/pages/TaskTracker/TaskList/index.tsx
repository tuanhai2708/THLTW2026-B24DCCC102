import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Input, Select, Space, Popconfirm, Tooltip } from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	SearchOutlined,
	ClockCircleOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import TaskForm from '../components/TaskForm';
import '../style.less';

const { Option } = Select;

const statusMap: Record<string, { text: string; color: string }> = {
	todo: { text: 'Cần làm', color: 'blue' },
	inprogress: { text: 'Đang làm', color: 'orange' },
	done: { text: 'Hoàn thành', color: 'green' },
};

const priorityMap: Record<string, { color: string }> = {
	Cao: { color: 'red' },
	'Trung bình': { color: 'orange' },
	Thấp: { color: 'green' },
};

const TaskList: React.FC = () => {
	const { tasks, loadTasks, deleteTask, setVisible, setIsEdit, setEditingTask } = useModel('taskTracker');
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

	useEffect(() => {
		loadTasks();
	}, []);

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

	const filteredTasks = tasks.filter((task) => {
		const matchSearch = task.name.toLowerCase().includes(searchText.toLowerCase());
		const matchStatus = filterStatus ? task.status === filterStatus : true;
		return matchSearch && matchStatus;
	});

	const columns = [
		{
			title: 'Tên Task',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: '20%',
			ellipsis: true,
			render: (text: string) => text || <span style={{ color: '#bfbfbf' }}>—</span>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: '12%',
			filters: [
				{ text: 'Cần làm', value: 'todo' },
				{ text: 'Đang làm', value: 'inprogress' },
				{ text: 'Hoàn thành', value: 'done' },
			],
			onFilter: (value: any, record: any) => record.status === value,
			render: (status: string) => {
				const info = statusMap[status];
				return info ? <Tag color={info.color}>{info.text}</Tag> : status;
			},
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			key: 'priority',
			width: '10%',
			filters: [
				{ text: 'Cao', value: 'Cao' },
				{ text: 'Trung bình', value: 'Trung bình' },
				{ text: 'Thấp', value: 'Thấp' },
			],
			onFilter: (value: any, record: any) => record.priority === value,
			render: (priority: string) => {
				const info = priorityMap[priority];
				return info ? <Tag color={info.color}>{priority}</Tag> : priority;
			},
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			width: '14%',
			sorter: (a: any, b: any) => {
				if (!a.deadline) return 1;
				if (!b.deadline) return -1;
				return moment(a.deadline).unix() - moment(b.deadline).unix();
			},
			render: (deadline: string, record: any) => {
				if (!deadline) return <span style={{ color: '#bfbfbf' }}>—</span>;
				const overdue = isOverdue(deadline, record.status);
				return (
					<span style={{ color: overdue ? '#ff4d4f' : undefined, fontWeight: overdue ? 500 : 400 }}>
						<ClockCircleOutlined style={{ marginRight: 4 }} />
						{moment(deadline).format('DD/MM/YYYY')}
						{overdue && <Tag color='red' style={{ marginLeft: 4, fontSize: 11 }}>Quá hạn</Tag>}
					</span>
				);
			},
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			width: '14%',
			render: (tags: string[]) =>
				tags && tags.length > 0 ? (
					<>
						{tags.map((tag) => (
							<Tag key={tag} style={{ marginBottom: 2 }}>
								{tag}
							</Tag>
						))}
					</>
				) : (
					<span style={{ color: '#bfbfbf' }}>—</span>
				),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: '10%',
			render: (_: any, record: any) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button type='text' icon={<EditOutlined />} onClick={() => openEdit(record)} />
					</Tooltip>
					<Popconfirm title='Xóa task này?' onConfirm={() => deleteTask(record.id)}>
						<Tooltip title='Xóa'>
							<Button type='text' danger icon={<DeleteOutlined />} />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<div className='task-list-header'>
				<h2>Danh sách Task</h2>
				<Space>
					<Input
						placeholder='Tìm kiếm theo tên...'
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
						style={{ width: 220 }}
					/>
					<Select
						placeholder='Lọc trạng thái'
						allowClear
						value={filterStatus}
						onChange={(val) => setFilterStatus(val)}
						style={{ width: 160 }}
					>
						<Option value='todo'>Cần làm</Option>
						<Option value='inprogress'>Đang làm</Option>
						<Option value='done'>Hoàn thành</Option>
					</Select>
					<Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>
						Thêm Task
					</Button>
				</Space>
			</div>

			<Table
				columns={columns}
				dataSource={filteredTasks}
				rowKey='id'
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} task` }}
				bordered
				size='middle'
			/>

			<TaskForm />
		</div>
	);
};

export default TaskList;
