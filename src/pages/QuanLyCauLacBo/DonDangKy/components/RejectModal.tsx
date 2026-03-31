import React from 'react';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';

const RejectModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onFinish: (reason: string) => Promise<boolean | void>;
}> = ({ visible, onClose, onFinish }) => {
  return (
    <ModalForm
      title="Từ chối đơn đăng ký"
      visible={visible}
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await onFinish(values.reason);
        return true;
      }}
    >
      <ProFormTextArea
        name="reason"
        label="Lý do từ chối"
        rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
        placeholder="Nhập lý do chi tiết để ứng viên nắm được..."
      />
    </ModalForm>
  );
};

export default RejectModal;
