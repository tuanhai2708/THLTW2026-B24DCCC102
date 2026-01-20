import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '@/models/product';

const ProductManagement: React.FC = () => {
    const {
        filteredProducts,
        visible,
        setVisible,
        searchText,
        setSearchText,
        addProduct,
        deleteProduct,
    } = useModel('product');

    const [form] = Form.useForm();

    // Xử lý thêm sản phẩm
    const handleAddProduct = (values: Omit<Product, 'id'>) => {
        addProduct(values);
        setVisible(false);
        form.resetFields();
        message.success('Thêm sản phẩm thành công!');
    };

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = (id: number) => {
        deleteProduct(id);
        message.success('Xóa sản phẩm thành công!');
    };

    // Định dạng giá tiền VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Cấu hình cột cho Table
    const columns: ColumnsType<Product> = [
        {
            title: 'STT',
            key: 'stt',
            width: 70,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 250,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            align: 'right',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            align: 'center',
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                    onConfirm={() => handleDeleteProduct(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ marginBottom: 24 }}>Quản lý Sản phẩm</h1>

            {/* Thanh công cụ: Tìm kiếm và Thêm mới */}
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setVisible(true)}
                >
                    Thêm sản phẩm
                </Button>
            </Space>

            {/* Bảng danh sách sản phẩm */}
            <Table
                dataSource={filteredProducts}
                columns={columns}
                rowKey="id"
                bordered
                pagination={{ pageSize: 10, showSizeChanger: true }}
            />

            {/* Modal thêm sản phẩm */}
            <Modal
                title="Thêm sản phẩm mới"
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddProduct}
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                        ]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá!' },
                            { type: 'number', min: 1, message: 'Giá phải là số dương!' },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập giá sản phẩm"
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                            min={1}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập số lượng"
                            style={{ width: '100%' }}
                            min={1}
                            precision={0}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;
