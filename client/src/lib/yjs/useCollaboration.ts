import { useState, useEffect, useCallback, useRef } from 'react';
import { collaborationProvider } from './YjsProvider';
import type { CollaborationUser } from './YjsProvider';

export interface UseCollaborationOptions {
  documentId: string;
  user: CollaborationUser;
  initialContent?: string;
  autoConnect?: boolean;
}

export interface UseCollaborationReturn {
  content: string;
  collaborators: CollaborationUser[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  updateContent: (content: string) => void;
  updateCursor: (anchor: number, head: number) => void;
}

export const useCollaboration = ({
  documentId,
  user,
  initialContent = '',
  autoConnect = true
}: UseCollaborationOptions): UseCollaborationReturn => {
  const [content, setContent] = useState(initialContent);
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isConnected, setIsConnected] = useState(false);
  
  const connectionRef = useRef<any>(null);
  const userRef = useRef(user);

  // Update user ref when user changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Handle document content updates from Yjs
  const handleDocumentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  // Handle collaborators updates
  const handleUsersUpdate = useCallback((users: CollaborationUser[]) => {
    setCollaborators(users);
  }, []);

  // Handle connection status changes
  const handleConnectionStatusChange = useCallback((status: 'connecting' | 'connected' | 'disconnected') => {
    setConnectionStatus(status);
    setIsConnected(status === 'connected');
  }, []);

  // Connect to document
  const connect = useCallback(() => {
    if (connectionRef.current) {
      return; // Already connected
    }

    try {
      setConnectionStatus('connecting');
      
      connectionRef.current = collaborationProvider.connectToDocument(
        documentId,
        userRef.current,
        handleDocumentUpdate,
        handleUsersUpdate,
        handleConnectionStatusChange
      );

      // Set initial content if provided
      if (initialContent) {
        collaborationProvider.applyTextChange(documentId, initialContent);
      }
    } catch (error) {
      console.error('Failed to connect to collaboration:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
    }
  }, [documentId, initialContent, handleDocumentUpdate, handleUsersUpdate, handleConnectionStatusChange]);

  // Disconnect from document
  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      collaborationProvider.disconnectFromDocument(documentId);
      connectionRef.current = null;
      setConnectionStatus('disconnected');
      setIsConnected(false);
      setCollaborators([]);
    }
  }, [documentId]);

  // Update document content
  const updateContent = useCallback((newContent: string) => {
    if (connectionRef.current && isConnected) {
      collaborationProvider.applyTextChange(documentId, newContent);
    } else {
      // If not connected, update local state
      setContent(newContent);
    }
  }, [documentId, isConnected]);

  // Update cursor position
  const updateCursor = useCallback((anchor: number, head: number) => {
    if (connectionRef.current && isConnected) {
      collaborationProvider.updateCursor(documentId, anchor, head);
    }
  }, [documentId, isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !connectionRef.current) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Handle document ID changes
  useEffect(() => {
    if (connectionRef.current) {
      disconnect();
      if (autoConnect) {
        setTimeout(connect, 100); // Small delay to ensure cleanup
      }
    }
  }, [documentId, disconnect, connect, autoConnect]);

  return {
    content,
    collaborators,
    connectionStatus,
    isConnected,
    connect,
    disconnect,
    updateContent,
    updateCursor
  };
};