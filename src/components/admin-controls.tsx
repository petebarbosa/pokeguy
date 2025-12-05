'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/i18n/context';

interface AdminControlsProps {
  isVotingActive: boolean;
  isRevealed: boolean;
  hasTask: boolean;
  onCreateTask: (title: string) => void;
  onRevealVotes: () => void;
  onNewTask: () => void;
}

export function AdminControls({
  isVotingActive,
  isRevealed,
  hasTask,
  onCreateTask,
  onRevealVotes,
  onNewTask,
}: AdminControlsProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const { t } = useTranslations();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onCreateTask(taskTitle.trim());
      setTaskTitle('');
    }
  };

  return (
    <Card className="p-4 space-y-4 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-semibold text-lg dark:text-gray-100">{t('adminControls.title')}</h3>
      
      {/* Create Task Form */}
      <form onSubmit={handleCreateTask} className="flex gap-2">
        <Input
          placeholder={t('adminControls.taskPlaceholder')}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          disabled={isVotingActive && !isRevealed}
          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <Button
          type="submit"
          disabled={!taskTitle.trim() || (isVotingActive && !isRevealed)}
        >
          {t('adminControls.createTask')}
        </Button>
      </form>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="default"
          onClick={onRevealVotes}
          disabled={!isVotingActive || isRevealed}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {t('adminControls.revealVotes')}
        </Button>

        {isRevealed && (
          <Button
            variant="outline"
            onClick={onNewTask}
          >
            {t('adminControls.newTask')}
          </Button>
        )}
      </div>

      {/* Status */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {!hasTask && t('adminControls.createTaskToStart')}
        {hasTask && isVotingActive && !isRevealed && t('adminControls.votingInProgress')}
        {isRevealed && t('adminControls.votesRevealed')}
      </div>
    </Card>
  );
}
