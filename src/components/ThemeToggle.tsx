
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { settingsService, type Theme } from '@/services/settingsService';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const settings = await settingsService.getSettings();
    setTheme(settings.theme);
    await settingsService.applyTheme(settings.theme);
  };

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const settings = await settingsService.getSettings();
    const newSettings = { ...settings, theme: newTheme };
    await settingsService.saveSettings(newSettings);
    await settingsService.applyTheme(newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
    >
      {theme === 'light' ? (
        <span className="text-lg">🌙</span>
      ) : (
        <span className="text-lg">☀️</span>
      )}
    </Button>
  );
};

export default ThemeToggle;
