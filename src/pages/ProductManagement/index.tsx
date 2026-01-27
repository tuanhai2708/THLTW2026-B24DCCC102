import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '@/models/product';

const categories = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Phụ kiện', 'Đồng hồ'];

const ProductManagement: React.FC = () => {
    const {
        filteredProducts,
        visible,
        setVisible,
        editVisible,
        setEditVisible,
        editingProduct,
        setEditingProduct,
        searchText,
        setSearchText,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductStatus,
    } = useModel('product');

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    // Thêm 
    const handleAddProduct = (values: Omit<Product, 'id'>) => {
        addProduct(values);
        setVisible(false);
        form.resetFields();
        message.success('Thêm sản phẩm thành công!');
    };

    // Sửa
    const handleEditProduct = (values: Omit<Product, 'id'>) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, values);
            setEditVisible(false);
            setEditingProduct(null);
            editForm.resetFields();
            message.success('Cập nhật sản phẩm thành công!');
        }
    };

    // Mở modal sửa
    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        editForm.setFieldsValue(product);
        setEditVisible(true);
    };

    // Xoá
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

    // Table
    const columns: ColumnsType<Product> = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 220,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 120,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 130,
            align: 'right',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 90,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 100,
            align: 'center',
            render: (_, record) => {
                const status = getProductStatus(record.quantity);
                return <Tag color={status.color}>{status.text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    >
                        Sửa
                    </Button>
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
                </Space>
            ),
        },
    ];

    // Form component để tái sử dụng
    const ProductForm = ({ formInstance, onFinish, submitText }: {
        formInstance: any;
        onFinish: (values: Omit<Product, 'id'>) => void;
        submitText: string;
    }) => (
        <Form
            form={formInstance}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
                <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
                <Select placeholder="Chọn danh mục">
                    {categories.map(cat => (
                        <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                    ))}
                </Select>
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
                    { type: 'number', min: 0, message: 'Số lượng không được âm!' },
                ]}
            >
                <InputNumber
                    placeholder="Nhập số lượng"
                    style={{ width: '100%' }}
                    min={0}
                    precision={0}
                />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                    <Button onClick={() => {
                        if (submitText === 'Thêm') {
                            setVisible(false);
                        } else {
                            setEditVisible(false);
                            setEditingProduct(null);
                        }
                        formInstance.resetFields();
                    }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {submitText}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );

    return (
        <div>
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
                pagination={{ pageSize: 5, showSizeChanger: true }}
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
                <ProductForm
                    formInstance={form}
                    onFinish={handleAddProduct}
                    submitText="Thêm"
                />
            </Modal>

            {/* Modal sửa sản phẩm */}
            <Modal
                title="Sửa sản phẩm"
                visible={editVisible}
                onCancel={() => {
                    setEditVisible(false);
                    setEditingProduct(null);
                    editForm.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <ProductForm
                    formInstance={editForm}
                    onFinish={handleEditProduct}
                    submitText="Cập nhật"
                />
            </Modal>
        </div>
    );
};

export default ProductManagement;
