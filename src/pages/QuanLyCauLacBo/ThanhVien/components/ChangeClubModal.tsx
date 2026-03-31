import { ModalForm, ProFormSelect } from '@ant-design/pro-form';

interface ChangeClubModalProps {
  visible: boolean;
  onClose: () => void;
  onFinish: (targetClubId: string) => Promise<boolean>;
  clubs: { id: string; name: string }[];
  selectedCount: number;
}

const ChangeClubModal = ({ visible, onClose, onFinish, clubs, selectedCount }: ChangeClubModalProps) => {
  return (
    <ModalForm
      title={`Chuyển Câu lạc bộ cho ${selectedCount} thành viên`}
      visible={visible}
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const success = await onFinish(values.targetClubId);
        return success;
      }}
    >
      <ProFormSelect
        name="targetClubId"
        label="Chọn Câu lạc bộ chuyển đến"
        rules={[{ required: true, message: 'Vui lòng chọn Câu lạc bộ' }]}
        options={clubs.map((c: any) => ({ value: c.id, label: c.name }))}
      />
    </ModalForm>
  );
};

export default ChangeClubModal;
