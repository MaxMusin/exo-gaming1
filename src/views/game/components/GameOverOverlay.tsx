import React from "react";
import { Button } from "../../../components/ui";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { gameService } from "../../../services";
import { startCountdown, resetGame } from "../../../store/gameSlice";
import { GameOverOverlayProps } from "../GameView.types";

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  onReturnToMenu,
}) => {
  const dispatch = useAppDispatch();
  const handlePlayAgain = () => {
    dispatch(resetGame());
    gameService.stopGame();
    // Start countdown instead of immediately starting the game
    // This ensures moles don't spawn during the countdown
    setTimeout(() => {
      dispatch(startCountdown());
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
        <p className="text-yellow-300 text-2xl font-bold mb-6">
          Final Score: {score}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handlePlayAgain}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🔄 Play Again
          </Button>

          <Button
            onClick={onReturnToMenu}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🏠 Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
