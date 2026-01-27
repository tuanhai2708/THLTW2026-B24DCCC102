import { useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, Descriptions, message } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import type { Order, OrderStatus, OrderItem } from '@/models/order';
import { orderStatusConfig } from '@/models/order';

const { Text } = Typography;

const OrderManagement: React.FC = () => {
    const {
        orders,
        visible,
        setVisible,
        detailVisible,
        setDetailVisible,
        selectedOrder,
        setSelectedOrder,
        addOrder,
        updateOrderStatus,
    } = useModel('order');

    const { products, updateQuantity } = useModel('product');

    const [form] = Form.useForm();
    const [orderItems, setOrderItems] = useState<{ productId: number; quantity: number }[]>([]);

    // Lấy sản phẩm còn hàng
    const availableProducts = products.filter(p => p.quantity > 0);

    // Định dạng giá tiền VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Định dạng ngày tạo
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    // Tính tổng tiền đơn hàng
    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    // Xử lý chọn sản phẩm
    const handleProductSelect = (productIds: number[]) => {
        const newItems = productIds.map(id => {
            const existing = orderItems.find(item => item.productId === id);
            return existing || { productId: id, quantity: 1 };
        });
        setOrderItems(newItems);
    };

    // Xử lý thay đổi số lượng
    const handleQuantityChange = (productId: number, quantity: number) => {
        setOrderItems(orderItems.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        ));
    };

    // Tạo đơn hàng
    const handleCreateOrder = (values: { customerName: string; phone: string; address: string }) => {
        if (orderItems.length === 0) {
            message.error('Vui lòng chọn ít nhất 1 sản phẩm!');
            return;
        }

        const items: OrderItem[] = orderItems.map(item => {
            const product = products.find(p => p.id === item.productId)!;
            return {
                productId: item.productId,
                productName: product.name,
                price: product.price,
                quantity: item.quantity,
            };
        });

        addOrder({
            ...values,
            items,
            totalAmount: calculateTotal(),
        });

        setVisible(false);
        form.resetFields();
        setOrderItems([]);
        message.success('Tạo đơn hàng thành công!');
    };

    // Xử lý thay đổi trạng thái
    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        const result = updateOrderStatus(orderId, newStatus);
        if (!result) return;

        const { oldStatus, items } = result;

        // Xử lý tồn kho
        if (newStatus === 'completed' && oldStatus !== 'completed') {
            // Trừ tồn kho khi hoàn thành
            items.forEach(item => {
                updateQuantity(item.productId, -item.quantity);
            });
            message.success('Đơn hàng đã hoàn thành! Số lượng tồn kho đã được cập nhật.');
        } else if (newStatus === 'cancelled' && oldStatus === 'completed') {
            // Hoàn trả tồn kho khi hủy đơn đã hoàn thành
            items.forEach(item => {
                updateQuantity(item.productId, item.quantity);
            });
            message.warning('Đơn hàng đã hủy! Số lượng tồn kho đã được hoàn trả.');
        } else if (oldStatus === 'completed' && newStatus !== 'completed' && newStatus !== 'cancelled') {
            // Hoàn trả tồn kho nếu đổi từ hoàn thành sang trạng thái khác
            items.forEach(item => {
                updateQuantity(item.productId, item.quantity);
            });
            message.info('Trạng thái đã cập nhật! Số lượng tồn kho đã được hoàn trả.');
        } else {
            message.success('Cập nhật trạng thái thành công!');
        }
    };

    // Xem chi tiết đơn hàng
    const viewOrderDetail = (order: Order) => {
        setSelectedOrder(order);
        setDetailVisible(true);
    };

    // Columns cho bảng đơn hàng
    const columns: ColumnsType<Order> = [
        {
            title: 'Mã ĐH',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
            render: (id) => `#${id}`,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 150,
        },
        {
            title: 'Số SP',
            key: 'itemCount',
            width: 80,
            align: 'center',
            render: (_, record) => record.items.length,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 130,
            align: 'right',
            render: (amount) => formatPrice(amount),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            align: 'center',
            render: (status: OrderStatus, record) => (
                <Select
                    value={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    size="small"
                >
                    {Object.entries(orderStatusConfig).map(([key, config]) => (
                        <Select.Option key={key} value={key}>
                            <Tag color={config.color} style={{ margin: 0 }}>{config.text}</Tag>
                        </Select.Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date) => formatDate(date),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => viewOrderDetail(record)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div>
            {/* Nút tạo đơn hàng */}
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setVisible(true)}
                >
                    Tạo đơn hàng
                </Button>
            </div>

            {/* Bảng danh sách đơn hàng */}
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                bordered
                pagination={{ pageSize: 5, showSizeChanger: true }}
            />

            {/* Modal tạo đơn hàng */}
            <Modal
                title="Tạo đơn hàng mới"
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                    setOrderItems([]);
                }}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
                    {/* Chọn sản phẩm */}
                    <Form.Item
                        label="Chọn sản phẩm"
                        required
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn sản phẩm"
                            style={{ width: '100%' }}
                            value={orderItems.map(item => item.productId)}
                            onChange={handleProductSelect}
                        >
                            {availableProducts.map(product => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name} - {formatPrice(product.price)} (Còn: {product.quantity})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Nhập số lượng cho từng sản phẩm */}
                    {orderItems.length > 0 && (
                        <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
                            <Text strong>Số lượng đặt hàng:</Text>
                            {orderItems.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                if (!product) return null;
                                return (
                                    <div key={item.productId} style={{ display: 'flex', alignItems: 'center', marginTop: 8, gap: 8 }}>
                                        <Text style={{ flex: 1 }}>{product.name}:</Text>
                                        <InputNumber
                                            min={1}
                                            max={product.quantity}
                                            value={item.quantity}
                                            onChange={(val) => handleQuantityChange(item.productId, val || 1)}
                                            style={{ width: 80 }}
                                        />
                                        <Text type="secondary">(Tối đa: {product.quantity})</Text>
                                    </div>
                                );
                            })}
                            <div style={{ marginTop: 12, textAlign: 'right' }}>
                                <Text strong style={{ fontSize: 16 }}>
                                    Tổng tiền: {formatPrice(calculateTotal())}
                                </Text>
                            </div>
                        </div>
                    )}

                    {/* Thông tin khách hàng */}
                    <Form.Item
                        label="Tên khách hàng"
                        name="customerName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            {
                                pattern: /^[0-9]{10,11}$/,
                                message: 'Số điện thoại phải có 10-11 chữ số!'
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại (10-11 số)" maxLength={11} />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input.TextArea placeholder="Nhập địa chỉ giao hàng" rows={2} />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setVisible(false);
                                form.resetFields();
                                setOrderItems([]);
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Tạo đơn hàng
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chi tiết đơn hàng */}
            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id || ''}`}
                visible={detailVisible}
                onCancel={() => {
                    setDetailVisible(false);
                    setSelectedOrder(null);
                }}
                footer={[
                    <Button key="close" onClick={() => setDetailVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedOrder && (
                    <>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Tên khách hàng">
                                {selectedOrder.customerName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {selectedOrder.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">
                                {selectedOrder.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={orderStatusConfig[selectedOrder.status].color}>
                                    {orderStatusConfig[selectedOrder.status].text}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                {formatDate(selectedOrder.createdAt)}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Danh sách sản phẩm:</Text>
                            <Table
                                dataSource={selectedOrder.items}
                                rowKey="productId"
                                size="small"
                                pagination={false}
                                style={{ marginTop: 8 }}
                                columns={[
                                    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
                                    { title: 'Đơn giá', dataIndex: 'price', key: 'price', render: formatPrice, align: 'right' as const },
                                    { title: 'SL', dataIndex: 'quantity', key: 'quantity', align: 'center' as const },
                                    {
                                        title: 'Thành tiền',
                                        key: 'subtotal',
                                        align: 'right' as const,
                                        render: (_, record) => formatPrice(record.price * record.quantity)
                                    },
                                ]}
                            />
                            <div style={{ marginTop: 12, textAlign: 'right' }}>
                                <Text strong style={{ fontSize: 16 }}>
                                    Tổng tiền: {formatPrice(selectedOrder.totalAmount)}
                                </Text>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default OrderManagement;
