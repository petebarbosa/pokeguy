'use client';

import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/i18n/context';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslations();

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
      return t('theme.system');
    }
    return theme === 'dark' ? t('theme.dark') : t('theme.light');
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
