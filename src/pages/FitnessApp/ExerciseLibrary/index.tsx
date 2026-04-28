import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input, Select, Space, Tag, Modal, Form, InputNumber, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import { getExercises, saveExercises, Exercise } from '../store';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const ExerciseLibrary: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string | undefined>(undefined);
  const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>(undefined);

  // Modal Detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Modal Form (Add/Edit)
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = getExercises();
    setExercises(data);
    setFilteredExercises(data);
  }, []);

  useEffect(() => {
    let result = exercises;
    
    if (searchText) {
      result = result.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    
    if (filterMuscle) {
      result = result.filter(e => e.muscleGroup === filterMuscle);
    }

    if (filterDifficulty) {
      result = result.filter(e => e.difficulty === filterDifficulty);
    }
    
    setFilteredExercises(result);
  }, [exercises, searchText, filterMuscle, filterDifficulty]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExercises = exercises.filter(ex => ex.id !== id);
    setExercises(newExercises);
    saveExercises(newExercises);
    message.success('Xóa bài tập thành công');
    if (detailModalVisible && selectedExercise?.id === id) {
      setDetailModalVisible(false);
    }
  };

  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const showEditModal = (record: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(record.id);
    form.setFieldsValue(record);
    setFormModalVisible(true);
  };

  const showDetailModal = (record: Exercise) => {
    setSelectedExercise(record);
    setDetailModalVisible(true);
  };

  const handleFormOk = () => {
    form.validateFields().then(values => {
      const newExercise: Exercise = {
        id: editingId || Date.now().toString(),
        name: values.name,
        muscleGroup: values.muscleGroup,
        difficulty: values.difficulty,
        description: values.description,
        caloriesPerHour: values.caloriesPerHour,
        instructions: values.instructions,
      };

      let newExercises;
      if (editingId) {
        newExercises = exercises.map(ex => ex.id === editingId ? newExercise : ex);
        message.success('Cập nhật bài tập thành công');
      } else {
        newExercises = [...exercises, newExercise];
        message.success('Thêm bài tập mới thành công');
      }

      setExercises(newExercises);
      saveExercises(newExercises);
      setFormModalVisible(false);
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'green';
      case 'Trung bình': return 'orange';
      case 'Khó': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Thư viện bài tập" bordered={false}>
        <Space style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Thêm bài tập
          </Button>
          <Input 
            placeholder="Tìm theo tên..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select 
            placeholder="Nhóm cơ" 
            style={{ width: 150 }} 
            allowClear
            value={filterMuscle}
            onChange={setFilterMuscle}
          >
            <Option value="Chest">Chest (Ngực)</Option>
            <Option value="Back">Back (Lưng)</Option>
            <Option value="Legs">Legs (Chân)</Option>
            <Option value="Shoulders">Shoulders (Vai)</Option>
            <Option value="Arms">Arms (Tay)</Option>
            <Option value="Core">Core (Bụng/Lõi)</Option>
            <Option value="Full Body">Full Body</Option>
          </Select>
          <Select 
            placeholder="Mức độ khó" 
            style={{ width: 150 }} 
            allowClear
            value={filterDifficulty}
            onChange={setFilterDifficulty}
          >
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
          </Select>
        </Space>

        <Row gutter={[16, 16]}>
          {filteredExercises.map(ex => (
            <Col xs={24} sm={12} md={8} key={ex.id}>
              <Card 
                hoverable 
                onClick={() => showDetailModal(ex)}
                actions={[
                  <Button type="text" icon={<EditOutlined />} onClick={(e) => showEditModal(ex, e)}>Sửa</Button>,
                  <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={(e) => handleDelete(ex.id, e as any)} onCancel={(e) => e?.stopPropagation()}>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>Xóa</Button>
                  </Popconfirm>
                ]}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Title level={5} style={{ margin: 0 }}>{ex.name}</Title>
                  <Tag color={getDifficultyColor(ex.difficulty)}>{ex.difficulty}</Tag>
                </div>
                <Tag color="blue" style={{ marginTop: 8, marginBottom: 8 }}>{ex.muscleGroup}</Tag>
                <Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                  {ex.description}
                </Paragraph>
                <Text type="secondary">
                  <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} /> 
                  ~{ex.caloriesPerHour} kcal/giờ
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
        {filteredExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            Không tìm thấy bài tập nào
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={selectedExercise?.name}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>Đóng</Button>
        ]}
      >
        {selectedExercise && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{selectedExercise.muscleGroup}</Tag>
              <Tag color={getDifficultyColor(selectedExercise.difficulty)}>{selectedExercise.difficulty}</Tag>
              <Tag color="orange"><FireOutlined /> {selectedExercise.caloriesPerHour} kcal/h</Tag>
            </div>
            <Title level={5}>Mô tả</Title>
            <Paragraph>{selectedExercise.description}</Paragraph>
            <Title level={5}>Hướng dẫn thực hiện</Title>
            <div style={{ whiteSpace: 'pre-wrap' }}>{selectedExercise.instructions}</div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Form Modal */}
      <Modal
        title={editingId ? "Sửa bài tập" : "Thêm bài tập mới"}
        visible={formModalVisible}
        onOk={handleFormOk}
        onCancel={() => setFormModalVisible(false)}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
                <Select>
                  <Option value="Chest">Chest</Option>
                  <Option value="Back">Back</Option>
                  <Option value="Legs">Legs</Option>
                  <Option value="Shoulders">Shoulders</Option>
                  <Option value="Arms">Arms</Option>
                  <Option value="Core">Core</Option>
                  <Option value="Full Body">Full Body</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}>
                <Select>
                  <Option value="Dễ">Dễ</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Khó">Khó</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="caloriesPerHour" label="Calo đốt (kcal/giờ)" rules={[{ required: true, message: 'Vui lòng nhập lượng calo' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả ngắn" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn thực hiện" rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}>
            <Input.TextArea rows={5} placeholder="Nhập chi tiết từng bước..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;
