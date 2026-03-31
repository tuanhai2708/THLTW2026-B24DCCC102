import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import { TeamOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import { getDashboardStats, getDashboardChart } from '@/services/QuanLyCauLacBo/api';

const BaoCao = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalClubs: 0,
    applications: { pending: 0, approved: 0, rejected: 0 }
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, chartRes] = await Promise.all([
          getDashboardStats(),
          getDashboardChart()
        ]);
        if (statsRes?.success) setStats(statsRes.data);
        if (chartRes?.success) setChartData(chartRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartSeries = [
    {
      name: 'Chờ duyệt',
      data: chartData.map(item => item.pending),
    },
    {
      name: 'Đã duyệt',
      data: chartData.map(item => item.approved),
    },
    {
      name: 'Từ chối',
      data: chartData.map(item => item.rejected),
    }
  ];

  const chartOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: { show: true }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: chartData.map(item => item.clubName),
    },
    yaxis: { title: { text: 'Số lượng đơn' } },
    colors: ['#faad14', '#52c41a', '#ff4d4f'],
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val: number) => val + ' đơn' }
    }
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false}>
              <Statistic
                title="Tổng CLB"
                value={stats.totalClubs}
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false}>
              <Statistic
                 title="Đơn đang chờ"
                 value={stats.applications.pending}
                 prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false}>
              <Statistic
                 title="Đơn đã duyệt"
                 value={stats.applications.approved}
                 prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false}>
              <Statistic
                 title="Đơn từ chối"
                 value={stats.applications.rejected}
                 prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
        </Row>

        <Card bordered={false} style={{ marginTop: 24 }} title="Biểu đồ Đơn đăng ký theo CLB">
          {chartData.length > 0 ? (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={400}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#999', padding: '50px 0' }}>Không có dữ liệu biểu đồ</div>
          )}
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default BaoCao;
