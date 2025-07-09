import React from "react";
import { useAppSelector } from "../../../hooks/useAppDispatch";
import MoleHole from "./MoleHole";

const GameGrid: React.FC = () => {
  const { moles } = useAppSelector((state) => state.game);

  // Group moles by rows (3 rows of 4 moles each)
  const rows = [
    moles.slice(0, 4), // Row 1: moles 1-4
    moles.slice(4, 8), // Row 2: moles 5-8
    moles.slice(8, 12), // Row 3: moles 9-12
  ];

  return (
    <div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((mole) => (
            <MoleHole key={mole.id} mole={mole} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
