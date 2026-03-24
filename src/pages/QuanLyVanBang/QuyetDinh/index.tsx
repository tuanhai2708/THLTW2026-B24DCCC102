import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, message, Popconfirm, Modal, Form, Input, Select, Space, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  getQuyetDinhs,
  createQuyetDinh,
  updateQuyetDinh,
  deleteQuyetDinh,
  getSoVanBangs,
} from '@/services/quanlyvanbang';

type QuyetDinhItem = {
  id: number;
  decisionNumber: string;
  date: string;
  summary: string;
  soVanBangId: number;
  lookupCount: number;
};

const QuyetDinh: React.FC = () => {
  const [data, setData] = useState<QuyetDinhItem[]>([]);
  const [soVanBangs, setSoVanBangs] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<QuyetDinhItem | undefined>(undefined);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [msgQd, msgSvb] = await Promise.all([getQuyetDinhs(), getSoVanBangs()]);
      setData(msgQd?.data || (Array.isArray(msgQd) ? msgQd : []));
      setSoVanBangs(msgSvb?.data || (Array.isArray(msgSvb) ? msgSvb : []));
    } catch (e) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddOrUpdate = async (values: any) => {
    try {
      const payload = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
      };
      if (currentRow) {
        await updateQuyetDinh(currentRow.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await createQuyetDinh(payload);
        message.success('Thêm mới thành công');
      }
      setModalVisible(false);
      setCurrentRow(undefined);
      loadData();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuyetDinh(id);
      message.success('Xóa thành công');
      loadData();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Số quyết định',
      dataIndex: 'decisionNumber',
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'date',
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'soVanBangId',
      render: (val: number) => {
        const svb = soVanBangs.find((s) => s.id === val);
        return svb ? svb.name : val;
      },
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'lookupCount',
    },
    {
      title: 'Thao tác',
      render: (text: string, record: QuyetDinhItem) => (
        <Space>
          <a
            onClick={() => {
              setCurrentRow(record);
              form.setFieldsValue({
                ...record,
                date: record.date ? moment(record.date) : undefined,
              });
              setModalVisible(true);
            }}
          >
            Sửa
          </a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa quyết định này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a style={{ color: 'red' }}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Table
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>Quản lý Quyết định tốt nghiệp</h2>
            <Button
              type="primary"
              onClick={() => {
                setCurrentRow(undefined);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> Thêm mới
            </Button>
          </div>
        )}
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
      />

      <Modal
        title={currentRow ? 'Cập nhật quyết định' : 'Thêm quyết định mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <Form.Item
            name="decisionNumber"
            label="Số quyết định"
            rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày ban hành"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="summary"
            label="Trích yếu"
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="soVanBangId"
            label="Sổ văn bằng"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
          >
            <Select>
              {soVanBangs.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default QuyetDinh;
