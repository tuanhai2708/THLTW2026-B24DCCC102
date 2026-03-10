import React, { useState } from 'react';
import { Button, Card, List, Typography, Space, message } from 'antd';

const choices = ['Kéo', 'Búa', 'Bao'] as const;
type Choice = typeof choices[number];

type Result = 'Thắng' | 'Thua' | 'Hòa';

interface HistoryItem {
  player: Choice;
  computer: Choice;
  result: Result;
}

function getResult(player: Choice, computer: Choice): Result {
  if (player === computer) return 'Hòa';
  if (
    (player === 'Kéo' && computer === 'Bao') ||
    (player === 'Búa' && computer === 'Kéo') ||
    (player === 'Bao' && computer === 'Búa')
  ) {
    return 'Thắng';
  }
  return 'Thua';
}

const OanTuTi: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [current, setCurrent] = useState<HistoryItem | null>(null);

  const handlePlay = (player: Choice) => {
    const computer = choices[Math.floor(Math.random() * choices.length)];
    const result = getResult(player, computer);
    const item = { player, computer, result };
    setCurrent(item);
    setHistory([item, ...history]);
    message.info(`Bạn chọn ${player}, Máy chọn ${computer}: ${result}`);
  };

  return (
    <Card title="Trò chơi Oẳn Tù Tì" style={{ maxWidth: 400, margin: '24px auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          {choices.map(choice => (
            <Button key={choice} type="primary" onClick={() => handlePlay(choice)}>
              {choice}
            </Button>
          ))}
        </Space>
        {current && (
          <Typography.Text strong>
            Bạn: {current.player} - Máy: {current.computer} → Kết quả: {current.result}
          </Typography.Text>
        )}
        <List
          header={<b>Lịch sử các ván đấu</b>}
          dataSource={history}
          size="small"
          bordered
          renderItem={(item, idx) => (
            <List.Item>
              Ván {history.length - idx}: Bạn: {item.player} - Máy: {item.computer} → {item.result}
            </List.Item>
          )}
          style={{ maxHeight: 240, overflow: 'auto' }}
        />
      </Space>
    </Card>
  );
};

export default OanTuTi;
