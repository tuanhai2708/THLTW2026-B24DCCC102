import { Card, Col, Row, Typography } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { AppointmentStatus } from '@/models/lichhen';

const { Title } = Typography;

const ThongKe = () => {
    const { appointments, getAppointments } = useModel('lichhen');
    const { employees, getEmployees } = useModel('nhanvien');
    const { services, getServices } = useModel('dichvu');

    const [appointmentsByDay, setAppointmentsByDay] = useState<{ x: string, y: number }[]>([]);
    const [revenueByService, setRevenueByService] = useState<{ name: string, data: number[] }[]>([]);
    const [revenueLabels, setRevenueLabels] = useState<string[]>([]);
    
    useEffect(() => {
        getAppointments();
        getEmployees();
        getServices();
    }, []);

    useEffect(() => {
        if (appointments.length === 0) return;

        // Statistics 1: Appointments by Day (Last 7 days)
        const last7Days = Array.from({length: 7}, (_, i) => moment().subtract(6 - i, 'days').format('YYYY-MM-DD'));
        
        const apptsByDayData = last7Days.map(date => {
            const count = appointments.filter(a => a.appointmentDate === date && a.status !== AppointmentStatus.CANCELLED).length;
            return { x: moment(date).format('DD/MM'), y: count };
        });
        setAppointmentsByDay(apptsByDayData);

        // Statistics 2: Revenue by Employee (completed appointments)
        const completedAppts = appointments.filter(a => a.status === AppointmentStatus.COMPLETED);
        
        const revLabels = employees.map(e => e.name);
        if (revLabels.length > 0) {
            setRevenueLabels(revLabels);
            const seriesData = employees.map(emp => {
                const total = completedAppts
                    .filter(a => a.employeeId === emp.id)
                    .reduce((sum, curr) => sum + curr.totalPrice, 0);
                return total;
            });
            setRevenueByService([{ name: 'Doanh thu (VNĐ)', data: seriesData }]);
        }

    }, [appointments, employees, services]);

    const chartOptions1: ApexCharts.ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        xaxis: { type: 'category' },
        colors: ['#1890ff'],
        plotOptions: { bar: { borderRadius: 4, dataLabels: { position: 'top' } } },
        dataLabels: { enabled: true, offsetY: -20, style: { fontSize: '12px', colors: ["#304758"] } }
    };

    const chartOptions2: ApexCharts.ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        xaxis: { categories: revenueLabels },
        colors: ['#52c41a'],
        plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        yaxis: { labels: { formatter: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) } }
    };

    const totalRevenue = appointments
        .filter(a => a.status === AppointmentStatus.COMPLETED)
        .reduce((sum, a) => sum + a.totalPrice, 0);
    const totalAppointments = appointments.filter(a => a.status !== AppointmentStatus.CANCELLED).length;

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={3} style={{ marginBottom: 24 }}>Thống kê & Báo cáo</Title>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card title="Tổng doanh thu" bordered={false} style={{ borderRadius: 8 }}>
                        <Title level={2} style={{ color: '#52c41a', margin: 0 }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
                        </Title>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Tổng lịch hẹn" bordered={false} style={{ borderRadius: 8 }}>
                         <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                            {totalAppointments} lịch
                        </Title>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Số lịch hẹn 7 ngày qua" bordered={false} style={{ borderRadius: 8 }}>
                        <ReactApexChart 
                            options={chartOptions1} 
                            series={[{ name: 'Lịch hẹn', data: appointmentsByDay }]} 
                            type="bar" 
                            height={350} 
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Doanh thu theo nhân viên" bordered={false} style={{ borderRadius: 8 }}>
                        <ReactApexChart 
                            options={chartOptions2} 
                            series={revenueByService} 
                            type="bar" 
                            height={350} 
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ThongKe;
