'use client';

import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';

interface TaskDisplayProps {
  task: Task | null;
  isVotingActive: boolean;
  isRevealed: boolean;
}

export function TaskDisplay({ task, isVotingActive, isRevealed }: TaskDisplayProps) {
  if (!task) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-400 dark:text-gray-500">
          Waiting for task...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The admin will create a task to vote on
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-6 space-y-3">
      <div className="flex items-center justify-center gap-2">
        {isVotingActive && !isRevealed && (
          <Badge variant="default" className="animate-pulse bg-green-500">
            Voting in progress
          </Badge>
        )}
        {isRevealed && (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            Votes revealed
          </Badge>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 px-4">
        {task.title}
      </h2>
    </div>
  );
}
