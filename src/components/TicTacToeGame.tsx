import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EnhancedGameCell from "./EnhancedGameCell";
import GameSettingsModal from "./GameSettings";
import GameStatsComponent from "./GameStats";
import GamePopup from "./GamePopup";
import StartMenu from "./StartMenu";
import RoundDisplay from "./RoundDisplay";
import FinalResults from "./FinalResults";
import { getAIMove, checkWin, isDraw, hasWinner, isGameOver } from "@/utils/aiLogic";
import { enhancedSoundService } from "@/services/enhancedSoundService";
import { settingsService, type GameSettings, type GameStats, type RoundStats } from "@/services/settingsService";
import { showInterstitialAd } from "@/services/admob";

export type Player = 'X' | 'O' | '';
export type Board = Player[];

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

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [winningCondition, setWinningCondition] = useState<number[] | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [hasGameOutcome, setHasGameOutcome] = useState(false);
  
  // Enhanced game state
  const [gameState, setGameState] = useState<GameState>({
    totalRounds: 7,
    currentRound: 1,
    stats: {
      xWins: 0,
      oWins: 0,
      draws: 0
    },
    gameMode: 'single-player',
    playerNames: {
      x: 'Player 1',
      o: 'Player 2'
    }
  });

  const [settings, setSettings] = useState<GameSettings>({
    theme: 'light',
    iconStyle: 'classic',
    gameMode: 'single-player',
    aiDifficulty: 'medium',
    soundEnabled: true,
    matchType: 'single-game'
  });

  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    xWins: 0,
    oWins: 0,
    draws: 0,
    currentWinStreak: 0,
    bestWinStreak: 0,
    winPercentage: 0
  });

  const [rounds, setRounds] = useState<RoundStats>({
    currentRound: 1,
    maxRounds: 7,
    xRoundWins: 0,
    oRoundWins: 0,
    roundDraws: 0,
    lastWinner: null,
    isMatchComplete: false,
    matchWinner: null
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadSettings();
    loadStats();
    loadRounds();
  }, []);

  useEffect(() => {
    enhancedSoundService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const loadSettings = async () => {
    const savedSettings = await settingsService.getSettings();
    setSettings(savedSettings);
    await settingsService.applyTheme(savedSettings.theme);
  };

  const loadStats = async () => {
    const savedStats = await settingsService.getStats();
    setStats(savedStats);
  };

  const loadRounds = async () => {
    const savedRounds = await settingsService.getRounds();
    setRounds(savedRounds);
  };

  const handleStartGame = (
    gameMode: 'single-player' | 'two-player', 
    matchType: 'single-game' | 'best-of-7',
    playerNames?: { x: string; o: string }
  ) => {
    const newSettings = { ...settings, gameMode, matchType };
    setSettings(newSettings);
    settingsService.saveSettings(newSettings);
    
    // Initialize game state for best-of-7
    if (matchType === 'best-of-7') {
      setGameState({
        totalRounds: 7,
        currentRound: 1,
        stats: {
          xWins: 0,
          oWins: 0,
          draws: 0
        },
        gameMode,
        playerNames: playerNames || {
          x: gameMode === 'two-player' ? 'Player 1' : 'You',
          o: gameMode === 'two-player' ? 'Player 2' : 'AI'
        }
      });
    }
    
    setShowStartMenu(false);
    setShowFinalResults(false);
    resetBoard();
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setWinningCondition(null);
    setHasGameOutcome(false);
    setShowPopup(false);
    setGameResult('');
    setCurrentPlayer('X');
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== '' || !gameActive) return;

    // In two-player mode, allow both players to move
    if (settings.gameMode === 'two-player' || currentPlayer === 'X') {
      enhancedSoundService.playTap();

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      // Check for win condition first
      const winCondition = checkWin(newBoard, currentPlayer);
      if (winCondition) {
        setWinningCondition(winCondition);
        setGameActive(false);
        setHasGameOutcome(true);
        enhancedSoundService.playWin();
        
        const winnerName = getPlayerName(currentPlayer);
        setTimeout(() => endRound(`${winnerName} wins this round! 🎉`, currentPlayer as 'X' | 'O'), 600);
        return;
      }

      // Enhanced draw detection
      if (isDraw(newBoard)) {
        setGameActive(false);
        setHasGameOutcome(true);
        enhancedSoundService.playDraw();
        setTimeout(() => endRound("It's a draw! 🤝", 'draw'), 600);
        return;
      }

      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      enhancedSoundService.playMove();

      // In single-player mode, trigger AI move
      if (settings.gameMode === 'single-player' && nextPlayer === 'O') {
        setTimeout(() => makeAIMove(newBoard), 800);
      }
    }
  };

  const makeAIMove = (currentBoard: Board) => {
    if (!gameActive || settings.gameMode !== 'single-player') return;

    const move = getAIMove(currentBoard, settings.aiDifficulty);
    
    if (move !== null) {
      const newBoard = [...currentBoard];
      newBoard[move] = 'O';
      setBoard(newBoard);

      // Check for AI win
      const winCondition = checkWin(newBoard, 'O');
      if (winCondition) {
        setWinningCondition(winCondition);
        setGameActive(false);
        setHasGameOutcome(true);
        enhancedSoundService.playWin();
        setTimeout(() => endRound('AI wins this round! 🤖', 'O'), 600);
        return;
      }

      // Enhanced draw detection for AI moves
      if (isDraw(newBoard)) {
        setGameActive(false);
        setHasGameOutcome(true);
        enhancedSoundService.playDraw();
        setTimeout(() => endRound("It's a draw! 🤝", 'draw'), 600);
        return;
      }

      setCurrentPlayer('X');
    }
  };

  const endRound = async (message: string, winner: 'X' | 'O' | 'draw') => {
    if (settings.matchType === 'best-of-7') {
      // Update game state stats
      const newStats = { ...gameState.stats };
      if (winner === 'X') {
        newStats.xWins++;
      } else if (winner === 'O') {
        newStats.oWins++;
      } else {
        newStats.draws++;
      }

      const newGameState = {
        ...gameState,
        stats: newStats,
        currentRound: gameState.currentRound + 1
      };

      setGameState(newGameState);

      // Check if series is complete
      if (newGameState.currentRound > newGameState.totalRounds) {
        // Series complete - determine winner
        const { xWins, oWins } = newStats;
        let seriesWinner: 'X' | 'O' | 'draw';
        
        if (xWins > oWins) {
          seriesWinner = 'X';
        } else if (oWins > xWins) {
          seriesWinner = 'O';
        } else {
          seriesWinner = 'draw';
        }

        // Update overall stats
        await updateGameStats(seriesWinner);
        
        // Show final results
        setTimeout(() => {
          setShowFinalResults(true);
        }, 1500);
        
        setGameResult(message);
      } else {
        // Continue to next round
        setGameResult(message);
        
        // Auto-advance to next round after popup
        setTimeout(() => {
          setShowPopup(false);
          resetBoard();
        }, winner === 'draw' ? 1500 : 3000);
      }

      // Update rounds for compatibility with existing system
      const updatedRounds = await settingsService.updateRounds(winner);
      setRounds(updatedRounds);
    } else {
      // Single game mode - update stats immediately
      setGameResult(message);
      await updateGameStats(winner);
    }
    
    setShowPopup(true);
  };

  const updateGameStats = async (winner: 'X' | 'O' | 'draw') => {
    const newStats = await settingsService.updateStats(winner);
    setStats(newStats);
  };

  const nextRound = () => {
    if (settings.matchType === 'best-of-7' && !rounds.isMatchComplete && gameState.currentRound <= gameState.totalRounds) {
      // Continue to next round
      setShowPopup(false);
      resetBoard();
    } else {
      // End of match or single game
      newGame();
    }
  };

  const newGame = async () => {
    console.log('Starting new game, showing interstitial ad...');
    await showInterstitialAd();
    
    // Reset everything completely
    await settingsService.resetRounds();
    const newRounds = await settingsService.getRounds();
    setRounds(newRounds);
    
    resetBoard();
    setShowFinalResults(false);
    setShowStartMenu(true);
    
    // Reset game state
    setGameState({
      totalRounds: 7,
      currentRound: 1,
      stats: {
        xWins: 0,
        oWins: 0,
        draws: 0
      },
      gameMode: 'single-player',
      playerNames: {
        x: 'Player 1',
        o: 'Player 2'
      }
    });
  };

  const resetAllStats = async () => {
    const newStats = await settingsService.resetStats();
    setStats(newStats);
    await settingsService.resetRounds();
    const newRounds = await settingsService.getRounds();
    setRounds(newRounds);
    setShowStats(false);
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    enhancedSoundService.setEnabled(newSettings.soundEnabled);
  };

  const getPlayerName = (player: Player): string => {
    if (player === 'X') {
      return gameState.playerNames?.x || (settings.gameMode === 'two-player' ? 'Player X' : 'You');
    } else if (player === 'O') {
      return gameState.playerNames?.o || (settings.gameMode === 'two-player' ? 'Player O' : 'AI');
    }
    return '';
  };

  const getDifficultyDisplay = () => {
    if (settings.gameMode === 'two-player') return 'Two Players';
    return `AI: ${settings.aiDifficulty.charAt(0).toUpperCase() + settings.aiDifficulty.slice(1)}`;
  };

  const getCurrentPlayerDisplay = () => {
    if (!gameActive) {
      return settings.matchType === 'best-of-7' ? "Round Over" : "Game Over";
    }
    
    return `${getPlayerName(currentPlayer)}'s turn`;
  };

  // Show final results if series is complete
  if (showFinalResults && settings.matchType === 'best-of-7') {
    return (
      <FinalResults
        gameState={gameState}
        onNewGame={newGame}
        onBackToMenu={() => setShowStartMenu(true)}
      />
    );
  }

  // Show start menu if requested
  if (showStartMenu) {
    return (
      <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto pb-20">
        <StartMenu 
          onStartGame={handleStartGame}
          onShowSettings={() => setShowSettings(true)}
          settings={settings}
        />
        
        {/* Settings Modal */}
        {showSettings && (
          <GameSettingsModal
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto pb-20">
      {/* Header with controls */}
      <div className="flex justify-between items-center w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStats(true)}
          className="flex items-center space-x-2"
        >
          <span>📊</span>
          <span>Stats</span>
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Tic-Tac-Toe
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getDifficultyDisplay()}
          </div>
          {settings.matchType === 'best-of-7' && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Round {gameState.currentRound} of {gameState.totalRounds}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="flex items-center space-x-2"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </Button>
      </div>

      {/* Round Display - Only show for best-of-7 matches */}
      {settings.matchType === 'best-of-7' && (
        <Card className="p-4 w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Best of 7 Series</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">
                Round {gameState.currentRound} of {gameState.totalRounds}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="space-y-1">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  {getPlayerName('X')}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {gameState.stats.xWins}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-gray-600 dark:text-gray-300 font-semibold">Draws</div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {gameState.stats.draws}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-red-600 dark:text-red-400 font-semibold">
                  {getPlayerName('O')}
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {gameState.stats.oWins}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 w-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="text-center space-y-4">
          {/* Current game stats for single games */}
          {settings.matchType === 'single-game' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">
                    {settings.gameMode === 'two-player' ? 'Player X' : 'You (X)'}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.xWins}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-600 dark:text-gray-300 font-semibold">Draws</div>
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stats.draws}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    {settings.gameMode === 'two-player' ? 'Player O' : 'AI (O)'}
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.oWins}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {getCurrentPlayerDisplay()}
          </div>
          
          {/* Game Board */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {board.map((cell, index) => (
                <EnhancedGameCell
                  key={index}
                  value={cell}
                  onClick={() => handleCellClick(index)}
                  isWinning={winningCondition?.includes(index) || false}
                  disabled={!gameActive || cell !== ''}
                  iconStyle={settings.iconStyle}
                  currentPlayer={currentPlayer}
                />
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={hasGameOutcome ? nextRound : newGame}
              disabled={!hasGameOutcome && gameActive}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasGameOutcome ? 
                (settings.matchType === 'best-of-7' && gameState.currentRound <= gameState.totalRounds ? '▶️ Next Round' : '🔄 New Game') 
                : '🔄 New Game'
              }
            </Button>
            
            <Button 
              onClick={newGame}
              variant="outline"
              className="flex-1"
            >
              🏠 Menu
            </Button>
          </div>
        </div>
      </Card>

      {/* Game Result Popup */}
      <GamePopup
        show={showPopup}
        message={gameResult}
        onClose={() => setShowPopup(false)}
        autoCloseDelay={gameResult.includes("draw") ? 1500 : 3000}
      />

      {/* Settings Modal */}
      {showSettings && (
        <GameSettingsModal
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Stats Modal */}
      {showStats && (
        <GameStatsComponent
          stats={stats}
          onClose={() => setShowStats(false)}
          onResetStats={resetAllStats}
        />
      )}
    </div>
  );
};

export default TicTacToeGame;