import { useState } from 'react';

export type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    customerName: string;
    phone: string;
    address: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}

// Trạng thái hiển thị
export const orderStatusConfig: Record<OrderStatus, { text: string; color: string }> = {
    pending: { text: 'Chờ xử lý', color: 'blue' },
    shipping: { text: 'Đang giao', color: 'orange' },
    completed: { text: 'Hoàn thành', color: 'green' },
    cancelled: { text: 'Đã hủy', color: 'red' },
};

const initialOrders: Order[] = [
    {
        id: 1,
        customerName: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        items: [
            { productId: 1, productName: 'Laptop Dell XPS 13', price: 25000000, quantity: 1 },
            { productId: 7, productName: 'AirPods Pro 2', price: 6000000, quantity: 2 },
        ],
        totalAmount: 37000000,
        status: 'pending',
        createdAt: '2026-01-25T10:30:00',
    },
    {
        id: 2,
        customerName: 'Trần Thị B',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận 7, TP.HCM',
        items: [
            { productId: 2, productName: 'iPhone 15 Pro Max', price: 30000000, quantity: 1 },
        ],
        totalAmount: 30000000,
        status: 'shipping',
        createdAt: '2026-01-26T14:15:00',
    },
];

export default () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [visible, setVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Tạo đơn hàng mới
    const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        const newOrder: Order = {
            ...orderData,
            id: newId,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        setOrders([...orders, newOrder]);
        return newOrder;
    };

    // Cập nhật trạng thái đơn hàng - trả về items để xử lý tồn kho
    const updateOrderStatus = (id: number, newStatus: OrderStatus): {
        oldStatus: OrderStatus;
        items: OrderItem[]
    } | null => {
        const order = orders.find(o => o.id === id);
        if (!order) return null;

        const oldStatus = order.status;
        setOrders(orders.map(o =>
            o.id === id ? { ...o, status: newStatus } : o
        ));

        return { oldStatus, items: order.items };
    };

    // Lấy đơn hàng theo ID
    const getOrderById = (id: number): Order | undefined => {
        return orders.find(o => o.id === id);
    };

    return {
        orders,
        setOrders,
        visible,
        setVisible,
        detailVisible,
        setDetailVisible,
        selectedOrder,
        setSelectedOrder,
        addOrder,
        updateOrderStatus,
        getOrderById,
    };
};
