import { Modal, Form, Input, Select, InputNumber, Rate, Divider } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface DestinationFormProps {
	visible: boolean;
	editingDest: DuLich.Destination | null;
	onClose: () => void;
	onSubmit: (values: Partial<DuLich.Destination>) => void;
}

const DestinationForm: React.FC<DestinationFormProps> = ({
	visible,
	editingDest,
	onClose,
	onSubmit,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible && editingDest) {
			form.setFieldsValue(editingDest);
		} else if (visible) {
			form.resetFields();
			form.setFieldsValue({ rating: 4.5, visitDuration: 4 });
		}
	}, [visible, editingDest]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onSubmit(values);
		} catch {
			// validation error
		}
	};

	return (
		<Modal
			title={editingDest ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
			visible={visible}
			onCancel={onClose}
			onOk={handleOk}
			okText={editingDest ? 'Cập nhật' : 'Thêm mới'}
			cancelText='Hủy'
			width={680}
			centered
		>
			<Form form={form} layout='vertical' className='dest-form'>
				<Form.Item
					name='name'
					label='Tên điểm đến'
					rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
				>
					<Input placeholder='VD: Bãi biển Mỹ Khê' size='large' />
				</Form.Item>

				<Form.Item
					name='location'
					label='Địa điểm'
					rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
				>
					<Input placeholder='VD: Đà Nẵng' size='large' />
				</Form.Item>

				<Form.Item
					name='type'
					label='Loại hình'
					rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
				>
					<Select placeholder='Chọn loại hình' size='large'>
						<Option value='bien'>🏖️ Biển</Option>
						<Option value='nui'>⛰️ Núi</Option>
						<Option value='thanh_pho'>🏙️ Thành phố</Option>
					</Select>
				</Form.Item>

				<Form.Item
					name='description'
					label='Mô tả'
					rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
				>
					<TextArea rows={4} placeholder='Mô tả chi tiết về điểm đến...' />
				</Form.Item>

				<Form.Item
					name='image'
					label='URL hình ảnh'
					rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
				>
					<Input placeholder='https://images.unsplash.com/...' size='large' />
				</Form.Item>

				<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
					<Form.Item
						name='rating'
						label='Đánh giá'
						style={{ flex: 1 }}
					>
						<Rate allowHalf />
					</Form.Item>

					<Form.Item
						name='visitDuration'
						label='Thời gian tham quan (giờ)'
						style={{ flex: 1 }}
						rules={[{ required: true, message: 'Vui lòng nhập' }]}
					>
						<InputNumber min={1} max={24} style={{ width: '100%' }} size='large' />
					</Form.Item>
				</div>

				<Divider>Chi phí (VNĐ)</Divider>

				<div className='cost-grid'>
					<Form.Item
						name='foodCost'
						label='🍜 Ăn uống'
						rules={[{ required: true, message: 'Nhập chi phí' }]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							step={50000}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value?.replace(/,/g, '') as any}
							size='large'
						/>
					</Form.Item>

					<Form.Item
						name='accommodationCost'
						label='🏨 Lưu trú'
						rules={[{ required: true, message: 'Nhập chi phí' }]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							step={50000}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value?.replace(/,/g, '') as any}
							size='large'
						/>
					</Form.Item>

					<Form.Item
						name='transportCost'
						label='🚗 Di chuyển'
						rules={[{ required: true, message: 'Nhập chi phí' }]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							step={50000}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value?.replace(/,/g, '') as any}
							size='large'
						/>
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
};

export default DestinationForm;
