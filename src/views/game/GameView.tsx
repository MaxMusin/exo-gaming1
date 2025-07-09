import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import {
  resetGame,
  startCountdown,
  decrementCountdown,
  toggleSound,
} from "../../store/gameSlice";
import { addPlayer } from "../../store/leaderboardSlice";
import { gameService, soundService, dataService } from "../../services";
import {
  CountdownBar,
  GameGrid,
  ScoreDisplay,
  Timer,
  CountdownOverlay,
  GameOverOverlay,
} from "./components";
import { Toaster, Button } from "../../components/ui";
import { toast } from "sonner";
import backgroundImage from "../../assets/images/WAM_bg.jpg";
import { Player } from "../../store/types";
interface GameViewProps {
  onReturnToMenu: () => void;
}

const GameView: React.FC<GameViewProps> = ({ onReturnToMenu }) => {
  const dispatch = useAppDispatch();
  const {
    gameStarted,
    gameEnded,
    soundEnabled,
    score,
    combo,
    maxCombo,
    playerName,
    countdown,
    isCountingDown,
  } = useAppSelector((state) => state.game);

  const [soundInitialized, setSoundInitialized] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  // Initialize sound service on first user interaction
  useEffect(() => {
    const initializeSound = async () => {
      if (!soundInitialized) {
        try {
          await soundService.enableAudio();
          setSoundInitialized(true);
          console.log("Sound service initialized successfully");
        } catch (error) {
          console.warn("Failed to initialize sound service:", error);
        }
      }
    };

    const handleFirstInteraction = () => {
      initializeSound();
      // Remove listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    // Listen for first user interaction
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [soundInitialized]);

  // Show toast notification when score increases
  useEffect(() => {
    if (score > lastScore && lastScore > 0) {
      const pointsGained = score - lastScore;

      // Create custom toast content with combo information
      const getComboText = (combo: number): string => {
        if (combo >= 5) return "🔥 MEGA COMBO! 🔥";
        if (combo >= 3) return "⚡ COMBO! ⚡";
        if (combo >= 2) return `${combo}x COMBO!`;
        return "";
      };

      const comboText = getComboText(combo);
      const message =
        combo >= 2
          ? `+${pointsGained} points! ${comboText} (${combo}x Multiplier)`
          : `+${pointsGained} points!`;

      // Show toast with custom styling based on points and combo
      if (pointsGained >= 500 || combo >= 5) {
        toast.success(message, {
          duration: 2500,
          style: {
            background: "rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            color: "#ef4444",
          },
        });
      } else if (pointsGained >= 300 || combo >= 3) {
        toast.success(message, {
          duration: 2000,
          style: {
            background: "rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(251, 191, 36, 0.5)",
            color: "#fbbf24",
          },
        });
      } else if (pointsGained >= 200 || combo >= 2) {
        toast.success(message, {
          duration: 2000,
          style: {
            background: "rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(251, 146, 60, 0.5)",
            color: "#fb923c",
          },
        });
      } else {
        toast.success(message, {
          duration: 1500,
          style: {
            background: "rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(34, 197, 94, 0.5)",
            color: "#22c55e",
          },
        });
      }
    }
    setLastScore(score);
  }, [score, combo, lastScore]);

  // Start countdown when component mounts
  useEffect(() => {
    if (!gameStarted && !gameEnded && !isCountingDown) {
      dispatch(startCountdown());
    }
  }, [dispatch, gameStarted, gameEnded, isCountingDown]);

  // Handle countdown timer
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (isCountingDown && countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        dispatch(decrementCountdown());
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [dispatch, isCountingDown, countdown]);

  // Play countdown sounds
  useEffect(() => {
    if (isCountingDown && countdown !== null && soundEnabled) {
      if (countdown > 0 && countdown <= 5) {
        // Play tick sound for each countdown number
        soundService.playTick();
      }
    }
  }, [countdown, isCountingDown, soundEnabled]);

  // Start game service when game actually starts (after countdown)
  useEffect(() => {
    if (gameStarted && !gameEnded && !isCountingDown) {
      gameService.startGame();
    } else if (gameEnded) {
      gameService.stopGame();
    }
  }, [gameStarted, gameEnded, isCountingDown]);

  // Save score to leaderboard when game ends
  useEffect(() => {
    const saveScore = async () => {
      console.log(
        "Score saving useEffect triggered - gameEnded:",
        gameEnded,
        "playerName:",
        playerName,
        "score:",
        score
      );
      if (gameEnded && playerName && score > 0) {
        console.log("✅ All conditions met, saving score to leaderboard...");
        const player: Player = {
          id: dataService.generatePlayerId(),
          name: playerName,
          score: score,
          timestamp: Date.now(),
          maxCombo: maxCombo,
        };
        console.log("📊 Player object created:", player);
        dispatch(addPlayer(player));
        console.log("🚀 addPlayer action dispatched");

        // Also save to dataService to persist the score
        try {
          await dataService.saveScore(player);
          console.log("💾 Score saved to dataService storage");
        } catch (error) {
          console.error("❌ Failed to save score to dataService:", error);
        }
      } else {
        console.log("❌ Score saving conditions not met:");
        console.log("  - gameEnded:", gameEnded);
        console.log("  - playerName:", playerName);
        console.log("  - score > 0:", score > 0, "(score:", score, ")");
      }
    };

    saveScore();
  }, [gameEnded, dispatch, playerName, score, maxCombo]);

  const handleReturnToMenu = () => {
    dispatch(resetGame());
    gameService.stopGame();
    onReturnToMenu();
  };

  const handleSoundToggle = () => {
    dispatch(toggleSound());
  };

  return (
    <div
      className="min-h-screen h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black/10 w-full backdrop-blur-lg">
        <CountdownBar />
        <div className="flex justify-between items-center p-4">
          <Button
            onClick={handleReturnToMenu}
            variant="outline"
            className="transition-all duration-200 transform hover:scale-110 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold border-white/20 hover:text-white"
          >
            ← Back to Menu
          </Button>
          <div className="text-center">
            <p className="text-white/80 text-lg">
              Player:{" "}
              <span className="text-yellow-300 font-bold">{playerName}</span>
            </p>
          </div>
          <Button
            onClick={handleSoundToggle}
            variant="outline"
            size="icon"
            className={`transition-all duration-200 transform hover:scale-110 ${
              soundEnabled
                ? "bg-green-500/20 text-green-400 border-green-400/50 hover:bg-green-500/30"
                : "bg-red-500/20 text-red-400 border-red-400/50 hover:bg-red-500/30"
            }`}
            title={soundEnabled ? "Sound On" : "Sound Off"}
          >
            <span className="text-xl">{soundEnabled ? "🔊" : "🔇"}</span>
          </Button>
        </div>
      </div>
      <div className="h-full w-full relative z-50">
        {isCountingDown && countdown !== null && (
          <CountdownOverlay countdown={countdown} />
        )}
        {gameEnded && (
          <GameOverOverlay
            score={score}
            onReturnToMenu={handleReturnToMenu}
          />
        )}
        <div className="flex justify-between items-center py-2 px-4 w-full">
          <ScoreDisplay />
          <Timer />
        </div>
        <div className="relative z-10 p-5 w-full h-full max-w-6xl mx-auto">
          <div className="lg:col-span-2 order-2 lg:order-1 flex flex-col gap-6">
            <GameGrid />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default GameView;
