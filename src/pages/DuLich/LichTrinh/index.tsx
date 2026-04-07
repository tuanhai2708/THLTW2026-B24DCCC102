import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Button, Spin, Empty, Card, Popconfirm, message } from 'antd';
import {
	PlusOutlined,
	ScheduleOutlined,
	CalendarOutlined,
	WalletOutlined,
	EnvironmentOutlined,
	DeleteOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import CreateItinerary from './components/CreateItinerary';
import ItineraryDetail from './components/ItineraryDetail';
import './style.less';

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const LichTrinh: React.FC = () => {
	const { itineraries, loading, fetchItineraries, removeItinerary } = useModel('dulich');
	const [createVisible, setCreateVisible] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		fetchItineraries();
	}, []);

	const handleDelete = async (id: string) => {
		await removeItinerary(id);
		message.success('Đã xóa lịch trình');
		fetchItineraries();
	};

	// Nếu đang xem chi tiết 1 lịch trình
	if (selectedId) {
		return (
			<div className='lich-trinh-page'>
				<ItineraryDetail itineraryId={selectedId} onBack={() => setSelectedId(null)} />
			</div>
		);
	}

	return (
		<div className='lich-trinh-page'>
			<div className='page-header'>
				<h1 className='page-title'>
					<ScheduleOutlined style={{ marginRight: 10, color: '#667eea' }} />
					Lịch trình du lịch
				</h1>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => setCreateVisible(true)}
					size='large'
					style={{ borderRadius: 8 }}
				>
					Tạo lịch trình mới
				</Button>
			</div>

			<Spin spinning={loading}>
				{itineraries.length > 0 ? (
					<div className='itinerary-list'>
						{itineraries.map((itin) => {
							const totalDests = itin.days.reduce(
								(sum, day) => sum + day.destinations.length,
								0,
							);
							const dayCount = itin.days.length;

							return (
								<div key={itin.id} className='itinerary-card'>
									<div className='card-header'>
										<div className='card-name'>{itin.name}</div>
										<div className='card-dates'>
											<CalendarOutlined />
											{itin.startDate} → {itin.endDate}
										</div>
									</div>
									<div className='card-body'>
										<div className='card-stats'>
											<div className='stat-item'>
												<div className='stat-value'>{dayCount}</div>
												<div className='stat-label'>Ngày</div>
											</div>
											<div className='stat-item'>
												<div className='stat-value'>{totalDests}</div>
												<div className='stat-label'>Điểm đến</div>
											</div>
											<div className='stat-item'>
												<div className='stat-value'>
													{(itin.totalBudget / 1000000).toFixed(1)}tr
												</div>
												<div className='stat-label'>Ngân sách</div>
											</div>
										</div>

										<div className='card-actions'>
											<Button
												type='primary'
												icon={<EyeOutlined />}
												size='small'
												onClick={() => setSelectedId(itin.id)}
											>
												Xem
											</Button>
											<Popconfirm
												title='Xóa lịch trình này?'
												onConfirm={() => handleDelete(itin.id)}
												okText='Xóa'
												cancelText='Hủy'
											>
												<Button
													danger
													icon={<DeleteOutlined />}
													size='small'
												>
													Xóa
												</Button>
											</Popconfirm>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<Card>
						<Empty description='Chưa có lịch trình nào. Hãy tạo lịch trình đầu tiên!' />
					</Card>
				)}
			</Spin>

			<CreateItinerary
				visible={createVisible}
				onClose={() => setCreateVisible(false)}
				onSuccess={() => fetchItineraries()}
			/>
		</div>
	);
};

export default LichTrinh;
