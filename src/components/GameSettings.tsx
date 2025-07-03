
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { settingsService, type GameSettings, AIDifficulty, IconStyle, GameMode } from "@/services/settingsService";

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

const GameSettings = ({ settings, onSettingsChange, onClose }: GameSettingsProps) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleSave = async () => {
    await settingsService.saveSettings(localSettings);
    await settingsService.applyTheme(localSettings.theme);
    onSettingsChange(localSettings);
    onClose();
  };

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const difficultyOptions: { value: AIDifficulty; label: string; description: string }[] = [
    { value: 'easy', label: 'Easy', description: 'Random moves' },
    { value: 'medium', label: 'Medium', description: 'Sometimes strategic' },
    { value: 'hard', label: 'Hard', description: 'Usually strategic' },
    { value: 'impossible', label: 'Impossible', description: 'Perfect play (Minimax)' }
  ];

  const iconStyleOptions: { value: IconStyle; label: string; preview: { x: string; o: string } }[] = [
    { value: 'classic', label: 'Classic', preview: { x: 'X', o: 'O' } },
    { value: 'emoji', label: 'Emoji', preview: { x: '❌', o: '⭕' } },
    { value: 'modern', label: 'Modern', preview: { x: '✖', o: '○' } }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Game Settings</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </Button>
          </div>

          {/* Game Mode */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Game Mode</h3>
            <div className="space-y-2">
              {(['single-player', 'two-player'] as GameMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={localSettings.gameMode === mode ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => updateSetting('gameMode', mode)}
                >
                  {mode === 'single-player' ? '🤖 vs AI' : '👥 Two Players'}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Difficulty (only show in single-player mode) */}
          {localSettings.gameMode === 'single-player' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">AI Difficulty</h3>
              <div className="space-y-2">
                {difficultyOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={localSettings.aiDifficulty === option.value ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => updateSetting('aiDifficulty', option.value)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-70">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Icon Style */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Icon Style</h3>
            <div className="space-y-2">
              {iconStyleOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={localSettings.iconStyle === option.value ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => updateSetting('iconStyle', option.value)}
                >
                  <span>{option.label}</span>
                  <span className="text-lg">
                    {option.preview.x} / {option.preview.o}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Theme</h3>
            <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{localSettings.theme === 'light' ? '☀️' : '🌙'}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {localSettings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </div>
              <Switch
                checked={localSettings.theme === 'dark'}
                onCheckedChange={(checked) => updateSetting('theme', checked ? 'dark' : 'light')}
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Sound Effects</h3>
            <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{localSettings.soundEnabled ? '🔊' : '🔇'}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Sound Effects
                </span>
              </div>
              <Switch
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameSettings;
