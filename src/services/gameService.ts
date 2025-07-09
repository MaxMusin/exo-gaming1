import { store } from '../store';
import { activateMole, deactivateMole, decrementTime } from '../store/gameSlice';

class GameService {
  private gameTimer: NodeJS.Timeout | null = null;
  private moleSpawnTimer: NodeJS.Timeout | null = null;
  private moleDeactivateTimer: NodeJS.Timeout | null = null;
  private lastMoleId: number | null = null;

  startGame(): void {
    this.stopGame(); // Clear any existing timers
    
    // Reset lastMoleId to ensure no consecutive duplicates across game sessions
    this.lastMoleId = null;
    
    // Start main game timer (decrements every second)
    this.gameTimer = setInterval(() => {
      const state = store.getState();
      if (state.game.isPlaying) {
        store.dispatch(decrementTime());
      } else {
        this.stopGame();
      }
    }, 1000);

    // Start mole spawning
    this.spawnMoles();
  }

  stopGame(): void {
    // Clear main game timer
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }

    // Clear mole spawn timer
    if (this.moleSpawnTimer) {
      clearInterval(this.moleSpawnTimer);
      this.moleSpawnTimer = null;
    }

    // Clear mole deactivate timer
    if (this.moleDeactivateTimer) {
      clearTimeout(this.moleDeactivateTimer);
      this.moleDeactivateTimer = null;
    }
  }

  private spawnMoles(): void {
    // Use interval instead of recursive setTimeout to prevent multiple spawn chains
    this.moleSpawnTimer = setInterval(() => {
      const state = store.getState();
      if (!state.game.isPlaying) {
        this.stopGame();
        return;
      }

      // Generate random mole ID (1-12) that's different from the last one
      let moleId: number;
      do {
        moleId = Math.floor(Math.random() * 12) + 1;
      } while (moleId === this.lastMoleId);
      
      // Update last mole ID
      this.lastMoleId = moleId;
      
      // Activate the mole
      store.dispatch(activateMole(moleId));

      // Clear any existing deactivate timer
      if (this.moleDeactivateTimer) {
        clearTimeout(this.moleDeactivateTimer);
      }

      // Set timer to deactivate mole after duration
      this.moleDeactivateTimer = setTimeout(() => {
        store.dispatch(deactivateMole());
        this.moleDeactivateTimer = null;
      }, 2500); // Mole stays active for 2.5 seconds

    }, 800); // New mole every 0.8 seconds
  }
}

export const gameService = new GameService();
