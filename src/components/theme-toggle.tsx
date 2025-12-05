'use client';

import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return '💻';
    }
    return resolvedTheme === 'dark' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (theme === 'system') {
      return 'System';
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="gap-1"
      title={`Theme: ${getLabel()}`}
    >
      <span className="text-base">{getIcon()}</span>
      <span className="hidden sm:inline text-xs">{getLabel()}</span>
    </Button>
  );
}
