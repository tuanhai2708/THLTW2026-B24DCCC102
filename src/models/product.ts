import { useState } from 'react';

export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// Mock data theo yêu cầu
const initialProducts: Product[] = [
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [visible, setVisible] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    // Thêm sản phẩm mới
    const addProduct = (product: Omit<Product, 'id'>) => {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct: Product = { ...product, id: newId };
        setProducts([...products, newProduct]);
    };

    // Xóa sản phẩm
    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    // Lọc sản phẩm theo tên (realtime search)
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return {
        products,
        setProducts,
        visible,
        setVisible,
        searchText,
        setSearchText,
        addProduct,
        deleteProduct,
        filteredProducts,
    };
};
