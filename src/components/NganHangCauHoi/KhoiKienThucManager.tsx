import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { KhoiKienThuc } from '../../models/nganHangCauHoi';
import { v4 as uuidv4 } from 'uuid';

const KhoiKienThucManager: React.FC = () => {
  const [data, setData] = useState<KhoiKienThuc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KhoiKienThuc | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: KhoiKienThuc) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setData(data.map(item => item.id === editing.id ? { ...item, ...values } : item));
      } else {
        setData([{ id: uuidv4(), ...values }, ...data]);
      }
      setModalOpen(false);
    });
  };

  const columns = [
    { title: 'STT', dataIndex: 'stt', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'Tên khối kiến thức', dataIndex: 'ten' },
    {
      title: 'Hành động',
      render: (_: any, record: KhoiKienThuc) => (
        <Space>
          <Button onClick={() => openEdit(record)} type="link">Sửa</Button>
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh mục khối kiến thức</h2>
      <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>Thêm khối kiến thức</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        visible={modalOpen}
        title={editing ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên khối kiến thức" rules={[{ required: true, message: 'Nhập tên khối kiến thức' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhoiKienThucManager;
