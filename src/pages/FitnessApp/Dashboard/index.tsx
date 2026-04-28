import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Timeline, Typography, Tag } from 'antd';
import { FireOutlined, CalendarOutlined, TrophyOutlined, AimOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import { getWorkouts, getMetrics, getGoals, Workout, HealthMetric, FitnessGoal } from '../store';
import styles from './index.less';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<FitnessGoal[]>([]);

  useEffect(() => {
    setWorkouts(getWorkouts());
    setMetrics(getMetrics());
    setGoals(getGoals());
  }, []);

  // Calculate quick metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && w.status === 'Completed';
  });

  const totalWorkoutsThisMonth = thisMonthWorkouts.length;
  const totalCaloriesThisMonth = thisMonthWorkouts.reduce((sum, w) => sum + w.calories, 0);

  // Simple Streak Calculation (days in a row ending today or yesterday)
  let streak = 0;
  const sortedCompleted = [...workouts]
    .filter(w => w.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedCompleted.length > 0) {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    let lastWorkoutDate = new Date(sortedCompleted[0].date);
    lastWorkoutDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(currentDate.getTime() - lastWorkoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 1) {
      streak = 1;
      for (let i = 1; i < sortedCompleted.length; i++) {
        const prev = new Date(sortedCompleted[i-1].date);
        prev.setHours(0,0,0,0);
        const curr = new Date(sortedCompleted[i].date);
        curr.setHours(0,0,0,0);
        
        const diff = Math.ceil(Math.abs(prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          streak++;
        } else if (diff > 1) {
          break;
        }
      }
    }
  }

  // Goal completion %
  const completedGoals = goals.filter(g => g.status === 'Đã đạt').length;
  const goalCompletionPercent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  // Chart data: Workouts per week in month
  // Assuming 4 weeks in a month
  const weekCounts = [0, 0, 0, 0];
  thisMonthWorkouts.forEach(w => {
    const d = new Date(w.date);
    const day = d.getDate();
    if (day <= 7) weekCounts[0]++;
    else if (day <= 14) weekCounts[1]++;
    else if (day <= 21) weekCounts[2]++;
    else weekCounts[3]++;
  });

  const columnChartOptions = {
    chart: { type: 'bar' as const },
    xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'] },
    colors: ['#1890ff'],
  };
  const columnChartSeries = [{ name: 'Số buổi tập', data: weekCounts }];

  // Chart data: Weight over time
  const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const weightDates = sortedMetrics.map(m => m.date);
  const weightValues = sortedMetrics.map(m => m.weight);

  const lineChartOptions = {
    chart: { type: 'line' as const },
    xaxis: { categories: weightDates },
    stroke: { curve: 'smooth' as const },
    colors: ['#52c41a'],
  };
  const lineChartSeries = [{ name: 'Cân nặng (kg)', data: weightValues }];

  return (
    <div className={styles.dashboard}>
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      {/* 4 Quick Metrics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.metricCard}>
            <Statistic 
              title="Buổi tập tháng này" 
              value={totalWorkoutsThisMonth} 
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.metricCard}>
            <Statistic 
              title="Calo đã đốt" 
              value={totalCaloriesThisMonth} 
              suffix="kcal"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.metricCard}>
            <Statistic 
              title="Chuỗi ngày (Streak)" 
              value={streak} 
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.metricCard}>
            <Statistic 
              title="Mục tiêu hoàn thành" 
              value={goalCompletionPercent} 
              suffix="%"
              prefix={<AimOutlined style={{ color: '#52c41a' }} />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Column Chart */}
        <Col xs={24} lg={12}>
          <Card title="Số buổi tập theo tuần (Tháng này)" bordered={false} className={styles.chartCard}>
            <Chart options={columnChartOptions} series={columnChartSeries} type="bar" height={300} />
          </Card>
        </Col>
        {/* Line Chart */}
        <Col xs={24} lg={12}>
          <Card title="Sự thay đổi cân nặng" bordered={false} className={styles.chartCard}>
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="5 buổi tập gần nhất" bordered={false}>
            <Timeline>
              {sortedCompleted.slice(0, 5).map(w => (
                <Timeline.Item key={w.id} color={w.status === 'Completed' ? 'green' : 'red'}>
                  <Text strong>{w.date}</Text> - {w.type} ({w.duration} phút)
                  <br />
                  <Tag color="orange" style={{ marginTop: 8 }}>{w.calories} kcal</Tag>
                  <Text type="secondary">{w.notes}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
            {sortedCompleted.length === 0 && <Text type="secondary">Chưa có dữ liệu buổi tập.</Text>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
