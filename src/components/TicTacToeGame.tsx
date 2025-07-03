import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EnhancedGameCell from "./EnhancedGameCell";
import GameSettingsModal from "./GameSettings";
import GameStatsComponent from "./GameStats";
import GamePopup from "./GamePopup";
import StartMenu from "./StartMenu";
import RoundDisplay from "./RoundDisplay";
import { getAIMove, checkWin, isDraw, hasWinner, isGameOver } from "@/utils/aiLogic";
import { enhancedSoundService } from "@/services/enhancedSoundService";
import { settingsService, type GameSettings, type GameStats, type RoundStats } from "@/services/settingsService";
import { showInterstitialAd } from "@/services/admob";

export type Player = 'X' | 'O' | '';
export type Board = Player[];

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [winningCondition, setWinningCondition] = useState<number[] | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [hasGameOutcome, setHasGameOutcome] = useState(false);
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

  const handleStartGame = (gameMode: 'single-player' | 'two-player', matchType: 'single-game' | 'best-of-7') => {
    const newSettings = { ...settings, gameMode, matchType };
    setSettings(newSettings);
    settingsService.saveSettings(newSettings);
    setShowStartMenu(false);
    
    // Reset to clean slate
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setWinningCondition(null);
    setHasGameOutcome(false);
    setShowPopup(false);
    setGameResult('');
    
    // Only use round logic for best-of-7 matches
    if (matchType === 'best-of-7') {
      // Determine who starts based on previous round winner
      if (rounds.lastWinner === 'O' && gameMode === 'single-player') {
        // AI starts if it won last round
        setCurrentPlayer('O');
        setTimeout(() => makeAIMove(Array(9).fill('')), 800);
      } else if (rounds.lastWinner === 'draw') {
        // Switch starter on draw
        setCurrentPlayer(rounds.currentRound % 2 === 0 ? 'O' : 'X');
        if (gameMode === 'single-player' && rounds.currentRound % 2 === 0) {
          setTimeout(() => makeAIMove(Array(9).fill('')), 800);
        }
      } else {
        // Player X starts by default or if they won
        setCurrentPlayer('X');
      }
    } else {
      // Single game mode - always start with X
      setCurrentPlayer('X');
    }
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
        setTimeout(() => endRound(`${currentPlayer === 'X' ? (settings.gameMode === 'two-player' ? 'Player X' : 'You') : (settings.gameMode === 'two-player' ? 'Player O' : 'AI')} wins this round! 🎉`, currentPlayer as 'X' | 'O'), 600);
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
      const updatedRounds = await settingsService.updateRounds(winner);
      setRounds(updatedRounds);

      if (updatedRounds.isMatchComplete) {
        // Match is complete, show final result
        const matchMessage = updatedRounds.matchWinner === 'X' 
          ? `🏆 ${settings.gameMode === 'two-player' ? 'Player X' : 'You'} won the match! 🏆`
          : updatedRounds.matchWinner === 'O'
          ? `🏆 ${settings.gameMode === 'two-player' ? 'Player O' : 'AI'} won the match! 🏆`
          : "🤝 The match ended in a tie! 🤝";
        
        setGameResult(matchMessage);
        
        // Update overall stats
        if (updatedRounds.matchWinner) {
          await updateGameStats(updatedRounds.matchWinner);
        } else {
          // Handle tie case
          await updateGameStats('draw');
        }
      } else {
        setGameResult(message);
      }
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
    if (settings.matchType === 'best-of-7' && !rounds.isMatchComplete) {
      // Start next round
      setBoard(Array(9).fill(''));
      setGameActive(true);
      setWinningCondition(null);
      setShowPopup(false);
      setGameResult('');
      setHasGameOutcome(false);
      
      // Determine starting player for next round
      if (rounds.lastWinner === 'O' && settings.gameMode === 'single-player') {
        setCurrentPlayer('O');
        setTimeout(() => makeAIMove(Array(9).fill('')), 800);
      } else if (rounds.lastWinner === 'draw') {
        setCurrentPlayer(rounds.currentRound % 2 === 0 ? 'O' : 'X');
        if (settings.gameMode === 'single-player' && rounds.currentRound % 2 === 0) {
          setTimeout(() => makeAIMove(Array(9).fill('')), 800);
        }
      } else {
        setCurrentPlayer('X');
      }
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
    
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setWinningCondition(null);
    setShowPopup(false);
    setGameResult('');
    setHasGameOutcome(false);
    setShowStartMenu(true);
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

  const getDifficultyDisplay = () => {
    if (settings.gameMode === 'two-player') return 'Two Players';
    return `AI: ${settings.aiDifficulty.charAt(0).toUpperCase() + settings.aiDifficulty.slice(1)}`;
  };

  const getCurrentPlayerDisplay = () => {
    if (!gameActive) {
      return settings.matchType === 'best-of-7' ? "Round Over" : "Game Over";
    }
    
    if (settings.gameMode === 'two-player') {
      return `Player ${currentPlayer}'s turn`;
    }
    
    return currentPlayer === 'X' ? "Your turn" : "AI is thinking...";
  };

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
              Best of 7 Match
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
        <RoundDisplay rounds={rounds} gameMode={settings.gameMode} />
      )}

      <Card className="p-6 w-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="text-center space-y-4">
          {/* Current game stats */}
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
                (settings.matchType === 'best-of-7' && !rounds.isMatchComplete ? '▶️ Next Round' : '🔄 New Game') 
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