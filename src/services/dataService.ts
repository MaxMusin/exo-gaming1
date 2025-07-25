import { Player } from '../store/types';
import { supabase } from '../lib/supabase';

class DataService {
  async getLeaderboard(): Promise<Player[]> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      // Transform Supabase data to Player format
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        score: row.score,
        timestamp: new Date(row.created_at).getTime(),
        maxCombo: row.max_combo || undefined
      }));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  async saveScore(player: Player): Promise<void> {
    try {
      // Always insert new entry - no deduplication by name
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert({
          id: player.id,
          name: player.name,
          score: player.score,
          max_combo: player.maxCombo || null,
          created_at: new Date(player.timestamp).toISOString()
        });

      if (insertError) {
        console.error('Error inserting new player:', insertError);
        throw insertError;
      }
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }

  async clearLeaderboard(): Promise<void> {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .delete()
        .neq('id', ''); // Delete all records

      if (error) {
        console.error('Error clearing leaderboard:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      throw error;
    }
  }

  generatePlayerId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const dataService = new DataService();
