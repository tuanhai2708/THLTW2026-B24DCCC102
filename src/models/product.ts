import { useState } from 'react';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const initialProducts: Product[] = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 0 },
    { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 8 },
    { id: 6, name: 'Laptop Lenovo ThinkPad X1 Carbon', category: 'Laptop', price: 20000000, quantity: 5 },
    { id: 7, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 25 },
    { id: 8, name: 'Apple Watch Series 9', category: 'Đồng hồ', price: 12000000, quantity: 3 },
];

export default () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [visible, setVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    // Thêm mới
    const addProduct = (product: Omit<Product, 'id'>) => {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct: Product = { ...product, id: newId };
        setProducts([...products, newProduct]);
    };

    // Sửa sản phẩm
    const updateProduct = (id: number, updatedProduct: Omit<Product, 'id'>) => {
        setProducts(products.map(p =>
            p.id === id ? { ...updatedProduct, id } : p
        ));
    };

    // Xóa 
    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    // Cập nhật số lượng tồn kho (dùng khi đơn hàng hoàn thành/hủy)
    const updateQuantity = (id: number, delta: number) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
        ));
    };

    // Lấy trạng thái sản phẩm
    const getProductStatus = (quantity: number): { text: string; color: string } => {
        if (quantity > 10) return { text: 'Còn hàng', color: 'green' };
        if (quantity >= 1) return { text: 'Sắp hết', color: 'orange' };
        return { text: 'Hết hàng', color: 'red' };
    };

    // Lọc theo tên
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return {
        products,
        setProducts,
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
        updateQuantity,
        getProductStatus,
        filteredProducts,
    };
};
