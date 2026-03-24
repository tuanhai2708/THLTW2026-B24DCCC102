import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, message, Popconfirm, Modal, Form, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  getCauHinhBieuMaus,
  createCauHinhBieuMau,
  updateCauHinhBieuMau,
  deleteCauHinhBieuMau,
} from '@/services/quanlyvanbang';

type CauHinhItem = {
  id: number;
  name: string;
  type: string;
};

const CauHinhBieuMau: React.FC = () => {
  const [data, setData] = useState<CauHinhItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CauHinhItem | undefined>(undefined);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const msg = await getCauHinhBieuMaus();
      setData(msg?.data || (Array.isArray(msg) ? msg : []));
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
      if (currentRow) {
        await updateCauHinhBieuMau(currentRow.id, values);
        message.success('Cập nhật thành công');
      } else {
        await createCauHinhBieuMau(values);
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
      await deleteCauHinhBieuMau(id);
      message.success('Xóa thành công');
      loadData();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên trường thông tin',
      dataIndex: 'name',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      render: (val: string) => {
        if (val === 'String') return 'Chuỗi ký tự (String)';
        if (val === 'Number') return 'Số (Number)';
        if (val === 'Date') return 'Ngày tháng (Date)';
        return val;
      },
    },
    {
      title: 'Thao tác',
      render: (text: string, record: CauHinhItem) => (
        <Space>
          <a
            onClick={() => {
              setCurrentRow(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trường này?"
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
            <h2>Danh sách trường thông tin phụ lục</h2>
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
        title={currentRow ? 'Cập nhật trường thông tin' : 'Thêm mới trường thông tin'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <Form.Item
            name="name"
            label="Tên trường thông tin"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
          >
            <Select>
              <Select.Option value="String">String</Select.Option>
              <Select.Option value="Number">Number</Select.Option>
              <Select.Option value="Date">Date</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CauHinhBieuMau;
