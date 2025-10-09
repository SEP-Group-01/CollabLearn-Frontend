import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getAccessToken } from '../../api/authApi';

export interface YjsConnection {
  doc: Y.Doc;
  provider: WebsocketProvider;
  text: Y.Text;
  awareness: any;
  disconnect: () => void;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isActive: boolean;
  cursor?: {
    anchor: number;
    head: number;
  };
}

export class YjsCollaborationProvider {
  private connections: Map<string, YjsConnection> = new Map();
  private wsUrl: string;

  constructor(wsUrl: string = 'ws://localhost:3000') {
    this.wsUrl = wsUrl;
  }

  /**
   * Connect to a document for real-time collaboration
   */
  connectToDocument(
    documentId: string, 
    user: CollaborationUser,
    onDocumentUpdate?: (content: string) => void,
    onUsersUpdate?: (users: CollaborationUser[]) => void,
    onConnectionStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void
  ): YjsConnection {
    // Check if already connected to this document
    if (this.connections.has(documentId)) {
      return this.connections.get(documentId)!;
    }

    // Create new Yjs document
    const doc = new Y.Doc();
    const text = doc.getText('content');

    // Get auth token for WebSocket connection
    const token = getAccessToken();
    
    // Create WebSocket provider with authentication
    const provider = new WebsocketProvider(
      this.wsUrl,
      `document-${documentId}`,
      doc,
      {
        // Add authentication parameters
        params: {
          token: token || '',
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
        },
        // Connection event handlers
        connect: true,
        resyncInterval: 5000, // Resync every 5 seconds if connection is lost
      }
    );

    // Set up awareness (user presence)
    const awareness = provider.awareness;
    awareness.setLocalStateField('user', {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      color: user.color,
      isActive: true, // User is active when they connect
    });

    // Handle connection status changes
    provider.on('status', (event: { status: string }) => {
      let status: 'connecting' | 'connected' | 'disconnected';
      
      switch (event.status) {
        case 'connecting':
          status = 'connecting';
          break;
        case 'connected':
          status = 'connected';
          break;
        case 'disconnected':
          status = 'disconnected';
          break;
        default:
          status = 'disconnected';
      }
      
      onConnectionStatusChange?.(status);
    });

    // Handle document content updates
    text.observe(() => {
      if (onDocumentUpdate) {
        const content = text.toString();
        onDocumentUpdate(content);
      }
    });

    // Handle awareness updates (users joining/leaving, cursor changes)
    awareness.on('update', () => {
      if (onUsersUpdate) {
        const users: CollaborationUser[] = [];
        awareness.getStates().forEach((state: any, clientId: number) => {
          if (state.user && clientId !== awareness.clientID) {
            users.push({
              id: state.user.id,
              name: state.user.name,
              avatar: state.user.avatar,
              color: state.user.color,
              isActive: state.user.isActive || true, // Default to active if not specified
              cursor: state.cursor,
            });
          }
        });
        onUsersUpdate(users);
      }
    });

    // Handle provider connection errors
    provider.on('connection-error', (error: any) => {
      console.error('YJS WebSocket connection error:', error);
      onConnectionStatusChange?.('disconnected');
    });

    // Create connection object
    const connection: YjsConnection = {
      doc,
      provider,
      text,
      awareness,
      disconnect: () => {
        provider.disconnect();
        doc.destroy();
        this.connections.delete(documentId);
      }
    };

    // Store connection
    this.connections.set(documentId, connection);

    return connection;
  }

  /**
   * Update user cursor position
   */
  updateCursor(documentId: string, anchor: number, head: number) {
    const connection = this.connections.get(documentId);
    if (connection) {
      connection.awareness.setLocalStateField('cursor', { anchor, head });
    }
  }

  /**
   * Apply text changes to the Yjs document
   */
  applyTextChange(documentId: string, content: string) {
    const connection = this.connections.get(documentId);
    if (connection) {
      const currentContent = connection.text.toString();
      if (currentContent !== content) {
        // Clear the text and insert new content
        connection.text.delete(0, connection.text.length);
        connection.text.insert(0, content);
      }
    }
  }

  /**
   * Get current document content
   */
  getDocumentContent(documentId: string): string {
    const connection = this.connections.get(documentId);
    return connection ? connection.text.toString() : '';
  }

  /**
   * Disconnect from a specific document
   */
  disconnectFromDocument(documentId: string) {
    const connection = this.connections.get(documentId);
    if (connection) {
      connection.disconnect();
    }
  }

  /**
   * Disconnect from all documents
   */
  disconnectAll() {
    this.connections.forEach((connection) => {
      connection.disconnect();
    });
    this.connections.clear();
  }

  /**
   * Check if connected to a document
   */
  isConnected(documentId: string): boolean {
    const connection = this.connections.get(documentId);
    return connection ? connection.provider.wsconnected : false;
  }

  /**
   * Get connection status for a document
   */
  getConnectionStatus(documentId: string): 'connecting' | 'connected' | 'disconnected' {
    const connection = this.connections.get(documentId);
    if (!connection) return 'disconnected';
    
    if (connection.provider.wsconnecting) return 'connecting';
    if (connection.provider.wsconnected) return 'connected';
    return 'disconnected';
  }
}

// Create singleton instance
export const collaborationProvider = new YjsCollaborationProvider();