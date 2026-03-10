import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm } from 'antd';
import { CauHoi, MucDoKho, MonHoc, KhoiKienThuc } from '../../models/nganHangCauHoi';
import { v4 as uuidv4 } from 'uuid';

// Dữ liệu mẫu cho MonHoc và KhoiKienThuc (cần truyền thực tế từ props hoặc context)
const monHocList: MonHoc[] = [];
const khoiKienThucList: KhoiKienThuc[] = [];
const mucDoList: MucDoKho[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const CauHoiManager: React.FC = () => {
  const [data, setData] = useState<CauHoi[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CauHoi | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: CauHoi) => {
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
    { title: 'Mã câu hỏi', dataIndex: 'maCauHoi' },
    { title: 'Môn học', dataIndex: 'monHocId', render: (id: string) => monHocList.find(m => m.id === id)?.tenMon || id },
    { title: 'Nội dung', dataIndex: 'noiDung' },
    { title: 'Mức độ', dataIndex: 'mucDo' },
    { title: 'Khối kiến thức', dataIndex: 'khoiKienThucId', render: (id: string) => khoiKienThucList.find(k => k.id === id)?.ten || id },
    {
      title: 'Hành động',
      render: (_: any, record: CauHoi) => (
        <Space>
          <Button onClick={() => openEdit(record)} type="link">Sửa</Button>
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // TODO: Nhận monHocList, khoiKienThucList từ props hoặc context thực tế

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Quản lý câu hỏi tự luận</h2>
      <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>Thêm câu hỏi</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        visible={modalOpen}
        title={editing ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="maCauHoi" label="Mã câu hỏi" rules={[{ required: true, message: 'Nhập mã câu hỏi' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}> 
            <Select options={monHocList.map(m => ({ value: m.id, label: m.tenMon }))} />
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true, message: 'Chọn mức độ' }]}> 
            <Select options={mucDoList.map(m => ({ value: m, label: m }))} />
          </Form.Item>
          <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối kiến thức' }]}> 
            <Select options={khoiKienThucList.map(k => ({ value: k.id, label: k.ten }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauHoiManager;
