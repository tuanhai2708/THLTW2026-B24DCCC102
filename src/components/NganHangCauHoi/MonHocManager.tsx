import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm } from 'antd';
import { MonHoc } from '../../models/nganHangCauHoi';
import { v4 as uuidv4 } from 'uuid';

const MonHocManager: React.FC = () => {
  const [data, setData] = useState<MonHoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MonHoc | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: MonHoc) => {
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
    { title: 'Mã môn', dataIndex: 'maMon' },
    { title: 'Tên môn', dataIndex: 'tenMon' },
    { title: 'Số tín chỉ', dataIndex: 'soTinChi' },
    {
      title: 'Hành động',
      render: (_: any, record: MonHoc) => (
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
    <div style={{ marginTop: 32 }}>
      <h2>Danh mục môn học</h2>
      <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>Thêm môn học</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        visible={modalOpen}
        title={editing ? 'Sửa môn học' : 'Thêm môn học'}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="maMon" label="Mã môn" rules={[{ required: true, message: 'Nhập mã môn' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="tenMon" label="Tên môn" rules={[{ required: true, message: 'Nhập tên môn' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{ required: true, message: 'Nhập số tín chỉ' }]}> 
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonHocManager;
