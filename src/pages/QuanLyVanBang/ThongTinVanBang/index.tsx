import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, message, Popconfirm, Modal, Form, Input, Select, Space, DatePicker, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  getThongTinVanBangs,
  createThongTinVanBang,
  updateThongTinVanBang,
  deleteThongTinVanBang,
  getQuyetDinhs,
  getCauHinhBieuMaus,
} from '@/services/quanlyvanbang';

type ThongTinVbItem = {
  id: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  registryNumber: number;
  diplomaNumber: string;
  quyetDinhId: number;
  dynamicFields: Record<string, any>;
};

const ThongTinVanBang: React.FC = () => {
  const [data, setData] = useState<ThongTinVbItem[]>([]);
  const [quyetDinhs, setQuyetDinhs] = useState<{ id: number; decisionNumber: string }[]>([]);
  const [cauHinhBieuMaus, setCauHinhBieuMaus] = useState<{ id: number; name: string; type: string }[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ThongTinVbItem | undefined>(undefined);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [msgTt, msgQd, msgCh] = await Promise.all([
        getThongTinVanBangs(),
        getQuyetDinhs(),
        getCauHinhBieuMaus(),
      ]);
      setData(msgTt?.data || (Array.isArray(msgTt) ? msgTt : []));
      setQuyetDinhs(msgQd?.data || (Array.isArray(msgQd) ? msgQd : []));
      setCauHinhBieuMaus(msgCh?.data || (Array.isArray(msgCh) ? msgCh : []));
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
      const dynamicFields: Record<string, any> = {};
      cauHinhBieuMaus.forEach(ch => {
        if (values[`dynamic_${ch.id}`] !== undefined) {
          if (ch.type === 'Date' && values[`dynamic_${ch.id}`]) {
            dynamicFields[ch.name] = values[`dynamic_${ch.id}`].format('YYYY-MM-DD');
          } else {
            dynamicFields[ch.name] = values[`dynamic_${ch.id}`];
          }
        }
      });

      const payload = {
        studentId: values.studentId,
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
        diplomaNumber: values.diplomaNumber,
        quyetDinhId: values.quyetDinhId,
        dynamicFields,
      };

      if (currentRow) {
        await updateThongTinVanBang(currentRow.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await createThongTinVanBang(payload);
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
      await deleteThongTinVanBang(id);
      message.success('Xóa thành công');
      loadData();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    { title: 'Số vào sổ', dataIndex: 'registryNumber' },
    { title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber' },
    { title: 'Họ và tên', dataIndex: 'fullName' },
    { title: 'Mã SV', dataIndex: 'studentId' },
    { title: 'Ngày sinh', dataIndex: 'dateOfBirth' },
    {
      title: 'Thuộc Quyết định',
      dataIndex: 'quyetDinhId',
      render: (val: number) => {
        const qd = quyetDinhs.find((q) => q.id === val);
        return qd ? qd.decisionNumber : val;
      },
    },
    {
      title: 'Thao tác',
      render: (text: string, record: ThongTinVbItem) => (
        <Space>
          <a
            onClick={() => {
              setCurrentRow(record);
              const dynamicValues: Record<string, any> = {};
              cauHinhBieuMaus.forEach(ch => {
                if (record.dynamicFields && record.dynamicFields[ch.name] !== undefined) {
                  if (ch.type === 'Date') {
                    dynamicValues[`dynamic_${ch.id}`] = moment(record.dynamicFields[ch.name]);
                  } else {
                    dynamicValues[`dynamic_${ch.id}`] = record.dynamicFields[ch.name];
                  }
                }
              });

              form.setFieldsValue({
                ...record,
                dateOfBirth: record.dateOfBirth ? moment(record.dateOfBirth) : undefined,
                ...dynamicValues
              });
              setModalVisible(true);
            }}
          >
            Sửa
          </a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa văn bằng này?"
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
            <h2>Quản lý thông tin văn bằng</h2>
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
        title={currentRow ? 'Cập nhật văn bằng' : 'Thêm mới văn bằng'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Form.Item
              name="studentId"
              label="Mã sinh viên"
              rules={[{ required: true, message: 'Vui lòng nhập MSV' }]}
              style={{ flex: '1 1 45%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              style={{ flex: '1 1 45%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              style={{ flex: '1 1 45%' }}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="diplomaNumber"
              label="Số hiệu văn bằng"
              rules={[{ required: true, message: 'Vui lòng nhập số hiệu VB' }]}
              style={{ flex: '1 1 45%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="quyetDinhId"
              label="Quyết định tốt nghiệp"
              rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
              style={{ flex: '1 1 100%' }}
            >
              <Select>
                {quyetDinhs.map((q) => (
                  <Select.Option key={q.id} value={q.id}>
                    {q.decisionNumber}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {cauHinhBieuMaus.map(ch => (
              <Form.Item
                key={ch.id}
                name={`dynamic_${ch.id}`}
                label={ch.name}
                rules={[{ required: true, message: `Vui lòng nhập/chọn ${ch.name.toLowerCase()}` }]}
                style={{ flex: '1 1 45%' }}
              >
                {ch.type === 'String' ? <Input /> :
                  ch.type === 'Number' ? <InputNumber style={{ width: '100%' }} /> :
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />}
              </Form.Item>
            ))}
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ThongTinVanBang;
