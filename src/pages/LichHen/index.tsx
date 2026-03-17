import { Button, Form, Input, Select, Space, Table, DatePicker, message, Tag, Modal, Popconfirm, TimePicker, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Appointment, AppointmentStatus } from '@/models/lichhen';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

const LichHen = () => {
  const { appointments, getAppointments, addAppointment, updateAppointment, checkConflict, checkEmployeeLimit } = useModel('lichhen');
  const { employees, getEmployees } = useModel('nhanvien');
  const { services, getServices } = useModel('dichvu');

  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string>('');
  const [form] = Form.useForm();
  
  // Lấy danh sách ID của nhân viên, dịch vụ để map tên ra bảng
  const getEmployeeName = (id: string) => employees?.find(e => e.id === id)?.name || 'Unknown';
  const getServiceName = (id: string) => services?.find(s => s.id === id)?.name || 'Unknown';

  useEffect(() => {
    getAppointments();
    getEmployees();
    getServices();
  }, []);

  const handleOpenModal = (record?: Appointment) => {
    if (record) {
      setIsEdit(true);
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        appointmentDate: moment(record.appointmentDate),
        startTime: moment(record.startTime, 'HH:mm'),
      });
    } else {
      setIsEdit(false);
      setEditingId('');
      form.resetFields();
      form.setFieldsValue({
        appointmentDate: moment(),
        startTime: moment('09:00', 'HH:mm'),
      });
    }
    setVisible(true);
  };

  const handleCancelModal = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    let { employeeId, serviceId, customerName, customerPhone, appointmentDate, startTime, notes } = values;
    const dateStr = appointmentDate.format('YYYY-MM-DD');
    startTime = startTime ? startTime.format('HH:mm') : '09:00';
    const service = services.find(s => s.id === serviceId);

    if (!service) {
      message.error("Vui lòng chọn dịch vụ hợp lệ.");
      return;
    }

    const employee = employees.find(e => e.id === employeeId);
    if (!employee) {
       message.error("Vui lòng chọn nhân viên hợp lệ.");
       return;
    }

    // Checking Conflicts
    const conflictResult = checkConflict(employeeId, dateStr, startTime, service.duration, isEdit ? editingId : undefined);
    if (conflictResult.hasConflict) {
      message.error(conflictResult.reason || "Trùng lịch nhân viên.");
      return;
    }

    // Checking Employee Limits
    if (!isEdit || (isEdit && appointments.find(a => a.id === editingId)?.appointmentDate !== dateStr)) {
        if (!checkEmployeeLimit(employee, dateStr)) {
          message.error(`Nhân viên đã đạt giới hạn ${employee.dailyCustomerLimit} khách trong ngày này.`);
          return;
        }
    }

    const payload = {
      employeeId,
      serviceId,
      customerName,
      customerPhone,
      appointmentDate: dateStr,
      startTime,
      notes,
    };

    if (isEdit) {
      updateAppointment(editingId, payload, services);
      message.success("Cập nhật lịch hẹn thành công!");
    } else {
      addAppointment({ ...payload, customerId: 'guest' }, employees, services);
      message.success("Đặt lịch thành công!");
    }
    setVisible(false);
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    updateAppointment(id, { status });
    message.success("Cập nhật trạng thái thành công!");
  };

  const columns = [
    {
      title: 'Khách hàng',
      key: 'customer',
      width: '15%',
      render: (_: any, record: Appointment) => (
        <Space direction="vertical" size="small">
          <b>{record.customerName}</b>
          <span>{record.customerPhone}</span>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: '15%',
      render: (_: any, record: Appointment) => (
        <Space direction="vertical" size="small">
          <Tag color="geekblue">{record.appointmentDate}</Tag>
          <Tag color="cyan">{record.startTime} - {record.endTime}</Tag>
        </Space>
      ),
    },
    {
      title: 'Dịch vụ',
      key: 'service',
      render: (_: any, record: Appointment) => (
         <Space direction="vertical" size="small">
          <span>{getServiceName(record.serviceId)}</span>
          <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</b>
         </Space>
      )
    },
    {
      title: 'Nhân viên',
      key: 'employee',
      render: (_: any, record: Appointment) => getEmployeeName(record.employeeId),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus) => {
        let color = 'default';
        let text = 'Chờ xác nhận';
        if (status === AppointmentStatus.CONFIRMED) { color = 'processing'; text = 'Đã xác nhận'; }
        if (status === AppointmentStatus.COMPLETED) { color = 'success'; text = 'Hoàn thành'; }
        if (status === AppointmentStatus.CANCELLED) { color = 'error'; text = 'Đã hủy'; }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Appointment) => (
        <Space size="middle">
          {record.status !== AppointmentStatus.COMPLETED && record.status !== AppointmentStatus.CANCELLED && (
            <Button type="link" onClick={() => handleOpenModal(record)}>
              Sửa
            </Button>
          )}

          {record.status === AppointmentStatus.PENDING && (
              <Popconfirm title="Xác nhận lịch?" onConfirm={() => handleStatusChange(record.id, AppointmentStatus.CONFIRMED)}>
                <Button type="link" style={{ color: "blue" }}>Xác nhận</Button>
              </Popconfirm>
          )}
          
          {record.status === AppointmentStatus.CONFIRMED && (
              <Popconfirm title="Hoàn thành lịch?" onConfirm={() => handleStatusChange(record.id, AppointmentStatus.COMPLETED)}>
                <Button type="link" style={{ color: "green" }}>Hoàn thành</Button>
              </Popconfirm>
          )}

          {record.status !== AppointmentStatus.COMPLETED && record.status !== AppointmentStatus.CANCELLED && (
              <Popconfirm title="Hủy lịch hẹn?" onConfirm={() => handleStatusChange(record.id, AppointmentStatus.CANCELLED)}>
                <Button type="link" danger>Hủy</Button>
              </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Quản lý lịch hẹn</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Đặt lịch mới
        </Button>
      </div>

      <Table columns={columns} dataSource={appointments} rowKey="id" />

      <Modal
        title={isEdit ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch mới'}
        visible={visible}
        onCancel={handleCancelModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="Tên khách hàng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                <Input placeholder="Số điện thoại khách hàng" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
                <Select placeholder="Chọn dịch vụ">
                  {services.map(s => <Option key={s.id} value={s.id}>{s.name} ({s.duration} phút)</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
                <Select placeholder="Chọn nhân viên">
                  {employees.map(e => <Option key={e.id} value={e.id}>{e.name} ({e.specialization})</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="appointmentDate" label="Ngày hẹn" rules={[{ required: true, message: 'Chọn ngày' }]}>
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancelModal}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {isEdit ? 'Lưu thay đổi' : 'Xác nhận đặt lịch'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LichHen;
