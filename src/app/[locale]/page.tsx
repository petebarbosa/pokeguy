'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { connectSocket } from '@/lib/socket';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslations } from '@/i18n/context';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { t, locale } = useTranslations();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = () => {
    setIsCreating(true);
    const socket = connectSocket();

    socket.emit('session:create', (code) => {
      router.push(`/${locale}/session/${code}?admin=true`);
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      {/* Theme Toggle and Language Switcher in corner */}
      <div className="fixed top-4 right-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 text-center space-y-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Image
              src="/family_guy.png"
              alt="Family Guy"
              width={40}
              height={40}
              className="inline-block"
            />
            {t('home.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="py-8">
          <div className="text-6xl mb-4">🃏</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('home.description')}
          </p>
        </div>

        <Button
          onClick={handleCreateSession}
          disabled={isCreating}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isCreating ? t('home.creating') : t('home.createSession')}
        </Button>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t('home.noAccount')}
        </p>
      </Card>
    </main>
  );
}
