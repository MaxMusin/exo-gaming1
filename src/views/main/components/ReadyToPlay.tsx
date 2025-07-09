import { useState } from "react";
import { Button } from "../../../components/ui";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setPlayerName } from "../../../store/gameSlice";
import hammerTimeSound from "../../../assets/sounds/hammer-time.mp3";

interface ReadyToPlayProps {
    onStartGame: () => void;
}

const ReadyToPlay: React.FC<ReadyToPlayProps> = ({onStartGame}) => {
  const dispatch = useAppDispatch();
  const [inputName, setInputName] = useState("");
  
  const handleStartGame = () => {
    if (inputName.trim()) {
      // Play the hammer time sound before starting the game
      const audio = new Audio(hammerTimeSound);
      audio.play().catch(error => {
        console.warn('Could not play hammer time sound:', error);
      });
      
      dispatch(setPlayerName(inputName.trim()));
      onStartGame();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputName.trim()) {
      handleStartGame();
    }
  };
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white">🔨 Ready to Play?</h2>
      <div className="space-y-6">
        <div>
          <input
            id="playerName"
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your name here..."
            className="w-full px-4 py-2 text-md rounded-md bg-white/5 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
            maxLength={20}
          />
        </div>
        <Button
          onClick={handleStartGame}
          disabled={!inputName.trim()}
          size="lg"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold text-sm transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {inputName.trim() ? "🚀 Start Game" : "👆 Enter Your Name First"}
        </Button>
      </div>
    </div>
  );
};

export default ReadyToPlay;
