import { Tabs, Button, Empty, Popconfirm, message, Tag } from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	CalendarOutlined,
	WalletOutlined,
	ClockCircleOutlined,
	EnvironmentOutlined,
	CarOutlined,
	ArrowLeftOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import DestinationPicker from './DestinationPicker';

const { TabPane } = Tabs;

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface ItineraryDetailProps {
	itineraryId: string;
	onBack: () => void;
}

const ItineraryDetail: React.FC<ItineraryDetailProps> = ({ itineraryId, onBack }) => {
	const { currentItinerary, fetchItineraryDetail, editItinerary, destinations, fetchDestinations, calculateBudgetBreakdown } =
		useModel('dulich');
	const [pickerVisible, setPickerVisible] = useState(false);
	const [activeDayIndex, setActiveDayIndex] = useState(0);

	useEffect(() => {
		fetchItineraryDetail(itineraryId);
		fetchDestinations();
	}, [itineraryId]);

	/** Tính toán ngân sách realtime */
	const budgetInfo = useMemo(() => {
		if (!currentItinerary) return { breakdown: { food: 0, accommodation: 0, transport: 0, other: 0, total: 0 }, percentage: 0 };
		const breakdown = calculateBudgetBreakdown(currentItinerary);
		const percentage = currentItinerary.totalBudget > 0 ? (breakdown.total / currentItinerary.totalBudget) * 100 : 0;
		return { breakdown, percentage };
	}, [currentItinerary, destinations]);

	/** Thêm điểm đến vào ngày đang chọn */
	const handleAddDestination = async (item: DuLich.ItineraryDestination) => {
		if (!currentItinerary) return;

		const updatedDays = [...currentItinerary.days];
		updatedDays[activeDayIndex] = {
			...updatedDays[activeDayIndex],
			destinations: [...updatedDays[activeDayIndex].destinations, item],
		};

		await editItinerary(currentItinerary.id, { days: updatedDays });
		message.success('Đã thêm điểm đến!');
		fetchItineraryDetail(itineraryId);
	};

	/** Xóa điểm đến khỏi ngày */
	const handleRemoveDestination = async (dayIndex: number, destIndex: number) => {
		if (!currentItinerary) return;

		const updatedDays = [...currentItinerary.days];
		const updatedDests = [...updatedDays[dayIndex].destinations];
		updatedDests.splice(destIndex, 1);
		updatedDays[dayIndex] = { ...updatedDays[dayIndex], destinations: updatedDests };

		await editItinerary(currentItinerary.id, { days: updatedDays });
		message.success('Đã xóa điểm đến');
		fetchItineraryDetail(itineraryId);
	};

	if (!currentItinerary) return null;

	const getBudgetColor = () => {
		if (budgetInfo.percentage > 100) return '#ef4444';
		if (budgetInfo.percentage > 80) return '#f59e0b';
		return '#22c55e';
	};

	const totalDests = currentItinerary.days.reduce((sum, day) => sum + day.destinations.length, 0);

	return (
		<div className='itinerary-detail'>
			{/* Header */}
			<div className='detail-header'>
				<div>
					<Button
						type='text'
						icon={<ArrowLeftOutlined />}
						onClick={onBack}
						style={{ color: '#fff', marginBottom: 8, padding: 0 }}
					>
						Quay lại
					</Button>
					<h2 className='detail-title'>{currentItinerary.name}</h2>
				</div>
				<div className='detail-meta'>
					<div className='meta-item'>
						<CalendarOutlined />
						{currentItinerary.startDate} → {currentItinerary.endDate}
					</div>
					<div className='meta-item'>
						<EnvironmentOutlined />
						{totalDests} điểm đến
					</div>
				</div>
			</div>

			{/* Budget Bar */}
			<div className='detail-budget-bar'>
				<div className='budget-item'>
					<div className='budget-value' style={{ color: '#1890ff' }}>
						{formatPrice(currentItinerary.totalBudget)}
					</div>
					<div className='budget-label'>Ngân sách</div>
				</div>
				<div className='budget-item'>
					<div className='budget-value' style={{ color: getBudgetColor() }}>
						{formatPrice(budgetInfo.breakdown.total)}
					</div>
					<div className='budget-label'>Đã chi</div>
				</div>
				<div className='budget-item'>
					<div className='budget-value' style={{ color: getBudgetColor() }}>
						{formatPrice(currentItinerary.totalBudget - budgetInfo.breakdown.total)}
					</div>
					<div className='budget-label'>Còn lại</div>
				</div>
				<div className={`budget-item ${budgetInfo.percentage > 100 ? 'over-budget' : ''}`}>
					<div className='budget-value' style={{ color: getBudgetColor() }}>
						{budgetInfo.percentage.toFixed(0)}%
					</div>
					<div className='budget-label'>Đã dùng</div>
				</div>
			</div>

			{/* Day Tabs */}
			<Tabs
				className='day-tabs'
				activeKey={String(activeDayIndex)}
				onChange={(key) => setActiveDayIndex(Number(key))}
				type='card'
			>
				{currentItinerary.days.map((day, dayIndex) => (
					<TabPane
						tab={
							<span>
								<CalendarOutlined style={{ marginRight: 4 }} />
								Ngày {day.dayNumber} ({day.date})
							</span>
						}
						key={String(dayIndex)}
					>
						<div className='day-content'>
							{day.destinations.length > 0 ? (
								day.destinations.map((dd, destIndex) => {
									const dest = dd.destination || destinations.find((d) => d.id === dd.destinationId);
									const totalCost = dest
										? dest.foodCost + dest.accommodationCost + dest.transportCost
										: 0;

									return (
										<div key={destIndex} className='timeline-item'>
											<div className='timeline-time'>
												<div className='time-range'>
													{dd.startTime} - {dd.endTime}
												</div>
												{dd.travelTimeFromPrev > 0 && (
													<div className='travel-time'>
														<CarOutlined /> {dd.travelTimeFromPrev} phút di chuyển
													</div>
												)}
											</div>

											<div className='timeline-info'>
												<div className='timeline-name'>
													{dest?.name || 'Điểm đến không xác định'}
												</div>
												<div className='timeline-location'>
													<EnvironmentOutlined />
													{dest?.location || ''}
												</div>
												{dd.notes && (
													<div className='timeline-notes'>📝 {dd.notes}</div>
												)}
											</div>

											<div className='timeline-cost'>
												<div className='cost-total'>{formatPrice(totalCost)}</div>
												{dest && (
													<div className='cost-breakdown'>
														🍜{formatPrice(dest.foodCost)} · 🏨{formatPrice(dest.accommodationCost)}
													</div>
												)}
											</div>

											<div className='timeline-actions'>
												<Popconfirm
													title='Xóa điểm đến này?'
													onConfirm={() => handleRemoveDestination(dayIndex, destIndex)}
													okText='Xóa'
													cancelText='Hủy'
												>
													<Button
														type='text'
														danger
														icon={<DeleteOutlined />}
														size='small'
													/>
												</Popconfirm>
											</div>
										</div>
									);
								})
							) : (
								<Empty description='Chưa có điểm đến nào' style={{ padding: 40 }} />
							)}

							<Button
								className='add-destination-btn'
								icon={<PlusOutlined />}
								onClick={() => setPickerVisible(true)}
							>
								Thêm điểm đến vào ngày {day.dayNumber}
							</Button>
						</div>
					</TabPane>
				))}
			</Tabs>

			<DestinationPicker
				visible={pickerVisible}
				onClose={() => setPickerVisible(false)}
				onSelect={handleAddDestination}
			/>
		</div>
	);
};

export default ItineraryDetail;
