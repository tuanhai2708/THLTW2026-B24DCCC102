import { Modal, Input, TimePicker, Form, message } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface DestinationPickerProps {
	visible: boolean;
	onClose: () => void;
	onSelect: (item: DuLich.ItineraryDestination) => void;
}

const DestinationPicker: React.FC<DestinationPickerProps> = ({ visible, onClose, onSelect }) => {
	const { destinations, fetchDestinations } = useModel('dulich');
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			fetchDestinations();
			setSelectedId(null);
			form.resetFields();
		}
	}, [visible]);

	const filteredDests = destinations.filter(
		(d) =>
			d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
			d.location.toLowerCase().includes(searchKeyword.toLowerCase()),
	);

	const handleConfirm = async () => {
		if (!selectedId) {
			message.warning('Vui lòng chọn một điểm đến');
			return;
		}

		try {
			const values = await form.validateFields();
			const itineraryDest: DuLich.ItineraryDestination = {
				destinationId: selectedId,
				destination: destinations.find((d) => d.id === selectedId),
				startTime: values.timeRange[0].format('HH:mm'),
				endTime: values.timeRange[1].format('HH:mm'),
				notes: values.notes || '',
				travelTimeFromPrev: values.travelTime || 30,
			};
			onSelect(itineraryDest);
			onClose();
		} catch {
			// validation
		}
	};

	return (
		<Modal
			title='Chọn điểm đến'
			visible={visible}
			onCancel={onClose}
			onOk={handleConfirm}
			okText='Thêm vào lịch trình'
			cancelText='Hủy'
			width={680}
			centered
		>
			<div className='destination-picker'>
				<Input
					placeholder='Tìm kiếm điểm đến...'
					prefix={<SearchOutlined />}
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					style={{ marginBottom: 16, borderRadius: 8 }}
					size='large'
					allowClear
				/>

				<div className='picker-grid'>
					{filteredDests.map((dest) => (
						<div
							key={dest.id}
							className={`picker-card ${selectedId === dest.id ? 'selected' : ''}`}
							onClick={() => setSelectedId(dest.id)}
						>
							<img
								className='picker-img'
								src={dest.image}
								alt={dest.name}
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
								}}
							/>
							<div className='picker-info'>
								<div className='picker-name'>{dest.name}</div>
								<div className='picker-location'>
									<EnvironmentOutlined /> {dest.location}
								</div>
								<div className='picker-cost'>
									{formatPrice(dest.foodCost + dest.accommodationCost + dest.transportCost)}
								</div>
							</div>
						</div>
					))}
				</div>

				{selectedId && (
					<Form form={form} layout='vertical' style={{ marginTop: 20 }}>
						<Form.Item
							name='timeRange'
							label='Thời gian'
							rules={[{ required: true, message: 'Chọn thời gian' }]}
							initialValue={[moment('08:00', 'HH:mm'), moment('12:00', 'HH:mm')]}
						>
							<TimePicker.RangePicker format='HH:mm' style={{ width: '100%' }} size='large' />
						</Form.Item>
						<Form.Item name='travelTime' label='Thời gian di chuyển (phút)' initialValue={30}>
							<Input type='number' min={0} size='large' />
						</Form.Item>
						<Form.Item name='notes' label='Ghi chú'>
							<Input.TextArea rows={2} placeholder='Ghi chú hoạt động...' />
						</Form.Item>
					</Form>
				)}
			</div>
		</Modal>
	);
};

export default DestinationPicker;
