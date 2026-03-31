import React, { useEffect } from 'react';
import { ModalForm, ProFormText, ProFormDatePicker, ProFormSwitch, ProFormTextArea } from '@ant-design/pro-form';
import { Form } from 'antd';

const ClubForm: React.FC<{
  visible: boolean;
  onClose: () => void;
  onFinish: (values: any) => Promise<boolean>;
  initialValues?: any;
}> = ({ visible, onClose, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          foundedDate: initialValues.foundedDate ? initialValues.foundedDate : undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ isActive: true });
      }
    }
  }, [visible, initialValues, form]);

  return (
    <ModalForm
      title={initialValues ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm Câu lạc bộ'}
      width={600}
      visible={visible}
      form={form}
      onVisibleChange={(v) => {
        if (!v) {
          form.resetFields();
          onClose();
        }
      }}
      onFinish={async (values) => {
        const success = await onFinish({ ...initialValues, ...values });
        if (success) {
          form.resetFields();
          return true;
        }
        return false;
      }}
    >
      <ProFormText
        name="name"
        label="Tên câu lạc bộ"
        rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ!' }]}
      />
      <ProFormText
        name="president"
        label="Chủ nhiệm Câu lạc bộ"
      />
      <ProFormText
        name="avatar"
        label="Link ảnh đại diện"
        placeholder="https://..."
      />
      <ProFormDatePicker
        name="foundedDate"
        label="Ngày thành lập"
        width="md"
      />
      <ProFormTextArea
        name="description"
        label="Mô tả"
        fieldProps={{ rows: 4 }}
      />
      <ProFormSwitch
        name="isActive"
        label="Trạng thái hoạt động"
      />
    </ModalForm>
  );
};

export default ClubForm;
