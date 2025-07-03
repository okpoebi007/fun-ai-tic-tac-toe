
import { Card } from '@/components/ui/card';
import { RoundStats } from '@/services/settingsService';

interface RoundDisplayProps {
  rounds: RoundStats;
  gameMode: 'single-player' | 'two-player';
}

const RoundDisplay = ({ rounds, gameMode }: RoundDisplayProps) => {
  return (
    <Card className="p-4 w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="space-y-3">
        {/* Round Progress */}
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Best of 7 Match</div>
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            Round {rounds.currentRound} of {rounds.maxRounds}
          </div>
        </div>

        {/* Round Wins Display */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="space-y-1">
            <div className="text-blue-600 dark:text-blue-400 font-semibold">
              {gameMode === 'two-player' ? 'Player X' : 'You'}
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {rounds.xRoundWins}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-gray-600 dark:text-gray-300 font-semibold">Draws</div>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {rounds.roundDraws}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-red-600 dark:text-red-400 font-semibold">
              {gameMode === 'two-player' ? 'Player O' : 'AI'}
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {rounds.oRoundWins}
            </div>
          </div>
        </div>

        {/* Win Progress Bar */}
        <div className="space-y-2">
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            First to 4 wins
          </div>
          <div className="flex space-x-1">
            {/* X wins indicators */}
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`x-${i}`}
                className={`h-2 flex-1 rounded ${
                  i < rounds.xRoundWins 
                    ? 'bg-blue-600 dark:bg-blue-400' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
            <div className="w-2" />
            {/* O wins indicators */}
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`o-${i}`}
                className={`h-2 flex-1 rounded ${
                  i < rounds.oRoundWins 
                    ? 'bg-red-600 dark:bg-red-400' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoundDisplay;
