'use client';

import { VotedTask } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/i18n/context';

interface TaskHistoryProps {
  tasks: VotedTask[];
}

export function TaskHistory({ tasks }: TaskHistoryProps) {
  const { t } = useTranslations();

  if (tasks.length === 0) {
    return null;
  }

  const sortedTasks = [...tasks].reverse();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
        {t('taskHistory.title')} ({tasks.length})
      </h3>
      <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-2">
          {sortedTasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-sm text-gray-400 dark:text-gray-500 w-6 flex-shrink-0">
                  {tasks.length - index}.
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {task.title}
                </span>
              </div>
              <Badge
                variant="secondary"
                className={`ml-2 flex-shrink-0 ${
                  task.score > 0
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {task.score > 0 ? task.score : '—'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
