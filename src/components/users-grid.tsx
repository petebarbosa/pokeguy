'use client';

import { User } from '@/types';
import { UserCard } from './user-card';

interface UsersGridProps {
  users: User[];
  isRevealed: boolean;
  currentUserId?: string;
}

export function UsersGrid({ users, isRevealed, currentUserId }: UsersGridProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No users yet</p>
        <p className="text-sm">Share the link to invite others</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isRevealed={isRevealed}
          isCurrentUser={user.id === currentUserId}
        />
      ))}
    </div>
  );
}
