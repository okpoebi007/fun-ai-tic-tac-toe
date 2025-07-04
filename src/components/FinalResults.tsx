import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameState {
  totalRounds: number;
  currentRound: number;
  stats: {
    xWins: number;
    oWins: number;
    draws: number;
  };
  gameMode: 'single-player' | 'two-player';
  playerNames?: {
    x: string;
    o: string;
  };
}

interface FinalResultsProps {
  gameState: GameState;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

const FinalResults = ({ gameState, onNewGame, onBackToMenu }: FinalResultsProps) => {
  const { stats, playerNames, gameMode } = gameState;
  const { xWins, oWins, draws } = stats;

  // Determine series winner
  let seriesWinner: 'X' | 'O' | 'draw';
  let winnerMessage: string;
  
  if (xWins > oWins) {
    seriesWinner = 'X';
    winnerMessage = `🏆 ${playerNames?.x || (gameMode === 'two-player' ? 'Player X' : 'You')} wins the series! 🏆`;
  } else if (oWins > xWins) {
    seriesWinner = 'O';
    winnerMessage = `🏆 ${playerNames?.o || (gameMode === 'two-player' ? 'Player O' : 'AI')} wins the series! 🏆`;
  } else {
    seriesWinner = 'draw';
    winnerMessage = "🤝 It's a Tie! The series ended in a draw! 🤝";
  }

  const totalGames = xWins + oWins + draws;

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Series Complete!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Best of {gameState.totalRounds} Results</p>
      </div>

      <Card className="p-6 w-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Winner Announcement */}
          <div className={`text-center p-4 rounded-lg ${
            seriesWinner === 'X' 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' 
              : seriesWinner === 'O'
              ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700'
          }`}>
            <div className={`text-2xl font-bold ${
              seriesWinner === 'X' 
                ? 'text-blue-600 dark:text-blue-400' 
                : seriesWinner === 'O'
                ? 'text-red-600 dark:text-red-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {winnerMessage}
            </div>
          </div>

          {/* Final Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
              Final Statistics
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  {playerNames?.x || (gameMode === 'two-player' ? 'Player X' : 'You')}
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {xWins}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalGames > 0 ? Math.round((xWins / totalGames) * 100) : 0}% wins
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-600 dark:text-gray-300 font-semibold">Draws</div>
                <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                  {draws}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalGames > 0 ? Math.round((draws / totalGames) * 100) : 0}% draws
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-red-600 dark:text-red-400 font-semibold">
                  {playerNames?.o || (gameMode === 'two-player' ? 'Player O' : 'AI')}
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {oWins}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalGames > 0 ? Math.round((oWins / totalGames) * 100) : 0}% wins
                </div>
              </div>
            </div>

            {/* Series Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">Series Summary</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  {totalGames} games played over {gameState.totalRounds} rounds
                </div>
                {seriesWinner !== 'draw' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Series won by {xWins > oWins ? xWins - oWins : oWins - xWins} game{Math.abs(xWins - oWins) !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onNewGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-lg"
            >
              🔄 Play Another Series
            </Button>
            
            <Button
              variant="outline"
              onClick={onBackToMenu}
              className="w-full"
            >
              🏠 Back to Menu
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinalResults;