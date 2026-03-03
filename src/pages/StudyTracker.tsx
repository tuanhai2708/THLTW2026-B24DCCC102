import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, Select, Table, Space, Tag, Divider, message, DatePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface Subject {
  id: string;
  name: string;
}

interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: number;
  content: string;
  note: string;
}

interface MonthlyGoal {
  id: string;
  subjectId: string;
  month: string;
  targetHours: number;
}

function getMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const SUBJECTS_KEY = 'study_subjects';
const SESSIONS_KEY = 'study_sessions';
const GOALS_KEY = 'study_goals';

const defaultSubjects = [
  { id: 'toan', name: 'Toán' },
  { id: 'van', name: 'Văn' },
  { id: 'anh', name: 'Anh' },
  { id: 'khoahoc', name: 'Khoa học' },
  { id: 'congnghe', name: 'Công nghệ' },
];

const StudyTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [subjectName, setSubjectName] = useState('');
  const [goalSubjectId, setGoalSubjectId] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalMonth, setGoalMonth] = useState<dayjs.Dayjs | null>(dayjs());
  const [session, setSession] = useState({ subjectId: '', date: '', duration: '', content: '', note: '' });

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem(SUBJECTS_KEY) || 'null') || defaultSubjects;
    setSubjects(storedSubjects);
    const storedSessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    setSessions(storedSessions);
    const storedGoals = JSON.parse(localStorage.getItem(GOALS_KEY) || '[]');
    setGoals(storedGoals);
  }, []);

  useEffect(() => {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  const addSubject = () => {
    if (!subjectName.trim()) {
      message.warning('Vui lòng nhập tên môn học');
      return;
    }
    setSubjects([...subjects, { id: Date.now().toString(), name: subjectName.trim() }]);
    setSubjectName('');
    message.success('Thêm môn học thành công');
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setSessions(sessions.filter(s => s.subjectId !== id));
    setGoals(goals.filter(g => g.subjectId !== id));
    message.success('Xóa môn học thành công');
  };

  const addSession = () => {
    if (!session.subjectId || !session.date || !session.duration) {
      message.warning('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSessions([
      ...sessions,
      {
        id: Date.now().toString(),
        subjectId: session.subjectId,
        date: session.date,
        duration: Number(session.duration),
        content: session.content,
        note: session.note,
      },
    ]);
    setSession({ subjectId: '', date: '', duration: '', content: '', note: '' });
    message.success('Thêm lịch học thành công');
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    message.success('Xóa lịch học thành công');
  };

  const addGoal = () => {
    if (!goalSubjectId || !goalTarget) {
      message.warning('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const monthStr = goalMonth.format('YYYY-MM');
    setGoals([
      ...goals.filter(g => !(g.subjectId === goalSubjectId && g.month === monthStr)),
      {
        id: Date.now().toString(),
        subjectId: goalSubjectId,
        month: monthStr,
        targetHours: Number(goalTarget),
      },
    ]);
    setGoalSubjectId('');
    setGoalTarget('');
    message.success('Đặt mục tiêu thành công');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    message.success('Xóa mục tiêu thành công');
  };

  const getProgress = (subjectId: string, month: string) => {
    const total = sessions
      .filter(s => s.subjectId === subjectId && s.date.startsWith(month))
      .reduce((sum, s) => sum + s.duration, 0);
    const goal = goals.find(g => g.subjectId === subjectId && g.month === month);
    return goal ? { total, target: goal.targetHours, done: total >= goal.targetHours } : null;
  };

  const sessionColumns = [
    {
      title: 'Môn',
      key: 'subjectId',
      render: (_: any, record: StudySession) => subjects.find(s => s.id === record.subjectId)?.name || '',
      width: 100,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'Thời lượng (giờ)',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_: any, record: StudySession) => (
        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteSession(record.id)} />
      ),
    },
  ];

  const monthStr = goalMonth ? goalMonth.format('YYYY-MM') : dayjs().format('YYYY-MM');

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Quản lý tiến độ học tập</h1>
      
      <Row gutter={24}>
        {/* Danh mục môn học */}
        <Col xs={24} sm={24} md={8}>
          <Card title="Danh mục môn học" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="Tên môn học"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                onPressEnter={addSubject}
              />
              <Button block type="primary" onClick={addSubject}>
                Thêm môn
              </Button>
            </Space>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              {subjects.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{s.name}</span>
                  <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteSubject(s.id)} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Lịch học */}
        <Col xs={24} sm={24} md={16}>
          <Card title="Lịch học" bordered={false}>
            <Table
              columns={sessionColumns}
              dataSource={sessions}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              style={{ marginBottom: '16px' }}
            />
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Row gutter={12}>
                <Col span={6}>
                  <Select
                    placeholder="Chọn môn"
                    value={session.subjectId || undefined}
                    onChange={value => setSession({ ...session, subjectId: value })}
                  >
                    {subjects.map(s => (
                      <Select.Option key={s.id} value={s.id}>
                        {s.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="dd/mm/yyyy"
                    format="DD/MM/YYYY"
                    value={session.date ? dayjs(session.date, 'YYYY-MM-DD') : null}
                    onChange={date => setSession({ ...session, date: date ? date.format('YYYY-MM-DD') : '' })}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    placeholder="Thời lượng"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={session.duration}
                    onChange={e => setSession({ ...session, duration: e.target.value })}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    placeholder="Nội dung"
                    value={session.content}
                    onChange={e => setSession({ ...session, content: e.target.value })}
                  />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={18}>
                  <Input
                    placeholder="Ghi chú"
                    value={session.note}
                    onChange={e => setSession({ ...session, note: e.target.value })}
                  />
                </Col>
                <Col span={6}>
                  <Button block type="primary" onClick={addSession}>
                    Thêm lịch học
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Mục tiêu học tập */}
      <Row gutter={24} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={24} md={8} mdOffset={16}>
          <Card title="Mục tiêu học tập tháng" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Select
                placeholder="Chọn môn"
                value={goalSubjectId || undefined}
                onChange={setGoalSubjectId}
              >
                {subjects.map(s => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
              <Input
                placeholder="Số giờ"
                type="number"
                min={1}
                value={goalTarget}
                onChange={e => setGoalTarget(e.target.value)}
              />
              <DatePicker
                picker="month"
                format="MM/YYYY"
                value={goalMonth}
                onChange={date => setGoalMonth(date)}
                style={{ width: '100%' }}
              />
              <Button block type="primary" onClick={addGoal}>
                Đặt mục tiêu
              </Button>
            </Space>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              {goals
                .filter(g => g.month === monthStr)
                .map(g => {
                  const subj = subjects.find(s => s.id === g.subjectId);
                  const progress = getProgress(g.subjectId, monthStr);
                  const status = progress?.done ? 'success' : 'error';
                  const text = progress?.done ? 'Đã hoàn thành' : `Chưa đạt (${progress?.total} giờ)`;
                  return (
                    <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div>{subj?.name}: {g.targetHours} giờ</div>
                        <Tag color={status}>{text}</Tag>
                      </div>
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteGoal(g.id)} />
                    </div>
                  );
                })}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudyTracker;
