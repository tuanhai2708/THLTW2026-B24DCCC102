import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Tag } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { getMembers, changeClub, getClubs } from '@/services/QuanLyCauLacBo/api';
import ChangeClubModal from './components/ChangeClubModal';
import { history } from 'umi';

const ThanhVien = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);

  // Lấy clubId từ URL (nếu redirect từ danh sách CLB)
  const query = new URLSearchParams(history.location.search);
  const initialClubId = query.get('clubId');

  useEffect(() => {
    getClubs().then(res => {
      if (res.success) {
        setClubs(res.data);
      }
    });
  }, []);

  const columns: ProColumns<any>[] = [
    { title: 'STT', dataIndex: 'index', valueType: 'indexBorder', width: 48, align: 'center' },
    { title: 'Họ và tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber' },
    { title: 'Sở trường', dataIndex: 'strengths', search: false },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubId', 
      valueType: 'select',
      initialValue: initialClubId,
      valueEnum: clubs.reduce((acc, current) => {
         acc[current.id] = { text: current.name };
         return acc;
      }, {}),
      render: (_, record) => <Tag color="blue">{record.clubName}</Tag>
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 150,
      align: 'center',
      render: (_, record) => [
        <Button
          key="changeClub"
          type="link"
          icon={<SwapOutlined />}
          onClick={() => {
            setSelectedRowKeys([record.id]);
            setModalVisible(true);
          }}
        >
          Đổi CLB
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="Danh sách Thành viên"
        actionRef={actionRef}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={() => setModalVisible(true)}
              key="batchChange"
            >
              Đổi CLB hàng loạt ({selectedRowKeys.length})
            </Button>
          ),
        ]}
        request={async (params) => {
          const res = await getMembers(params);
          let data = res?.data || [];
          if (params.fullName) data = data.filter((d: any) => d.fullName.toLowerCase().includes(params.fullName.toLowerCase()));
          if (params.clubId) data = data.filter((d: any) => d.clubId === params.clubId);
          
          return { data, success: res?.success, total: data.length };
        }}
        columns={columns}
      />

      <ChangeClubModal
        visible={modalVisible}
        clubs={clubs}
        selectedCount={selectedRowKeys.length}
        onClose={() => {
          setModalVisible(false);
          // if single row action, we can clear. If bulk, let's also clear
        }}
        onFinish={async (targetClubId) => {
          try {
            await changeClub(selectedRowKeys as string[], targetClubId);
            message.success('Đổi Câu lạc bộ thành công!');
            setModalVisible(false);
            setSelectedRowKeys([]);
            actionRef.current?.reload();
            return true;
          } catch (error) {
            message.error('Đổi Câu lạc bộ thất bại!');
            return false;
          }
        }}
      />
    </PageContainer>
  );
};

export default ThanhVien;
