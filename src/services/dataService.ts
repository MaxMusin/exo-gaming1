import { Player } from '../store/types';

class DataService {
  private readonly STORAGE_KEY = 'whack-a-mole-leaderboard';

  // Simulate async API calls with delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getLeaderboard(): Promise<Player[]> {
    await this.delay(100); // Simulate network delay
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const players: Player[] = JSON.parse(stored);
        return players.sort((a, b) => b.score - a.score).slice(0, 10);
      }
      return [];
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  async saveScore(player: Player): Promise<void> {
    await this.delay(50); // Simulate network delay
    
    try {
      const currentLeaderboard = await this.getLeaderboard();
      
      // Check if player already exists
      const existingPlayerIndex = currentLeaderboard.findIndex(
        p => p.name === player.name
      );
      
      if (existingPlayerIndex !== -1) {
        // Update existing player if new score is better
        if (player.score > currentLeaderboard[existingPlayerIndex].score) {
          currentLeaderboard[existingPlayerIndex] = player;
        }
      } else {
        // Add new player
        currentLeaderboard.push(player);
      }
      
      // Sort by score and keep top 10
      const sortedPlayers = currentLeaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      // Only save if player made it to top 10
      if (sortedPlayers.find(p => p.id === player.id)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedPlayers));
      }
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }

  async clearLeaderboard(): Promise<void> {
    await this.delay(50); // Simulate network delay
    localStorage.removeItem(this.STORAGE_KEY);
  }

  generatePlayerId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const dataService = new DataService();
