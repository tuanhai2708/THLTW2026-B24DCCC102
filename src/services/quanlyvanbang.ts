const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getDB = (key: string, defaultData: any[]) => {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {}
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

const setDB = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const INIT_SOVANBANG = [
  { id: 1, year: 2023, name: 'Sổ VB năm 2023', currentRegistryNumber: 150 },
  { id: 2, year: 2024, name: 'Sổ VB năm 2024', currentRegistryNumber: 1 },
];
const INIT_QUYETDINH = [
  { id: 1, decisionNumber: '123/QĐ-BGDĐT', date: '2024-05-15', summary: 'Cấp bằng đợt 1', soVanBangId: 2, lookupCount: 0 },
];
const INIT_CAUHINH = [
  { id: 1, name: 'Dân tộc', type: 'String' },
  { id: 2, name: 'Nơi sinh', type: 'String' },
  { id: 3, name: 'Điểm trung bình', type: 'Number' },
  { id: 4, name: 'Ngày nhập học', type: 'Date' },
];
const INIT_THONGTIN = [
  {
    id: 1,
    studentId: 'SV001',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '2000-01-01',
    registryNumber: 1,
    diplomaNumber: 'BGD123456',
    quyetDinhId: 1,
    dynamicFields: {
      'Dân tộc': 'Kinh',
      'Nơi sinh': 'Hà Nội',
      'Điểm trung bình': 8.5,
      'Ngày nhập học': '2018-09-05',
    },
  },
];

export async function getSoVanBangs() {
  await delay(300);
  return { data: getDB('db_sovanbang', INIT_SOVANBANG), success: true };
}
export async function createSoVanBang(data: any) {
  await delay(300);
  const db = getDB('db_sovanbang', INIT_SOVANBANG);
  const newData = { ...data, id: db.length > 0 ? Math.max(...db.map((x: any) => x.id)) + 1 : 1, currentRegistryNumber: 1 };
  db.push(newData);
  setDB('db_sovanbang', db);
  return { data: newData, success: true };
}
export async function updateSoVanBang(id: number, data: any) {
  await delay(300);
  const db = getDB('db_sovanbang', INIT_SOVANBANG);
  const idx = db.findIndex((x: any) => x.id === id);
  if (idx > -1) {
    db[idx] = { ...db[idx], ...data };
    setDB('db_sovanbang', db);
    return { data: db[idx], success: true };
  }
  return { success: false, message: 'Not found' };
}
export async function deleteSoVanBang(id: number) {
  await delay(300);
  let db = getDB('db_sovanbang', INIT_SOVANBANG);
  db = db.filter((x: any) => x.id !== id);
  setDB('db_sovanbang', db);
  return { success: true };
}

export async function getQuyetDinhs() {
  await delay(300);
  return { data: getDB('db_quyetdinh', INIT_QUYETDINH), success: true };
}
export async function createQuyetDinh(data: any) {
  await delay(300);
  const db = getDB('db_quyetdinh', INIT_QUYETDINH);
  const newData = { ...data, id: db.length > 0 ? Math.max(...db.map((x: any) => x.id)) + 1 : 1, lookupCount: 0 };
  db.push(newData);
  setDB('db_quyetdinh', db);
  return { data: newData, success: true };
}
export async function updateQuyetDinh(id: number, data: any) {
  await delay(300);
  const db = getDB('db_quyetdinh', INIT_QUYETDINH);
  const idx = db.findIndex((x: any) => x.id === id);
  if (idx > -1) {
    db[idx] = { ...db[idx], ...data };
    setDB('db_quyetdinh', db);
    return { data: db[idx], success: true };
  }
  return { success: false, message: 'Not found' };
}
export async function deleteQuyetDinh(id: number) {
  await delay(300);
  let db = getDB('db_quyetdinh', INIT_QUYETDINH);
  db = db.filter((x: any) => x.id !== id);
  setDB('db_quyetdinh', db);
  return { success: true };
}

export async function getCauHinhBieuMaus() {
  await delay(300);
  return { data: getDB('db_cauhinh', INIT_CAUHINH), success: true };
}
export async function createCauHinhBieuMau(data: any) {
  await delay(300);
  const db = getDB('db_cauhinh', INIT_CAUHINH);
  const newData = { ...data, id: db.length > 0 ? Math.max(...db.map((x: any) => x.id)) + 1 : 1 };
  db.push(newData);
  setDB('db_cauhinh', db);
  return { data: newData, success: true };
}
export async function updateCauHinhBieuMau(id: number, data: any) {
  await delay(300);
  const db = getDB('db_cauhinh', INIT_CAUHINH);
  const idx = db.findIndex((x: any) => x.id === id);
  if (idx > -1) {
    db[idx] = { ...db[idx], ...data };
    setDB('db_cauhinh', db);
    return { data: db[idx], success: true };
  }
  return { success: false, message: 'Not found' };
}
export async function deleteCauHinhBieuMau(id: number) {
  await delay(300);
  let db = getDB('db_cauhinh', INIT_CAUHINH);
  db = db.filter((x: any) => x.id !== id);
  setDB('db_cauhinh', db);
  return { success: true };
}

export async function getThongTinVanBangs() {
  await delay(300);
  return { data: getDB('db_thongtin', INIT_THONGTIN), success: true };
}
export async function createThongTinVanBang(data: any) {
  await delay(300);
  const db = getDB('db_thongtin', INIT_THONGTIN);
  const qdDb = getDB('db_quyetdinh', INIT_QUYETDINH);
  const svbDb = getDB('db_sovanbang', INIT_SOVANBANG);

  const quyetDinh = qdDb.find((q: any) => q.id === data.quyetDinhId);
  if (!quyetDinh) return { success: false, message: 'Quyết định không hợp lệ' };
  
  const soVanBangIndex = svbDb.findIndex((s: any) => s.id === quyetDinh.soVanBangId);
  if (soVanBangIndex === -1) return { success: false, message: 'Sổ văn bằng không hợp lệ' };
  
  const newRegNum = svbDb[soVanBangIndex].currentRegistryNumber;
  svbDb[soVanBangIndex].currentRegistryNumber += 1;
  setDB('db_sovanbang', svbDb);

  const newData = { 
    ...data, 
    id: db.length > 0 ? Math.max(...db.map((x: any) => x.id)) + 1 : 1,
    registryNumber: newRegNum 
  };
  db.push(newData);
  setDB('db_thongtin', db);
  return { data: newData, success: true };
}
export async function updateThongTinVanBang(id: number, data: any) {
  await delay(300);
  const db = getDB('db_thongtin', INIT_THONGTIN);
  const idx = db.findIndex((x: any) => x.id === id);
  if (idx > -1) {
    db[idx] = { ...db[idx], ...data };
    setDB('db_thongtin', db);
    return { data: db[idx], success: true };
  }
  return { success: false, message: 'Not found' };
}
export async function deleteThongTinVanBang(id: number) {
  await delay(300);
  let db = getDB('db_thongtin', INIT_THONGTIN);
  db = db.filter((x: any) => x.id !== id);
  setDB('db_thongtin', db);
  return { success: true };
}

export async function searchVanBangs(params: any) {
  await delay(500);
  const db = getDB('db_thongtin', INIT_THONGTIN);
  const qdDb = getDB('db_quyetdinh', INIT_QUYETDINH);

  const q = params;
  let paramsCount = 0;
  if (q.diplomaNumber) paramsCount++;
  if (q.registryNumber) paramsCount++;
  if (q.studentId) paramsCount++;
  if (q.fullName) paramsCount++;
  if (q.dateOfBirth) paramsCount++;

  if (paramsCount < 2) {
    return { success: false, message: 'Yêu cầu nhập ít nhất 2 tham số tra cứu' };
  }

  let results = db.filter((t: any) => {
    let match = true;
    if (q.diplomaNumber && t.diplomaNumber !== q.diplomaNumber) match = false;
    if (q.registryNumber && t.registryNumber.toString() !== q.registryNumber.toString()) match = false;
    if (q.studentId && t.studentId !== q.studentId) match = false;
    if (q.fullName && !t.fullName.toLowerCase().includes(String(q.fullName).toLowerCase())) match = false;
    if (q.dateOfBirth && t.dateOfBirth !== q.dateOfBirth) match = false;
    return match;
  });

  results.forEach((result: any) => {
    const qdIndex = qdDb.findIndex((qd: any) => qd.id === result.quyetDinhId);
    if (qdIndex > -1) {
      qdDb[qdIndex].lookupCount += 1;
    }
  });
  setDB('db_quyetdinh', qdDb);

  return { data: results, success: true };
}
