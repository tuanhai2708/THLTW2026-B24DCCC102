import { Button, Form, Input, InputNumber, Modal, Space, Table, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Service } from '@/models/dichvu';

const { Title } = Typography;

const DichVu = () => {
  const { services, getServices, addService, updateService, deleteService } = useModel('dichvu');
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    getServices();
  }, []);

  const handleOpenModal = (record?: Service) => {
    if (record) {
      setIsEdit(true);
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setIsEdit(false);
      setEditingId('');
      form.resetFields();
      form.setFieldsValue({
        price: 100000,
        duration: 30,
      });
    }
    setVisible(true);
  };

  const handleCancelModal = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    if (isEdit) {
      updateService(editingId, values);
    } else {
      addService(values);
    }
    setVisible(false);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa dịch vụ',
      content: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => deleteService(id),
    });
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Service) => (
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
        <Title level={4}>Quản lý dịch vụ</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Thêm dịch vụ
        </Button>
      </div>

      <Table columns={columns} dataSource={services} rowKey="id" />

      <Modal
        title={isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
        visible={visible}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}>
            <Input placeholder="Tên dịch vụ..." />
          </Form.Item>
          
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết về dịch vụ..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                <InputNumber min={0} step={10000} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '') as any} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="Thời gian thực hiện (phút)" rules={[{ required: true, message: 'Nhập thời gian' }]}>
                <InputNumber min={5} step={5} style={{ width: '100%' }} />
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

export default DichVu;
