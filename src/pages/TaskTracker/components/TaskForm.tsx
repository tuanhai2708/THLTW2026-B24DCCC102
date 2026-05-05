import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Select, Modal, Button } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import type { TaskItem } from '@/models/taskTracker';

const { TextArea } = Input;
const { Option } = Select;

const priorityOptions = [
	{ label: 'Cao', value: 'Cao' },
	{ label: 'Trung bình', value: 'Trung bình' },
	{ label: 'Thấp', value: 'Thấp' },
];

const statusOptions = [
	{ label: 'Cần làm', value: 'todo' },
	{ label: 'Đang làm', value: 'inprogress' },
	{ label: 'Hoàn thành', value: 'done' },
];

const tagOptions = ['Frontend', 'Backend', 'Design', 'Bug', 'Feature', 'Documentation', 'Testing', 'Urgent'];

const TaskForm: React.FC = () => {
	const [form] = Form.useForm();
	const { visible, setVisible, isEdit, editingTask, addTask, updateTask } = useModel('taskTracker');

	useEffect(() => {
		if (visible && isEdit && editingTask) {
			form.setFieldsValue({
				name: editingTask.name,
				description: editingTask.description,
				deadline: editingTask.deadline ? moment(editingTask.deadline) : undefined,
				priority: editingTask.priority,
				status: editingTask.status,
				tags: editingTask.tags || [],
			});
		} else if (visible && !isEdit) {
			form.resetFields();
		}
	}, [visible, isEdit, editingTask]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const taskData = {
				name: values.name,
				description: values.description || '',
				deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
				priority: values.priority,
				status: values.status || 'todo',
				tags: values.tags || [],
			};

			if (isEdit && editingTask) {
				updateTask(editingTask.id, taskData);
			} else {
				addTask(taskData as Omit<TaskItem, 'id' | 'createdAt'>);
			}

			form.resetFields();
			setVisible(false);
		} catch (err) {
			// validation failed
		}
	};

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
			visible={visible}
			onCancel={() => {
				form.resetFields();
				setVisible(false);
			}}
			footer={[
				<Button key='cancel' onClick={() => { form.resetFields(); setVisible(false); }}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' onClick={handleSubmit}>
					{isEdit ? 'Cập nhật' : 'Tạo mới'}
				</Button>,
			]}
			destroyOnClose
		>
			<Form form={form} layout='vertical' initialValues={{ priority: 'Trung bình', status: 'todo' }}>
				<Form.Item
					name='name'
					label='Tên task'
					rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}
				>
					<Input placeholder='Nhập tên task...' />
				</Form.Item>

				<Form.Item name='description' label='Mô tả'>
					<TextArea rows={3} placeholder='Nhập mô tả...' />
				</Form.Item>

				<Form.Item name='deadline' label='Deadline'>
					<DatePicker style={{ width: '100%' }} placeholder='Chọn deadline' format='DD/MM/YYYY' />
				</Form.Item>

				<Form.Item
					name='priority'
					label='Mức độ ưu tiên'
					rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
				>
					<Select placeholder='Chọn mức độ ưu tiên'>
						{priorityOptions.map((opt) => (
							<Option key={opt.value} value={opt.value}>
								{opt.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='status' label='Trạng thái'>
					<Select placeholder='Chọn trạng thái'>
						{statusOptions.map((opt) => (
							<Option key={opt.value} value={opt.value}>
								{opt.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='tags' label='Tags'>
					<Select mode='tags' placeholder='Chọn hoặc nhập tags'>
						{tagOptions.map((tag) => (
							<Option key={tag} value={tag}>
								{tag}
							</Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskForm;
