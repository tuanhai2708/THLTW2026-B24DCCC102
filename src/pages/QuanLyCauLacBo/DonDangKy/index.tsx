import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Tag, message, Popconfirm, Dropdown, Menu, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getApplications, deleteApplication, approveApplications, rejectApplications, getClubs } from '@/services/QuanLyCauLacBo/api';
import RejectModal from './components/RejectModal';
import LogModal from './components/LogModal';
import ApplicationForm from './components/ApplicationForm';

const DonDangKy = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    getClubs().then(res => {
      if (res.success) {
        setClubs(res.data);
      }
    });
  }, []);

  const handleApprove = async (ids: string[]) => {
    try {
      await approveApplications(ids);
      message.success('Duyệt đơn thành công!');
      actionRef.current?.reload();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('Duyệt đơn thất bại!');
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="approve" onClick={() => handleApprove(selectedRowKeys as string[])}>
        Duyệt {selectedRowKeys.length} đơn đã chọn
      </Menu.Item>
      <Menu.Item key="reject" onClick={() => setRejectModalVisible(true)}>
        Từ chối {selectedRowKeys.length} đơn đã chọn
      </Menu.Item>
    </Menu>
  );

  const columns: ProColumns<any>[] = [
    { title: 'STT', dataIndex: 'index', valueType: 'indexBorder', width: 48, align: 'center' },
    { title: 'Họ và tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber' },
    { title: 'CLB', dataIndex: 'clubName' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        Pending: { text: 'Chờ duyệt', status: 'Processing' },
        Approved: { text: 'Đã duyệt', status: 'Success' },
        Rejected: { text: 'Từ chối', status: 'Error' },
      },
      render: (_, record) => {
        let color = 'gold';
        if (record.status === 'Approved') color = 'green';
        if (record.status === 'Rejected') color = 'red';
        return <Tag color={color}>{record.status}</Tag>;
      },
    },
    { title: 'Lý do đăng ký', dataIndex: 'reason', search: false, ellipsis: true },
    {
      title: 'Lý do từ chối',
      dataIndex: 'rejectReason',
      search: false,
      render: (_, record) => record.rejectReason ? <Tooltip title={record.rejectReason}><span>{record.rejectReason}</span></Tooltip> : '-',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 180,
      align: 'center',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setCurrentRow(record);
            setFormModalVisible(true);
          }}
        >
          Chi tiết
        </a>,
        <a
          key="log"
          onClick={() => {
            setCurrentRow(record);
            setLogModalVisible(true);
          }}
        >
          Lịch sử
        </a>,
        record.status === 'Pending' && (
          <a key="approveSingle" style={{ color: '#52c41a' }} onClick={() => handleApprove([record.id])}>
            Duyệt
          </a>
        ),
        record.status === 'Pending' && (
          <a
            key="rejectSingle"
            style={{ color: '#ff4d4f' }}
            onClick={() => {
              setSelectedRowKeys([record.id]);
              setRejectModalVisible(true);
            }}
          >
            Từ chối
          </a>
        ),
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa đơn này?"
          onConfirm={async () => {
            await deleteApplication(record.id);
            message.success('Xóa đơn thành công');
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: 'red' }}>Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="Quản lý Đơn đăng ký"
        actionRef={actionRef}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => { setCurrentRow(null); setFormModalVisible(true); }}>
            Thêm mới
          </Button>,
          selectedRowKeys.length > 0 && (
            <Dropdown overlay={menu} key="batch">
              <Button>
                Thao tác hàng loạt <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        request={async (params) => {
          const res = await getApplications(params);
          let data = res?.data || [];
          if (params.fullName) data = data.filter((d: any) => d.fullName.toLowerCase().includes(params.fullName.toLowerCase()));
          if (params.email) data = data.filter((d: any) => d.email.toLowerCase().includes(params.email.toLowerCase()));
          if (params.phoneNumber) data = data.filter((d: any) => d.phoneNumber.includes(params.phoneNumber));
          if (params.status) data = data.filter((d: any) => d.status === params.status);

          return { data, success: res?.success, total: data.length };
        }}
        columns={columns}
      />

      <RejectModal
        visible={rejectModalVisible}
        onClose={() => {
          setRejectModalVisible(false);
          if (selectedRowKeys.length === 1) setSelectedRowKeys([]);
        }}
        onFinish={async (reason) => {
          try {
            await rejectApplications(selectedRowKeys as string[], reason);
            message.success('Từ chối đơn thành công!');
            setRejectModalVisible(false);
            setSelectedRowKeys([]);
            actionRef.current?.reload();
          } catch (error) {
            message.error('Từ chối đơn thất bại!');
          }
        }}
      />

      <LogModal
        visible={logModalVisible}
        applicationId={currentRow?.id}
        onClose={() => {
          setLogModalVisible(false);
          setCurrentRow(null);
        }}
      />

      <ApplicationForm
        visible={formModalVisible}
        initialValues={currentRow}
        clubs={clubs}
        onClose={() => {
          setFormModalVisible(false);
          setCurrentRow(null);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default DonDangKy;
