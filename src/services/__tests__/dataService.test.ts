import { dataService } from '../dataService';
import { Player } from '../../store/types';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      delete: jest.fn(() => ({
        neq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

import { supabase } from '../../lib/supabase';

describe('DataService', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveScore - Always Insert New Entries', () => {
    test('should always insert new entries regardless of duplicate player names', async () => {
      const mockInsert = jest.fn(() => Promise.resolve({ error: null }));
      const mockFrom = jest.fn(() => ({
        insert: mockInsert
      }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const player: Player = {
        id: 'test-id-123',
        name: 'John Doe',
        score: 1500,
        timestamp: Date.now(),
        maxCombo: 5
      };

      await dataService.saveScore(player);

      expect(mockSupabase.from).toHaveBeenCalledWith('leaderboard');
      expect(mockInsert).toHaveBeenCalledWith({
        id: player.id,
        name: player.name,
        score: player.score,
        max_combo: player.maxCombo,
        created_at: new Date(player.timestamp).toISOString()
      });
    });

    test('should handle multiple players with same name', async () => {
      const mockInsert = jest.fn(() => Promise.resolve({ error: null }));
      const mockFrom = jest.fn(() => ({
        insert: mockInsert
      }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const player1: Player = {
        id: 'test-id-1',
        name: 'John Doe',
        score: 1000,
        timestamp: Date.now(),
        maxCombo: 3
      };

      const player2: Player = {
        id: 'test-id-2',
        name: 'John Doe', // Same name
        score: 800, // Lower score
        timestamp: Date.now() + 1000,
        maxCombo: 2
      };

      // Both should be saved
      await dataService.saveScore(player1);
      await dataService.saveScore(player2);

      expect(mockInsert).toHaveBeenCalledTimes(2);
      expect(mockInsert).toHaveBeenNthCalledWith(1, {
        id: player1.id,
        name: player1.name,
        score: player1.score,
        max_combo: player1.maxCombo,
        created_at: new Date(player1.timestamp).toISOString()
      });
      expect(mockInsert).toHaveBeenNthCalledWith(2, {
        id: player2.id,
        name: player2.name,
        score: player2.score,
        max_combo: player2.maxCombo,
        created_at: new Date(player2.timestamp).toISOString()
      });
    });

    test('should handle players with undefined maxCombo', async () => {
      const mockInsert = jest.fn(() => Promise.resolve({ error: null }));
      const mockFrom = jest.fn(() => ({
        insert: mockInsert
      }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const player: Player = {
        id: 'test-id-123',
        name: 'Jane Doe',
        score: 2000,
        timestamp: Date.now(),
        maxCombo: undefined
      };

      await dataService.saveScore(player);

      expect(mockInsert).toHaveBeenCalledWith({
        id: player.id,
        name: player.name,
        score: player.score,
        max_combo: null, // Should convert undefined to null
        created_at: new Date(player.timestamp).toISOString()
      });
    });

    test('should throw error when Supabase insert fails', async () => {
      const mockError = { message: 'Database error' };
      const mockInsert = jest.fn(() => Promise.resolve({ error: mockError }));
      const mockFrom = jest.fn(() => ({
        insert: mockInsert
      }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const player: Player = {
        id: 'test-id-123',
        name: 'John Doe',
        score: 1500,
        timestamp: Date.now(),
        maxCombo: 5
      };

      await expect(dataService.saveScore(player)).rejects.toThrow();
    });
  });

  describe('getLeaderboard', () => {
    test('should fetch and transform leaderboard data correctly', async () => {
      const mockSupabaseData = [
        {
          id: 'player-1',
          name: 'Alice',
          score: 2000,
          max_combo: 8,
          created_at: '2024-01-01T12:00:00Z'
        },
        {
          id: 'player-2',
          name: 'Bob',
          score: 1500,
          max_combo: 5,
          created_at: '2024-01-01T13:00:00Z'
        }
      ];

      const mockLimit = jest.fn(() => Promise.resolve({ data: mockSupabaseData, error: null }));
      const mockOrder = jest.fn(() => ({ limit: mockLimit }));
      const mockSelect = jest.fn(() => ({ order: mockOrder }));
      const mockFrom = jest.fn(() => ({ select: mockSelect }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const result = await dataService.getLeaderboard();

      expect(mockSupabase.from).toHaveBeenCalledWith('leaderboard');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('score', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(10);

      expect(result).toEqual([
        {
          id: 'player-1',
          name: 'Alice',
          score: 2000,
          maxCombo: 8,
          timestamp: new Date('2024-01-01T12:00:00Z').getTime()
        },
        {
          id: 'player-2',
          name: 'Bob',
          score: 1500,
          maxCombo: 5,
          timestamp: new Date('2024-01-01T13:00:00Z').getTime()
        }
      ]);
    });

    test('should handle null max_combo values', async () => {
      const mockSupabaseData = [
        {
          id: 'player-1',
          name: 'Charlie',
          score: 1000,
          max_combo: null,
          created_at: '2024-01-01T12:00:00Z'
        }
      ];

      const mockLimit = jest.fn(() => Promise.resolve({ data: mockSupabaseData, error: null }));
      const mockOrder = jest.fn(() => ({ limit: mockLimit }));
      const mockSelect = jest.fn(() => ({ order: mockOrder }));
      const mockFrom = jest.fn(() => ({ select: mockSelect }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const result = await dataService.getLeaderboard();

      expect(result[0].maxCombo).toBeUndefined();
    });

    test('should return empty array when Supabase returns error', async () => {
      const mockError = { message: 'Database error' };
      const mockLimit = jest.fn(() => Promise.resolve({ data: null, error: mockError }));
      const mockOrder = jest.fn(() => ({ limit: mockLimit }));
      const mockSelect = jest.fn(() => ({ order: mockOrder }));
      const mockFrom = jest.fn(() => ({ select: mockSelect }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      const result = await dataService.getLeaderboard();

      expect(result).toEqual([]);
    });
  });

  describe('clearLeaderboard', () => {
    test('should delete all leaderboard entries', async () => {
      const mockNeq = jest.fn(() => Promise.resolve({ error: null }));
      const mockDelete = jest.fn(() => ({ neq: mockNeq }));
      const mockFrom = jest.fn(() => ({ delete: mockDelete }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      await dataService.clearLeaderboard();

      expect(mockSupabase.from).toHaveBeenCalledWith('leaderboard');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockNeq).toHaveBeenCalledWith('id', '');
    });

    test('should throw error when delete fails', async () => {
      const mockError = { message: 'Delete failed' };
      const mockNeq = jest.fn(() => Promise.resolve({ error: mockError }));
      const mockDelete = jest.fn(() => ({ neq: mockNeq }));
      const mockFrom = jest.fn(() => ({ delete: mockDelete }));
      
      mockSupabase.from.mockReturnValue(mockFrom() as any);

      await expect(dataService.clearLeaderboard()).rejects.toThrow();
    });
  });

  describe('generatePlayerId', () => {
    test('should generate unique player IDs', () => {
      const id1 = dataService.generatePlayerId();
      const id2 = dataService.generatePlayerId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
      expect(id2.length).toBeGreaterThan(10);
    });

    test('should include timestamp in generated ID', () => {
      const beforeTime = Date.now();
      const id = dataService.generatePlayerId();
      const afterTime = Date.now();

      const timestampPart = id.split('_')[0];
      const timestamp = parseInt(timestampPart);

      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });
});
