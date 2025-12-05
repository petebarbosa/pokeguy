'use client';

import { VoteValue } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VotingPanelProps {
  currentVote: VoteValue;
  onVote: (vote: VoteValue) => void;
  disabled: boolean;
}

const VOTE_OPTIONS: VoteValue[] = ['☕', '❓', '1', '2', '3', '5', '8'];

export function VotingPanel({ currentVote, onVote, disabled }: VotingPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg p-4 md:relative md:border md:rounded-lg md:shadow-md transition-colors">
      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap max-w-2xl mx-auto">
        {VOTE_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={currentVote === option ? 'default' : 'outline'}
            size="lg"
            disabled={disabled}
            onClick={() => onVote(option)}
            className={cn(
              'min-w-[48px] h-12 sm:h-14 text-lg sm:text-xl font-bold transition-all',
              currentVote === option && 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900',
              option === '☕' && 'text-amber-700 dark:text-amber-400',
              option === '❓' && 'text-purple-600 dark:text-purple-400'
            )}
          >
            {option}
          </Button>
        ))}
      </div>
      {disabled && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Waiting for task to start...
        </p>
      )}
    </div>
  );
}
