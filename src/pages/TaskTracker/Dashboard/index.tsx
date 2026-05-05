import React, { useEffect } from 'react';
import { Card, Col, Row, Tag, List, Typography, Progress } from 'antd';
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	RiseOutlined,
	ThunderboltOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import '../style.less';

const { Text, Title } = Typography;

const Dashboard: React.FC = () => {
	const { tasks, totalTasks, doneTasks, overdueTasks, todoTasks, inprogressTasks, loadTasks } =
		useModel('taskTracker');

	useEffect(() => {
		loadTasks();
	}, []);

	const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

	// Lấy 5 task gần nhất
	const recentTasks = [...tasks]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 5);

	// Task sắp đến hạn (trong 3 ngày tới)
	const upcomingTasks = tasks
		.filter(
			(t) =>
				t.status !== 'done' &&
				t.deadline &&
				moment(t.deadline).isBetween(moment(), moment().add(3, 'days'), 'day', '[]'),
		)
		.sort((a, b) => moment(a.deadline).diff(moment(b.deadline)));

	const statCards = [
		{
			title: 'Tổng số Task',
			value: totalTasks,
			icon: <FileTextOutlined style={{ color: '#1890ff' }} />,
			color: '#e6f7ff',
		},
		{
			title: 'Hoàn thành',
			value: doneTasks,
			icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
			color: '#f6ffed',
		},
		{
			title: 'Đang làm',
			value: inprogressTasks,
			icon: <ThunderboltOutlined style={{ color: '#faad14' }} />,
			color: '#fffbe6',
		},
		{
			title: 'Quá hạn',
			value: overdueTasks,
			icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
			color: '#fff2f0',
		},
	];

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

	return (
		<div className='dashboard-page'>
			{/* Thẻ thống kê */}
			<Row gutter={[16, 16]}>
				{statCards.map((card, idx) => (
					<Col xs={12} sm={12} md={6} key={idx}>
						<Card className='stat-card' bodyStyle={{ padding: 20, background: card.color }}>
							<Row align='middle' justify='space-between'>
								<Col>
									<div className='stat-value'>{card.value}</div>
									<div className='stat-label'>{card.title}</div>
								</Col>
								<Col>
									<div className='stat-icon'>{card.icon}</div>
								</Col>
							</Row>
						</Card>
					</Col>
				))}
			</Row>

			{/* Tiến độ & Thống kê trạng thái */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} md={8}>
					<Card title='Tiến độ hoàn thành' className='chart-card'>
						<div style={{ textAlign: 'center' }}>
							<Progress type='circle' percent={completionRate} width={140} />
							<div style={{ marginTop: 12 }}>
								<Text type='secondary'>
									{doneTasks}/{totalTasks} task đã hoàn thành
								</Text>
							</div>
						</div>
					</Card>
				</Col>

				<Col xs={24} md={8}>
					<Card title='Phân bổ trạng thái' className='chart-card'>
						<div style={{ padding: '8px 0' }}>
							<div style={{ marginBottom: 16 }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
									<Text>Cần làm</Text>
									<Text strong>{todoTasks}</Text>
								</div>
								<Progress percent={totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0} strokeColor='#1890ff' showInfo={false} />
							</div>
							<div style={{ marginBottom: 16 }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
									<Text>Đang làm</Text>
									<Text strong>{inprogressTasks}</Text>
								</div>
								<Progress percent={totalTasks > 0 ? Math.round((inprogressTasks / totalTasks) * 100) : 0} strokeColor='#faad14' showInfo={false} />
							</div>
							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
									<Text>Hoàn thành</Text>
									<Text strong>{doneTasks}</Text>
								</div>
								<Progress percent={totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0} strokeColor='#52c41a' showInfo={false} />
							</div>
						</div>
					</Card>
				</Col>

				<Col xs={24} md={8}>
					<Card
						title={
							<span>
								<ClockCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
								Sắp đến hạn
							</span>
						}
						className='chart-card'
					>
						{upcomingTasks.length === 0 ? (
							<Text type='secondary'>Không có task nào sắp đến hạn</Text>
						) : (
							<List
								size='small'
								dataSource={upcomingTasks}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											title={item.name}
											description={
												<span>
													<ClockCircleOutlined style={{ marginRight: 4 }} />
													{moment(item.deadline).format('DD/MM/YYYY')}
												</span>
											}
										/>
										<Tag color={priorityMap[item.priority]?.color}>{item.priority}</Tag>
									</List.Item>
								)}
							/>
						)}
					</Card>
				</Col>
			</Row>

			{/* Danh sách task gần đây */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col span={24}>
					<Card
						title={
							<span>
								<RiseOutlined style={{ marginRight: 8, color: '#1890ff' }} />
								Task gần đây
							</span>
						}
						className='chart-card'
					>
						{recentTasks.length === 0 ? (
							<Text type='secondary'>Chưa có task nào. Hãy tạo task mới!</Text>
						) : (
							<List
								dataSource={recentTasks}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											title={item.name}
											description={item.description || 'Không có mô tả'}
										/>
										<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
											<Tag color={statusMap[item.status]?.color}>{statusMap[item.status]?.text}</Tag>
											<Tag color={priorityMap[item.priority]?.color}>{item.priority}</Tag>
											{item.deadline && (
												<Text type='secondary' style={{ fontSize: 12 }}>
													{moment(item.deadline).format('DD/MM/YYYY')}
												</Text>
											)}
										</div>
									</List.Item>
								)}
							/>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
