import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardState, Player } from './types';

const initialState: LeaderboardState = {
  players: [],
  loading: false,
  error: null
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    addPlayer: (state, action: PayloadAction<Player>) => {
      const newPlayer = action.payload;
      
      // Check if player already exists
      const existingPlayerIndex = state.players.findIndex(
        player => player.name === newPlayer.name
      );
      
      if (existingPlayerIndex !== -1) {
        // Update existing player if new score is better
        const existingPlayer = state.players[existingPlayerIndex];
        if (newPlayer.score > existingPlayer.score) {
          state.players[existingPlayerIndex] = newPlayer;
        }
      } else {
        // Add new player
        state.players.push(newPlayer);
      }
      
      // Sort by score descending and keep top 10
      state.players.sort((a, b) => b.score - a.score);
      state.players = state.players.slice(0, 10);
    },

    clearLeaderboard: (state) => {
      state.players = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  setPlayers,
  setLoading,
  setError,
  addPlayer,
  clearLeaderboard
} = leaderboardSlice.actions;

export { leaderboardSlice };
