import { useAppSelector } from "../../../hooks/useAppDispatch";

const Timer: React.FC = () => {
  const { timeLeft, isPlaying, gameStarted, gameEnded } = useAppSelector(
    (state) => state.game
  );

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimeColor = (): string => {
    if (timeLeft <= 10) return "text-red-400 animate-critical-pulse";
    if (timeLeft <= 30) return "text-yellow-400 animate-pulse-warning";
    return "text-green-400";
  };

  const getGameStatus = (): string => {
    if (!gameStarted) return "Ready to Play!";
    if (gameEnded) return "Game Over!";
    if (isPlaying) return "Game in Progress";
    return "Paused";
  };

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-2xl border border-white/20 backdrop-blur-md">
      <h3 className={`text-lg font-semibold mb-2 ${getTimeColor()}`}>Time</h3>
      <p className={`text-4xl font-bold ${getTimeColor()}`}>
        {formatTime(timeLeft)}
      </p>
      <p className={`text-sm mt-2 ${getTimeColor()}`}>{getGameStatus()}</p>
    </div>
  );
};

export default Timer;
