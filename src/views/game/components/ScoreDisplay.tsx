import React from "react";
import { useAppSelector } from "../../../hooks/useAppDispatch";

const ScoreDisplay: React.FC = () => {
  const { score, maxCombo } = useAppSelector((state) => state.game);

  return (
    <div className="bg-white rounded-lg p-4 shadow-2xl border border-white/20 backdrop-blur-md">
      <h3 className="text-black text-lg font-semibold mb-2">Score</h3>
      <p className="text-4xl font-bold text-right">{score.toLocaleString()}</p>
      {maxCombo > 0 && (
        <p className="text-black text-sm mt-2">Best Combo: {maxCombo}x</p>
      )}
    </div>
  );
};

export default ScoreDisplay;
