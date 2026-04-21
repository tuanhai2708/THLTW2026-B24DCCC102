import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchPosts, deletePost } from '@/services/Blog/post';
import { fetchTags } from '@/services/Blog/tag';
import PostForm from './PostForm';
import moment from 'moment';

const PostManagement: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<API.BlogPost[]>([]);
    const [total, setTotal] = useState(0);
    const [tags, setTags] = useState<API.BlogTag[]>([]);
    
    const [params, setParams] = useState<API.PostSearchParams>({
        current: 1,
        pageSize: 10,
        keyword: '',
        status: undefined,
    });

    const [formVisible, setFormVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<API.BlogPost | null>(null);

    const loadData = async (currentParams = params) => {
        setLoading(true);
        try {
            const [postRes, tagRes] = await Promise.all([
                fetchPosts(currentParams),
                tags.length === 0 ? fetchTags() : Promise.resolve({ success: true, data: tags })
            ]);

            if (postRes.success) {
                setPosts(postRes.data);
                setTotal(postRes.total);
            }
            if (tags.length === 0 && tagRes.success) {
                setTags(tagRes.data);
            }
        } catch (error) {
            message.error('Lỗi khi lấy dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [params]);

    const handleTableChange = (pagination: any) => {
        setParams(prev => ({ ...prev, current: pagination.current, pageSize: pagination.pageSize }));
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id);
            message.success('Xóa bài viết thành công');
            loadData();
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            render: (text: string, record: API.BlogPost) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={record.thumbnail} alt="thumb" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    <span style={{ fontWeight: 500 }}>{text}</span>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={status === 'Published' ? 'success' : 'default'}>
                    {status === 'Published' ? 'Đã đăng' : 'Bản nháp'}
                </Tag>
            )
        },
        {
            title: 'Thẻ',
            dataIndex: 'tags',
            key: 'tags',
            render: (postTags: string[]) => {
                return postTags.map(tid => {
                    const tagObj = tags.find(t => t.id === tid);
                    return tagObj ? <Tag key={tid}>{tagObj.name}</Tag> : null;
                });
            }
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: API.BlogPost) => (
                <Space>
                    <Button 
                        type="primary" 
                        ghost 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => {
                            setEditingPost(record);
                            setFormVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa bài viết này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card title="Quản lý Bài viết">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm theo tiêu đề..."
                        allowClear
                        onSearch={(value) => setParams(prev => ({ ...prev, keyword: value, current: 1 }))}
                        style={{ width: 300 }}
                    />
                    <Select
                        placeholder="Lọc theo trạng thái"
                        allowClear
                        style={{ width: 150 }}
                        onChange={(value) => setParams(prev => ({ ...prev, status: value, current: 1 }))}
                    >
                        <Select.Option value="Published">Đã đăng</Select.Option>
                        <Select.Option value="Draft">Bản nháp</Select.Option>
                    </Select>
                </Space>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingPost(null);
                        setFormVisible(true);
                    }}
                >
                    Thêm bài viết
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={posts}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: params.current,
                    pageSize: params.pageSize,
                    total: total,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />

            <PostForm
                open={formVisible}
                initialValues={editingPost}
                tags={tags}
                onCancel={() => setFormVisible(false)}
                onSuccess={() => {
                    setFormVisible(false);
                    loadData();
                }}
            />
        </Card>
    );
};

export default PostManagement;
