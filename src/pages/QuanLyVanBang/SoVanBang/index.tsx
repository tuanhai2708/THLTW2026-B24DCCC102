import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, message, Popconfirm, Modal, Form, Input, InputNumber, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  getSoVanBangs,
  createSoVanBang,
  updateSoVanBang,
  deleteSoVanBang,
} from '@/services/quanlyvanbang';

type SoVanBangItem = {
  id: number;
  year: number;
  name: string;
  currentRegistryNumber: number;
};

const SoVanBang: React.FC = () => {
  const [data, setData] = useState<SoVanBangItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<SoVanBangItem | undefined>(undefined);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const msg = await getSoVanBangs();
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
        await updateSoVanBang(currentRow.id, values);
        message.success('Cập nhật thành công');
      } else {
        await createSoVanBang(values);
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
      await deleteSoVanBang(id);
      message.success('Xóa thành công');
      loadData();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Năm',
      dataIndex: 'year',
    },
    {
      title: 'Tên sổ văn bằng',
      dataIndex: 'name',
    },
    {
      title: 'Số vào sổ hiện tại',
      dataIndex: 'currentRegistryNumber',
    },
    {
      title: 'Thao tác',
      render: (text: string, record: SoVanBangItem) => (
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
            title="Bạn có chắc chắn muốn xóa sổ này?"
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
            <h2>Quản lý sổ văn bằng</h2>
            <Button
              type="primary"
              onClick={() => {
                setCurrentRow(undefined);
                form.resetFields();
                form.setFieldsValue({ year: new Date().getFullYear() });
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
        title={currentRow ? 'Cập nhật sổ văn bằng' : 'Mở sổ văn bằng mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <Form.Item
            name="year"
            label="Năm"
            rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
          >
            <InputNumber disabled={!!currentRow} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên sổ"
            rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SoVanBang;
