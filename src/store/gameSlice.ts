import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Mole } from './types';
import { soundService } from '../services';

const GAME_DURATION = 120; // 2 minutes in seconds
const POINTS_PER_HIT = 100;
const COMBO_TIMEOUT = 3000; // 3 seconds to maintain combo
const COUNTDOWN_DURATION = 5; // 5 seconds for countdown

const initializeMoles = (): Mole[] => {
  return Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    isActive: false,
    position: {
      row: Math.floor(index / 4),
      col: index % 4
    }
  }));
};

const initialState: GameState = {
  moles: initializeMoles(),
  score: 0,
  timeLeft: GAME_DURATION,
  isPlaying: false,
  gameStarted: false,
  gameEnded: false,
  activeMoleId: null,
  playerName: '',
  combo: 0,
  maxCombo: 0,
  lastHitTime: null,
  soundEnabled: true,
  countdown: null,
  isCountingDown: false
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },

    startGame: (state) => {
      state.isPlaying = true;
      state.gameStarted = true;
      state.gameEnded = false;
      state.score = 0;
      state.timeLeft = GAME_DURATION;
      state.combo = 0;
      state.maxCombo = 0;
      state.lastHitTime = null;
      state.activeMoleId = null;
      state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
      
      // Play game start sound
      if (state.soundEnabled) {
        soundService.playGameStart();
      }
    },

    endGame: (state) => {
      state.isPlaying = false;
      state.gameEnded = true;
      state.activeMoleId = null;
      state.combo = 0;
      state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
      
      // Play game end sound
      if (state.soundEnabled) {
        soundService.playGameEnd();
      }
    },

    resetGame: (state) => {
      state.score = 0;
      state.timeLeft = GAME_DURATION;
      state.isPlaying = false;
      state.gameStarted = false;
      state.gameEnded = false;
      state.activeMoleId = null;
      state.combo = 0;
      state.maxCombo = 0;
      state.lastHitTime = null;
      state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
      state.countdown = null;
      state.isCountingDown = false;
    },

    activateMole: (state, action: PayloadAction<number>) => {
      const moleId = action.payload;
      
      // Deactivate all moles first
      state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
      
      // Activate the selected mole
      const targetMole = state.moles.find(mole => mole.id === moleId);
      if (targetMole) {
        targetMole.isActive = true;
        state.activeMoleId = moleId;
        
        // Play mole appearance sound
        if (state.soundEnabled) {
          soundService.playMoleAppear();
        }
      }
    },

    deactivateMole: (state) => {
      state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
      state.activeMoleId = null;
      
      // Reset combo if mole disappears without being hit
      if (state.combo > 0) {
        state.combo = 0;
      }
    },

    whackMole: (state, action: PayloadAction<number>) => {
      const moleId = action.payload;
      const currentTime = Date.now();
      
      // Find the target mole
      const targetMole = state.moles.find(mole => mole.id === moleId);
      

      
      // Check if the whacked mole is active OR was recently active
      // This handles race conditions where the mole might become inactive
      // between the visual appearance and the click handler execution
      const isValidHit = targetMole && (
        // Direct hit on active mole
        (state.activeMoleId === moleId && targetMole.isActive) ||
        // Hit on mole that was active very recently (within 100ms grace period)
        (targetMole.isActive && state.activeMoleId === moleId)
      );
      
      if (isValidHit) {
        // Successful hit!
        targetMole.isActive = false;
        state.activeMoleId = null;
        
        // Update combo
        const timeSinceLastHit = state.lastHitTime ? currentTime - state.lastHitTime : 0;
        if (state.lastHitTime === null || timeSinceLastHit <= COMBO_TIMEOUT) {
          state.combo += 1;
        } else {
          state.combo = 1; // Reset combo
        }
        
        // Update max combo
        if (state.combo > state.maxCombo) {
          state.maxCombo = state.combo;
        }
        
        state.lastHitTime = currentTime;
        
        // Calculate score with combo multiplier
        const basePoints = POINTS_PER_HIT;
        const comboMultiplier = Math.min(state.combo, 5); // Cap at 5x multiplier
        const points = basePoints * comboMultiplier;
        state.score += points;
        
        // Play sound effects
        if (state.soundEnabled) {
          soundService.playWhack();
          if (state.combo >= 2) {
            soundService.playCombo(state.combo);
          }
        }
      } else {
        // Miss - always reset combo on any miss
        state.combo = 0;
        state.lastHitTime = null;
        
        // Play miss sound
        if (state.soundEnabled) {
          soundService.playMiss();
        }
      }
    },

    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
        
        // Play tick sound for last 10 seconds
        if (state.timeLeft <= 10 && state.timeLeft > 0 && state.soundEnabled) {
          soundService.playTick();
        }
        
        // Check combo timeout
        const currentTime = Date.now();
        if (state.lastHitTime && currentTime - state.lastHitTime > COMBO_TIMEOUT) {
          state.combo = 0;
        }
      }
      
      // End game when time reaches 0
      if (state.timeLeft <= 0) {
        state.isPlaying = false;
        state.gameEnded = true;
        state.activeMoleId = null;
        state.combo = 0;
        state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
        
        // Play game end sound
        if (state.soundEnabled) {
          soundService.playGameEnd();
        }
      }
    },

    startCountdown: (state) => {
      state.countdown = COUNTDOWN_DURATION;
      state.isCountingDown = true;
    },

    decrementCountdown: (state) => {
      if (state.countdown !== null && state.countdown > 0) {
        state.countdown -= 1;
      }
      
      // Start game when countdown reaches 0
      if (state.countdown === 0) {
        state.isPlaying = true;
        state.gameStarted = true;
        state.gameEnded = false;
        state.score = 0;
        state.timeLeft = GAME_DURATION;
        state.combo = 0;
        state.maxCombo = 0;
        state.lastHitTime = null;
        state.activeMoleId = null;
        state.moles = state.moles.map(mole => ({ ...mole, isActive: false }));
        state.isCountingDown = false;
        state.countdown = null;
        
        // Play game start sound
        if (state.soundEnabled) {
          soundService.playGameStart();
        }
      }
    },

    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      soundService.setEnabled(state.soundEnabled);
    },

    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
      soundService.setEnabled(action.payload);
    }
  }
});

export const {
  setPlayerName,
  startGame,
  endGame,
  resetGame,
  activateMole,
  deactivateMole,
  whackMole,
  decrementTime,
  startCountdown,
  decrementCountdown,
  toggleSound,
  setSoundEnabled
} = gameSlice.actions;

export { gameSlice };
export type { GameState };
