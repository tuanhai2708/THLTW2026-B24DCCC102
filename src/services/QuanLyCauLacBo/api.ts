const CLUBS_KEY = 'cms_clubs';
const APPS_KEY = 'cms_applications';
const LOGS_KEY = 'cms_logs';

const initialClubs = [
  { id: '1', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png', name: 'CLB Âm nhạc', foundedDate: '2020-01-15', description: '<p>Câu lạc bộ yêu thích âm nhạc và biểu diễn.</p>', president: 'Nguyễn Văn A', isActive: true },
  { id: '2', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuioRQhfyIgk.png', name: 'CLB Mỹ thuật', foundedDate: '2019-05-20', description: '<p>Sáng tạo không giới hạn với hội họa.</p>', president: 'Trần Thị B', isActive: true },
  { id: '3', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKjpwllNqyBjoGZcKu.png', name: 'CLB Thể thao điện tử', foundedDate: '2021-11-10', description: '<p>Tổ chức các giải đấu eSports.</p>', president: 'Lê Văn C', isActive: false }
];

const initialApplications = [
  { id: 'app-1', fullName: 'Hoàng Minh D', email: 'hoangminhd@gmail.com', phoneNumber: '0987654321', gender: 'Nam', address: 'Hà Nội', strengths: 'Ca hát, guitar', clubId: '1', reason: 'Yêu thích âm nhạc từ nhỏ', status: 'Pending', rejectReason: '', createdAt: '2025-04-01T10:00:00Z' },
  { id: 'app-2', fullName: 'Phạm Thị E', email: 'phamthie@gmail.com', phoneNumber: '0912345678', gender: 'Nữ', address: 'Hồ Chí Minh', strengths: 'Vẽ màu nước', clubId: '2', reason: 'Muốn học hỏi thêm về hội họa', status: 'Approved', rejectReason: '', createdAt: '2025-04-02T15:30:00Z' },
  { id: 'app-3', fullName: 'Vũ Văn F', email: 'vuvanf@gmail.com', phoneNumber: '0901234567', gender: 'Nam', address: 'Đà Nẵng', strengths: 'Phản xạ nhanh', clubId: '3', reason: 'Muốn thi đấu chuyên nghiệp', status: 'Rejected', rejectReason: 'Không đủ tuổi tham gia', createdAt: '2025-04-03T09:15:00Z' }
];

const initialActionLogs = [
  { id: 'log-1', applicationId: 'app-2', action: 'Approved', performedBy: 'Admin', time: '2025-04-02T16:00:00Z', reason: '' },
  { id: 'log-2', applicationId: 'app-3', action: 'Rejected', performedBy: 'Admin', time: '2025-04-03T10:00:00Z', reason: 'Không đủ tuổi tham gia' }
];

// Initialize DB
if (!localStorage.getItem(CLUBS_KEY)) localStorage.setItem(CLUBS_KEY, JSON.stringify(initialClubs));
if (!localStorage.getItem(APPS_KEY)) localStorage.setItem(APPS_KEY, JSON.stringify(initialApplications));
if (!localStorage.getItem(LOGS_KEY)) localStorage.setItem(LOGS_KEY, JSON.stringify(initialActionLogs));

// Helpers
const getDB = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const saveDB = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
const waitTime = (time = 300) => new Promise((resolve) => setTimeout(resolve, time));
const generateId = () => Math.random().toString(36).substr(2, 9);

// =========== CLUBS ===========
export async function getClubs(params?: any) {
  await waitTime();
  let data = getDB(CLUBS_KEY);
  return { success: true, data: data, total: data.length };
}

export async function createClub(data: any) {
  await waitTime();
  const clubs = getDB(CLUBS_KEY);
  const newClub = { ...data, id: generateId() };
  clubs.unshift(newClub);
  saveDB(CLUBS_KEY, clubs);
  return { success: true, data: newClub, message: 'Thêm mới câu lạc bộ thành công' };
}

export async function updateClub(id: string, data: any) {
  await waitTime();
  const clubs = getDB(CLUBS_KEY).map((c: any) => c.id === id ? { ...c, ...data } : c);
  saveDB(CLUBS_KEY, clubs);
  return { success: true, message: 'Cập nhật thông tin thành công' };
}

export async function deleteClub(id: string) {
  await waitTime();
  const clubs = getDB(CLUBS_KEY).filter((c: any) => c.id !== id);
  saveDB(CLUBS_KEY, clubs);
  return { success: true, message: 'Xóa câu lạc bộ thành công' };
}

// =========== APPLICATIONS ===========
export async function getApplications(params?: any) {
  await waitTime();
  const apps = getDB(APPS_KEY);
  const clubs = getDB(CLUBS_KEY);
  const data = apps.map((app: any) => {
    const club = clubs.find((c: any) => c.id === app.clubId);
    return { ...app, clubName: club ? club.name : 'Unknown' };
  });
  return { success: true, data: data, total: data.length };
}

export async function createApplication(data: any) {
  await waitTime();
  const apps = getDB(APPS_KEY);
  const newApp = { 
    ...data, 
    id: generateId(), 
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  apps.unshift(newApp);
  saveDB(APPS_KEY, apps);
  return { success: true, data: newApp, message: 'Nộp đơn thành công' };
}

export async function updateApplication(id: string, data: any) {
  await waitTime();
  const apps = getDB(APPS_KEY).map((app: any) => app.id === id ? { ...app, ...data } : app);
  saveDB(APPS_KEY, apps);
  return { success: true, message: 'Cập nhật đơn thành công' };
}

export async function deleteApplication(id: string) {
  await waitTime();
  const apps = getDB(APPS_KEY).filter((app: any) => app.id !== id);
  saveDB(APPS_KEY, apps);
  return { success: true, message: 'Xóa đơn thành công' };
}

export async function approveApplications(ids: string[]) {
  await waitTime();
  const time = new Date().toISOString();
  let apps = getDB(APPS_KEY);
  const logs = getDB(LOGS_KEY);
  apps = apps.map((app: any) => {
    if (ids.includes(app.id)) {
      logs.unshift({ id: generateId(), applicationId: app.id, action: 'Approved', performedBy: 'Admin', time, reason: '' });
      return { ...app, status: 'Approved' };
    }
    return app;
  });
  saveDB(APPS_KEY, apps);
  saveDB(LOGS_KEY, logs);
  return { success: true, message: `Đã duyệt ${ids.length} đơn đăng ký` };
}

export async function rejectApplications(ids: string[], reason: string) {
  await waitTime();
  const time = new Date().toISOString();
  let apps = getDB(APPS_KEY);
  const logs = getDB(LOGS_KEY);
  apps = apps.map((app: any) => {
    if (ids.includes(app.id)) {
      logs.unshift({ id: generateId(), applicationId: app.id, action: 'Rejected', performedBy: 'Admin', time, reason });
      return { ...app, status: 'Rejected', rejectReason: reason };
    }
    return app;
  });
  saveDB(APPS_KEY, apps);
  saveDB(LOGS_KEY, logs);
  return { success: true, message: `Đã từ chối ${ids.length} đơn đăng ký` };
}

export async function getApplicationLogs(id: string) {
  await waitTime();
  const logs = getDB(LOGS_KEY).filter((log: any) => log.applicationId === id);
  return { success: true, data: logs };
}

// =========== MEMBERS ===========
export async function getMembers(params?: any) {
  await waitTime();
  const apps = getDB(APPS_KEY);
  const clubs = getDB(CLUBS_KEY);
  
  let members = apps.filter((app: any) => app.status === 'Approved');
  if (params && params.clubId) {
    members = members.filter((m: any) => m.clubId === params.clubId);
  }
  const data = members.map((app: any) => {
    const club = clubs.find((c: any) => c.id === app.clubId);
    return { ...app, clubName: club ? club.name : 'Unknown' };
  });
  return { success: true, data: data, total: data.length };
}

export async function changeClub(ids: string[], targetClubId: string) {
  await waitTime();
  const time = new Date().toISOString();
  let apps = getDB(APPS_KEY);
  const logs = getDB(LOGS_KEY);
  apps = apps.map((app: any) => {
    if (ids.includes(app.id) && app.status === 'Approved') {
      const oldClubId = app.clubId;
      logs.unshift({
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
  saveDB(APPS_KEY, apps);
  saveDB(LOGS_KEY, logs);
  return { success: true, message: `Đã chuyển ${ids.length} thành viên sang CLB mới` };
}

// =========== DASHBOARD ===========
export async function getDashboardStats() {
  await waitTime();
  const clubs = getDB(CLUBS_KEY);
  const apps = getDB(APPS_KEY);
  return {
    success: true,
    data: {
      totalClubs: clubs.length,
      applications: {
        pending: apps.filter((a: any) => a.status === 'Pending').length,
        approved: apps.filter((a: any) => a.status === 'Approved').length,
        rejected: apps.filter((a: any) => a.status === 'Rejected').length,
      }
    }
  };
}

export async function getDashboardChart() {
  await waitTime();
  const clubs = getDB(CLUBS_KEY);
  const apps = getDB(APPS_KEY);
  const chartData = clubs.map((club: any) => {
    const clubApps = apps.filter((app: any) => app.clubId === club.id);
    return {
      clubName: club.name,
      pending: clubApps.filter((a: any) => a.status === 'Pending').length,
      approved: clubApps.filter((a: any) => a.status === 'Approved').length,
      rejected: clubApps.filter((a: any) => a.status === 'Rejected').length,
    };
  });
  return { success: true, data: chartData };
}
