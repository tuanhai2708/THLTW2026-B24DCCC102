import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Modal, Form, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchTags, createTag, updateTag, deleteTag } from '@/services/Blog/tag';

const TagManagement: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<API.BlogTag[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingTag, setEditingTag] = useState<API.BlogTag | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchTags();
            if (res.success) {
                setTags(res.data);
            }
        } catch (error) {
            message.error('Lỗi khi lấy dữ liệu thẻ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteTag(id);
            message.success('Xóa thẻ thành công');
            loadData();
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    const handleOpenForm = (record?: API.BlogTag) => {
        if (record) {
            setEditingTag(record);
            form.setFieldsValue({ name: record.name });
        } else {
            setEditingTag(null);
            form.resetFields();
        }
        setFormVisible(true);
    };

    const handleFinish = async (values: any) => {
        setSubmitting(true);
        try {
            if (editingTag) {
                await updateTag(editingTag.id, values);
                message.success('Cập nhật thẻ thành công');
            } else {
                await createTag(values);
                message.success('Thêm thẻ mới thành công');
            }
            setFormVisible(false);
            loadData();
        } catch (error) {
            message.error('Thực hiện thất bại, vui lòng thử lại');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Tên thẻ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số bài viết sử dụng',
            dataIndex: 'count',
            key: 'count',
            width: 200,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: API.BlogTag) => (
                <Space>
                    <Button 
                        type="primary" 
                        ghost 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleOpenForm(record)}
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa thẻ này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                        disabled={record.count !== undefined && record.count > 0}
                    >
                        <Button 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small" 
                            disabled={record.count !== undefined && record.count > 0} 
                            title={record.count !== undefined && record.count > 0 ? 'Không thể xóa thẻ đang được sử dụng' : ''}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card title="Quản lý Thẻ (Tags)">
            <div style={{ marginBottom: 16 }}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenForm()}
                >
                    Thêm thẻ
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={tags}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <Modal
                title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
                visible={formVisible}
                onCancel={() => setFormVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label="Tên thẻ"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
                    >
                        <Input placeholder="Ví dụ: React, Frontend..." />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default TagManagement;
