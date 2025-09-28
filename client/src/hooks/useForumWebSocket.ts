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
      return;
    }

    console.log('🔌 Attempting to connect to WebSocket server...');
    
    // Create socket connection
    socketRef.current = io('http://localhost:3003', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      setIsConnected(true);
      
      // Join the forum room
      socket.emit('join-forum', { workspaceId });
      console.log(`📡 Joined forum room: forum-${workspaceId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('🚫 WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Forum-specific event handlers
    socket.on('new-message', (messageData) => {
      console.log('📨 Received new message via WebSocket:', messageData);
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
      console.log('📤 Sending message via WebSocket:', messageData);
      socketRef.current.emit('send-message', {
        workspaceId,
        ...messageData
      });
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

  // Initialize WebSocket connection
  useEffect(() => {
    if (!workspaceId) return;

    connectSocket();

    // Auto-reconnect logic
    const reconnectInterval = setInterval(() => {
      if (!socketRef.current?.connected) {
        console.log('🔄 Attempting to reconnect WebSocket...');
        connectSocket();
      }
    }, 10000); // Try to reconnect every 10 seconds if disconnected

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
