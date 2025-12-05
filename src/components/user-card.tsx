'use client';

import Image from 'next/image';
import { User } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCharacterByName, getCharacterInitials, getCharacterColor } from '@/lib/characters';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  isRevealed: boolean;
  isCurrentUser?: boolean;
}

export function UserCard({ user, isRevealed, isCurrentUser }: UserCardProps) {
  const character = getCharacterByName(user.character);
  const initials = getCharacterInitials(user.character);
  const bgColor = getCharacterColor(user.character);
  
  const showVote = isRevealed && user.hasVoted;
  const isOnBreak = user.vote === '☕';

  return (
    <div className="card-flip">
      <Card
        className={cn(
          'user-card relative p-4 flex flex-col items-center gap-2 border-2 transition-all duration-300 dark:bg-gray-800',
          user.hasVoted && !isRevealed && 'border-green-500',
          isCurrentUser && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900',
          !user.hasVoted && 'border-gray-200 dark:border-gray-700'
        )}
      >
        <div className={cn('card-flip-inner w-full', showVote && 'flipped')}>
          {/* Front - Avatar */}
          <div className="card-front flex flex-col items-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden shadow-md"
              style={{ backgroundColor: bgColor }}
            >
              {character?.image ? (
                <Image
                  src={character.image}
                  alt={user.character}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {initials}
                </span>
              )}
            </div>
            <p className="mt-2 font-medium text-sm sm:text-base text-center truncate w-full dark:text-gray-100">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center">
              {user.character}
            </p>
          </div>
          
          {/* Back - Vote */}
          <div className="card-back absolute inset-0 flex flex-col items-center justify-center p-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-md text-white"
              style={{ backgroundColor: bgColor }}
            >
              {user.vote}
            </div>
            <p className="mt-2 font-medium text-sm sm:text-base text-center truncate w-full dark:text-gray-100">
              {user.name}
            </p>
          </div>
        </div>

        {/* On Break Badge */}
        {isOnBreak && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 text-lg"
          >
            ☕
          </Badge>
        )}

        {/* Voted indicator (before reveal) */}
        {user.hasVoted && !isRevealed && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full" />
        )}
      </Card>
    </div>
  );
}
