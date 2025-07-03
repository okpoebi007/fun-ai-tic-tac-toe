
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameStats } from "@/services/settingsService";

interface GameStatsProps {
  stats: GameStats;
  onClose: () => void;
  onResetStats: () => void;
}

const GameStatsComponent = ({ stats, onClose, onResetStats }: GameStatsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Game Statistics</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </Button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.gamesPlayed}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Games Played</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.winPercentage}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Win Rate</div>
            </div>
          </div>

          {/* Win Stats */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">X</span>
                  <span className="text-gray-700 dark:text-gray-300">Wins</span>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400">{stats.xWins}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 dark:text-red-400 font-bold">O</span>
                  <span className="text-gray-700 dark:text-gray-300">Wins</span>
                </div>
                <span className="font-bold text-red-600 dark:text-red-400">{stats.oWins}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400 font-bold">—</span>
                  <span className="text-gray-700 dark:text-gray-300">Draws</span>
                </div>
                <span className="font-bold text-gray-600 dark:text-gray-400">{stats.draws}</span>
              </div>
            </div>
          </div>

          {/* Streak Stats */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Streaks</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.currentWinStreak}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Current Streak</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.bestWinStreak}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onResetStats}
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Reset Stats
            </Button>
            <Button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameStatsComponent;
