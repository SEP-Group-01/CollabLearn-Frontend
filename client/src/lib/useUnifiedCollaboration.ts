import { useState, useEffect, useCallback, useRef } from 'react';
import { collaborationProvider } from './yjs/YjsProvider';
import { WebSocketCollaborationClient } from './websocket/WebSocketCollaborationClient';
import type { 
  CollaborationUser, 
  DocumentVersion, 
  ConnectionStatus, 
  CollaborationType, 
  UserPermission, 
  ExportFormat, 
  MediaType 
} from './types/collaboration';

// Get WebSocket URL from environment variable
const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const baseUrl = apiUrl.replace('/api', '');
  // Convert http/https to ws/wss
  return baseUrl.replace(/^http/, 'ws');
};

export interface UseUnifiedCollaborationOptions {
  documentId: string;
  user: CollaborationUser;
  initialContent?: string;
  autoConnect?: boolean;
  preferYjs?: boolean; // true for CRDT benefits
  wsUrl?: string;
}

export interface UseUnifiedCollaborationReturn {
  content: string;
  collaborators: CollaborationUser[];
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  collaborationType: CollaborationType;
  
  // Core functions
  connect: () => void;
  disconnect: () => void;
  updateContent: (content: string) => void;
  updateCursor: (anchor: number, head: number) => void;
  
  // Version control
  saveSnapshot: (label?: string) => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  getVersionHistory: () => Promise<DocumentVersion[]>;
  
  // Permissions
  checkPermission: (action: UserPermission) => boolean;
  updatePermissions: (userId: string, permission: UserPermission) => Promise<void>;
  
  // Export
  exportDocument: (format: ExportFormat) => Promise<Blob>;
  
  // Media
  uploadMedia: (file: File) => Promise<string>;
  insertMedia: (url: string, type: MediaType) => void;
}

// Remove the duplicate DocumentVersion interface since it's now in shared types

export const useUnifiedCollaboration = ({
  documentId,
  user,
  initialContent = '',
  autoConnect = true,
  preferYjs = true,
  wsUrl = getWsUrl()
}: UseUnifiedCollaborationOptions): UseUnifiedCollaborationReturn => {
  // State
  const [content, setContent] = useState(initialContent);
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isConnected, setIsConnected] = useState(false);
  const [collaborationType, setCollaborationType] = useState<CollaborationType>('none');
  const [userPermissions, setUserPermissions] = useState<Record<string, string>>({});

  // Refs
  const yjsConnectionRef = useRef<any>(null);
  const wsClientRef = useRef<WebSocketCollaborationClient | null>(null);
  const userRef = useRef(user);

  // Update user ref when user changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Unified event handlers
  const handleDocumentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleUsersUpdate = useCallback((users: CollaborationUser[]) => {
    setCollaborators(users);
  }, []);

  const handleConnectionStatusChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
    setIsConnected(status === 'connected');
  }, []);

  // Connect with fallback strategy
  const connect = useCallback(async () => {
    if (yjsConnectionRef.current || wsClientRef.current) {
      return; // Already connected
    }

    setConnectionStatus('connecting');

    try {
      if (preferYjs) {
        // Try Yjs first
        try {
          yjsConnectionRef.current = collaborationProvider.connectToDocument(
            documentId,
            userRef.current,
            handleDocumentUpdate,
            handleUsersUpdate,
            handleConnectionStatusChange
          );
          
          setCollaborationType('yjs');
          
          if (initialContent) {
            collaborationProvider.applyTextChange(documentId, initialContent);
          }
          
          console.log('Connected using Yjs CRDT');
          return;
        } catch (yjsError) {
          console.warn('Yjs connection failed, falling back to WebSocket:', yjsError);
          yjsConnectionRef.current = null;
        }
      }

      // Fallback to WebSocket
      wsClientRef.current = new WebSocketCollaborationClient({
        documentId,
        user: userRef.current,
        wsUrl,
        onConnectionStatusChange: handleConnectionStatusChange,
        onContentUpdate: handleDocumentUpdate,
        onUsersUpdate: handleUsersUpdate,
        onCursorUpdate: (userId: string, cursor: { anchor: number; head: number }) => {
          setCollaborators(prev => 
            prev.map(collab => 
              collab.id === userId ? { ...collab, cursor } : collab
            )
          );
        }
      });

      await wsClientRef.current.connect();
      setCollaborationType('websocket');
      console.log('Connected using WebSocket');

    } catch (error) {
      console.error('All connection methods failed:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
      setCollaborationType('none');
    }
  }, [documentId, initialContent, preferYjs, wsUrl, handleDocumentUpdate, handleUsersUpdate, handleConnectionStatusChange]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (yjsConnectionRef.current) {
      collaborationProvider.disconnectFromDocument(documentId);
      yjsConnectionRef.current = null;
    }
    
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
      wsClientRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setIsConnected(false);
    setCollaborationType('none');
    setCollaborators([]);
  }, [documentId]);

  // Update content
  const updateContent = useCallback((newContent: string) => {
    if (!isConnected) {
      setContent(newContent);
      return;
    }

    if (collaborationType === 'yjs' && yjsConnectionRef.current) {
      collaborationProvider.applyTextChange(documentId, newContent);
    } else if (collaborationType === 'websocket' && wsClientRef.current) {
      wsClientRef.current.sendContentUpdate(newContent);
    } else {
      setContent(newContent);
    }
  }, [documentId, isConnected, collaborationType]);

  // Update cursor
  const updateCursor = useCallback((anchor: number, head: number) => {
    if (!isConnected) return;

    if (collaborationType === 'yjs' && yjsConnectionRef.current) {
      collaborationProvider.updateCursor(documentId, anchor, head);
    } else if (collaborationType === 'websocket' && wsClientRef.current) {
      wsClientRef.current.sendCursorUpdate({ anchor, head });
    }
  }, [documentId, isConnected, collaborationType]);

  // Version control functions
  const saveSnapshot = useCallback(async (label?: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          label,
          userId: user.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to save snapshot');
      console.log('Snapshot saved successfully');
    } catch (error) {
      console.error('Failed to save snapshot:', error);
      throw error;
    }
  }, [content, documentId, user.id]);

  const restoreVersion = useCallback(async (versionId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/versions/${versionId}/restore`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to restore version');
      
      const { content: restoredContent } = await response.json();
      updateContent(restoredContent);
    } catch (error) {
      console.error('Failed to restore version:', error);
      throw error;
    }
  }, [documentId, updateContent]);

  const getVersionHistory = useCallback(async (): Promise<DocumentVersion[]> => {
    try {
      const response = await fetch(`/api/documents/${documentId}/versions`);
      if (!response.ok) throw new Error('Failed to get version history');
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get version history:', error);
      return [];
    }
  }, [documentId]);

  // Permission functions
  const checkPermission = useCallback((action: UserPermission): boolean => {
    const userPermission = userPermissions[user.id] || 'read';
    
    switch (action) {
      case 'read':
        return ['read', 'write', 'admin'].includes(userPermission);
      case 'write':
        return ['write', 'admin'].includes(userPermission);
      case 'admin':
        return userPermission === 'admin';
      default:
        return false;
    }
  }, [userPermissions, user.id]);

  const updatePermissions = useCallback(async (userId: string, permission: UserPermission) => {
    if (!checkPermission('admin')) {
      throw new Error('Insufficient permissions to update user permissions');
    }

    try {
      const response = await fetch(`/api/documents/${documentId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, permission })
      });
      
      if (!response.ok) throw new Error('Failed to update permissions');
      
      setUserPermissions(prev => ({ ...prev, [userId]: permission }));
    } catch (error) {
      console.error('Failed to update permissions:', error);
      throw error;
    }
  }, [documentId, checkPermission]);

  // Export functions
  const exportDocument = useCallback(async (format: ExportFormat): Promise<Blob> => {
    try {
      const response = await fetch(`/api/documents/${documentId}/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) throw new Error(`Failed to export as ${format}`);
      
      return await response.blob();
    } catch (error) {
      console.error(`Failed to export as ${format}:`, error);
      throw error;
    }
  }, [documentId, content]);

  // Media functions
  const uploadMedia = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentId', documentId);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload media');
      
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Failed to upload media:', error);
      throw error;
    }
  }, [documentId]);

  const insertMedia = useCallback((url: string, type: MediaType) => {
    let mediaHtml = '';
    
    switch (type) {
      case 'image':
        mediaHtml = `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        break;
      case 'video':
        mediaHtml = `<video src="${url}" controls style="max-width: 100%; height: auto;"></video>`;
        break;
      case 'file':
        mediaHtml = `<a href="${url}" target="_blank">📎 Attachment</a>`;
        break;
    }
    
    const currentContent = content;
    const newContent = currentContent + '\n' + mediaHtml;
    updateContent(newContent);
  }, [content, updateContent]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !yjsConnectionRef.current && !wsClientRef.current) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Handle document ID changes
  useEffect(() => {
    if (yjsConnectionRef.current || wsClientRef.current) {
      disconnect();
      if (autoConnect) {
        setTimeout(connect, 100);
      }
    }
  }, [documentId, disconnect, connect, autoConnect]);

  // Load permissions on mount
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/permissions`);
        if (response.ok) {
          const permissions = await response.json();
          setUserPermissions(permissions);
        }
      } catch (error) {
        console.error('Failed to load permissions:', error);
      }
    };

    loadPermissions();
  }, [documentId]);

  return {
    content,
    collaborators,
    connectionStatus,
    isConnected,
    collaborationType,
    connect,
    disconnect,
    updateContent,
    updateCursor,
    saveSnapshot,
    restoreVersion,
    getVersionHistory,
    checkPermission,
    updatePermissions,
    exportDocument,
    uploadMedia,
    insertMedia
  };
};