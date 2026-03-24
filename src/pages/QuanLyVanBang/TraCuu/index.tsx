import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, InputNumber, Button, Card, Row, Col, Table, message, DatePicker, Descriptions, Modal } from 'antd';
import { searchVanBangs, getQuyetDinhs, getCauHinhBieuMaus } from '@/services/quanlyvanbang';

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

const TraCuuVanBang: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ThongTinVbItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  const [quyetDinhs, setQuyetDinhs] = useState<{ id: number; decisionNumber: string; date: string; summary: string }[]>([]);
  const [cauHinhBieuMaus, setCauHinhBieuMaus] = useState<{ id: number; name: string; type: string }[]>([]);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ThongTinVbItem | undefined>(undefined);

  useEffect(() => {
    Promise.all([getQuyetDinhs(), getCauHinhBieuMaus()]).then(([resQd, resCh]) => {
      setQuyetDinhs(resQd?.data || (Array.isArray(resQd) ? resQd : []));
      setCauHinhBieuMaus(resCh?.data || (Array.isArray(resCh) ? resCh : []));
    });
  }, []);

  const handleSearch = async (values: any) => {
    const params = [
      values.diplomaNumber,
      values.registryNumber,
      values.studentId,
      values.fullName,
      values.dateOfBirth,
    ];
    const filledParams = params.filter((p) => p !== undefined && p !== null && p !== '');

    if (filledParams.length < 2) {
      message.warning('Yêu cầu nhập ít nhất 2 tham số tra cứu');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      };
      const res = await searchVanBangs(payload);
      if (res.success || Array.isArray(res)) {
        setData(res?.data || (Array.isArray(res) ? res : []));
      } else {
        message.warning(res.message);
      }
    } catch (error) {
      message.error('Lỗi khi tra cứu');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setData([]);
    setHasSearched(false);
  };

  const columns = [
    { title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber' },
    { title: 'Số vào sổ', dataIndex: 'registryNumber' },
    { title: 'MSV', dataIndex: 'studentId' },
    { title: 'Họ và tên', dataIndex: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'dateOfBirth' },
    {
      title: 'Thao tác',
      render: (text: string, record: ThongTinVbItem) => (
        <a onClick={() => {
          setSelectedRecord(record);
          setDetailVisible(true);
        }}>
          Xem chi tiết
        </a>
      )
    }
  ];

  const renderDetail = () => {
    if (!selectedRecord) return null;
    const qd = quyetDinhs.find(q => q.id === selectedRecord.quyetDinhId);

    return (
      <div>
        <Descriptions title="Thông tin cơ bản" bordered column={2}>
          <Descriptions.Item label="Số hiệu văn bằng">{selectedRecord.diplomaNumber}</Descriptions.Item>
          <Descriptions.Item label="Số vào sổ">{selectedRecord.registryNumber}</Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">{selectedRecord.studentId}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{selectedRecord.fullName}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{selectedRecord.dateOfBirth}</Descriptions.Item>
        </Descriptions>

        {cauHinhBieuMaus.length > 0 && (
          <Descriptions title="Các trường thông tin khác" bordered column={2} style={{ marginTop: 24 }}>
            {cauHinhBieuMaus.map(ch => (
              <Descriptions.Item key={ch.id} label={ch.name}>
                {selectedRecord.dynamicFields?.[ch.name] || 'N/A'}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}

        {qd && (
          <Descriptions title="Thông tin quyết định tốt nghiệp" bordered column={1} style={{ marginTop: 24 }}>
            <Descriptions.Item label="Số Quyết Định">{qd.decisionNumber}</Descriptions.Item>
            <Descriptions.Item label="Ngày ban hành">{qd.date}</Descriptions.Item>
            <Descriptions.Item label="Trích yếu">{qd.summary}</Descriptions.Item>
          </Descriptions>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <Card title="Các tiêu chí tìm kiếm (Nhập ít nhất 2 mục)" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="diplomaNumber" label="Số hiệu văn bằng">
                <Input placeholder="Nhập số hiệu văn bằng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="registryNumber" label="Số vào sổ">
                <InputNumber style={{ width: '100%' }} placeholder="Nhập số vào sổ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="studentId" label="Mã sinh viên (MSV)">
                <Input placeholder="Nhập MSV" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="fullName" label="Họ và tên">
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateOfBirth" label="Ngày sinh">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button onClick={clearForm} style={{ marginRight: 8 }}>
                Xóa tìm kiếm
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {hasSearched && (
        <Card title="Kết quả tra cứu">
          <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            columns={columns}
          />
        </Card>
      )}

      <Modal
        title="Chi tiết văn bằng"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>Đóng</Button>
        ]}
        width={800}
      >
        {renderDetail()}
      </Modal>
    </PageContainer>
  );
};

export default TraCuuVanBang;
