import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getAccessToken } from '../../api/authApi';
import type { ImageMetadata } from '../imageUtils';

// Get WebSocket URL from environment variable
const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const baseUrl = apiUrl.replace('/api', '');
  // Convert http/https to ws/wss
  return baseUrl.replace(/^http/, 'ws');
};

export interface YjsConnection {
  doc: Y.Doc;
  provider: WebsocketProvider;
  text: Y.Text;
  images: Y.Map<ImageMetadata>; // Store image metadata
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

// Image-related event handlers
export interface ImageEventHandlers {
  onImageAdded?: (imageMetadata: ImageMetadata) => void;
  onImageRemoved?: (imageId: string) => void;
  onImageUpdated?: (imageMetadata: ImageMetadata) => void;
}

export class YjsCollaborationProvider {
  private connections: Map<string, YjsConnection> = new Map();
  private wsUrl: string;

  constructor(wsUrl: string = getWsUrl()) {
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
    onConnectionStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void,
    imageHandlers?: ImageEventHandlers
  ): YjsConnection {
    // Check if already connected to this document
    if (this.connections.has(documentId)) {
      return this.connections.get(documentId)!;
    }

    // Create new Yjs document
    const doc = new Y.Doc();
    const text = doc.getText('content');
    const images = doc.getMap<ImageMetadata>('images'); // Store image metadata

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

    // Handle image metadata updates
    images.observe((event) => {
      if (imageHandlers) {
        event.changes.keys.forEach((change, key) => {
          if (change.action === 'add' && imageHandlers.onImageAdded) {
            const imageMetadata = images.get(key);
            if (imageMetadata) {
              imageHandlers.onImageAdded(imageMetadata);
            }
          } else if (change.action === 'delete' && imageHandlers.onImageRemoved) {
            imageHandlers.onImageRemoved(key);
          } else if (change.action === 'update' && imageHandlers.onImageUpdated) {
            const imageMetadata = images.get(key);
            if (imageMetadata) {
              imageHandlers.onImageUpdated(imageMetadata);
            }
          }
        });
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
      images,
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

  /**
   * Add image metadata to the document
   */
  addImage(documentId: string, imageMetadata: ImageMetadata): void {
    const connection = this.connections.get(documentId);
    if (connection) {
      connection.images.set(imageMetadata.id, imageMetadata);
    }
  }

  /**
   * Remove image metadata from the document
   */
  removeImage(documentId: string, imageId: string): void {
    const connection = this.connections.get(documentId);
    if (connection) {
      connection.images.delete(imageId);
    }
  }

  /**
   * Update image metadata in the document
   */
  updateImage(documentId: string, imageMetadata: ImageMetadata): void {
    const connection = this.connections.get(documentId);
    if (connection) {
      connection.images.set(imageMetadata.id, imageMetadata);
    }
  }

  /**
   * Get all images in the document
   */
  getImages(documentId: string): ImageMetadata[] {
    const connection = this.connections.get(documentId);
    if (!connection) return [];
    
    const images: ImageMetadata[] = [];
    connection.images.forEach((imageMetadata) => {
      images.push(imageMetadata);
    });
    
    return images;
  }

  /**
   * Get a specific image by ID
   */
  getImage(documentId: string, imageId: string): ImageMetadata | null {
    const connection = this.connections.get(documentId);
    if (!connection) return null;
    
    return connection.images.get(imageId) || null;
  }

  /**
   * Insert image at specific position in text content
   */
  insertImageAtPosition(
    documentId: string, 
    imageMetadata: ImageMetadata, 
    position: number,
    imageHtml?: string
  ): void {
    const connection = this.connections.get(documentId);
    if (!connection) return;
    
    // Add image metadata to shared state
    connection.images.set(imageMetadata.id, imageMetadata);
    
    // Insert image HTML into text content if provided
    if (imageHtml) {
      connection.text.insert(position, imageHtml);
    }
  }

  /**
   * Replace image content in the document
   */
  replaceImageInContent(
    documentId: string,
    oldImageId: string,
    newImageMetadata: ImageMetadata,
    newImageHtml: string
  ): void {
    const connection = this.connections.get(documentId);
    if (!connection) return;
    
    // Update image metadata
    connection.images.delete(oldImageId);
    connection.images.set(newImageMetadata.id, newImageMetadata);
    
    // Find and replace in text content
    const content = connection.text.toString();
    const oldImagePattern = new RegExp(`<img[^>]*data-yjs-image-id="${oldImageId}"[^>]*>`, 'g');
    const newContent = content.replace(oldImagePattern, newImageHtml);
    
    if (newContent !== content) {
      connection.text.delete(0, connection.text.length);
      connection.text.insert(0, newContent);
    }
  }
}

// Create singleton instance
export const collaborationProvider = new YjsCollaborationProvider();