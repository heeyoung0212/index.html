import React, { useState, useEffect, useCallback } from 'react';

const Shuttlecock = ({ position }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    style={{
      position: 'absolute',
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <path d="M12 2L8 10L12 22L16 10L12 2Z" fill="white" stroke="black" strokeWidth="1" />
  </svg>
);

const Racket = ({ position }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="48"
    height="48"
    style={{
      position: 'absolute',
      left: `${position.x}%`,
      bottom: '10%',
      transform: 'translateX(-50%)',
    }}
  >
    <ellipse cx="12" cy="8" rx="10" ry="7" fill="lightblue" stroke="black" strokeWidth="1" />
    <line x1="12" y1="15" x2="12" y2="24" stroke="black" strokeWidth="2" />
  </svg>
);

const BadmintonGame = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shuttlecockPosition, setShuttlecockPosition] = useState({ x: 50, y: 0 });
  const [racketPosition, setRacketPosition] = useState({ x: 50 });
  const [shuttlecockDirection, setShuttlecockDirection] = useState(1); // 1: down, -1: up
  const [speed, setSpeed] = useState(1);

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setShuttlecockPosition({ x: Math.random() * 80 + 10, y: 0 });
    setRacketPosition({ x: 50 });
    setShuttlecockDirection(1);
    setSpeed(1);
  }, []);

  const handleHit = useCallback(() => {
    if (Math.abs(shuttlecockPosition.x - racketPosition.x) < 10 && shuttlecockPosition.y > 80) {
      setScore(prevScore => prevScore + 1);
      setShuttlecockDirection(-1);
      setSpeed(prevSpeed => prevSpeed + 0.1);
    }
  }, [shuttlecockPosition, racketPosition]);

  useEffect(() => {
    if (gameOver) return;

    const moveShuttlecock = () => {
      setShuttlecockPosition(prev => ({
        x: prev.x,
        y: prev.y + speed * shuttlecockDirection,
      }));
    };

    const gameLoop = setInterval(() => {
      moveShuttlecock();
      
      if (shuttlecockPosition.y > 100) {
        clearInterval(gameLoop);
        setGameOver(true);
      }

      if (shuttlecockPosition.y <= 0) {
        setShuttlecockDirection(1);
      }

      if (shuttlecockPosition.y > 80 && shuttlecockPosition.y < 90) {
        handleHit();
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [shuttlecockPosition, gameOver, speed, shuttlecockDirection, handleHit]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const gameArea = document.getElementById('game-area');
      if (gameArea) {
        const rect = gameArea.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setRacketPosition({ x: Math.max(10, Math.min(90, x)) });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold mb-4">배드민턴 게임</h1>
      <div className="mb-4">
        <span className="font-bold">점수:</span> {score}
      </div>
      <div id="game-area" className="relative w-80 h-80 bg-blue-200 border-4 border-blue-500 rounded-lg overflow-hidden">
        {!gameOver ? (
          <>
            <Shuttlecock position={shuttlecockPosition} />
            <Racket position={racketPosition} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white">
              <p className="text-xl font-bold mb-2">게임 종료!</p>
              <p className="mb-4">최종 점수: {score}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={resetGame}
              >
                다시 시작
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm">마우스를 움직여 라켓을 조종하세요!</p>
    </div>
  );
};

export default BadmintonGame;
