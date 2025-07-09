import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Leaderboard from '../Leaderboard';
import { leaderboardSlice } from '../../../../store/leaderboardSlice';
import { gameSlice } from '../../../../store/gameSlice';

// Mock the data service
jest.mock('../../../../services/dataService', () => ({
  dataService: {
    getLeaderboard: jest.fn().mockResolvedValue([]),
  },
}));

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Trophy: () => <div data-testid="trophy-icon" />,
  Medal: () => <div data-testid="medal-icon" />,
  Award: () => <div data-testid="award-icon" />,
}));

const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      leaderboard: leaderboardSlice.reducer,
      game: gameSlice.reducer,
    },
    preloadedState: {
      leaderboard: {
        players: [],
        loading: false,
        error: null,
        ...initialState.leaderboard,
      },
      game: {
        moles: Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          isActive: false,
          position: { row: Math.floor(i / 4), col: i % 4 }
        })),
        isPlaying: false,
        gameStarted: false,
        gameEnded: false,
        timeLeft: 30,
        score: 0,
        combo: 0,
        maxCombo: 0,
        activeMoleId: null,
        playerName: 'Test Player',
        lastHitTime: null,
        soundEnabled: true,
        countdown: null,
        isCountingDown: false,
        ...initialState.game,
      },
    },
  });
};

const renderLeaderboard = (initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <Leaderboard />
    </Provider>
  );
};

describe('Leaderboard - Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders leaderboard title', () => {
    renderLeaderboard();
    expect(screen.getByText('🏆 Leaderboard')).toBeInTheDocument();
  });

  it('shows empty state when no players', () => {
    renderLeaderboard({
      leaderboard: { players: [] },
    });

    expect(screen.getByText('No scores yet!')).toBeInTheDocument();
    expect(screen.getByText('Be the first to play and set a record!')).toBeInTheDocument();
  });

  it('displays players when loaded', () => {
    const mockPlayers = [
      {
        id: '1',
        name: 'Player 1',
        score: 1000,
        maxCombo: 10,
        timestamp: Date.now(),
      },
      {
        id: '2',
        name: 'Player 2',
        score: 800,
        maxCombo: 8,
        timestamp: Date.now(),
      },
    ];

    renderLeaderboard({
      leaderboard: { players: mockPlayers },
    });

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });

  it('handles duplicate player names correctly', () => {
    const mockPlayers = [
      {
        id: '1',
        name: 'John',
        score: 1000,
        maxCombo: 10,
        timestamp: Date.now(),
      },
      {
        id: '2',
        name: 'John', // Duplicate name
        score: 800,
        maxCombo: 8,
        timestamp: Date.now() - 1000,
      },
    ];

    renderLeaderboard({
      leaderboard: { players: mockPlayers },
    });

    // Both entries should be displayed
    const johnEntries = screen.getAllByText('John');
    expect(johnEntries).toHaveLength(2);
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });
});
