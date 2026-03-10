import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message } from 'antd';
import { DeThi, CauTrucDeThiItem, MonHoc, KhoiKienThuc, MucDoKho, CauHoi } from '../../models/nganHangCauHoi';
import { v4 as uuidv4 } from 'uuid';

// Dữ liệu mẫu (cần truyền thực tế từ props hoặc context)
const monHocList: MonHoc[] = [];
const khoiKienThucList: KhoiKienThuc[] = [];
const mucDoList: MucDoKho[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
const cauHoiList: CauHoi[] = [];

const DeThiManager: React.FC = () => {
  const [data, setData] = useState<DeThi[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DeThi | null>(null);
  const [form] = Form.useForm();
  const [cauTruc, setCauTruc] = useState<CauTrucDeThiItem[]>([]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setCauTruc([]);
    setModalOpen(true);
  };

  const openEdit = (record: DeThi) => {
    setEditing(record);
    form.setFieldsValue({ tenDe: record.tenDe, monHocId: record.monHocId });
    setCauTruc(record.cauTruc.items);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  // Sinh đề thi tự động dựa trên cấu trúc
  const generateDeThi = (monHocId: string, items: CauTrucDeThiItem[]): string[] | null => {
    let selected: string[] = [];
    for (const item of items) {
      const filtered = cauHoiList.filter(
        q => q.monHocId === monHocId && q.khoiKienThucId === item.khoiKienThucId && q.mucDo === item.mucDo
      );
      if (filtered.length < item.soLuong) {
        return null; // Không đủ câu hỏi
      }
      // Lấy ngẫu nhiên đủ số lượng
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      selected = selected.concat(shuffled.slice(0, item.soLuong).map(q => q.id));
    }
    return selected;
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (!cauTruc.length) {
        message.error('Cần thêm cấu trúc đề thi!');
        return;
      }
      const cauHoiIds = generateDeThi(values.monHocId, cauTruc);
      if (!cauHoiIds) {
        message.error('Không đủ câu hỏi phù hợp để tạo đề thi!');
        return;
      }
      const deThi: DeThi = {
        id: editing ? editing.id : uuidv4(),
        monHocId: values.monHocId,
        cauHoiIds,
        cauTruc: { monHocId: values.monHocId, items: cauTruc },
        tenDe: values.tenDe,
        ngayTao: new Date().toISOString(),
      };
      if (editing) {
        setData(data.map(item => item.id === editing.id ? deThi : item));
      } else {
        setData([deThi, ...data]);
      }
      setModalOpen(false);
    });
  };

  // Thêm cấu trúc đề thi item
  const addCauTrucItem = (item: CauTrucDeThiItem) => {
    setCauTruc([...cauTruc, item]);
  };

  const columns = [
    { title: 'STT', dataIndex: 'stt', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'Tên đề', dataIndex: 'tenDe' },
    { title: 'Môn học', dataIndex: 'monHocId', render: (id: string) => monHocList.find(m => m.id === id)?.tenMon || id },
    { title: 'Ngày tạo', dataIndex: 'ngayTao', render: (d: string) => new Date(d).toLocaleString() },
    {
      title: 'Hành động',
      render: (_: any, record: DeThi) => (
        <Space>
          <Button onClick={() => openEdit(record)} type="link">Sửa</Button>
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Form thêm cấu trúc đề thi item
  const [itemForm] = Form.useForm();

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Quản lý đề thi & sinh đề tự động</h2>
      <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>Tạo đề thi</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        visible={modalOpen}
        title={editing ? 'Sửa đề thi' : 'Tạo đề thi'}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenDe" label="Tên đề thi" rules={[{ required: true, message: 'Nhập tên đề thi' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}> 
            <Select options={monHocList.map(m => ({ value: m.id, label: m.tenMon }))} />
          </Form.Item>
        </Form>
        <div style={{ margin: '16px 0', border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
          <b>Cấu trúc đề thi</b>
          <Form form={itemForm} layout="inline" style={{ marginTop: 8 }} onFinish={addCauTrucItem}>
            <Form.Item name="khoiKienThucId" rules={[{ required: true, message: 'Chọn khối kiến thức' }]}> 
              <Select placeholder="Khối kiến thức" options={khoiKienThucList.map(k => ({ value: k.id, label: k.ten }))} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="mucDo" rules={[{ required: true, message: 'Chọn mức độ' }]}> 
              <Select placeholder="Mức độ" options={mucDoList.map(m => ({ value: m, label: m }))} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="soLuong" rules={[{ required: true, message: 'Nhập số lượng' }]}> 
              <InputNumber min={1} max={50} placeholder="Số lượng" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="dashed">Thêm</Button>
            </Form.Item>
          </Form>
          <Table
            size="small"
            style={{ marginTop: 8 }}
            rowKey={(_, idx) => String(idx)}
            columns={[
              { title: 'Khối kiến thức', dataIndex: 'khoiKienThucId', render: (id: string) => khoiKienThucList.find(k => k.id === id)?.ten || id },
              { title: 'Mức độ', dataIndex: 'mucDo' },
              { title: 'Số lượng', dataIndex: 'soLuong' },
            ]}
            dataSource={cauTruc}
            pagination={false}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DeThiManager;
