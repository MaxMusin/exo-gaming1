import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { whackMole } from "../../../store/gameSlice";
import MoleSprite from "../../../assets/images/WAM_Mole.png";
import HoleSprite from "../../../assets/images/WAM_Hole.png";
import Hammer from "../../../assets/images/WAM_Hammer.png";
import { MoleHoleProps } from "../GameView.types";

const MoleHole: React.FC<MoleHoleProps> = ({ mole }) => {
  const dispatch = useAppDispatch();
  const { isPlaying } = useAppSelector((state) => state.game);
  const [isClicked, setIsClicked] = useState(false);
  const [clickFeedback, setClickFeedback] = useState<"hit" | "miss" | null>(
    null
  );

  const handleClick = () => {
    if (!isPlaying) return;

    // Immediate visual feedback
    setIsClicked(true);

    // Determine if this should be a hit or miss based on current state
    const isValidClick = mole.isActive;
    setClickFeedback(isValidClick ? "hit" : "miss");

    // Always dispatch whackMole - the game slice will handle hit vs miss logic
    dispatch(whackMole(mole.id));

    // Reset visual feedback after animation
    setTimeout(() => {
      setIsClicked(false);
      setClickFeedback(null);
    }, 300);
  };

  // Reset click state when mole becomes active (new mole appears)
  useEffect(() => {
    if (mole.isActive) {
      setIsClicked(false);
      setClickFeedback(null);
    }
  }, [mole.isActive]);

  return (
    <div className="relative">
      {/* Mole Hole Container */}
      <div
        className={`w-20 h-20 md:w-32 md:h-32 relative p-2 md:p-8 box-content select-none transition-all duration-150 ${
          mole.isActive ? "hover:scale-105" : ""
        } ${isClicked ? "scale-95" : ""}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        style={{ cursor: `url(${Hammer}) 0 0, auto` }}
        aria-label={`Mole hole ${mole.id}${
          mole.isActive ? " - mole is active!" : ""
        }`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Show EITHER hole OR mole, never both */}
        {mole.isActive ? (
          /* Mole - When active, replaces the hole entirely */
          <img
            src={MoleSprite}
            alt="Mole"
            className={`w-20 h-20 md:w-32 md:h-32 object-contain object-bottom pointer-events-none transition-all duration-150 ${
              isClicked ? "brightness-150" : ""
            }`}
          />
        ) : (
          /* Hole - When mole is not active, show the hole */
          <img
            src={HoleSprite}
            alt="Hole"
            className={`w-20 h-20 md:w-32 md:h-32 object-contain object-bottom pointer-events-none transition-all duration-150 ${
              isClicked ? "brightness-75" : ""
            }`}
          />
        )}

        {/* Click Feedback */}
        {clickFeedback && (
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
              clickFeedback === "hit" ? "text-green-500" : "text-red-500"
            }`}
          >
            <div className="text-2xl font-bold animate-bounce">
              {clickFeedback === "hit" ? "✅" : "❌"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoleHole;
