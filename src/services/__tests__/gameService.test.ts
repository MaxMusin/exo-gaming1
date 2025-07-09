import { gameService } from '../gameService';
import { store } from '../../store';

// Mock the store and dispatch
jest.mock('../../store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe('GameService', () => {
  const mockStore = store as jest.Mocked<typeof store>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Mock store state with minimal required properties
    mockStore.getState.mockReturnValue({
      game: {
        isPlaying: true,
        timeLeft: 30,
        score: 0,
        combo: 0,
        maxCombo: 0,
        activeMoleId: null,
        playerName: 'Test Player'
      }
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
    gameService.stopGame();
  });

  describe('RNG Logic - No Consecutive Duplicates', () => {
    test('should not spawn the same mole consecutively within a game session', () => {
      const spawnedMoles: number[] = [];
      let callCount = 0;
      
      // Mock dispatch to capture mole IDs
      mockStore.dispatch.mockImplementation((action: any) => {
        if (action.type === 'game/activateMole') {
          spawnedMoles.push(action.payload);
          callCount++;
        }
      });

      gameService.startGame();
      
      // Advance timers to trigger multiple mole spawns
      for (let i = 0; i < 10; i++) {
        jest.advanceTimersByTime(800); // Mole spawn interval
      }

      // Check that no consecutive moles are the same
      for (let i = 1; i < spawnedMoles.length; i++) {
        expect(spawnedMoles[i]).not.toBe(spawnedMoles[i - 1]);
      }
      
      expect(spawnedMoles.length).toBeGreaterThan(5);
    });

    test('should reset lastMoleId when starting a new game', () => {
      const spawnedMoles: number[] = [];
      
      mockStore.dispatch.mockImplementation((action: any) => {
        if (action.type === 'game/activateMole') {
          spawnedMoles.push(action.payload);
        }
      });

      // First game session
      gameService.startGame();
      jest.advanceTimersByTime(800);
      const firstMole = spawnedMoles[0];
      
      gameService.stopGame();
      spawnedMoles.length = 0; // Clear array
      
      // Second game session
      gameService.startGame();
      jest.advanceTimersByTime(800);
      const secondGameFirstMole = spawnedMoles[0];
      
      // The first mole of the second game could be the same as the last mole
      // of the first game since lastMoleId is reset
      expect(typeof secondGameFirstMole).toBe('number');
      expect(secondGameFirstMole).toBeGreaterThanOrEqual(1);
      expect(secondGameFirstMole).toBeLessThanOrEqual(12);
    });

    test('should generate mole IDs within valid range (1-12)', () => {
      const spawnedMoles: number[] = [];
      
      mockStore.dispatch.mockImplementation((action: any) => {
        if (action.type === 'game/activateMole') {
          spawnedMoles.push(action.payload);
        }
      });

      gameService.startGame();
      
      // Spawn multiple moles
      for (let i = 0; i < 20; i++) {
        jest.advanceTimersByTime(800);
      }

      // Check all moles are in valid range
      spawnedMoles.forEach(moleId => {
        expect(moleId).toBeGreaterThanOrEqual(1);
        expect(moleId).toBeLessThanOrEqual(12);
        expect(Number.isInteger(moleId)).toBe(true);
      });
    });

    test('should eventually spawn all possible mole positions', () => {
      const spawnedMoles: number[] = [];
      
      mockStore.dispatch.mockImplementation((action: any) => {
        if (action.type === 'game/activateMole') {
          spawnedMoles.push(action.payload);
        }
      });

      gameService.startGame();
      
      // Spawn many moles to ensure good distribution
      for (let i = 0; i < 100; i++) {
        jest.advanceTimersByTime(800);
      }

      const uniqueMoles = new Set(spawnedMoles);
      
      // Should have spawned at least 8 different positions out of 12
      expect(uniqueMoles.size).toBeGreaterThanOrEqual(8);
      
      // All spawned moles should be valid
      uniqueMoles.forEach(moleId => {
        expect(moleId).toBeGreaterThanOrEqual(1);
        expect(moleId).toBeLessThanOrEqual(12);
      });
    });
  });

  describe('Game Timer Management', () => {
    test('should start and stop game timers properly', () => {
      gameService.startGame();
      
      // Should have started timers
      expect(mockStore.dispatch).toHaveBeenCalled();
      
      gameService.stopGame();
      
      // Advance time after stopping - no new moles should spawn
      const initialCallCount = mockStore.dispatch.mock.calls.length;
      jest.advanceTimersByTime(5000);
      
      // No new calls should have been made
      expect(mockStore.dispatch.mock.calls.length).toBe(initialCallCount);
    });

    test('should stop spawning when game is not playing', () => {
      // Start with playing state
      mockStore.getState.mockReturnValue({
        game: {
          isPlaying: false, // Game stopped
          timeLeft: 0,
          score: 100,
          combo: 0,
          maxCombo: 5,
          activeMoleId: null,
          playerName: 'Test Player'
        }
      } as any);

      gameService.startGame();
      
      const initialCallCount = mockStore.dispatch.mock.calls.length;
      jest.advanceTimersByTime(2000);
      
      // Should have stopped spawning moles
      expect(mockStore.dispatch.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('Mole Deactivation', () => {
    test('should deactivate moles after 2.5 seconds', () => {
      gameService.startGame();
      
      // Spawn a mole
      jest.advanceTimersByTime(800);
      
      // Clear previous calls
      mockStore.dispatch.mockClear();
      
      // Advance time to trigger deactivation
      jest.advanceTimersByTime(2500);
      
      // Should have called deactivateMole
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'game/deactivateMole'
        })
      );
    });
  });
});
