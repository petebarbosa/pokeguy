'use client';

import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';
import { ServerToClientEvents, ClientToServerEvents } from '@/types';

export function useSocket() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = connectSocket();
    setSocket(socketInstance);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    // Set initial connection status
    setIsConnected(socketInstance.connected);

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
