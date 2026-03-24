import { Request, Response } from 'express';

let soVanBangs = [
  { id: 1, year: 2023, name: 'Sổ VB năm 2023', currentRegistryNumber: 150 },
  { id: 2, year: 2024, name: 'Sổ VB năm 2024', currentRegistryNumber: 1 },
];

let quyetDinhs = [
  { id: 1, decisionNumber: '123/QĐ-BGDĐT', date: '2024-05-15', summary: 'Cấp bằng tốt nghiệp đợt 1', soVanBangId: 2, lookupCount: 0 },
];

let cauHinhBieuMaus = [
  { id: 1, name: 'Dân tộc', type: 'String' },
  { id: 2, name: 'Nơi sinh', type: 'String' },
  { id: 3, name: 'Điểm trung bình', type: 'Number' },
  { id: 4, name: 'Ngày nhập học', type: 'Date' },
];

let thongTinVanBangs = [
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

export default {
  'GET /api/so-van-bang': (req: Request, res: Response) => {
    res.json({ data: soVanBangs, success: true });
  },
  'POST /api/so-van-bang': (req: Request, res: Response) => {
    const newData = { ...req.body, id: soVanBangs.length + 1, currentRegistryNumber: 1 };
    soVanBangs.push(newData);
    res.json({ data: newData, success: true });
  },
  'PUT /api/so-van-bang/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = soVanBangs.findIndex((d) => d.id === id);
    if (index > -1) {
      soVanBangs[index] = { ...soVanBangs[index], ...req.body };
      res.json({ data: soVanBangs[index], success: true });
    } else {
      res.status(404).json({ success: false });
    }
  },
  'DELETE /api/so-van-bang/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    soVanBangs = soVanBangs.filter((d) => d.id !== id);
    res.json({ success: true });
  },

  'GET /api/quyet-dinh': (req: Request, res: Response) => {
    res.json({ data: quyetDinhs, success: true });
  },
  'POST /api/quyet-dinh': (req: Request, res: Response) => {
    const newData = { ...req.body, id: quyetDinhs.length + 1, lookupCount: 0 };
    quyetDinhs.push(newData);
    res.json({ data: newData, success: true });
  },
  'PUT /api/quyet-dinh/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = quyetDinhs.findIndex((d) => d.id === id);
    if (index > -1) {
      quyetDinhs[index] = { ...quyetDinhs[index], ...req.body };
      res.json({ data: quyetDinhs[index], success: true });
    } else {
      res.status(404).json({ success: false });
    }
  },
  'DELETE /api/quyet-dinh/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    quyetDinhs = quyetDinhs.filter((d) => d.id !== id);
    res.json({ success: true });
  },

  'GET /api/cau-hinh-bieu-mau': (req: Request, res: Response) => {
    res.json({ data: cauHinhBieuMaus, success: true });
  },
  'POST /api/cau-hinh-bieu-mau': (req: Request, res: Response) => {
    const newData = { ...req.body, id: cauHinhBieuMaus.length > 0 ? Math.max(...cauHinhBieuMaus.map(x => x.id)) + 1 : 1 };
    cauHinhBieuMaus.push(newData);
    res.json({ data: newData, success: true });
  },
  'PUT /api/cau-hinh-bieu-mau/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = cauHinhBieuMaus.findIndex((d) => d.id === id);
    if (index > -1) {
      cauHinhBieuMaus[index] = { ...cauHinhBieuMaus[index], ...req.body };
      res.json({ data: cauHinhBieuMaus[index], success: true });
    } else {
      res.status(404).json({ success: false });
    }
  },
  'DELETE /api/cau-hinh-bieu-mau/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    cauHinhBieuMaus = cauHinhBieuMaus.filter((d) => d.id !== id);
    res.json({ success: true });
  },

  'GET /api/thong-tin-van-bang': (req: Request, res: Response) => {
    return res.json({ data: thongTinVanBangs, success: true });
  },
  'POST /api/thong-tin-van-bang': (req: Request, res: Response) => {
    const body = req.body;
    const quyetDinh = quyetDinhs.find(q => q.id === body.quyetDinhId);
    if (!quyetDinh) return res.status(400).json({ success: false, message: 'Quyết định không hợp lệ' });
    
    const soVanBangIndex = soVanBangs.findIndex(s => s.id === quyetDinh.soVanBangId);
    if (soVanBangIndex === -1) return res.status(400).json({ success: false, message: 'Sổ văn bằng không hợp lệ' });
    
    const newRegNum = soVanBangs[soVanBangIndex].currentRegistryNumber;
    soVanBangs[soVanBangIndex].currentRegistryNumber += 1;

    const newData = { 
      ...body, 
      id: thongTinVanBangs.length > 0 ? Math.max(...thongTinVanBangs.map(x => x.id)) + 1 : 1,
      registryNumber: newRegNum 
    };
    thongTinVanBangs.push(newData);
    return res.json({ data: newData, success: true });
  },
  'PUT /api/thong-tin-van-bang/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = thongTinVanBangs.findIndex((d) => d.id === id);
    if (index > -1) {
      thongTinVanBangs[index] = { ...thongTinVanBangs[index], ...req.body };
      return res.json({ data: thongTinVanBangs[index], success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  },
  'DELETE /api/thong-tin-van-bang/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    thongTinVanBangs = thongTinVanBangs.filter((d) => d.id !== id);
    return res.json({ success: true });
  },

  'GET /api/tra-cuu': (req: Request, res: Response) => {
    const q = req.query;
    let paramsCount = 0;
    if (q.diplomaNumber) paramsCount++;
    if (q.registryNumber) paramsCount++;
    if (q.studentId) paramsCount++;
    if (q.fullName) paramsCount++;
    if (q.dateOfBirth) paramsCount++;

    if (paramsCount < 2) {
      return res.status(400).json({ success: false, message: 'Yêu cầu nhập ít nhất 2 tham số tra cứu' });
    }

    let results = thongTinVanBangs.filter(t => {
      let match = true;
      if (q.diplomaNumber && t.diplomaNumber !== q.diplomaNumber) match = false;
      if (q.registryNumber && t.registryNumber.toString() !== q.registryNumber) match = false;
      if (q.studentId && t.studentId !== q.studentId) match = false;
      if (q.fullName && !t.fullName.toLowerCase().includes(String(q.fullName).toLowerCase())) match = false;
      if (q.dateOfBirth && t.dateOfBirth !== q.dateOfBirth) match = false;
      return match;
    });

    results.forEach(result => {
      const qdIndex = quyetDinhs.findIndex(qd => qd.id === result.quyetDinhId);
      if (qdIndex > -1) {
        quyetDinhs[qdIndex].lookupCount += 1;
      }
    });

    return res.json({ data: results, success: true });
  }
};
