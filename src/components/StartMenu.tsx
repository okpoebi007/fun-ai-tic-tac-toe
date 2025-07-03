
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { settingsService, type GameSettings, type MatchType } from '@/services/settingsService';

interface StartMenuProps {
  onStartGame: (gameMode: 'single-player' | 'two-player', matchType: MatchType) => void;
  onShowSettings: () => void;
  settings: GameSettings;
}

const StartMenu = ({ onStartGame, onShowSettings, settings }: StartMenuProps) => {
  const [selectedMode, setSelectedMode] = useState<'single-player' | 'two-player'>('single-player');
  const [selectedMatchType, setSelectedMatchType] = useState<MatchType>('single-game');

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Tic-Tac-Toe
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Choose Your Game Style</p>
      </div>

      <Card className="p-6 w-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Game Mode Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Choose Game Mode</h3>
            <div className="space-y-2">
              <Button
                variant={selectedMode === 'single-player' ? 'default' : 'outline'}
                onClick={() => setSelectedMode('single-player')}
                className="w-full justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🤖</span>
                  <div>
                    <div className="font-medium">Player vs AI</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Challenge the computer
                    </div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant={selectedMode === 'two-player' ? 'default' : 'outline'}
                onClick={() => setSelectedMode('two-player')}
                className="w-full justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <div className="font-medium">Two Players</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Local pass-and-play
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Match Type Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Match Type</h3>
            <div className="space-y-2">
              <Button
                variant={selectedMatchType === 'single-game' ? 'default' : 'outline'}
                onClick={() => setSelectedMatchType('single-game')}
                className="w-full justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚡</span>
                  <div>
                    <div className="font-medium">Single Game</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Quick one-off match
                    </div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant={selectedMatchType === 'best-of-7' ? 'default' : 'outline'}
                onClick={() => setSelectedMatchType('best-of-7')}
                className="w-full justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <div className="font-medium">Best of 7 Match</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      First to 4 wins
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Icon Style Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Icon Style</p>
              <div className="flex justify-center space-x-4">
                {settings.iconStyle === 'classic' && (
                  <>
                    <span className="text-2xl font-bold text-blue-600">X</span>
                    <span className="text-2xl font-bold text-red-600">O</span>
                  </>
                )}
                {settings.iconStyle === 'emoji' && (
                  <>
                    <span className="text-2xl">❌</span>
                    <span className="text-2xl">⭕</span>
                  </>
                )}
                {settings.iconStyle === 'modern' && (
                  <>
                    <span className="text-2xl">✖️</span>
                    <span className="text-2xl">🔴</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => onStartGame(selectedMode, selectedMatchType)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-lg"
            >
              Start Game
            </Button>
            
            <Button
              variant="outline"
              onClick={onShowSettings}
              className="w-full"
            >
              ⚙️ Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StartMenu;
