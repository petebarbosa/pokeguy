'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import type {
  Session,
  User,
  Task,
  VoteValue,
  ServerToClientEvents,
  ClientToServerEvents,
} from '@/types';

interface UseSessionOptions {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  sessionCode: string;
  isAdmin: boolean;
}

export function useSession({ socket, sessionCode, isAdmin }: UseSessionOptions) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive currentUser from session
  const currentUser = useMemo(() => {
    if (!session || !socket?.id) return null;
    return session.users.find((u) => u.id === socket.id) || null;
  }, [session, socket?.id]);

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    function onSessionState(newSession: Session) {
      setSession(newSession);
      setIsLoading(false);
    }

    function onSessionEnded() {
      setSessionEnded(true);
    }

    function onUserJoined(user: User) {
      setSession((prev) => {
        if (!prev) return prev;
        // Check if user already exists (avoid duplicates)
        if (prev.users.some((u) => u.id === user.id)) return prev;
        return { ...prev, users: [...prev.users, user] };
      });
    }

    function onUserLeft(userId: string) {
      setSession((prev) => {
        if (!prev) return prev;
        return { ...prev, users: prev.users.filter((u) => u.id !== userId) };
      });
    }

    function onUserVoted(userId: string) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === userId ? { ...u, hasVoted: true } : u
          ),
        };
      });
    }

    function onUserNameChanged(userId: string, newName: string) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === userId ? { ...u, name: newName } : u
          ),
        };
      });
    }

    function onTaskCreated(task: Task) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentTask: task,
          isVotingActive: true,
          isRevealed: false,
        };
      });
    }

    function onVotesRevealed() {
      setSession((prev) => {
        if (!prev) return prev;
        return { ...prev, isRevealed: true };
      });
    }

    function onError(message: string) {
      setError(message);
    }

    socket.on('session:state', onSessionState);
    socket.on('session:ended', onSessionEnded);
    socket.on('user:joined', onUserJoined);
    socket.on('user:left', onUserLeft);
    socket.on('user:voted', onUserVoted);
    socket.on('user:name-changed', onUserNameChanged);
    socket.on('task:created', onTaskCreated);
    socket.on('votes:revealed', onVotesRevealed);
    socket.on('error', onError);

    return () => {
      socket.off('session:state', onSessionState);
      socket.off('session:ended', onSessionEnded);
      socket.off('user:joined', onUserJoined);
      socket.off('user:left', onUserLeft);
      socket.off('user:voted', onUserVoted);
      socket.off('user:name-changed', onUserNameChanged);
      socket.off('task:created', onTaskCreated);
      socket.off('votes:revealed', onVotesRevealed);
      socket.off('error', onError);
    };
  }, [socket]);

  // Create session (admin only)
  const createSession = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }
      socket.emit('session:create', (code: string) => {
        resolve(code);
      });
    });
  }, [socket]);

  // Join session
  const joinSession = useCallback(
    (name: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!socket) {
          setError('Socket not connected');
          resolve(false);
          return;
        }
        socket.emit(
          'session:join',
          sessionCode,
          name,
          (success: boolean, errorMsg?: string) => {
            if (success) {
              // Store name in localStorage for reconnection
              localStorage.setItem(`pokeguy-name-${sessionCode}`, name);
              setError(null);
            } else {
              setError(errorMsg || 'Failed to join session');
            }
            setIsLoading(false);
            resolve(success);
          }
        );
      });
    },
    [socket, sessionCode]
  );

  // Rejoin session
  const rejoinSession = useCallback(
    (name: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!socket) {
          resolve(false);
          return;
        }
        socket.emit(
          'session:rejoin',
          sessionCode,
          name,
          (success: boolean, _user?: User) => {
            if (success) {
              setError(null);
            }
            setIsLoading(false);
            resolve(success);
          }
        );
      });
    },
    [socket, sessionCode]
  );

  // Vote
  const vote = useCallback(
    (value: VoteValue) => {
      if (!socket) return;
      socket.emit('user:vote', value);
      // Optimistically update local state
      setSession((prev) => {
        if (!prev || !socket?.id) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === socket.id
              ? { ...u, vote: value, hasVoted: true, isOnBreak: value === '☕' }
              : u
          ),
        };
      });
    },
    [socket]
  );

  // Change name
  const changeName = useCallback(
    (newName: string) => {
      if (!socket) return;
      socket.emit('user:change-name', newName);
      // Update localStorage
      localStorage.setItem(`pokeguy-name-${sessionCode}`, newName);
      // Optimistically update local state
      setSession((prev) => {
        if (!prev || !socket?.id) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === socket.id ? { ...u, name: newName } : u
          ),
        };
      });
    },
    [socket, sessionCode]
  );

  // Admin: Create task
  const createTask = useCallback(
    (title: string) => {
      if (!socket || !isAdmin) return;
      socket.emit('admin:create-task', title);
    },
    [socket, isAdmin]
  );

  // Admin: Reveal votes
  const revealVotes = useCallback(() => {
    if (!socket || !isAdmin) return;
    socket.emit('admin:reveal-votes');
  }, [socket, isAdmin]);

  // Admin: New task
  const newTask = useCallback(() => {
    if (!socket || !isAdmin) return;
    socket.emit('admin:new-task');
  }, [socket, isAdmin]);

  return {
    session,
    currentUser,
    isLoading,
    error,
    sessionEnded,
    createSession,
    joinSession,
    rejoinSession,
    vote,
    changeName,
    createTask,
    revealVotes,
    newTask,
  };
}
