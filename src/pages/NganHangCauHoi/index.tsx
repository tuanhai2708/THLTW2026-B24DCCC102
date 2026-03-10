
import React from 'react';
import KhoiKienThucManager from '../../components/NganHangCauHoi/KhoiKienThucManager';
import MonHocManager from '../../components/NganHangCauHoi/MonHocManager';
import CauHoiManager from '../../components/NganHangCauHoi/CauHoiManager';
import DeThiManager from '../../components/NganHangCauHoi/DeThiManager';

const NganHangCauHoiPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý ngân hàng câu hỏi tự luận</h1>
      <KhoiKienThucManager />
      <MonHocManager />
      <CauHoiManager />
      <DeThiManager />
    </div>
  );
};

export default NganHangCauHoiPage;
