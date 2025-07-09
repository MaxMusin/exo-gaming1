import React from "react";
import { Button } from "../../components/ui";
import backgroundImage from "../../assets/images/WAM_bg.jpg";
import {
  Footer,
  GameFeatures,
  GameInstructions,
  Leaderboard,
  ReadyToPlay,
} from "./components";

interface MainViewProps {
  onStartGame: () => void;
}

const MainView: React.FC<MainViewProps> = ({ onStartGame }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div className="text-center mb-4">
            <h1 className="text-8xl font-bold text-white drop-shadow-2xl animate-pulse mb-4">
              🔨 Whack-a-Mole
            </h1>
            <p className="text-2xl text-white/90 font-semibold">
              The Ultimate Mole Whacking Challenge!
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Test your reflexes in this fast-paced game. Whack moles as they
              pop up, build combos for bonus points, and compete for the top
              spot on the leaderboard!
            </p>
          </div>
          <GameFeatures />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadyToPlay onStartGame={onStartGame} />
            <GameInstructions />
          </div>
          <Leaderboard />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() =>
                window.open("https://github.com/MaxMusin/exo-gaming1", "_blank")
              }
              size="lg"
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              📖 View Source Code
            </Button>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainView;
