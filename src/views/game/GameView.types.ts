import { Mole } from "../../store/types";

export interface GameViewProps {
  onReturnToMenu: () => void;
}

export interface MoleHoleProps {
  mole: Mole;
}

export interface GameOverOverlayProps {
  score: number;
  onReturnToMenu: () => void;
}

export interface CountdownOverlayProps {
  countdown: number;
}