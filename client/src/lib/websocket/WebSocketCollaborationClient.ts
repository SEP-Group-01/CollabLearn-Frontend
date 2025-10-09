import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../../api/authApi';

export interface CollaborationMessage {
  type: 'join' | 'leave' | 'content-update' | 'cursor-update' | 'user-update' | 'awareness-update';
  documentId: string;
  userId: string;
  data?: any;
  timestamp?: number;
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

export interface WebSocketCollaborationOptions {
  documentId: string;
  user: CollaborationUser;
  wsUrl?: string;
  onConnectionStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void;
  onContentUpdate?: (content: string, userId: string) => void;
  onUsersUpdate?: (users: CollaborationUser[]) => void;
  onCursorUpdate?: (userId: string, cursor: { anchor: number; head: number }) => void;
}

export class WebSocketCollaborationClient {
  private socket: Socket | null = null;
  private documentId: string;
  private user: CollaborationUser;
  private wsUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  
  // Event handlers
  private onConnectionStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void;
  private onContentUpdate?: (content: string, userId: string) => void;
  private onUsersUpdate?: (users: CollaborationUser[]) => void;
  private onCursorUpdate?: (userId: string, cursor: { anchor: number; head: number }) => void;

  constructor({
    documentId,
    user,
    wsUrl = 'http://localhost:3000',
    onConnectionStatusChange,
    onContentUpdate,
    onUsersUpdate,
    onCursorUpdate
  }: WebSocketCollaborationOptions) {
    this.documentId = documentId;
    this.user = user;
    this.wsUrl = wsUrl;
    this.onConnectionStatusChange = onConnectionStatusChange;
    this.onContentUpdate = onContentUpdate;
    this.onUsersUpdate = onUsersUpdate;
    this.onCursorUpdate = onCursorUpdate;
  }

  /**
   * Connect to the collaboration WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        return;
      }

      this.isConnecting = true;
      this.onConnectionStatusChange?.('connecting');

      try {
        // Get authentication token
        const token = getAccessToken();
        
        // Create Socket.IO connection with authentication
        this.socket = io(`${this.wsUrl}/collaboration`, {
          query: {
            documentId: this.documentId,
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            userColor: this.user.color,
            token: token || '',
          },
          transports: ['websocket'],
          forceNew: true,
        });

        console.log('🔗 Attempting Socket.IO connection to:', `${this.wsUrl}/collaboration`);

        this.socket.on('connect', () => {
          console.log('✅ Socket.IO connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.onConnectionStatusChange?.('connected');
          
          // Join the document room
          this.socket?.emit('document:join', {
            documentId: this.documentId,
            userId: this.user.id,
          });
          
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('❌ Socket.IO disconnected:', reason);
          this.isConnecting = false;
          this.onConnectionStatusChange?.('disconnected');
          
          // Auto-reconnect if not manually disconnected
          if (reason !== 'io client disconnect' && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket.IO connection error:', error);
          this.isConnecting = false;
          this.onConnectionStatusChange?.('disconnected');
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          } else {
            reject(error);
          }
        });

        // Listen for collaboration events
        this.socket.on('collaboration-event', (message) => {
          this.handleMessage(message);
        });

        // Listen for specific events
        this.socket.on('document:joined', (data) => {
          console.log('✅ Joined document successfully:', data);
        });

        this.socket.on('error', (error) => {
          console.error('❌ Socket.IO error:', error);
        });

      } catch (error) {
        this.isConnecting = false;
        this.onConnectionStatusChange?.('disconnected');
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the collaboration server
   */
  disconnect(): void {
    if (this.socket) {
      // Send leave message before closing
      this.socket.emit('document:leave', {
        documentId: this.documentId,
        userId: this.user.id,
        timestamp: Date.now()
      });

      this.socket.disconnect();
      this.socket = null;
    }
    
    this.onConnectionStatusChange?.('disconnected');
  }

  /**
   * Send content update to other collaborators
   */
  sendContentUpdate(content: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('collaboration-event', {
        type: 'content-update',
        documentId: this.documentId,
        userId: this.user.id,
        data: { content },
        timestamp: Date.now()
      });
    }
  }

  /**
   * Send cursor position update
   */
  sendCursorUpdate(cursor: { anchor: number; head: number }): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('collaboration-event', {
        type: 'cursor-update',
        documentId: this.documentId,
        userId: this.user.id,
        data: { cursor },
        timestamp: Date.now()
      });
    }
  }

  /**
   * Send awareness update (user presence)
   */
  sendAwarenessUpdate(isActive: boolean): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('collaboration-event', {
        type: 'awareness-update',
        documentId: this.documentId,
        userId: this.user.id,
        data: { 
          user: { ...this.user, isActive }
        },
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.socket && this.socket.connected) return 'connected';
    return 'disconnected';
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: CollaborationMessage): void {
    // Don't process messages from self
    if (message.userId === this.user.id) {
      return;
    }

    switch (message.type) {
      case 'content-update':
        if (message.data?.content && this.onContentUpdate) {
          this.onContentUpdate(message.data.content, message.userId);
        }
        break;

      case 'cursor-update':
        if (message.data?.cursor && this.onCursorUpdate) {
          this.onCursorUpdate(message.userId, message.data.cursor);
        }
        break;

      case 'user-update':
        if (message.data?.users && this.onUsersUpdate) {
          this.onUsersUpdate(message.data.users);
        }
        break;

      case 'awareness-update':
        // Handle user presence updates
        console.log('User awareness update:', message.data);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Attempt to reconnect to the server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }
}

export default WebSocketCollaborationClient;