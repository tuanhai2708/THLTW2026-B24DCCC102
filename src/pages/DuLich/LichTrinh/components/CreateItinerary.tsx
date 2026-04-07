import { Modal, Form, Input, DatePicker, InputNumber, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface CreateItineraryProps {
	visible: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const CreateItinerary: React.FC<CreateItineraryProps> = ({ visible, onClose, onSuccess }) => {
	const [form] = Form.useForm();
	const { addItinerary } = useModel('dulich');

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const [startDate, endDate] = values.dateRange;
			const start = startDate.format('YYYY-MM-DD');
			const end = endDate.format('YYYY-MM-DD');

			// Tự động tạo các ngày trong khoảng
			const days: DuLich.ItineraryDay[] = [];
			const diffDays = endDate.diff(startDate, 'days') + 1;
			for (let i = 0; i < diffDays; i++) {
				days.push({
					dayNumber: i + 1,
					date: moment(start).add(i, 'days').format('YYYY-MM-DD'),
					destinations: [],
				});
			}

			await addItinerary({
				name: values.name,
				startDate: start,
				endDate: end,
				totalBudget: values.totalBudget,
				days,
			});

			message.success('Tạo lịch trình thành công!');
			form.resetFields();
			onClose();
			onSuccess();
		} catch (err) {
			// validation error
		}
	};

	return (
		<Modal
			title='Tạo lịch trình mới'
			visible={visible}
			onCancel={onClose}
			onOk={handleSubmit}
			okText='Tạo'
			cancelText='Hủy'
			width={520}
			centered
		>
			<Form form={form} layout='vertical' className='create-form'>
				<Form.Item
					name='name'
					label='Tên lịch trình'
					rules={[{ required: true, message: 'Vui lòng nhập tên lịch trình' }]}
				>
					<Input placeholder='VD: Du lịch Đà Nẵng 3 ngày 2 đêm' size='large' />
				</Form.Item>

				<Form.Item
					name='dateRange'
					label='Thời gian'
					rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
				>
					<RangePicker
						format='DD/MM/YYYY'
						placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
						style={{ width: '100%' }}
						size='large'
					/>
				</Form.Item>

				<Form.Item
					name='totalBudget'
					label='Ngân sách dự kiến (VNĐ)'
					rules={[{ required: true, message: 'Vui lòng nhập ngân sách' }]}
				>
					<InputNumber
						style={{ width: '100%' }}
						min={0}
						step={500000}
						formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(value) => value?.replace(/,/g, '') as any}
						placeholder='VD: 5,000,000'
						size='large'
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CreateItinerary;
