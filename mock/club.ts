import { Request, Response } from 'express';

// Dữ liệu mock ban đầu
let clubs = [
  {
    id: '1',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    name: 'CLB Âm nhạc',
    foundedDate: '2020-01-15',
    description: '<p>Câu lạc bộ yêu thích âm nhạc và biểu diễn.</p>',
    president: 'Nguyễn Văn A',
    isActive: true,
  },
  {
    id: '2',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuioRQhfyIgk.png',
    name: 'CLB Mỹ thuật',
    foundedDate: '2019-05-20',
    description: '<p>Sáng tạo không giới hạn với hội họa.</p>',
    president: 'Trần Thị B',
    isActive: true,
  },
  {
    id: '3',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKjpwllNqyBjoGZcKu.png',
    name: 'CLB Thể thao điện tử',
    foundedDate: '2021-11-10',
    description: '<p>Tổ chức các giải đấu eSports.</p>',
    president: 'Lê Văn C',
    isActive: false,
  },
];

let applications = [
  {
    id: 'app-1',
    fullName: 'Hoàng Minh Dương',
    email: 'hoangminhd@gmail.com',
    phoneNumber: '0987654321',
    gender: 'Nam',
    address: 'Hà Nội',
    strengths: 'Ca hát, guitar',
    clubId: '1',
    reason: 'Yêu thích âm nhạc từ nhỏ',
    status: 'Pending', // Pending, Approved, Rejected
    rejectReason: '',
    createdAt: '2025-04-01T10:00:00Z',
  },
  {
    id: 'app-2',
    fullName: 'Nguyễn Thị Lan',
    email: 'phamthie@gmail.com',
    phoneNumber: '0912345678',
    gender: 'Nữ',
    address: 'Hồ Chí Minh',
    strengths: 'Vẽ màu nước',
    clubId: '2',
    reason: 'Muốn học hỏi thêm về hội họa',
    status: 'Approved',
    rejectReason: '',
    createdAt: '2025-04-02T15:30:00Z',
  },
  {
    id: 'app-3',
    fullName: 'Vũ Văn Phong',
    email: 'vuvanf@gmail.com',
    phoneNumber: '0901234567',
    gender: 'Nam',
    address: 'Đà Nẵng',
    strengths: 'Phản xạ nhanh',
    clubId: '3',
    reason: 'Muốn thi đấu chuyên nghiệp',
    status: 'Rejected',
    rejectReason: 'Không đủ tuổi tham gia',
    createdAt: '2025-04-03T09:15:00Z',
  },
];

let actionLogs = [
  {
    id: 'log-1',
    applicationId: 'app-2',
    action: 'Approved',
    performedBy: 'Admin',
    time: '2025-04-02T16:00:00Z',
    reason: '',
  },
  {
    id: 'log-2',
    applicationId: 'app-3',
    action: 'Rejected',
    performedBy: 'Admin',
    time: '2025-04-03T10:00:00Z',
    reason: 'Không đủ tuổi tham gia',
  },
];

const waitTime = (time = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export default {
  // CLB APIs
  'GET /api/clubs': async (req: Request, res: Response) => {
    await waitTime();
    res.send({
      data: clubs,
      total: clubs.length,
      success: true,
    });
  },
  'POST /api/clubs': async (req: Request, res: Response) => {
    await waitTime();
    const newClub = { ...req.body, id: generateId() };
    clubs.unshift(newClub);
    res.send({ success: true, data: newClub, message: 'Thêm mới câu lạc bộ thành công' });
  },
  'PUT /api/clubs/:id': async (req: Request, res: Response) => {
    await waitTime();
    const { id } = req.params;
    clubs = clubs.map((c) => (c.id === id ? { ...c, ...req.body } : c));
    res.send({ success: true, message: 'Cập nhật thông tin thành công' });
  },
  'DELETE /api/clubs/:id': async (req: Request, res: Response) => {
    await waitTime();
    const { id } = req.params;
    clubs = clubs.filter((c) => c.id !== id);
    res.send({ success: true, message: 'Xóa câu lạc bộ thành công' });
  },

  // Đơn đăng ký APIs
  'GET /api/applications': async (req: Request, res: Response) => {
    await waitTime();
    const data = applications.map((app) => {
      const club = clubs.find((c) => c.id === app.clubId);
      return { ...app, clubName: club ? club.name : 'Unknown' };
    });
    res.send({
      data: data,
      total: data.length,
      success: true,
    });
  },
  'POST /api/applications': async (req: Request, res: Response) => {
    await waitTime();
    const newApp = {
      ...req.body,
      id: generateId(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    applications.unshift(newApp);
    res.send({ success: true, data: newApp, message: 'Nộp đơn thành công' });
  },
  'PUT /api/applications/:id': async (req: Request, res: Response) => {
    await waitTime();
    const { id } = req.params;
    applications = applications.map((app) => (app.id === id ? { ...app, ...req.body } : app));
    res.send({ success: true, message: 'Cập nhật đơn thành công' });
  },
  'DELETE /api/applications/:id': async (req: Request, res: Response) => {
    await waitTime();
    const { id } = req.params;
    applications = applications.filter((app) => app.id !== id);
    res.send({ success: true, message: 'Xóa đơn thành công' });
  },

  // Duyệt đơn / Từ chối đơn
  'POST /api/applications/approve': async (req: Request, res: Response) => {
    await waitTime();
    const { ids } = req.body; // mảng ID
    if (!ids || !Array.isArray(ids)) {
      return res.send({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const time = new Date().toISOString();
    applications = applications.map((app) => {
      if (ids.includes(app.id)) {
        actionLogs.unshift({
          id: generateId(),
          applicationId: app.id,
          action: 'Approved',
          performedBy: 'Admin',
          time,
          reason: '',
        });
        return { ...app, status: 'Approved' };
      }
      return app;
    });
    return res.send({ success: true, message: `Đã duyệt ${ids.length} đơn đăng ký` });
  },
  'POST /api/applications/reject': async (req: Request, res: Response) => {
    await waitTime();
    const { ids, reason } = req.body; // mảng ID và lý do
    if (!ids || !Array.isArray(ids)) {
      return res.send({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const time = new Date().toISOString();
    applications = applications.map((app) => {
      if (ids.includes(app.id)) {
        actionLogs.unshift({
          id: generateId(),
          applicationId: app.id,
          action: 'Rejected',
          performedBy: 'Admin',
          time,
          reason,
        });
        return { ...app, status: 'Rejected', rejectReason: reason };
      }
      return app;
    });
    return res.send({ success: true, message: `Đã từ chối ${ids.length} đơn đăng ký` });
  },

  // Thành viên (Members)
  'GET /api/members': async (req: Request, res: Response) => {
    await waitTime();
    const { clubId } = req.query;
    let members = applications.filter(app => app.status === 'Approved');
    if (clubId) {
      members = members.filter(m => m.clubId === clubId);
    }
    const data = members.map((app) => {
      const club = clubs.find((c) => c.id === app.clubId);
      return { ...app, clubName: club ? club.name : 'Unknown' };
    });
    res.send({
      data: data,
      total: data.length,
      success: true,
    });
  },
  'POST /api/members/change-club': async (req: Request, res: Response) => {
    await waitTime();
    const { ids, targetClubId } = req.body;
    applications = applications.map((app) => {
      if (ids.includes(app.id) && app.status === 'Approved') {
        const time = new Date().toISOString();
        const oldClubId = app.clubId;
        actionLogs.unshift({
          id: generateId(),
          applicationId: app.id,
          action: 'ChangeClub',
          performedBy: 'Admin',
          time,
          reason: `Chuyển từ CLB ${oldClubId} sang ${targetClubId}`,
        });
        return { ...app, clubId: targetClubId };
      }
      return app;
    });
    res.send({ success: true, message: `Đã chuyển ${ids.length} thành viên sang CLB mới` });
  },

  'GET /api/applications/logs/:id': async (req: Request, res: Response) => {
    await waitTime();
    const { id } = req.params;
    const logs = actionLogs.filter(log => log.applicationId === id);
    res.send({ success: true, data: logs });
  },

  // Thống kê (Dashboard)
  'GET /api/dashboard/stats': async (req: Request, res: Response) => {
    await waitTime();
    const totalClubs = clubs.length;
    const totalPending = applications.filter(app => app.status === 'Pending').length;
    const totalApproved = applications.filter(app => app.status === 'Approved').length;
    const totalRejected = applications.filter(app => app.status === 'Rejected').length;

    res.send({
      success: true,
      data: {
        totalClubs,
        applications: {
          pending: totalPending,
          approved: totalApproved,
          rejected: totalRejected,
        }
      }
    });
  },

  // Dữ liệu cho ColumnChart
  'GET /api/dashboard/chart': async (req: Request, res: Response) => {
    await waitTime();
    const chartData = clubs.map(club => {
      const apps = applications.filter(app => app.clubId === club.id);
      return {
        clubName: club.name,
        pending: apps.filter(app => app.status === 'Pending').length,
        approved: apps.filter(app => app.status === 'Approved').length,
        rejected: apps.filter(app => app.status === 'Rejected').length,
      };
    });
    res.send({
      success: true,
      data: chartData,
    });
  }
};
