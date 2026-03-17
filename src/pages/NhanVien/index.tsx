import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, TimePicker, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { DayOfWeek, Employee, WorkSchedule } from '@/models/nhanvien';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

const daysOfWeekOptions = [
  { label: 'Thứ 2', value: DayOfWeek.MONDAY },
  { label: 'Thứ 3', value: DayOfWeek.TUESDAY },
  { label: 'Thứ 4', value: DayOfWeek.WEDNESDAY },
  { label: 'Thứ 5', value: DayOfWeek.THURSDAY },
  { label: 'Thứ 6', value: DayOfWeek.FRIDAY },
  { label: 'Thứ 7', value: DayOfWeek.SATURDAY },
  { label: 'Chủ nhật', value: DayOfWeek.SUNDAY },
];

const NhanVien = () => {
  const { employees, getEmployees, addEmployee, updateEmployee, deleteEmployee } = useModel('nhanvien');
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    getEmployees();
  }, []);

  const handleOpenModal = (record?: Employee) => {
    if (record) {
      setIsEdit(true);
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        workingDays: record.workSchedules.filter((ws) => ws.isWorking).map((ws) => ws.dayOfWeek),
        startTime: moment(record.workSchedules[0]?.startTime || '09:00', 'HH:mm'),
        endTime: moment(record.workSchedules[0]?.endTime || '17:00', 'HH:mm'),
      });
    } else {
      setIsEdit(false);
      setEditingId('');
      form.resetFields();
      form.setFieldsValue({
        workingDays: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
        startTime: moment('09:00', 'HH:mm'),
        endTime: moment('17:00', 'HH:mm'),
        dailyCustomerLimit: 10,
      });
    }
    setVisible(true);
  };

  const handleCancelModal = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    const workSchedules: WorkSchedule[] = daysOfWeekOptions.map((opt) => ({
      dayOfWeek: opt.value,
      isWorking: values.workingDays.includes(opt.value),
      startTime: values.startTime ? values.startTime.format('HH:mm') : '09:00',
      endTime: values.endTime ? values.endTime.format('HH:mm') : '17:00',
    }));

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      specialization: values.specialization,
      dailyCustomerLimit: values.dailyCustomerLimit,
      workSchedules,
    };

    if (isEdit) {
      updateEmployee(editingId, payload);
    } else {
      addEmployee(payload);
    }
    setVisible(false);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa nhân viên',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => deleteEmployee(id),
    });
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Giới hạn khách/ngày',
      dataIndex: 'dailyCustomerLimit',
      key: 'dailyCustomerLimit',
    },
    {
      title: 'Lịch làm việc',
      key: 'schedule',
      render: (_: any, record: Employee) => {
        const workingDays = record.workSchedules.filter((ws) => ws.isWorking);
        if (workingDays.length === 0) return <span>Không có lịch</span>;
        
        const timeStr = `${workingDays[0].startTime} - ${workingDays[0].endTime}`;
        return (
          <Space direction="vertical" size="small">
            <span>{workingDays.length} ngày/tuần</span>
            <Tag color="green">{timeStr}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Quản lý nhân viên</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Thêm nhân viên
        </Button>
      </div>

      <Table columns={columns} dataSource={employees} rowKey="id" />

      <Modal
        title={isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
        visible={visible}
        onCancel={handleCancelModal}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Nhập họ tên nhân viên" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                <Input placeholder="Nhập email (không bắt buộc)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="specialization" label="Chuyên môn" rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}>
                <Input placeholder="VD: Cắt tóc, Massage, Gội đầu..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dailyCustomerLimit" label="Giới hạn khách/ngày" rules={[{ required: true, message: 'Nhập số' }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="workingDays" label="Ngày làm việc trong tuần" rules={[{ required: true, message: 'Chọn ít nhất 1 ngày làm việc' }]}>
            <Select mode="multiple" placeholder="Chọn các ngày làm việc" options={daysOfWeekOptions} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
                 <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancelModal}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhanVien;
