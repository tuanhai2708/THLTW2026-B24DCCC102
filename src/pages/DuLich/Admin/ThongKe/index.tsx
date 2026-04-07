import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import { Spin, Table, Empty, Card } from 'antd';
import {
	BarChartOutlined,
	ScheduleOutlined,
	DollarOutlined,
	EnvironmentOutlined,
	StarOutlined,
	RiseOutlined,
	PieChartOutlined,
	LineChartOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import './style.less';

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ThongKe: React.FC = () => {
	const { statistics, loading, fetchStatistics } = useModel('dulich');

	useEffect(() => {
		fetchStatistics();
	}, []);

	// ===== Line Chart: Lịch trình theo tháng =====
	const monthlyChartOptions = useMemo(() => {
		if (!statistics?.monthlyStats) return {};
		return {
			chart: { type: 'area' as const, toolbar: { show: false }, zoom: { enabled: false } },
			dataLabels: { enabled: false },
			stroke: { curve: 'smooth' as const, width: 3 },
			fill: {
				type: 'gradient',
				gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] },
			},
			xaxis: {
				categories: statistics.monthlyStats.map((s: any) => {
					const [year, month] = s.month.split('-');
					return `T${month}/${year.slice(2)}`;
				}),
			},
			yaxis: { labels: { formatter: (val: number) => Math.floor(val).toString() } },
			colors: ['#3b82f6'],
			tooltip: { y: { formatter: (val: number) => `${val} lịch trình` } },
		};
	}, [statistics]);

	// ===== Donut Chart: Doanh thu theo hạng mục =====
	const categoryChartOptions = useMemo(() => {
		if (!statistics?.categoryRevenue) return {};
		return {
			chart: { type: 'donut' as const },
			labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
			colors: ['#f59e0b', '#8b5cf6', '#0ea5e9'],
			legend: { position: 'bottom' as const },
			plotOptions: {
				pie: {
					donut: {
						size: '50%',
						labels: {
							show: true,
							total: {
								show: true,
								label: 'Tổng',
								formatter: () => {
									const { food, accommodation, transport } = statistics.categoryRevenue;
									return formatPrice(food + accommodation + transport);
								},
							},
						},
					},
				},
			},
		};
	}, [statistics]);

	// ===== Line Chart: Doanh thu theo tháng =====
	const revenueChartOptions = useMemo(() => {
		if (!statistics?.monthlyRevenue) return {};
		return {
			chart: { type: 'area' as const, toolbar: { show: false }, zoom: { enabled: false } },
			dataLabels: { enabled: false },
			stroke: { curve: 'smooth' as const, width: 3 },
			fill: {
				type: 'gradient',
				gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] },
			},
			xaxis: {
				categories: statistics.monthlyRevenue.map((r: any) => {
					const [year, month] = r.month.split('-');
					return `T${month}/${year.slice(2)}`;
				}),
			},
			yaxis: {
				labels: { formatter: (val: number) => `${(val / 1000000).toFixed(0)}tr` },
			},
			colors: ['#22c55e'],
			tooltip: { y: { formatter: (val: number) => formatPrice(val) } },
		};
	}, [statistics]);

	// ===== Revenue Table Columns =====
	const revenueColumns = [
		{
			title: 'Tháng',
			dataIndex: 'month',
			key: 'month',
			render: (val: string) => {
				const [year, month] = val.split('-');
				return `Tháng ${month}/${year}`;
			},
		},
		{
			title: 'Doanh thu',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (val: number) => <strong style={{ color: '#22c55e' }}>{formatPrice(val)}</strong>,
			align: 'right' as const,
			sorter: (a: any, b: any) => a.revenue - b.revenue,
		},
	];

	if (!statistics) {
		return (
			<div className='admin-thong-ke-page'>
				<Spin spinning={loading}>
					<Card style={{ borderRadius: 16, minHeight: 300 }}>
						<Empty description='Đang tải dữ liệu thống kê...' />
					</Card>
				</Spin>
			</div>
		);
	}

	return (
		<div className='admin-thong-ke-page'>
			<div className='page-header'>
				<h1 className='page-title'>
					<BarChartOutlined style={{ marginRight: 10, color: '#3b82f6' }} />
					Thống kê tổng quan
				</h1>
				<p className='page-subtitle'>Theo dõi hiệu suất và xu hướng của hệ thống du lịch</p>
			</div>

			{/* Overview Cards */}
			<div className='overview-cards'>
				<div className='overview-card'>
					<div className='card-icon-wrapper gradient-blue'>
						<ScheduleOutlined />
					</div>
					<div className='card-info'>
						<div className='card-value'>{statistics.totalItineraries}</div>
						<div className='card-label'>Tổng lịch trình</div>
					</div>
				</div>
				<div className='overview-card'>
					<div className='card-icon-wrapper gradient-green'>
						<DollarOutlined />
					</div>
					<div className='card-info'>
						<div className='card-value'>
							{(statistics.totalRevenue / 1000000).toFixed(1)}tr
						</div>
						<div className='card-label'>Tổng doanh thu</div>
					</div>
				</div>
				<div className='overview-card'>
					<div className='card-icon-wrapper gradient-purple'>
						<EnvironmentOutlined />
					</div>
					<div className='card-info'>
						<div className='card-value'>{statistics.totalDestinations}</div>
						<div className='card-label'>Điểm đến</div>
					</div>
				</div>
				<div className='overview-card'>
					<div className='card-icon-wrapper gradient-orange'>
						<StarOutlined />
					</div>
					<div className='card-info'>
						<div className='card-value'>{statistics.averageRating}</div>
						<div className='card-label'>Rating trung bình</div>
					</div>
				</div>
			</div>

			{/* Charts Row 1: Lịch trình theo tháng + Điểm đến phổ biến */}
			<div className='charts-section'>
				<div className='chart-card'>
					<div className='chart-title'>
						<LineChartOutlined />
						Lịch trình tạo theo tháng
					</div>
					<ReactApexChart
						options={monthlyChartOptions as any}
						series={[
							{
								name: 'Lịch trình',
								data: statistics.monthlyStats.map((s: any) => s.count),
							},
						]}
						type='area'
						height={300}
					/>
				</div>

				<div className='chart-card'>
					<div className='chart-title'>
						<BarChartOutlined />
						Điểm đến phổ biến nhất
					</div>
					{statistics.popularDestinations.length > 0 ? (
						<div className='popular-list'>
							{statistics.popularDestinations.map((item: any, index: number) => {
								const rankClass =
									index === 0
										? 'rank-1'
										: index === 1
										? 'rank-2'
										: index === 2
										? 'rank-3'
										: 'rank-other';
								return (
									<div key={index} className='popular-item'>
										<div className={`rank ${rankClass}`}>{index + 1}</div>
										<div className='item-info'>
											<div className='item-name'>
												{item.destination?.name || 'N/A'}
											</div>
											<div className='item-location'>
												<EnvironmentOutlined />{' '}
												{item.destination?.location || ''}
											</div>
										</div>
										<div className='item-count'>{item.count} lượt</div>
									</div>
								);
							})}
						</div>
					) : (
						<Empty description='Chưa có dữ liệu' />
					)}
				</div>
			</div>

			{/* Charts Row 2: Doanh thu theo tháng + Doanh thu theo hạng mục */}
			<div className='charts-section'>
				<div className='chart-card'>
					<div className='chart-title'>
						<RiseOutlined />
						Doanh thu theo tháng
					</div>
					<ReactApexChart
						options={revenueChartOptions as any}
						series={[
							{
								name: 'Doanh thu',
								data: statistics.monthlyRevenue.map((r: any) => r.revenue),
							},
						]}
						type='area'
						height={300}
					/>
				</div>

				<div className='chart-card'>
					<div className='chart-title'>
						<PieChartOutlined />
						Doanh thu theo hạng mục
					</div>
					<ReactApexChart
						options={categoryChartOptions as any}
						series={[
							statistics.categoryRevenue.food,
							statistics.categoryRevenue.accommodation,
							statistics.categoryRevenue.transport,
						]}
						type='donut'
						height={300}
					/>
				</div>
			</div>

			{/* Revenue Table */}
			<div className='revenue-table-card'>
				<div className='table-title'>Chi tiết doanh thu từng tháng</div>
				<Table
					dataSource={statistics.monthlyRevenue}
					columns={revenueColumns}
					rowKey='month'
					pagination={false}
					scroll={{ x: 400 }}
					summary={() => {
						const totalRev = statistics.monthlyRevenue.reduce(
							(sum: number, r: any) => sum + r.revenue,
							0,
						);
						return (
							<Table.Summary.Row>
								<Table.Summary.Cell index={0}>
									<strong>Tổng cộng</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} align='right'>
									<strong style={{ color: '#22c55e', fontSize: 16 }}>
										{formatPrice(totalRev)}
									</strong>
								</Table.Summary.Cell>
							</Table.Summary.Row>
						);
					}}
				/>
			</div>
		</div>
	);
};

export default ThongKe;
