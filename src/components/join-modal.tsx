'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface JoinModalProps {
  open: boolean;
  onJoin: (name: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function JoinModal({ open, onJoin, isLoading, error }: JoinModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center dark:text-gray-100">
            Join Session
          </DialogTitle>
          <DialogDescription className="text-center dark:text-gray-400">
            Enter your name to join the voting session
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              autoFocus
              className="text-lg py-6 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full py-6 text-lg font-semibold"
          >
            {isLoading ? 'Joining...' : 'Join Session'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
