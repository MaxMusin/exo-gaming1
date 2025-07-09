import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from './gameSlice';
import { leaderboardSlice } from './leaderboardSlice';

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    leaderboard: leaderboardSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['game/whackMole', 'game/decrementTime'],
        ignoredPaths: ['game.lastHitTime'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
