import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Tag, Popconfirm, message, Space, Rate, Input } from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EnvironmentOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { createDestination, updateDestination, deleteDestination } from '@/services/DuLich/api';
import DestinationForm from './components/DestinationForm';
import './style.less';

const TYPE_MAP: Record<DuLich.DestinationType, { label: string; color: string }> = {
	bien: { label: '🏖️ Biển', color: 'cyan' },
	nui: { label: '⛰️ Núi', color: 'green' },
	thanh_pho: { label: '🏙️ Thành phố', color: 'gold' },
};

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const QuanLyDiemDen: React.FC = () => {
	const { destinations, loading, fetchDestinations } = useModel('dulich');
	const [formVisible, setFormVisible] = useState(false);
	const [editingDest, setEditingDest] = useState<DuLich.Destination | null>(null);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchDestinations();
	}, []);

	const handleCreate = () => {
		setEditingDest(null);
		setFormVisible(true);
	};

	const handleEdit = (dest: DuLich.Destination) => {
		setEditingDest(dest);
		setFormVisible(true);
	};

	const handleDelete = async (id: string) => {
		await deleteDestination(id);
		message.success('Đã xóa điểm đến');
		fetchDestinations();
	};

	const handleFormSubmit = async (values: Partial<DuLich.Destination>) => {
		if (editingDest) {
			await updateDestination(editingDest.id, values);
			message.success('Cập nhật thành công');
		} else {
			await createDestination(values);
			message.success('Thêm mới thành công');
		}
		setFormVisible(false);
		fetchDestinations();
	};

	const filteredData = destinations.filter(
		(d) =>
			d.name.toLowerCase().includes(searchText.toLowerCase()) ||
			d.location.toLowerCase().includes(searchText.toLowerCase()),
	);

	const columns = [
		{
			title: 'Ảnh',
			dataIndex: 'image',
			key: 'image',
			width: 100,
			render: (image: string, record: DuLich.Destination) => (
				<img
					className='table-image'
					src={image}
					alt={record.name}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
					}}
				/>
			),
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'name',
			key: 'name',
			render: (name: string, record: DuLich.Destination) => (
				<div>
					<div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
					<div style={{ color: '#888', fontSize: 12 }}>
						<EnvironmentOutlined /> {record.location}
					</div>
				</div>
			),
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			key: 'type',
			width: 120,
			filters: [
				{ text: 'Biển', value: 'bien' },
				{ text: 'Núi', value: 'nui' },
				{ text: 'Thành phố', value: 'thanh_pho' },
			],
			onFilter: (value: any, record: DuLich.Destination) => record.type === value,
			render: (type: DuLich.DestinationType) => (
				<Tag color={TYPE_MAP[type].color} className='type-tag'>
					{TYPE_MAP[type].label}
				</Tag>
			),
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			width: 160,
			sorter: (a: DuLich.Destination, b: DuLich.Destination) => a.rating - b.rating,
			render: (rating: number) => (
				<Space>
					<Rate disabled allowHalf defaultValue={rating} style={{ fontSize: 14 }} />
					<span style={{ fontWeight: 600 }}>{rating}</span>
				</Space>
			),
		},
		{
			title: 'Chi phí tổng',
			key: 'totalCost',
			width: 150,
			sorter: (a: DuLich.Destination, b: DuLich.Destination) => {
				const costA = a.foodCost + a.accommodationCost + a.transportCost;
				const costB = b.foodCost + b.accommodationCost + b.transportCost;
				return costA - costB;
			},
			render: (_: any, record: DuLich.Destination) => (
				<strong style={{ color: '#1890ff' }}>
					{formatPrice(record.foodCost + record.accommodationCost + record.transportCost)}
				</strong>
			),
		},
		{
			title: 'Thời gian',
			dataIndex: 'visitDuration',
			key: 'visitDuration',
			width: 100,
			render: (val: number) => `${val} giờ`,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 150,
			render: (_: any, record: DuLich.Destination) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						size='small'
						onClick={() => handleEdit(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa điểm đến này? Dữ liệu sẽ không thể khôi phục.'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger icon={<DeleteOutlined />} size='small'>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='admin-diem-den-page'>
			<div className='page-header'>
				<h1 className='page-title'>
					<EnvironmentOutlined style={{ marginRight: 10, color: '#22c55e' }} />
					Quản lý Điểm đến
				</h1>
				<Space>
					<Input
						placeholder='Tìm kiếm...'
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 250, borderRadius: 8 }}
						size='large'
						allowClear
					/>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleCreate}
						size='large'
						style={{ borderRadius: 8 }}
					>
						Thêm điểm đến
					</Button>
				</Space>
			</div>

			<div className='table-wrapper'>
				<Table
					dataSource={filteredData}
					columns={columns as any}
					rowKey='id'
					loading={loading}
					scroll={{ x: 900 }}
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showTotal: (total) => `Tổng ${total} điểm đến`,
					}}
				/>
			</div>

			<DestinationForm
				visible={formVisible}
				editingDest={editingDest}
				onClose={() => setFormVisible(false)}
				onSubmit={handleFormSubmit}
			/>
		</div>
	);
};

export default QuanLyDiemDen;
