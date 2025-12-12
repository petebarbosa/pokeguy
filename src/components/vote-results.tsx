'use client';

import { User } from '@/types';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/i18n/context';

interface VoteResultsProps {
  users: User[];
}

const NUMERIC_VOTES = ['1', '2', '3', '5', '8'] as const;
const NUMERIC_VALUES = [1, 2, 3, 5, 8] as const;

// Rounds a number to the nearest valid vote option
function roundToNearestVoteOption(value: number): number {
  if (value <= 0) return 1;
  
  let closest: (typeof NUMERIC_VALUES)[number] = NUMERIC_VALUES[0];
  let minDiff = Math.abs(value - closest);
  
  for (const option of NUMERIC_VALUES) {
    const diff = Math.abs(value - option);
    if (diff < minDiff) {
      minDiff = diff;
      closest = option;
    }
  }
  
  return closest;
}

export function VoteResults({ users }: VoteResultsProps) {
  const { t } = useTranslations();

  // Filter out users who didn't vote or are on break
  const votingUsers = users.filter(
    (u) => u.hasVoted && u.vote !== '☕' && u.vote !== '❓' && u.vote !== null
  );
  
  const breakUsers = users.filter((u) => u.vote === '☕');
  const unsureUsers = users.filter((u) => u.vote === '❓');

  // Calculate vote distribution
  const voteDistribution = NUMERIC_VOTES.reduce((acc, vote) => {
    if (vote === null) return acc;
    const count = votingUsers.filter((u) => u.vote === vote).length;
    if (count > 0) {
      acc[vote] = count;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate average
  const numericVotes = votingUsers
    .map((u) => parseInt(u.vote as string, 10))
    .filter((n) => !isNaN(n));
  
  const average =
    numericVotes.length > 0
      ? numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length
      : 0;

  // Check for consensus
  const uniqueVotes = [...new Set(votingUsers.map((u) => u.vote))];
  const hasConsensus = uniqueVotes.length === 1 && votingUsers.length > 0;

  return (
    <Card className="p-4 space-y-4 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-semibold text-lg dark:text-gray-100">{t('voteResults.title')}</h3>
      
      {/* Consensus celebration */}
      {hasConsensus && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3 text-center">
          <p className="text-green-800 dark:text-green-300 font-semibold text-lg">
            {t('voteResults.consensusReached', { vote: String(uniqueVotes[0]) })}
          </p>
        </div>
      )}

      {/* Vote distribution */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {t('voteResults.voteDistribution')}
        </p>
        <div className="flex justify-around items-end gap-2 pt-4 h-40 rounded-lg bg-gray-50 dark:bg-gray-900/50 px-2">
          {NUMERIC_VOTES.map((vote) => {
            const count = voteDistribution[vote] || 0;
            const maxCount = Math.max(...Object.values(voteDistribution), 1);
            // Use pixel values: max bar height is 100px, minimum is 4px for empty
            const maxBarHeight = 100;
            const barHeight = count > 0 
              ? Math.max((count / maxCount) * maxBarHeight, 8) 
              : 4;

            return (
              <div key={vote} className="flex flex-col items-center gap-1 w-10 text-center">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{count}</div>
                <div
                  className="w-full bg-blue-400 dark:bg-blue-600 rounded-t-md hover:bg-blue-500 dark:hover:bg-blue-500 transition-all"
                  style={{ height: `${barHeight}px` }}
                />
                <div className="text-sm font-semibold dark:text-gray-200">{vote}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Average */}
      {numericVotes.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
          <p className="text-sm text-blue-600 dark:text-blue-400">{t('voteResults.average')}</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {roundToNearestVoteOption(average)}
          </p>
        </div>
      )}

      {/* Special votes */}
      {(breakUsers.length > 0 || unsureUsers.length > 0) && (
        <div className="border-t dark:border-gray-700 pt-3 space-y-2">
          {breakUsers.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('voteResults.onBreak', { names: breakUsers.map((u) => u.name).join(', ') })}
            </p>
          )}
          {unsureUsers.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('voteResults.unsure', { names: unsureUsers.map((u) => u.name).join(', ') })}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
