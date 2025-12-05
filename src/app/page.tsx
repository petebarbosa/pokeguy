'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { connectSocket } from '@/lib/socket';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = () => {
    setIsCreating(true);
    const socket = connectSocket();

    socket.emit('session:create', (code) => {
      router.push(`/session/${code}?admin=true`);
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      {/* Theme Toggle in corner */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 text-center space-y-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🎯 PokeGuy</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time voting for agile teams
          </p>
        </div>

        <div className="py-8">
          <div className="text-6xl mb-4">🃏</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a session, share the link, and start voting on tasks together!
          </p>
        </div>

        <Button
          onClick={handleCreateSession}
          disabled={isCreating}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isCreating ? 'Creating...' : 'Create New Session'}
        </Button>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          No account required • Free forever
        </p>
      </Card>
    </main>
  );
}
