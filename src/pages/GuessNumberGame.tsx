import React, { useState } from 'react';

const MAX_ATTEMPTS = 10;

const GuessNumberGame: React.FC = () => {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Hãy đoán một số từ 1 đến 100!');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (gameOver) return;
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('Vui lòng nhập số hợp lệ từ 1 đến 100!');
      return;
    }
    setAttempts(attempts + 1);
    if (num === target) {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
    } else if (attempts + 1 >= MAX_ATTEMPTS) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${target}.`);
      setGameOver(true);
    } else if (num < target) {
      setMessage('Bạn đoán quá thấp!');
    } else {
      setMessage('Bạn đoán quá cao!');
    }
    setGuess('');
  };

  const handleRestart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('Hãy đoán một số từ 1 đến 100!');
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Trò chơi đoán số</h2>
      <p>{message}</p>
      <p>Lượt còn lại: {MAX_ATTEMPTS - attempts}</p>
      <input
        type="number"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        disabled={gameOver}
        min={1}
        max={100}
        style={{ width: 120, marginRight: 8 }}
      />
      <button onClick={handleGuess} disabled={gameOver}>Đoán</button>
      {gameOver && (
        <div style={{ marginTop: 16 }}>
          <button onClick={handleRestart}>Chơi lại</button>
        </div>
      )}
    </div>
  );
};

export default GuessNumberGame;
