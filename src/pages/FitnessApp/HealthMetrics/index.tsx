import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Popconfirm, Modal, Form, InputNumber, Tag, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getMetrics, saveMetrics, HealthMetric } from '../store';

const HealthMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);

  // Modal Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setMetrics(getMetrics().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleDelete = (id: string) => {
    const newMetrics = metrics.filter(m => m.id !== id);
    setMetrics(newMetrics);
    saveMetrics(newMetrics);
    message.success('Xóa chỉ số thành công');
  };

  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      date: moment(),
    });
    setIsModalVisible(true);
  };

  const showEditModal = (record: HealthMetric) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      date: moment(record.date)
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newMetric: HealthMetric = {
        id: editingId || Date.now().toString(),
        date: values.date.format('YYYY-MM-DD'),
        weight: values.weight,
        height: values.height,
        restingHeartRate: values.restingHeartRate,
        sleepHours: values.sleepHours,
      };

      let newMetrics;
      if (editingId) {
        newMetrics = metrics.map(m => m.id === editingId ? newMetric : m);
        message.success('Cập nhật chỉ số thành công');
      } else {
        newMetrics = [...metrics, newMetric];
        message.success('Thêm chỉ số mới thành công');
      }
      
      newMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMetrics(newMetrics);
      saveMetrics(newMetrics);
      setIsModalVisible(false);
    });
  };

  const calculateBMI = (weight: number, heightCm: number) => {
    if (!heightCm || heightCm === 0) return 0;
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
  };

  const getBMITag = (bmi: number) => {
    if (bmi < 18.5) return { color: 'blue', text: 'Thiếu cân' };
    if (bmi >= 18.5 && bmi <= 24.9) return { color: 'green', text: 'Bình thường' };
    if (bmi >= 25 && bmi <= 29.9) return { color: 'gold', text: 'Thừa cân' };
    return { color: 'red', text: 'Béo phì' };
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      key: 'bmi',
      render: (_: any, record: HealthMetric) => {
        const bmi = calculateBMI(record.weight, record.height);
        const bmiTag = getBMITag(bmi);
        return (
          <Space>
            <span>{bmi.toFixed(1)}</span>
            <Tag color={bmiTag.color}>{bmiTag.text}</Tag>
          </Space>
        );
      }
    },
    {
      title: 'Nhịp tim lúc nghỉ (bpm)',
      dataIndex: 'restingHeartRate',
      key: 'restingHeartRate',
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: HealthMetric) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Nhật ký chỉ số sức khỏe" bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Thêm chỉ số
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={metrics} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? "Sửa chỉ số" : "Thêm chỉ số mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Ngày ghi nhận" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}>
            <InputNumber min={30} max={200} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sleepHours" label="Giờ ngủ (tiếng)" rules={[{ required: true, message: 'Vui lòng nhập số giờ ngủ' }]}>
            <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthMetrics;
