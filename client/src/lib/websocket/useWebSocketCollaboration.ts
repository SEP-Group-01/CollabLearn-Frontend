import { useState, useEffect, useCallback, useRef } from 'react';
import WebSocketCollaborationClient from './WebSocketCollaborationClient';
import type { CollaborationUser } from './WebSocketCollaborationClient';

export interface UseWebSocketCollaborationOptions {
  documentId: string;
  user: CollaborationUser;
  wsUrl?: string;
  autoConnect?: boolean;
  debounceMs?: number;
}

export interface UseWebSocketCollaborationReturn {
  content: string;
  collaborators: CollaborationUser[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendContentUpdate: (content: string) => void;
  sendCursorUpdate: (cursor: { anchor: number; head: number }) => void;
  sendAwarenessUpdate: (isActive: boolean) => void;
}

export const useWebSocketCollaboration = ({
  documentId,
  user,
  wsUrl,
  autoConnect = true,
  debounceMs = 300
}: UseWebSocketCollaborationOptions): UseWebSocketCollaborationReturn => {
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isConnected, setIsConnected] = useState(false);

  const clientRef = useRef<WebSocketCollaborationClient | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef('');

  // Handle connection status changes
  const handleConnectionStatusChange = useCallback((status: 'connecting' | 'connected' | 'disconnected') => {
    setConnectionStatus(status);
    setIsConnected(status === 'connected');
  }, []);

  // Handle content updates from other users
  const handleContentUpdate = useCallback((newContent: string, userId: string) => {
    console.log(`Content update from user ${userId}`);
    setContent(newContent);
    lastContentRef.current = newContent;
  }, []);

  // Handle users updates
  const handleUsersUpdate = useCallback((users: CollaborationUser[]) => {
    // Filter out the current user from collaborators list
    const otherUsers = users.filter(u => u.id !== user.id);
    setCollaborators(otherUsers);
  }, [user.id]);

  // Handle cursor updates
  const handleCursorUpdate = useCallback((userId: string, cursor: { anchor: number; head: number }) => {
    setCollaborators(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, cursor } : user
      )
    );
  }, []);

  // Connect to collaboration server
  const connect = useCallback(async (): Promise<void> => {
    if (clientRef.current) {
      return;
    }

    try {
      clientRef.current = new WebSocketCollaborationClient({
        documentId,
        user,
        wsUrl,
        onConnectionStatusChange: handleConnectionStatusChange,
        onContentUpdate: handleContentUpdate,
        onUsersUpdate: handleUsersUpdate,
        onCursorUpdate: handleCursorUpdate
      });

      await clientRef.current.connect();
      
      // Request initial user list after successful connection
      setTimeout(() => {
        if (clientRef.current) {
          clientRef.current.requestUserUpdate();
        }
      }, 500); // Small delay to ensure connection is fully established
      
    } catch (error) {
      console.error('Failed to connect to collaboration server:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
    }
  }, [documentId, user, wsUrl, handleConnectionStatusChange, handleContentUpdate, handleUsersUpdate, handleCursorUpdate]);

  // Disconnect from collaboration server
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setConnectionStatus('disconnected');
    setIsConnected(false);
    setCollaborators([]);
  }, []);

  // Send content update with debouncing
  const sendContentUpdate = useCallback((newContent: string) => {
    if (!clientRef.current || !isConnected) {
      return;
    }

    // Update local content immediately
    setContent(newContent);
    lastContentRef.current = newContent;

    // Debounce the server update
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (clientRef.current && isConnected) {
        clientRef.current.sendContentUpdate(newContent);
      }
    }, debounceMs);
  }, [isConnected, debounceMs]);

  // Send cursor update
  const sendCursorUpdate = useCallback((cursor: { anchor: number; head: number }) => {
    if (clientRef.current && isConnected) {
      clientRef.current.sendCursorUpdate(cursor);
    }
  }, [isConnected]);

  // Send awareness update
  const sendAwarenessUpdate = useCallback((isActive: boolean) => {
    if (clientRef.current && isConnected) {
      clientRef.current.sendAwarenessUpdate(isActive);
    }
  }, [isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []); // Empty dependency array - only run once on mount

  // Handle document ID changes - separate effect
  useEffect(() => {
    if (clientRef.current && autoConnect) {
      disconnect();
      setTimeout(connect, 100); // Small delay to ensure cleanup
    }
  }, [documentId]); // Only depend on documentId

  // Send awareness update when user becomes active/inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isActive = !document.hidden;
      sendAwarenessUpdate(isActive);
    };

    const handleFocus = () => sendAwarenessUpdate(true);
    const handleBlur = () => sendAwarenessUpdate(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [sendAwarenessUpdate]);

  return {
    content,
    collaborators,
    connectionStatus,
    isConnected,
    connect,
    disconnect,
    sendContentUpdate,
    sendCursorUpdate,
    sendAwarenessUpdate
  };
};