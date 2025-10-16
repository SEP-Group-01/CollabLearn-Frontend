import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface MessageData {
  content: string;
  author: {
    id: string | number;
    name: string;
    role?: string;
  };
  timestamp?: string;
  image?: string;
}

interface ReplyData {
  content: string;
  author: {
    id: string | number;
    name: string;
    role?: string;
  };
  timestamp?: string;
}

interface UseForumWebSocketProps {
  workspaceId: string;
  onNewMessage: (message: MessageData) => void;
  onNewReply: (data: { messageId: string; reply: ReplyData }) => void;
  onUserJoined: (data: { userId: string; userName: string }) => void;
  onUserLeft: (data: { userId: string; userName: string }) => void;
}

interface UseForumWebSocketReturn {
  isConnected: boolean;
  sendMessage: (messageData: Partial<MessageData>) => void;
  sendReply: (messageId: string, replyData: Partial<ReplyData>) => void;
  sendTyping: (isTyping: boolean) => void;
}

export const useForumWebSocket = ({
  workspaceId,
  onNewMessage,
  onNewReply,
  onUserJoined,
  onUserLeft
}: UseForumWebSocketProps): UseForumWebSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('✅ WebSocket already connected');
      return;
    }

    // Clean up existing connection
    if (socketRef.current) {
      console.log('🧹 Cleaning up existing socket connection');
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log('🔌 Attempting to connect to WebSocket server (API Gateway)...');
    
    // Get authentication token (using correct key from authApi)
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ No authentication token found');
      console.log('🔍 Checking all auth keys:', {
        access_token: !!localStorage.getItem('access_token'),
        accessToken: !!localStorage.getItem('accessToken'),
        user_data: !!localStorage.getItem('user_data')
      });
      return;
    }
    
    console.log('✅ Authentication token found');

    // Create socket connection to API Gateway (port 3000), NOT forum service (port 3003)
    socketRef.current = io('http://localhost:3000/forum', {
      transports: ['polling', 'websocket'], // Try polling first, then upgrade
      timeout: 15000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      auth: {
        token
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      },
      forceNew: true
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully', {
        socketId: socket.id,
        transport: socket.io.engine.transport.name
      });
      setIsConnected(true);
      
      // Join the workspace forum room (send as groupId to match backend interface)
      console.log(`📡 Joining workspace forum: ${workspaceId}`);
      
      // Get user ID from stored user data
      const userData = localStorage.getItem('user_data');
      let userId = 'unknown';
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || 'unknown';
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      socket.emit('join-group', { 
        groupId: workspaceId,
        userId: userId
      });
      
      // Listen for join confirmation
      socket.on('group-joined', (data) => {
        console.log('✅ Successfully joined workspace forum:', data);
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('🚫 WebSocket connection error:', error);
      console.log('Connection details:', {
        url: 'http://localhost:3000/forum',
        workspaceId,
        hasToken: !!token,
        errorMessage: error.message,
        error: error
      });
      setIsConnected(false);
      
      // Check if API Gateway is running
      fetch('http://localhost:3000/api/health')
        .then(() => console.log('✅ API Gateway is running'))
        .catch(err => console.error('❌ API Gateway not accessible:', err.message));
    });

    // Add error handler
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setIsConnected(false);
    });

    // Forum-specific event handlers
    socket.on('new-message', (data) => {
      console.log('📨 Received new message via WebSocket:', data);
      // Backend sends {message: {...}, workspaceId: '...'}, extract the message
      const messageData = data.message || data;
      onNewMessage(messageData);
    });

    socket.on('new-reply', (replyData) => {
      console.log('💬 Received new reply via WebSocket:', replyData);
      onNewReply(replyData);
    });

    socket.on('user-joined', (userData) => {
      console.log('👋 User joined:', userData);
      onUserJoined(userData);
    });

    socket.on('user-left', (userData) => {
      console.log('👋 User left:', userData);
      onUserLeft(userData);
    });

    // Typing indicators
    socket.on('user-typing', (data) => {
      console.log('⌨️ User typing:', data);
      // You can handle typing indicators here if needed
    });

    socket.on('user-stopped-typing', (data) => {
      console.log('⌨️ User stopped typing:', data);
      // Handle stop typing indicators here
    });

  }, [workspaceId, onNewMessage, onNewReply, onUserJoined, onUserLeft]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting WebSocket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // WebSocket actions
  const sendMessage = useCallback((messageData: Partial<MessageData>) => {
    if (socketRef.current?.connected) {
      // Get user ID from stored user data
      const userData = localStorage.getItem('user_data');
      let userId = '';
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || '';
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      if (!userId) {
        console.error('❌ Cannot send message - User ID not found');
        return;
      }

      // Format data according to backend expectations
      const payload = {
        workspaceId,
        userId,
        content: messageData.content || ''
      };

      console.log('📤 Sending message via WebSocket:', payload);
      socketRef.current.emit('send-message', payload);
    } else {
      console.warn('⚠️ Cannot send message - WebSocket not connected');
    }
  }, [workspaceId]);

  const sendReply = useCallback((messageId: string, replyData: Partial<ReplyData>) => {
    if (socketRef.current?.connected) {
      console.log('📤 Sending reply via WebSocket:', { messageId, replyData });
      socketRef.current.emit('send-reply', {
        workspaceId,
        messageId,
        ...replyData
      });
    } else {
      console.warn('⚠️ Cannot send reply - WebSocket not connected');
    }
  }, [workspaceId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(isTyping ? 'typing' : 'stop-typing', {
        workspaceId
      });
    }
  }, [workspaceId]);

  // Track reconnection attempts
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  // Initialize WebSocket connection
  useEffect(() => {
    if (!workspaceId) {
      console.log('⚠️ No workspace ID, skipping WebSocket connection');
      return;
    }

    // Reset connection attempts
    reconnectAttempts.current = 0;
    connectSocket();

    // Auto-reconnect logic with limits
    const reconnectInterval = setInterval(() => {
      if (!socketRef.current?.connected) {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          console.log(`🔄 Attempting to reconnect WebSocket (${reconnectAttempts.current + 1}/${maxReconnectAttempts})...`);
          reconnectAttempts.current++;
          connectSocket();
        } else {
          console.log('⚠️ Max reconnection attempts reached, stopping');
          clearInterval(reconnectInterval);
        }
      } else {
        // Reset attempts on successful connection
        reconnectAttempts.current = 0;
      }
    }, 5000); // Try every 5 seconds

    return () => {
      clearInterval(reconnectInterval);
      disconnectSocket();
    };
  }, [workspaceId, connectSocket, disconnectSocket]);

  return {
    isConnected,
    sendMessage,
    sendReply,
    sendTyping
  };
};
