import React, { useEffect } from 'react';
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, message } from 'antd';
import { createApplication, updateApplication } from '@/services/QuanLyCauLacBo/api';

const ApplicationForm: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues: any;
  clubs: any[];
}> = ({ visible, onClose, onSuccess, initialValues, clubs }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  return (
    <ModalForm
      title={initialValues ? 'Chi tiết / Chỉnh sửa đơn đăng ký' : 'Tạo mới đơn đăng ký'}
      width={700}
      visible={visible}
      form={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: onClose,
      }}
      onFinish={async (values) => {
        try {
          if (initialValues) {
            await updateApplication(initialValues.id, values);
            message.success('Cập nhật thành công!');
          } else {
            await createApplication(values);
            message.success('Tạo mới thành công!');
          }
          onSuccess();
          onClose();
          return true;
        } catch (error) {
          message.error('Có lỗi xảy ra!');
          return false;
        }
      }}
    >
      <ProFormText
        name="fullName"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
      />
      <ProFormText
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
      />
      <ProFormText
        name="phoneNumber"
        label="Số điện thoại"
      />
      <ProFormSelect
        name="gender"
        label="Giới tính"
        options={[
          { value: 'Nam', label: 'Nam' },
          { value: 'Nữ', label: 'Nữ' },
          { value: 'Khác', label: 'Khác' },
        ]}
      />
      <ProFormText
        name="address"
        label="Địa chỉ"
      />
      <ProFormText
        name="strengths"
        label="Sở trường"
      />
      <ProFormSelect
        name="clubId"
        label="Câu lạc bộ đăng ký"
        rules={[{ required: true, message: 'Vui lòng chọn Câu lạc bộ' }]}
        options={clubs.map(c => ({ value: c.id, label: c.name }))}
      />
      <ProFormTextArea
        name="reason"
        label="Lý do đăng ký"
      />
    </ModalForm>
  );
};

export default ApplicationForm;
