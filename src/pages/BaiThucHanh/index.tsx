import { Tabs } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ProductManagement from '@/pages/ProductManagement';
import OrderManagement from '@/pages/OrderManagement';

const { TabPane } = Tabs;

const BaiThucHanh: React.FC = () => {
    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ marginBottom: 24 }}>Quản lý Đơn hàng và Sản phẩm</h1>

            <Tabs defaultActiveKey="products" type="card" size="large">
                <TabPane
                    tab={
                        <span>
                            <ShoppingOutlined />
                            Quản lý Sản phẩm
                        </span>
                    }
                    key="products"
                >
                    <ProductManagement />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <ShoppingCartOutlined />
                            Quản lý Đơn hàng
                        </span>
                    }
                    key="orders"
                >
                    <OrderManagement />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default BaiThucHanh;
