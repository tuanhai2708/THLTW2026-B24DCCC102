import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Popconfirm, Avatar, Tag, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getClubs, createClub, updateClub, deleteClub } from '@/services/QuanLyCauLacBo/api';
import ClubForm from './components/ClubForm';

const DanhSachCauLacBo = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>(null);

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      search: false,
      render: (_, record) => (
        <Avatar src={record.avatar}>{record.name?.charAt(0)}</Avatar>
      ),
      width: 60,
      align: 'center',
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      valueType: 'date',
      sorter: (a, b) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      search: false,
      render: (_, record) => <div dangerouslySetInnerHTML={{ __html: record.description || '' }} style={{ maxWidth: 200, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', display: '-webkit-box' }} />
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: {
        true: { text: 'Có', status: 'Success' },
        false: { text: 'Không', status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 150,
      align: 'center',
      render: (_, record) => [
        <Tooltip key="edit" title="Chỉnh sửa">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />}
            onClick={() => {
              setCurrentRow(record);
              setModalVisible(true);
            }}
          />
        </Tooltip>,
        <Tooltip key="members" title="Xem danh sách thành viên">
          <Button
            type="text"
            icon={<TeamOutlined style={{ color: '#52c41a' }} />}
            onClick={() => {
              history.push(`/quan-ly-cau-lac-bo/thanh-vien?clubId=${record.id}`);
            }}
          />
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa Câu lạc bộ này?"
          onConfirm={async () => {
            try {
              await deleteClub(record.id);
              message.success('Xóa thành công');
              actionRef.current?.reload();
            } catch (error) {
              message.error('Xóa thất bại');
            }
          }}
        >
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="Danh sách Câu lạc bộ"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(null);
              setModalVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            Thêm mới
          </Button>,
        ]}
        request={async (params) => {
          const res = await getClubs(params);
          let data = res?.data || [];
          if (params.name) {
            data = data.filter((item: any) => item.name.toLowerCase().includes(params.name.toLowerCase()));
          }
          if (params.president) {
             data = data.filter((item: any) => item.president.toLowerCase().includes(params.president.toLowerCase()));
          }
          if (params.isActive) {
             data = data.filter((item: any) => String(item.isActive) === params.isActive);
          }
           
          return {
            data: data,
            success: res?.success,
            total: data.length,
          };
        }}
        columns={columns}
      />

      <ClubForm
        initialValues={currentRow}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCurrentRow(null);
        }}
        onFinish={async (value) => {
          try {
            if (currentRow) {
              await updateClub(currentRow.id, value);
              message.success('Cập nhật Câu lạc bộ thành công!');
            } else {
              await createClub(value);
              message.success('Thêm Câu lạc bộ mới thành công!');
            }
            setModalVisible(false);
            setCurrentRow(null);
            actionRef.current?.reload();
            return true;
          } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại sau!');
            return false;
          }
        }}
      />
    </PageContainer>
  );
};

export default DanhSachCauLacBo;
