import React, { useEffect, useState } from 'react';
import { Modal, Timeline, Spin } from 'antd';
import moment from 'moment';
import { getApplicationLogs } from '@/services/QuanLyCauLacBo/api';

const LogModal: React.FC<{
  visible: boolean;
  applicationId: string;
  onClose: () => void;
}> = ({ visible, applicationId, onClose }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && applicationId) {
      setLoading(true);
      getApplicationLogs(applicationId).then(res => {
        setLogs(res.data || []);
        setLoading(false);
      });
    }
  }, [visible, applicationId]);

  return (
    <Modal
      title="Lịch sử thao tác đơn đăng ký"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {logs.length > 0 ? (
          <Timeline>
            {logs.map(log => (
              <Timeline.Item key={log.id} color={log.action === 'Approved' ? 'green' : (log.action === 'Rejected' ? 'red' : 'blue')}>
                <p style={{ fontWeight: 'bold' }}>{log.performedBy} ({log.action})</p>
                <p>{moment(log.time).format('DD/MM/YYYY HH:mm')}</p>
                {log.reason && <p>Lý do: {log.reason}</p>}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <p>Chưa có lịch sử thao tác.</p>
        )}
      </Spin>
    </Modal>
  );
};

export default LogModal;
