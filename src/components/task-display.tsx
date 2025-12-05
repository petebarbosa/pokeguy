'use client';

import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/i18n/context';

interface TaskDisplayProps {
  task: Task | null;
  isVotingActive: boolean;
  isRevealed: boolean;
}

export function TaskDisplay({ task, isVotingActive, isRevealed }: TaskDisplayProps) {
  const { t } = useTranslations();

  if (!task) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-400 dark:text-gray-500">
          {t('session.waitingForTask')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('session.waitingForTaskDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-6 space-y-3">
      <div className="flex items-center justify-center gap-2">
        {isVotingActive && !isRevealed && (
          <Badge variant="default" className="animate-pulse bg-green-500">
            {t('session.votingInProgress')}
          </Badge>
        )}
        {isRevealed && (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            {t('session.votesRevealed')}
          </Badge>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 px-4">
        {task.title}
      </h2>
    </div>
  );
}
