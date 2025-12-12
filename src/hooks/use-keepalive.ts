'use client';

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types';

const KEEPALIVE_INTERVAL = 60 * 1000;

interface UseKeepaliveOptions {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
}

export function useKeepalive({ socket, isConnected }: UseKeepaliveOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      socket.emit('keepalive:ping');
    }, KEEPALIVE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [socket, isConnected]);
}
