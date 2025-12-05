'use client';

import { User, VoteValue } from '@/types';
import { Card } from '@/components/ui/card';

interface VoteResultsProps {
  users: User[];
}

const NUMERIC_VOTES: VoteValue[] = ['1', '2', '3', '5', '8'];

export function VoteResults({ users }: VoteResultsProps) {
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
      <h3 className="font-semibold text-lg dark:text-gray-100">Results</h3>
      
      {/* Consensus celebration */}
      {hasConsensus && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3 text-center">
          <p className="text-green-800 dark:text-green-300 font-semibold text-lg">
            🎉 Consensus reached! Everyone voted {uniqueVotes[0]}
          </p>
        </div>
      )}

      {/* Vote distribution */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vote Distribution:</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(voteDistribution).map(([vote, count]) => (
            <div
              key={vote}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <span className="text-xl font-bold dark:text-gray-100">{vote}</span>
              <span className="text-gray-600 dark:text-gray-300">
                {count} vote{count !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Average */}
      {numericVotes.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
          <p className="text-sm text-blue-600 dark:text-blue-400">Average</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {average.toFixed(1)}
          </p>
        </div>
      )}

      {/* Special votes */}
      {(breakUsers.length > 0 || unsureUsers.length > 0) && (
        <div className="border-t dark:border-gray-700 pt-3 space-y-2">
          {breakUsers.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ☕ On break: {breakUsers.map((u) => u.name).join(', ')}
            </p>
          )}
          {unsureUsers.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ❓ Unsure: {unsureUsers.map((u) => u.name).join(', ')}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
