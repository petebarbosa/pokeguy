'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/use-socket';
import { useSession } from '@/hooks/use-session';
import { useKeepalive } from '@/hooks/use-keepalive';
import { JoinModal } from '@/components/join-modal';
import { UsersGrid } from '@/components/users-grid';
import { VotingPanel } from '@/components/voting-panel';
import { TaskDisplay } from '@/components/task-display';
import { AdminControls } from '@/components/admin-controls';
import { VoteResults } from '@/components/vote-results';
import { SessionEndedModal } from '@/components/session-ended-modal';
import { ChangeNameModal } from '@/components/change-name-modal';
import { TaskHistory } from '@/components/task-history';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { triggerFireworks } from '@/components/fireworks';
import { useTranslations } from '@/i18n/context';
import Image from 'next/image';

interface SessionPageProps {
  params: Promise<{ code: string; locale: string }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { code: sessionCode } = use(params);
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const { t } = useTranslations();

  const { socket, isConnected } = useSocket();
  useKeepalive({ socket, isConnected });
  const {
    session,
    currentUser,
    error,
    sessionEnded,
    joinSession,
    rejoinSession,
    vote,
    changeName,
    createTask,
    revealVotes,
    newTask,
  } = useSession({ socket, sessionCode, isAdmin });

  // Join flow state: 'idle' -> 'checking' -> 'show_modal' | 'joined'
  const [joinState, setJoinState] = useState<'idle' | 'checking' | 'show_modal' | 'joined'>('idle');
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const prevRevealedRef = useRef(false);
  const rejoinAttemptedRef = useRef(false);

  // Handle initial connection and auto-rejoin attempt
  useEffect(() => {
    if (!isConnected || !socket || isAdmin || rejoinAttemptedRef.current) return;

    rejoinAttemptedRef.current = true;

    // Check for existing name in localStorage
    const savedName = localStorage.getItem(`pokeguy-name-${sessionCode}`);
    if (savedName) {
      rejoinSession(savedName).then((success) => {
        setJoinState(success ? 'joined' : 'show_modal');
      });
    } else {
      // Use queueMicrotask to batch state update and avoid synchronous setState warning
      queueMicrotask(() => setJoinState('show_modal'));
    }
  }, [isConnected, socket, isAdmin, sessionCode, rejoinSession]);

  // Derive whether join modal should be shown
  const showJoinModal = joinState === 'show_modal';

  // Trigger fireworks when votes are revealed
  useEffect(() => {
    if (session?.isRevealed && !prevRevealedRef.current) {
      triggerFireworks();
    }
    prevRevealedRef.current = session?.isRevealed ?? false;
  }, [session?.isRevealed]);

  // Handle join
  const handleJoin = async (name: string) => {
    setJoinError(null);

    const success = await joinSession(name);
    if (success) {
      setJoinState('joined');
    } else {
      setJoinError(error || t('joinModal.error'));
    }
    return success;
  };

  // Handle copy link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/session/${sessionCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.connecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Session Ended Modal */}
      <SessionEndedModal open={sessionEnded} />

      {/* Join Modal */}
      <JoinModal
        open={showJoinModal && !isAdmin}
        onJoin={handleJoin}
        error={joinError}
      />

      {/* Change Name Modal */}
      <ChangeNameModal
        open={showChangeNameModal}
        currentName={currentUser?.name || ''}
        onClose={() => setShowChangeNameModal(false)}
        onChangeName={changeName}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Image
                src="/family_guy.png"
                alt="Family Guy"
                width={28}
                height={28}
                className="inline-block"
              />
              {t('common.appName')}
            </h1>
            <Badge variant="outline" className="font-mono dark:border-gray-600 dark:text-gray-300">
              {sessionCode}
            </Badge>
            {isAdmin && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {t('common.admin')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {!isAdmin && currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChangeNameModal(true)}
              >
                {currentUser.name} ✏️
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="hidden sm:flex"
            >
              {copied ? `✓ ${t('common.copied')}` : t('session.copyLink')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="sm:hidden"
            >
              {copied ? '✓' : '📋'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-32 md:pb-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Task Display */}
          <TaskDisplay
            task={session?.currentTask || null}
            isVotingActive={session?.isVotingActive || false}
            isRevealed={session?.isRevealed || false}
          />

          {/* Admin Controls */}
          {isAdmin && (
            <AdminControls
              isVotingActive={session?.isVotingActive || false}
              isRevealed={session?.isRevealed || false}
              hasTask={!!session?.currentTask}
              onCreateTask={createTask}
              onRevealVotes={revealVotes}
              onNewTask={newTask}
            />
          )}

          {/* Vote Results (after reveal) */}
          {session?.isRevealed && session.users.length > 0 && (
            <VoteResults users={session.users} />
          )}

          {/* Users Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
              {t('session.participants')} ({session?.users.length || 0})
            </h3>
            <UsersGrid
              users={session?.users || []}
              isRevealed={session?.isRevealed || false}
              currentUserId={socket?.id}
            />
          </div>

          {/* Task History */}
          {session?.votedTasks && session.votedTasks.length > 0 && (
            <TaskHistory tasks={session.votedTasks} />
          )}
        </div>
      </main>

      {/* Voting Panel (users only) */}
      {!isAdmin && currentUser && (
        <VotingPanel
          currentVote={currentUser.vote}
          onVote={vote}
          disabled={!session?.isVotingActive || session?.isRevealed || false}
        />
      )}
    </div>
  );
}
