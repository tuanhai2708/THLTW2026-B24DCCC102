// Model cho Khối Kiến Thức
export interface KhoiKienThuc {
  id: string;
  ten: string;
}

// Model cho Môn Học
export interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number;
}

export type MucDoKho = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

// Model cho Câu Hỏi
export interface CauHoi {
  id: string;
  maCauHoi: string;
  monHocId: string;
  noiDung: string;
  mucDo: MucDoKho;
  khoiKienThucId: string;
}

// Cấu trúc đề thi
export interface CauTrucDeThiItem {
  khoiKienThucId: string;
  mucDo: MucDoKho;
  soLuong: number;
}

export interface CauTrucDeThi {
  monHocId: string;
  items: CauTrucDeThiItem[];
}

// Model cho Đề Thi
export interface DeThi {
  id: string;
  monHocId: string;
  cauHoiIds: string[];
  cauTruc: CauTrucDeThi;
  tenDe: string;
  ngayTao: string;
}
