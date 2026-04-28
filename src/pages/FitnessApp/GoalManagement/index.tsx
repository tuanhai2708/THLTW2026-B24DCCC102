import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Progress, Drawer, Form, Input, InputNumber, Select, DatePicker, Segmented, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getGoals, saveGoals, FitnessGoal } from '../store';
import styles from './index.less';

const { Option } = Select;
const { Title, Text } = Typography;

const GoalManagement: React.FC = () => {
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
  
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const handleDelete = (id: string) => {
    const newGoals = goals.filter(g => g.id !== id);
    setGoals(newGoals);
    saveGoals(newGoals);
    message.success('Xóa mục tiêu thành công');
  };

  const handleUpdateCurrentValue = (id: string, value: number | null) => {
    if (value === null) return;
    const newGoals = goals.map(g => {
      if (g.id === id) {
        const updated = { ...g, currentValue: value };
        // Auto update status if reached target
        if ((g.type === 'Giảm cân' && value <= g.targetValue) || 
            (g.type !== 'Giảm cân' && value >= g.targetValue)) {
          updated.status = 'Đã đạt';
        }
        return updated;
      }
      return g;
    });
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const showAddDrawer = () => {
    form.resetFields();
    form.setFieldsValue({ status: 'Đang thực hiện' });
    setIsDrawerVisible(true);
  };

  const handleDrawerOk = () => {
    form.validateFields().then(values => {
      const newGoal: FitnessGoal = {
        id: Date.now().toString(),
        name: values.name,
        type: values.type,
        targetValue: values.targetValue,
        currentValue: values.currentValue,
        deadline: values.deadline.format('YYYY-MM-DD'),
        status: values.status,
      };

      const newGoals = [...goals, newGoal];
      setGoals(newGoals);
      saveGoals(newGoals);
      setIsDrawerVisible(false);
      message.success('Thêm mục tiêu mới thành công');
    });
  };

  const filteredGoals = goals.filter(g => filterStatus === 'Tất cả' || g.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Đã đạt': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Đã hủy': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <SyncOutlined spin style={{ color: '#1890ff' }} />;
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Quản lý mục tiêu" bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <Segmented 
            options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']} 
            value={filterStatus}
            onChange={(val) => setFilterStatus(val as string)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddDrawer}>
            Thêm mục tiêu
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {filteredGoals.map(goal => {
            // Calculate progress percentage
            let percent = 0;
            if (goal.type === 'Giảm cân') {
              // For weight loss, assuming starting from a higher value, but we only have target and current.
              // Let's assume start was higher, simple calculation based on typical weight goal.
              // A simple generic formula for progress:
              // For increase type: current / target
              // For decrease type (Giảm cân): It's trickier without initial weight. We'll just show the actual number and a generic % or if we assume it's reached when current <= target.
              if (goal.currentValue <= goal.targetValue) {
                percent = 100;
              } else {
                // Approximate 50% if we don't know start, or just use 0 if current > target
                // To keep it simple, we use a basic formula: Target / Current for weight loss (not perfect, but works for UI)
                percent = Math.max(0, Math.min(100, Math.round((goal.targetValue / goal.currentValue) * 100)));
              }
            } else {
              percent = Math.max(0, Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)));
            }

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={goal.id}>
                <Card 
                  hoverable 
                  className={styles.goalCard}
                  actions={[
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(goal.id)}>
                      <Button type="text" danger icon={<DeleteOutlined />} size="small">Xóa</Button>
                    </Popconfirm>
                  ]}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Title level={5} style={{ margin: 0 }}>{goal.name}</Title>
                    {getStatusIcon(goal.status)}
                  </div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>{goal.type}</Text>
                  
                  <div style={{ marginBottom: 16 }}>
                    <Text>Hiện tại: </Text>
                    <InputNumber 
                      value={goal.currentValue} 
                      onChange={(val) => handleUpdateCurrentValue(goal.id, val)}
                      size="small"
                      style={{ width: 80, marginRight: 8 }}
                    />
                    <Text> / Mục tiêu: {goal.targetValue}</Text>
                  </div>

                  <Progress percent={percent} status={goal.status === 'Đã đạt' ? 'success' : goal.status === 'Đã hủy' ? 'exception' : 'active'} />
                  
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Deadline: {goal.deadline}</Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
        {filteredGoals.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            Không có mục tiêu nào
          </div>
        )}
      </Card>

      <Drawer
        title="Thêm mục tiêu mới"
        width={400}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsDrawerVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button onClick={handleDrawerOk} type="primary">
              Lưu
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
            <Input placeholder="Vd: Giảm 5kg" />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
            <Select>
              <Option value="Giảm cân">Giảm cân</Option>
              <Option value="Tăng cơ">Tăng cơ</Option>
              <Option value="Cải thiện sức bền">Cải thiện sức bền</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="currentValue" label="Giá trị hiện tại" rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng chọn ngày deadline' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              <Option value="Đang thực hiện">Đang thực hiện</Option>
              <Option value="Đã đạt">Đã đạt</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default GoalManagement;
