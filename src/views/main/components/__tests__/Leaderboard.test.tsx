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

import { dataService } from '../../../../services/dataService';
const mockGetLeaderboard = dataService.getLeaderboard as jest.MockedFunction<typeof dataService.getLeaderboard>;

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
    mockGetLeaderboard.mockResolvedValue([]);
  });

  it('renders leaderboard title', async () => {
    renderLeaderboard();
    expect(screen.getByText('🏆 Leaderboard')).toBeInTheDocument();
    
    // Wait for async loading to complete
    await screen.findByText('No scores yet!');
  });

  it('shows empty state when no players', async () => {
    mockGetLeaderboard.mockResolvedValue([]);
    renderLeaderboard({
      leaderboard: { players: [], loading: false },
    });

    // Wait for the component to finish loading
    await screen.findByText('No scores yet!');
    expect(screen.getByText('Be the first to play and set a record!')).toBeInTheDocument();
  });

  it('displays players when loaded', async () => {
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

    mockGetLeaderboard.mockResolvedValue(mockPlayers);
    renderLeaderboard({
      leaderboard: { players: mockPlayers, loading: false },
    });

    // Wait for the component to finish loading and display players
    await screen.findByText('Player 1');
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });

  it('handles duplicate player names correctly', async () => {
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

    mockGetLeaderboard.mockResolvedValue(mockPlayers);
    renderLeaderboard({
      leaderboard: { players: mockPlayers, loading: false },
    });

    // Wait for the component to finish loading and display players
    await screen.findByText('1,000');
    
    // Both entries should be displayed
    const johnEntries = screen.getAllByText('John');
    expect(johnEntries).toHaveLength(2);
    expect(screen.getByText('800')).toBeInTheDocument();
  });
});
