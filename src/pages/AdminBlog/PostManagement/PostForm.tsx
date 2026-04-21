import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { createPost, updatePost } from '@/services/Blog/post';

interface PostFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: API.BlogPost | null;
    tags: API.BlogTag[];
}

const PostForm: React.FC<PostFormProps> = ({ open, onCancel, onSuccess, initialValues, tags }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialValues, form]);

    const handleFinish = async (values: any) => {
        setSubmitting(true);
        try {
            if (initialValues) {
                const res = await updatePost(initialValues.id, values);
                if (res) {
                    message.success('Cập nhật bài viết thành công');
                    onSuccess();
                }
            } else {
                const res = await createPost(values);
                if (res) {
                    message.success('Thêm bài viết mới thành công');
                    onSuccess();
                }
            }
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={initialValues ? 'Sửa bài viết' : 'Thêm bài viết mới'}
            visible={open} // Use visible for antd < 4.23
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            width={800}
            destroyOnClose
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ status: 'Draft' }}
            >
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết' }]}
                >
                    <Input placeholder="Nhập tiêu đề..." />
                </Form.Item>

                <Form.Item
                    label="Slug (Đường dẫn tĩnh)"
                    name="slug"
                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                >
                    <Input placeholder="vi-du-slug-bai-viet" />
                </Form.Item>

                <Form.Item
                    label="Ảnh đại diện (URL)"
                    name="thumbnail"
                    rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện' }]}
                >
                    <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>

                <Form.Item
                    label="Nội dung Markdown"
                    name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết' }]}
                >
                    <Input.TextArea 
                        placeholder="Hỗ trợ Markdown syntax..." 
                        autoSize={{ minRows: 10, maxRows: 20 }}
                        style={{ fontFamily: 'monospace' }}
                    />
                </Form.Item>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item
                        label="Thẻ (Tags)"
                        name="tags"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn thẻ"
                            options={tags.map(t => ({ label: t.name, value: t.id }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        style={{ width: 200 }}
                    >
                        <Select>
                            <Select.Option value="Draft">Bản nháp</Select.Option>
                            <Select.Option value="Published">Đã đăng</Select.Option>
                        </Select>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default PostForm;
