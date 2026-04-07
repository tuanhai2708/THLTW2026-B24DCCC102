import { useEffect, useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Select, Alert, Progress, Table, Empty, Card, Spin } from 'antd';
import {
	WalletOutlined,
	WarningOutlined,
	CheckCircleOutlined,
	CoffeeOutlined,
	HomeOutlined,
	CarOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import './style.less';

const { Option } = Select;

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const NganSach: React.FC = () => {
	const { itineraries, destinations, loading, fetchItineraries, fetchDestinations, calculateBudgetBreakdown, fetchItineraryDetail, currentItinerary } =
		useModel('dulich');
	const [selectedItinId, setSelectedItinId] = useState<string | null>(null);

	useEffect(() => {
		fetchItineraries();
		fetchDestinations();
	}, []);

	// Khi chọn lịch trình -> load chi tiết
	useEffect(() => {
		if (selectedItinId) {
			fetchItineraryDetail(selectedItinId);
		}
	}, [selectedItinId]);

	/** Tính ngân sách theo hạng mục */
	const budgetData = useMemo(() => {
		if (!currentItinerary) return null;

		const breakdown = calculateBudgetBreakdown(currentItinerary);
		const budget = currentItinerary.totalBudget;
		const percentage = budget > 0 ? (breakdown.total / budget) * 100 : 0;
		const remaining = budget - breakdown.total;

		// Tính chi phí theo ngày
		const dailyCosts = currentItinerary.days.map((day) => {
			let dayFood = 0;
			let dayAccom = 0;
			let dayTransport = 0;

			day.destinations.forEach((dd) => {
				const dest = dd.destination || destinations.find((d) => d.id === dd.destinationId);
				if (dest) {
					dayFood += dest.foodCost;
					dayAccom += dest.accommodationCost;
					dayTransport += dest.transportCost;
				}
			});

			return {
				dayNumber: day.dayNumber,
				date: day.date,
				food: dayFood,
				accommodation: dayAccom,
				transport: dayTransport,
				total: dayFood + dayAccom + dayTransport,
			};
		});

		return { breakdown, percentage, remaining, dailyCosts, budget };
	}, [currentItinerary, destinations]);

	/** Donut chart - Phân bổ ngân sách */
	const donutOptions = useMemo(() => {
		if (!budgetData) return {};
		return {
			chart: { type: 'donut' as const },
			labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
			colors: ['#f59e0b', '#8b5cf6', '#0ea5e9'],
			legend: { position: 'bottom' as const, fontSize: '14px' },
			plotOptions: {
				pie: {
					donut: {
						size: '55%',
						labels: {
							show: true,
							total: {
								show: true,
								label: 'Tổng chi',
								formatter: () => formatPrice(budgetData.breakdown.total),
							},
						},
					},
				},
			},
			responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
		};
	}, [budgetData]);

	/** Bar chart - Chi phí theo ngày */
	const barOptions = useMemo(() => {
		if (!budgetData) return {};
		return {
			chart: { type: 'bar' as const, stacked: true, toolbar: { show: false } },
			plotOptions: {
				bar: { horizontal: false, borderRadius: 6, columnWidth: '50%' },
			},
			xaxis: {
				categories: budgetData.dailyCosts.map((d) => `Ngày ${d.dayNumber}`),
			},
			yaxis: {
				labels: {
					formatter: (val: number) => `${(val / 1000000).toFixed(1)}tr`,
				},
			},
			colors: ['#f59e0b', '#8b5cf6', '#0ea5e9'],
			legend: { position: 'top' as const },
			tooltip: {
				y: {
					formatter: (val: number) => formatPrice(val),
				},
			},
		};
	}, [budgetData]);

	const barSeries = useMemo(() => {
		if (!budgetData) return [];
		return [
			{ name: 'Ăn uống', data: budgetData.dailyCosts.map((d) => d.food) },
			{ name: 'Lưu trú', data: budgetData.dailyCosts.map((d) => d.accommodation) },
			{ name: 'Di chuyển', data: budgetData.dailyCosts.map((d) => d.transport) },
		];
	}, [budgetData]);

	/** Columns cho bảng chi tiết */
	const columns = [
		{
			title: 'Ngày',
			dataIndex: 'dayNumber',
			key: 'dayNumber',
			render: (val: number) => <strong>Ngày {val}</strong>,
		},
		{
			title: 'Ngày tháng',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: '🍜 Ăn uống',
			dataIndex: 'food',
			key: 'food',
			render: (val: number) => formatPrice(val),
			align: 'right' as const,
		},
		{
			title: '🏨 Lưu trú',
			dataIndex: 'accommodation',
			key: 'accommodation',
			render: (val: number) => formatPrice(val),
			align: 'right' as const,
		},
		{
			title: '🚗 Di chuyển',
			dataIndex: 'transport',
			key: 'transport',
			render: (val: number) => formatPrice(val),
			align: 'right' as const,
		},
		{
			title: 'Tổng',
			dataIndex: 'total',
			key: 'total',
			render: (val: number) => <strong style={{ color: '#1890ff' }}>{formatPrice(val)}</strong>,
			align: 'right' as const,
		},
	];

	const getProgressStatus = () => {
		if (!budgetData) return 'normal';
		if (budgetData.percentage > 100) return 'exception';
		if (budgetData.percentage > 80) return 'active';
		return 'normal';
	};

	return (
		<div className='ngan-sach-page'>
			<div className='page-header'>
				<h1 className='page-title'>
					<WalletOutlined style={{ marginRight: 10, color: '#8b5cf6' }} />
					Quản lý Ngân sách
				</h1>
				<p className='page-subtitle'>Theo dõi và quản lý chi phí cho chuyến du lịch của bạn</p>
			</div>

			{/* Chọn lịch trình */}
			<div className='select-itinerary'>
				<Select
					placeholder='Chọn lịch trình để xem ngân sách'
					size='large'
					style={{ width: '100%', maxWidth: 500 }}
					value={selectedItinId}
					onChange={setSelectedItinId}
					allowClear
				>
					{itineraries.map((itin) => (
						<Option key={itin.id} value={itin.id}>
							{itin.name} ({itin.startDate} → {itin.endDate})
						</Option>
					))}
				</Select>
			</div>

			<Spin spinning={loading}>
				{budgetData && currentItinerary ? (
					<>
						{/* Budget Alerts */}
						<div className='budget-alerts'>
							{budgetData.percentage > 100 && (
								<Alert
									message='Vượt ngân sách!'
									description={`Chi phí đã vượt ${(budgetData.percentage - 100).toFixed(0)}% so với ngân sách dự kiến. Vượt ${formatPrice(Math.abs(budgetData.remaining))}.`}
									type='error'
									showIcon
									icon={<WarningOutlined />}
								/>
							)}
							{budgetData.percentage > 80 && budgetData.percentage <= 100 && (
								<Alert
									message='Cảnh báo ngân sách'
									description={`Đã sử dụng ${budgetData.percentage.toFixed(0)}% ngân sách. Còn lại ${formatPrice(budgetData.remaining)}.`}
									type='warning'
									showIcon
								/>
							)}
							{budgetData.percentage <= 80 && (
								<Alert
									message='Ngân sách ổn định'
									description={`Đã sử dụng ${budgetData.percentage.toFixed(0)}% ngân sách. Còn lại ${formatPrice(budgetData.remaining)}.`}
									type='success'
									showIcon
									icon={<CheckCircleOutlined />}
								/>
							)}
						</div>

						{/* Progress Bar */}
						<Card style={{ borderRadius: 16, marginBottom: 24 }}>
							<Progress
								percent={Math.min(budgetData.percentage, 100)}
								status={getProgressStatus() as any}
								strokeWidth={20}
								className='budget-progress'
								format={() => `${budgetData.percentage.toFixed(1)}%`}
							/>
						</Card>

						{/* Summary Cards */}
						<div className='summary-cards'>
							<div className='summary-card'>
								<div className='card-icon blue'>
									<WalletOutlined />
								</div>
								<div className='card-label'>Tổng ngân sách</div>
								<div className='card-value'>{formatPrice(budgetData.budget)}</div>
							</div>
							<div className='summary-card'>
								<div className='card-icon orange'>
									<CoffeeOutlined />
								</div>
								<div className='card-label'>Ăn uống</div>
								<div className='card-value'>{formatPrice(budgetData.breakdown.food)}</div>
							</div>
							<div className='summary-card'>
								<div className='card-icon purple'>
									<HomeOutlined />
								</div>
								<div className='card-label'>Lưu trú</div>
								<div className='card-value'>{formatPrice(budgetData.breakdown.accommodation)}</div>
							</div>
							<div className='summary-card'>
								<div className='card-icon green'>
									<CarOutlined />
								</div>
								<div className='card-label'>Di chuyển</div>
								<div className='card-value'>{formatPrice(budgetData.breakdown.transport)}</div>
							</div>
						</div>

						{/* Charts */}
						<div className='charts-row'>
							<div className='chart-card'>
								<div className='chart-title'>Phân bổ ngân sách</div>
								<ReactApexChart
									options={donutOptions as any}
									series={[
										budgetData.breakdown.food,
										budgetData.breakdown.accommodation,
										budgetData.breakdown.transport,
									]}
									type='donut'
									height={320}
								/>
							</div>
							<div className='chart-card'>
								<div className='chart-title'>Chi phí theo ngày</div>
								<ReactApexChart
									options={barOptions as any}
									series={barSeries}
									type='bar'
									height={320}
								/>
							</div>
						</div>

						{/* Detail Table */}
						<div className='budget-table-card'>
							<div className='table-title'>Chi tiết ngân sách từng ngày</div>
							<Table
								dataSource={budgetData.dailyCosts}
								columns={columns}
								pagination={false}
								rowKey='dayNumber'
								scroll={{ x: 600 }}
								summary={() => (
									<Table.Summary.Row>
										<Table.Summary.Cell index={0} colSpan={2}>
											<strong>Tổng cộng</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={2} align='right'>
											<strong>{formatPrice(budgetData.breakdown.food)}</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={3} align='right'>
											<strong>{formatPrice(budgetData.breakdown.accommodation)}</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={4} align='right'>
											<strong>{formatPrice(budgetData.breakdown.transport)}</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={5} align='right'>
											<strong style={{ color: '#1890ff', fontSize: 16 }}>
												{formatPrice(budgetData.breakdown.total)}
											</strong>
										</Table.Summary.Cell>
									</Table.Summary.Row>
								)}
							/>
						</div>
					</>
				) : (
					<Card style={{ borderRadius: 16 }}>
						<Empty description='Vui lòng chọn một lịch trình để xem ngân sách' />
					</Card>
				)}
			</Spin>
		</div>
	);
};

export default NganSach;
