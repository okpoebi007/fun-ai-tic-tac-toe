import { Preferences } from '@capacitor/preferences';

export type Theme = 'light' | 'dark';
export type IconStyle = 'classic' | 'emoji' | 'modern';
export type GameMode = 'single-player' | 'two-player';
export type MatchType = 'single-game' | 'best-of-7';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface GameSettings {
  theme: Theme;
  iconStyle: IconStyle;
  gameMode: GameMode;
  matchType: MatchType;
  aiDifficulty: AIDifficulty;
  soundEnabled: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  xWins: number;
  oWins: number;
  draws: number;
  currentWinStreak: number;
  bestWinStreak: number;
  winPercentage: number;
}

export interface RoundStats {
  currentRound: number;
  maxRounds: number;
  xRoundWins: number;
  oRoundWins: number;
  roundDraws: number;
  lastWinner: 'X' | 'O' | 'draw' | null;
  isMatchComplete: boolean;
  matchWinner: 'X' | 'O' | null;
}

class SettingsService {
  private readonly SETTINGS_KEY = 'tic-tac-toe-settings';
  private readonly STATS_KEY = 'tic-tac-toe-stats';
  private readonly ROUNDS_KEY = 'tic-tac-toe-rounds';

  private defaultSettings: GameSettings = {
    theme: 'light',
    iconStyle: 'classic',
    gameMode: 'single-player',
    matchType: 'single-game',
    aiDifficulty: 'medium',
    soundEnabled: true
  };

  private defaultStats: GameStats = {
    gamesPlayed: 0,
    xWins: 0,
    oWins: 0,
    draws: 0,
    currentWinStreak: 0,
    bestWinStreak: 0,
    winPercentage: 0
  };

  private defaultRounds: RoundStats = {
    currentRound: 1,
    maxRounds: 7,
    xRoundWins: 0,
    oRoundWins: 0,
    roundDraws: 0,
    lastWinner: null,
    isMatchComplete: false,
    matchWinner: null
  };

  async getSettings(): Promise<GameSettings> {
    try {
      const { value } = await Preferences.get({ key: this.SETTINGS_KEY });
      if (value) {
        return { ...this.defaultSettings, ...JSON.parse(value) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return this.defaultSettings;
  }

  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await Preferences.set({ 
        key: this.SETTINGS_KEY, 
        value: JSON.stringify(settings) 
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async getStats(): Promise<GameStats> {
    try {
      const { value } = await Preferences.get({ key: this.STATS_KEY });
      if (value) {
        return { ...this.defaultStats, ...JSON.parse(value) };
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    return this.defaultStats;
  }

  async saveStats(stats: GameStats): Promise<void> {
    try {
      await Preferences.set({ 
        key: this.STATS_KEY, 
        value: JSON.stringify(stats) 
      });
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  async updateStats(winner: 'X' | 'O' | 'draw'): Promise<GameStats> {
    const currentStats = await this.getStats();
    
    const newStats: GameStats = {
      ...currentStats,
      gamesPlayed: currentStats.gamesPlayed + 1
    };

    if (winner === 'X') {
      newStats.xWins = currentStats.xWins + 1;
      newStats.currentWinStreak = currentStats.currentWinStreak + 1;
      newStats.bestWinStreak = Math.max(newStats.bestWinStreak, newStats.currentWinStreak);
    } else if (winner === 'O') {
      newStats.oWins = currentStats.oWins + 1;
      newStats.currentWinStreak = 0;
    } else {
      newStats.draws = currentStats.draws + 1;
      newStats.currentWinStreak = 0;
    }

    newStats.winPercentage = newStats.gamesPlayed > 0 
      ? Math.round((newStats.xWins / newStats.gamesPlayed) * 100) 
      : 0;

    await this.saveStats(newStats);
    return newStats;
  }

  async resetStats(): Promise<GameStats> {
    await this.saveStats(this.defaultStats);
    return this.defaultStats;
  }

  async getRounds(): Promise<RoundStats> {
    try {
      const { value } = await Preferences.get({ key: this.ROUNDS_KEY });
      if (value) {
        return { ...this.defaultRounds, ...JSON.parse(value) };
      }
    } catch (error) {
      console.error('Failed to load rounds:', error);
    }
    return this.defaultRounds;
  }

  async saveRounds(rounds: RoundStats): Promise<void> {
    try {
      await Preferences.set({ 
        key: this.ROUNDS_KEY, 
        value: JSON.stringify(rounds) 
      });
    } catch (error) {
      console.error('Failed to save rounds:', error);
    }
  }

  async updateRounds(winner: 'X' | 'O' | 'draw'): Promise<RoundStats> {
    const currentRounds = await this.getRounds();
    
    const newRounds: RoundStats = {
      ...currentRounds,
      lastWinner: winner
    };

    // Update round wins based on winner
    if (winner === 'X') {
      newRounds.xRoundWins = currentRounds.xRoundWins + 1;
    } else if (winner === 'O') {
      newRounds.oRoundWins = currentRounds.oRoundWins + 1;
    } else {
      // Handle draw case
      newRounds.roundDraws = currentRounds.roundDraws + 1;
    }

    // Check if match is complete (first to 4 wins)
    if (newRounds.xRoundWins >= 4) {
      newRounds.isMatchComplete = true;
      newRounds.matchWinner = 'X';
    } else if (newRounds.oRoundWins >= 4) {
      newRounds.isMatchComplete = true;
      newRounds.matchWinner = 'O';
    } else if (newRounds.currentRound >= 7) {
      // All 7 rounds completed, determine winner by most wins
      newRounds.isMatchComplete = true;
      if (newRounds.xRoundWins > newRounds.oRoundWins) {
        newRounds.matchWinner = 'X';
      } else if (newRounds.oRoundWins > newRounds.xRoundWins) {
        newRounds.matchWinner = 'O';
      } else {
        // Tie case - no winner
        newRounds.matchWinner = null;
      }
    } else {
      // Advance to next round
      newRounds.currentRound = currentRounds.currentRound + 1;
    }

    await this.saveRounds(newRounds);
    return newRounds;
  }

  async resetRounds(): Promise<RoundStats> {
    await this.saveRounds(this.defaultRounds);
    return this.defaultRounds;
  }

  async applyTheme(theme: Theme): Promise<void> {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export const settingsService = new SettingsService();