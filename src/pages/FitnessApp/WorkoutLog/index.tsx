import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, DatePicker, Space, Popconfirm, Modal, Form, InputNumber, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getWorkouts, saveWorkouts, Workout } from '../store';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WorkoutLog: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  
  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  // Modal Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = getWorkouts();
    setWorkouts(data);
    setFilteredWorkouts(data);
  }, []);

  useEffect(() => {
    let result = workouts;
    
    // Filter by search text (notes)
    if (searchText) {
      result = result.filter(w => w.notes.toLowerCase().includes(searchText.toLowerCase()) || w.type.toLowerCase().includes(searchText.toLowerCase()));
    }
    
    // Filter by type
    if (filterType) {
      result = result.filter(w => w.type === filterType);
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day').valueOf();
      const end = dateRange[1].endOf('day').valueOf();
      result = result.filter(w => {
        const time = new Date(w.date).getTime();
        return time >= start && time <= end;
      });
    }
    
    // Sort by date descending
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredWorkouts([...result]);
  }, [workouts, searchText, filterType, dateRange]);

  const handleDelete = (id: string) => {
    const newWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(newWorkouts);
    saveWorkouts(newWorkouts);
    message.success('Xóa buổi tập thành công');
  };

  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      date: moment(),
      status: 'Completed'
    });
    setIsModalVisible(true);
  };

  const showEditModal = (record: Workout) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      date: moment(record.date)
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newWorkout: Workout = {
        id: editingId || Date.now().toString(),
        date: values.date.format('YYYY-MM-DD'),
        type: values.type,
        duration: values.duration,
        calories: values.calories,
        notes: values.notes || '',
        status: values.status,
      };

      let newWorkouts;
      if (editingId) {
        newWorkouts = workouts.map(w => w.id === editingId ? newWorkout : w);
        message.success('Cập nhật buổi tập thành công');
      } else {
        newWorkouts = [...workouts, newWorkout];
        message.success('Thêm buổi tập mới thành công');
      }

      setWorkouts(newWorkouts);
      saveWorkouts(newWorkouts);
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Workout, b: Workout) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          Cardio: 'blue',
          Strength: 'volcano',
          Yoga: 'green',
          HIIT: 'red',
          Other: 'default',
        };
        return <Tag color={colors[type] || 'default'}>{type}</Tag>;
      }
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Calo đốt',
      dataIndex: 'calories',
      key: 'calories',
      render: (val: number) => <Tag color="orange">{val} kcal</Tag>
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'success' : 'error'}>
          {status === 'Completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Workout) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Nhật ký tập luyện" bordered={false}>
        <Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Thêm buổi tập
          </Button>
          <Input 
            placeholder="Tìm kiếm..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select 
            placeholder="Loại bài tập" 
            style={{ width: 150 }} 
            allowClear
            value={filterType}
            onChange={setFilterType}
          >
            <Option value="Cardio">Cardio</Option>
            <Option value="Strength">Strength</Option>
            <Option value="Yoga">Yoga</Option>
            <Option value="HIIT">HIIT</Option>
            <Option value="Other">Other</Option>
          </Select>
          <RangePicker 
            onChange={(dates) => setDateRange(dates as any)}
          />
        </Space>

        <Table 
          columns={columns} 
          dataSource={filteredWorkouts} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? "Sửa buổi tập" : "Thêm buổi tập mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}>
            <Select>
              <Option value="Cardio">Cardio</Option>
              <Option value="Strength">Strength</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="HIIT">HIIT</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="calories" label="Calo đốt" rules={[{ required: true, message: 'Vui lòng nhập lượng calo' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="Missed">Bỏ lỡ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutLog;
