export interface Mole {
  id: number;
  isActive: boolean;
  position: {
    row: number;
    col: number;
  };
}

export interface GameState {
  moles: Mole[];
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  gameStarted: boolean;
  gameEnded: boolean;
  activeMoleId: number | null;
  playerName: string;
  combo: number;
  maxCombo: number;
  lastHitTime: number | null;
  soundEnabled: boolean;
  countdown: number | null;
  isCountingDown: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  timestamp: number;
  maxCombo?: number;
}

export interface LeaderboardState {
  players: Player[];
  loading: boolean;
  error: string | null;
}
