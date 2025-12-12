'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { ServerToClientEvents, ClientToServerEvents } from '@/types';

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = connectSocket();
    socketRef.current = socketInstance;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    // Set initial state synchronously before first render completes
    // Using a microtask to batch with React's internal updates
    queueMicrotask(() => {
      setSocket(socketInstance);
      setIsConnected(socketInstance.connected);
    });

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
    };
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  return { socket, isConnected, disconnect };
}
