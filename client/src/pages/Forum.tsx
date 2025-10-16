import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import SidebarComponent from "../components/SideBar";
import { AttachFile, Send, Close, Reply as ReplyIcon, Delete as DeleteIcon, ThumbUp } from "@mui/icons-material";
import { Pin, MessageCircle } from "lucide-react";
import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Paper,
  Stack,
  useMediaQuery,
  CircularProgress,
  GlobalStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";

import type { Role, MessageType, ReplyType, Author } from "../types/ForumInterfaces";
import { 
  getForumMessages, 
  createForumMessage, 
  createReply, 
  getWorkspaceInfo,
  toggleMessageLike,
  toggleReplyLike,
  deleteMessage,
  deleteReply,
  pinMessage
} from "../api/forumApi";
import { getUserData } from "../api/authApi";
import type { User } from "../types/AuthInterfaces";
import { useForumWebSocket } from "../hooks/useForumWebSocket";


export default function WorkspaceForumPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId ?? ""; // fallback to empty string if undefined
  const isMobile = useMediaQuery("(max-width:900px)");

  // Debug the workspace ID only once
  React.useEffect(() => {
    console.log('🔍 Forum Component Mounted with workspaceId:', workspaceId);
  }, [workspaceId]);

  // CSS animations for modern effects
  const animationStyles = (
    <GlobalStyles
      styles={{
        '@keyframes slideIn': {
          '0%': {
            opacity: 0,
            transform: 'translateX(-10px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        '@keyframes slideDown': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    />
  );

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [shownReplies, setShownReplies] = useState<(number | string)[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(isMobile);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workspaceInfo, setWorkspaceInfo] = useState<{ id: string; title: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    messageId: string | number;
    isOwnMessage: boolean;
  } | null>(null);

  // Manual refresh function with duplicate prevention
  const refreshMessages = useCallback(async () => {
    if (!workspaceId || refreshing) return;
    
    // Validate workspaceId before making API call
    if (workspaceId.length < 10) {
      console.warn('⚠️ Invalid workspace ID, skipping forum messages fetch:', workspaceId);
      return;
    }
    
    try {
      setRefreshing(true);
      const messagesData = await getForumMessages(workspaceId);
      console.log('🔍 Refresh - Raw messages from API:', messagesData);
      // Organize messages and replies
      const organizedMessages = organizeMessagesWithReplies(messagesData);
      console.log('🔍 Refresh - Organized messages:', organizedMessages);
      setMessages(organizedMessages);
      // Reduce refresh logging
      if (Math.random() < 0.3) { // 30% chance to log
        console.log('Messages refreshed:', messagesData.length, 'messages');
      }
    } catch (err) {
      console.error('Error refreshing messages:', err);
      // Don't show error to user for 404s during background sync
      if (err instanceof Error && err.message.includes('404')) {
        console.warn('📝 Forum endpoint not found - this workspace may not have forum functionality enabled');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      }
    } finally {
      setRefreshing(false);
    }
  }, [workspaceId, refreshing]);

  // WebSocket event handlers for real-time updates
  const handleNewMessage = useCallback((message: unknown) => {
    const msgData = message as Record<string, unknown>;
    
    // Add the new message directly with better duplicate prevention
    setMessages(prevMessages => {
      // More robust duplicate checking
      const messageExists = prevMessages.some(msg => {
        // Check by ID first, then by content and timestamp for safety
        return msg.id.toString() === msgData.id?.toString() ||
               (msg.content === msgData.content && 
                Math.abs(new Date(msg.timestamp).getTime() - new Date(msgData.timestamp as string).getTime()) < 2000);
      });
      
      if (messageExists) {
        // Don't log for every duplicate - just return existing
        return prevMessages;
      }
      
      // Add the new message to the list
      const newMessage: MessageType = {
        id: msgData.id as number | string,
        content: msgData.content as string,
        author: msgData.author as Author,
        timestamp: msgData.timestamp as string,
        isPinned: (msgData.isPinned as boolean) || false,
        likes: 0,
        isLiked: false,
        replies: (msgData.replies as ReplyType[]) || [],
        image: msgData.image as string | undefined
      };
      
      console.log('📨 New message via WebSocket added to UI');
      return [...prevMessages, newMessage].sort((a, b) => {
        // Sort pinned messages first, then by timestamp
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
    });
  }, []);

  const handleNewReply = useCallback((data: { messageId: string; reply: unknown }) => {
    const replyData = data.reply as Record<string, unknown>;
    
    // Add the reply directly to the specific message with better duplicate prevention
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id.toString() === data.messageId.toString()) {
          // More robust duplicate checking for replies
          const replyExists = message.replies?.some(reply => {
            return reply.id.toString() === replyData.id?.toString() ||
                   (reply.content === replyData.content && 
                    Math.abs(new Date(reply.timestamp).getTime() - new Date(replyData.timestamp as string).getTime()) < 2000);
          });
          
          if (replyExists) {
            // Don't log for every duplicate - just return existing
            return message;
          }
          
          const newReply: ReplyType = {
            id: replyData.id as number | string,
            content: replyData.content as string,
            author: replyData.author as Author,
            timestamp: replyData.timestamp as string,
            likes: 0,
            isLiked: false
          };
          
          console.log('💬 New reply via WebSocket added to UI');
          return {
            ...message,
            replies: [...(message.replies || []), newReply].sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
          };
        }
        return message;
      });
    });
  }, []);

  const handleUserJoined = useCallback((data: { userId: string; userName: string }) => {
    console.log('� User joined:', data);
    // You can show a notification here if needed
  }, []);

  const handleUserLeft = useCallback((data: { userId: string; userName: string }) => {
    console.log('👋 User left:', data);
    // You can show a notification here if needed
  }, []);

  // Handle pin/unpin message
  const handlePinMessage = useCallback(async (messageId: string | number) => {
    try {
      const user = await getUserData();
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Get current message state
      const currentMessage = messages.find(msg => msg.id === messageId);
      if (!currentMessage) {
        throw new Error('Message not found');
      }
      
      // Call the API endpoint - it will toggle pin/unpin automatically
      await pinMessage(workspaceId, Number(messageId));
      
      // Toggle the pin state in UI
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isPinned: !msg.isPinned };
        }
        return msg;
      }).sort((a, b) => {
        // Sort pinned messages first, then by timestamp
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }));
      
      console.log('✅ Message pin toggled successfully');
    } catch (error) {
      console.error('Error pinning/unpinning message:', error);
      setError(error instanceof Error ? error.message : 'Failed to pin/unpin message');
    }
  }, [messages, workspaceId]);

  // Handle like/unlike message
  const handleLikeMessage = useCallback(async (messageId: string | number) => {
    try {
      console.log('Toggling like for message:', messageId);
      const result = await toggleMessageLike(workspaceId, messageId);
      
      // Update message likes in UI
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
          return { 
            ...msg, 
            likes: result.likeCount,
            isLiked: result.liked
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle like');
    }
  }, [workspaceId]);

  // Handle like/unlike reply
  const handleLikeReply = useCallback(async (messageId: string | number, replyId: string | number) => {
    try {
      console.log('Toggling like for reply:', replyId);
      const result = await toggleReplyLike(messageId, replyId);
      
      // Update reply likes in UI
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            replies: msg.replies?.map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: result.likeCount,
                  isLiked: result.liked
                };
              }
              return reply;
            }) || []
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error toggling reply like:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle reply like');
    }
  }, []);

  // Handle delete message
  const handleDeleteMessage = useCallback(async (messageId: string | number) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this message?');
      if (!confirmDelete) return;

      console.log('Deleting message:', messageId);
      await deleteMessage(workspaceId, messageId);
      
      // Remove message from UI
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      console.log('✅ Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete message');
    }
  }, [workspaceId]);

  // Handle delete reply
  const handleDeleteReply = useCallback(async (messageId: string | number, replyId: string | number) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this reply?');
      if (!confirmDelete) return;

      console.log('Deleting reply:', replyId);
      await deleteReply(messageId, replyId);
      
      // Remove reply from UI
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            replies: msg.replies?.filter(reply => reply.id !== replyId) || []
          };
        }
        return msg;
      }));
      console.log('✅ Reply deleted successfully');
    } catch (error) {
      console.error('Error deleting reply:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete reply');
    }
  }, []);

  // Initialize Socket.IO WebSocket connection for real-time updates
  const {
    isConnected: wsConnected,
    sendMessage: wsSendMessage,
    sendReply: wsSendReply,
    sendTyping: wsSendTyping
  } = useForumWebSocket({
    workspaceId,
    onNewMessage: handleNewMessage,
    onNewReply: handleNewReply,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft
  });

  // Debug WebSocket connection status (reduced logging)
  React.useEffect(() => {
    if (wsConnected) {
      console.log('✅ WebSocket connected - Real-time updates enabled');
    } else {
      console.log('❌ WebSocket disconnected - Using API fallback');
    }
  }, [wsConnected]);

  // Multi-tab synchronization: Reduced frequency background refresh
  React.useEffect(() => {
    if (!workspaceId || workspaceId.length < 10) return;
    
    // Set up a background refresh interval for multi-tab sync (less aggressive)
    const syncInterval = setInterval(() => {
      if (!wsConnected) {
        // Only log occasionally to reduce noise
        if (Math.random() < 0.1) { // 10% chance to log
          console.log('🔄 Background sync - refreshing messages');
        }
        refreshMessages();
      }
      // Remove the "even when connected" refresh to reduce load
    }, wsConnected ? 60000 : 30000); // 60s when connected, 30s when disconnected

    return () => clearInterval(syncInterval);
  }, [wsConnected, workspaceId, refreshMessages]);

  // Tab visibility change listener for immediate sync when switching between tabs
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && workspaceId && !wsConnected) {
        // Only refresh when tab becomes visible AND WebSocket is disconnected
        console.log('🔄 Tab visible + WebSocket offline - syncing messages');
        refreshMessages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [workspaceId, refreshMessages, wsConnected]);

  // Helper function to organize messages with nested replies
  const organizeMessagesWithReplies = (messagesData: unknown[]): MessageType[] => {
    if (!Array.isArray(messagesData)) return [];

    console.log('🔍 organizeMessagesWithReplies received:', messagesData.length, 'messages');
    console.log('🔍 First message sample:', messagesData[0]);

    // Check if messages already have nested replies (new backend format)
    const firstMessage = messagesData[0] as Record<string, unknown>;
    if (firstMessage && firstMessage.replies && Array.isArray(firstMessage.replies)) {
      console.log('✅ Messages already have nested replies, returning as-is');
      return messagesData.map(msg => {
        const msgObj = msg as Record<string, unknown>;
        return {
          id: msgObj.id as number | string,
          content: msgObj.content as string,
          author: msgObj.author as Author,
          timestamp: msgObj.timestamp as string,
          isPinned: (msgObj.isPinned as boolean) || false,
          likes: 0,
          isLiked: false,
          replies: msgObj.replies as ReplyType[] || [],
          image: msgObj.image as string | undefined
        };
      });
    }

    console.log('⚠️ Using legacy organization logic for flat message structure');
    // Legacy logic for organizing flat message structure

    // Separate parent messages and replies
    const parentMessages: MessageType[] = [];
    const replyMessages: unknown[] = [];

    messagesData.forEach(msg => {
      const msgObj = msg as Record<string, unknown>;
      if (msgObj.parentMessageId || msgObj.parent_message_id || msgObj.parent_id) {
        replyMessages.push(msg);
      } else {
        // Ensure the message has all required MessageType properties
        const messageWithReplies: MessageType = {
          id: msgObj.id as number | string,
          content: msgObj.content as string,
          author: msgObj.author as Author,
          timestamp: msgObj.timestamp as string,
          isPinned: (msgObj.isPinned as boolean) || false,
          likes: 0, // Remove like functionality
          isLiked: false, // Remove like functionality
          replies: [],
          image: msgObj.image as string | undefined
        };
        parentMessages.push(messageWithReplies);
      }
    });

    // Attach replies to their parent messages
    replyMessages.forEach(reply => {
      const replyObj = reply as Record<string, unknown>;
      const parentId = replyObj.parentMessageId || replyObj.parent_message_id || replyObj.parent_id;
      
      if (parentId) {
        const parentIndex = parentMessages.findIndex(msg => 
          msg.id.toString() === parentId.toString()
        );
        
        if (parentIndex !== -1) {
          if (!parentMessages[parentIndex].replies) {
            parentMessages[parentIndex].replies = [];
          }
          
          // Convert reply to proper ReplyType
          const formattedReply: ReplyType = {
            id: replyObj.id as number | string,
            content: replyObj.content as string,
            author: replyObj.author as Author,
            timestamp: replyObj.timestamp as string,
            likes: 0, // Remove like functionality
            isLiked: false // Remove like functionality
          };
          
          parentMessages[parentIndex].replies.push(formattedReply);
        }
      }
    });

    // Sort parent messages by timestamp (oldest first)
    parentMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Sort replies within each message by timestamp
    parentMessages.forEach(msg => {
      if (msg.replies && msg.replies.length > 0) {
        msg.replies.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }
    });

    return parentMessages;
  };

  // Load forum data on component mount
  useEffect(() => {
    const loadForumData = async () => {
      // Load current user data FIRST - await it!
      try {
        const user = await getUserData();
        setCurrentUser(user);
        console.log('👤 Current user loaded:', user ? `${user.first_name} ${user.last_name} (ID: ${user.id})` : 'Not logged in');
      } catch (error) {
        console.error('Error loading user data:', error);
        setCurrentUser(null);
      }

      if (!workspaceId) {
        console.warn('⚠️ No workspace ID provided, skipping forum data load');
        return;
      }
      
      // Validate workspaceId format
      if (workspaceId.length < 10) {
        console.warn('⚠️ Invalid workspace ID format, skipping forum data load:', workspaceId);
        setError('Invalid workspace ID. Please ensure you are accessing the forum from a valid workspace URL.');
        return;
      }
      
      try {
        setError(null);
        
        // Load workspace info and messages in parallel
        const [workspaceData, messagesData] = await Promise.all([
          getWorkspaceInfo(workspaceId),
          getForumMessages(workspaceId)
        ]);
        
        console.log('🔍 Raw messages from API:', messagesData);
        
        setWorkspaceInfo(workspaceData);
        // Organize messages and replies
        const organizedMessages = organizeMessagesWithReplies(messagesData);
        console.log('🔍 Organized messages:', organizedMessages);
        setMessages(organizedMessages);
        
        // Scroll to bottom after messages are loaded
        setTimeout(() => {
          const scrollContainer = messagesEndRef.current?.parentElement;
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }, 200);
      } catch (err) {
        console.error('Error loading forum data:', err);
        
        // More specific error handling
        if (err instanceof Error && err.message.includes('404')) {
          setError('Forum not found. This workspace may not have forum functionality enabled.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load forum data');
        }
        setMessages([]); // Ensure messages is always an array
      }
    };

    loadForumData();
  }, [workspaceId]);



  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Use a small delay to ensure DOM has updated
    const scrollToBottom = () => {
      const scrollContainer = messagesEndRef.current?.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    };
    
    // Immediate scroll
    scrollToBottom();
    
    // Delayed scroll to ensure everything is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !image) return;
    if (!workspaceId) return;

    try {
      // Get user data from localStorage directly (synchronous)
      const userDataString = localStorage.getItem('user_data');
      if (!userDataString) {
        setError('Please sign in to send messages');
        return;
      }
      
      let user;
      try {
        user = JSON.parse(userDataString);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data - please sign in again');
        return;
      }
      
      if (!user || !user.id) {
        setError('Please sign in to send messages');
        return;
      }
      
      setSending(true);
      setError(null);
      
      console.log('Sending message:', { workspaceId, content: newMessage });
      
      // Use WebSocket if connected, otherwise fall back to HTTP API
      if (wsConnected) {
        console.log('📤 Sending via WebSocket');
        // Send via WebSocket - backend will create in DB and broadcast
        wsSendMessage({
          content: newMessage.trim(),
          author: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim(),
            role: 'member' as Role, // Default role since User type doesn't have role
          }
        });
        
        // Clear input immediately
        setNewMessage("");
        setImage(null);
      } else {
        console.log('📡 Sending via HTTP API (WebSocket disconnected)');
        // Fallback to HTTP API when WebSocket is not connected
        const newMessageData = await createForumMessage(workspaceId, newMessage.trim(), image || undefined);
        console.log('Received new message:', newMessageData);
        
        // Add message to UI
        const messageWithReplies: MessageType = {
          id: newMessageData.id,
          content: newMessageData.content,
          author: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim(),
            role: 'member' as Role, // Default to member role
            avatar: '/src/assets/profile_img.png' // Default avatar
          },
          timestamp: newMessageData.timestamp,
          isPinned: newMessageData.isPinned || false,
          likes: 0,
          isLiked: false,
          replies: newMessageData.replies || [],
          image: newMessageData.image
        };
        
        setMessages(prev => {
          // Check for duplicates before adding
          const exists = prev.some(msg => msg.id.toString() === newMessageData.id.toString());
          if (exists) {
            console.log('Message already exists in UI, skipping duplicate');
            return prev;
          }
          
          console.log('Adding new message to UI immediately');
          return [...prev, messageWithReplies].sort((a, b) => {
            // Sort pinned messages first, then by timestamp
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          });
        });
        
        // Clear the input
        setNewMessage("");
        setImage(null);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async (messageId: number | string) => {
    if (!replyContent.trim()) return;
    if (!workspaceId) return;

    try {
      const user = await getUserData();
      if (!user || !user.id) {
        setError('Please sign in to reply to messages');
        return;
      }
      
      console.log('Sending reply to message:', messageId, 'Content:', replyContent);
      const newReply = await createReply(workspaceId, String(messageId), replyContent.trim());
      console.log('Reply sent successfully:', newReply);
      
      // Clear reply input immediately
      setReplyContent("");
      setReplyingTo(null);
      
      // Format reply with user data
      const formattedReply: ReplyType = {
        id: newReply.id,
        content: newReply.content,
        author: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          role: 'member' as Role, // Default to member role
          avatar: '/src/assets/profile_img.png' // Default avatar
        },
        timestamp: newReply.timestamp,
        likes: 0,
        isLiked: false
      };
      
      setMessages(prevMessages => {
        return prevMessages.map(message => {
          if (message.id.toString() === messageId.toString()) {
            // Check for duplicate replies
            const replyExists = message.replies?.some(reply => 
              reply.id.toString() === newReply.id.toString()
            );
            if (replyExists) {
              console.log('Reply already exists in UI, skipping duplicate');
              return message;
            }
            
            console.log('Adding new reply to UI immediately');
            // Add reply and sort
            return {
              ...message,
              replies: [...(message.replies || []), formattedReply].sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              )
            };
          }
          return message;
        });
      });
      
      // Emit via WebSocket if connected
      if (wsConnected) {
        console.log('Emitting reply via WebSocket');
        wsSendReply(String(messageId), formattedReply);
      }
      
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    }
  };



  const toggleReplies = (messageId: number | string) => {
    setShownReplies((prev) =>
      prev.some(id => id.toString() === messageId.toString())
        ? prev.filter((id) => id.toString() !== messageId.toString())
        : [...prev, messageId]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getRoleColor = (role: Role) =>
    role === "admin" ? "warning" : "default";

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      {animationStyles}
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar - Hidden on mobile */}
      <Box
        sx={{
          width: { xs: 0, md: collapsed ? 72 : 240 },
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: { xs: "none", md: "1px solid #e0e0e0" },
          display: { xs: "none", md: "block" }
        }}
      >
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modern Header */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: { xs: 0, sm: '0 0 20px 20px' },
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography 
                  variant="h4" 
                  fontWeight="700" 
                  sx={{ 
                    mb: 0.5, 
                    wordBreak: 'break-word',
                    fontSize: { xs: '1.5rem', sm: '2.125rem' }
                  }}
                >
                  💬 {workspaceInfo?.title || 'Loading...'} 
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: wsConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                  border: `1px solid ${wsConnected ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 152, 0, 0.4)'}`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: wsConnected ? '#4CAF50' : '#FF9800',
                    animation: wsConnected ? 'none' : 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 }
                    }
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: '0.75rem'
                  }}>
                    {wsConnected ? 'LIVE' : 'OFFLINE'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Modern Chat Messages Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: "auto", 
            bgcolor: "#f8fafc",
            position: "relative",
            height: 0, // This forces the flex item to not exceed parent height
            scrollBehavior: 'smooth'
          }}
        >
          {error ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              gap: 2
            }}>
              <Typography variant="h6" color="error">Connection Error</Typography>
              <Typography color="text.secondary">{error}</Typography>
              <Button variant="outlined" onClick={refreshMessages}>
                Try Again
              </Button>
            </Box>
          ) : !Array.isArray(messages) || messages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              p: 4
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <Typography variant="h3" sx={{ opacity: 0.6 }}>💬</Typography>
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
                Start the conversation! Your message will appear here and notify all workspace members.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <Stack spacing={1}>
                {messages.filter(message => message && message.id && message.author).map((message, index) => {
                  // Check if this message is from the current user - FIXED comparison
                  const isOwnMessage = !!(
                    currentUser?.id && 
                    message.author?.id && 
                    String(message.author.id) === String(currentUser.id)
                  );
                  
                  // Debug logging (only for first render)
                  if (index === 0 && import.meta.env.DEV) {
                    console.log('🔍 Message ownership check:', {
                      messageAuthorId: message.author?.id,
                      currentUserId: currentUser?.id,
                      isOwnMessage,
                      messageAuthor: message.author?.name,
                      comparison: `${String(message.author?.id)} === ${String(currentUser?.id)}`
                    });
                  }
                  
                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  const showAvatar = !prevMessage || prevMessage.author?.id !== message.author?.id;
                  const isGrouped = prevMessage && prevMessage.author?.id === message.author?.id;

                  return (
                    <Box key={message.id} sx={{ mb: isGrouped ? 0.5 : 2 }}>
                      {/* Message Bubble Container */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isOwnMessage ? "row-reverse" : "row",
                          alignItems: "flex-end",
                          gap: 1,
                          px: 1
                        }}
                      >
                        {/* Avatar */}
                        {showAvatar ? (
                          <Avatar 
                            src={message.author?.avatar || '/src/assets/profile_img.png'} 
                            sx={{ 
                              width: { xs: 28, sm: 32 }, 
                              height: { xs: 28, sm: 32 },
                              border: isOwnMessage ? '2px solid #e3f2fd' : '2px solid #f3e5f5'
                            }}
                          />
                        ) : (
                          <Box sx={{ width: { xs: 28, sm: 32 } }} /> // Spacer for alignment
                        )}

                        {/* Message Bubble */}
                        <Box
                          sx={{
                            maxWidth: { xs: "85%", sm: "70%", md: "60%" },
                            position: "relative"
                          }}
                        >
                          {/* Author & Time (only show if not grouped) */}
                          {showAvatar && (
                            <Box sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                              justifyContent: isOwnMessage ? "flex-end" : "flex-start"
                            }}>
                              <Typography 
                                variant="caption" 
                                fontWeight="600"
                                color="text.primary"
                              >
                                {message.author?.name || 'Unknown User'}
                                {isOwnMessage && ' (You)'}
                              </Typography>
                              <Chip
                                label={message.author?.role || 'member'}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 18, 
                                  fontSize: '0.65rem',
                                  color: getRoleColor(message.author?.role || 'member') === 'warning' ? '#f57c00' : '#666'
                                }}
                              />
                              {message.isPinned && (
                                <Pin size={12} color="#ff9800" />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(message.timestamp)}
                              </Typography>
                            </Box>
                          )}

                          {/* Message Content Bubble */}
                          <Paper
                            elevation={0}
                            className="message-bubble"
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setContextMenu({
                                mouseX: e.clientX,
                                mouseY: e.clientY,
                                messageId: message.id,
                                isOwnMessage
                              });
                            }}
                            sx={{
                              p: { xs: 1.5, sm: 2.5 },
                              borderRadius: isOwnMessage 
                                ? '20px 20px 4px 20px'
                                : '20px 20px 20px 4px',
                              color: isOwnMessage ? 'white' : 'text.primary',
                              border: isOwnMessage ? 'none' : '1px solid #e0e7ff',
                              boxShadow: isOwnMessage 
                                ? '0 2px 12px rgba(102, 126, 234, 0.3)'
                                : '0 2px 12px rgba(0,0,0,0.08)',
                              position: 'relative',
                              minWidth: '120px',
                              background: isOwnMessage 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : message.isPinned 
                                  ? 'linear-gradient(135deg, #fff9c4 0%, #fff3e0 100%)' 
                                  : 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: isOwnMessage 
                                  ? '0 4px 20px rgba(102, 126, 234, 0.4)'
                                  : '0 4px 20px rgba(0,0,0,0.12)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            <Typography 
                              variant="body1"
                              sx={{ 
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                lineHeight: 1.5
                              }}
                            >
                              {message.content}
                            </Typography>

                            {/* Image in message */}
                            {message.image && (
                              <Box sx={{ mt: 1.5 }}>
                                <Box
                                  component="img"
                                  src={message.image}
                                  alt="Shared image"
                                  sx={{
                                    maxWidth: "100%",
                                    maxHeight: 300,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                      transform: 'scale(1.02)'
                                    }
                                  }}
                                />
                              </Box>
                            )}

                            {/* Reply Button - Positioned in top right corner */}
                            <Box sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              display: 'flex',
                              gap: 0.5,
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              '.message-bubble:hover &': {
                                opacity: 1
                              }
                            }}>
                              <IconButton
                                size="small"
                                onClick={() => setReplyingTo(
                                  replyingTo?.toString() === message.id.toString() ? null : message.id
                                )}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  bgcolor: isOwnMessage ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                                  color: isOwnMessage ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                                  '&:hover': {
                                    bgcolor: isOwnMessage ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <ReplyIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Box>

                            {/* Actions Row - Like, Reply, Context Menu */}
                            <Box sx={{ 
                              mt: 1, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleLikeMessage(message.id)}
                                  sx={{
                                    padding: '4px',
                                    color: message.isLiked 
                                      ? (isOwnMessage ? '#fff' : '#667eea') 
                                      : (isOwnMessage ? 'rgba(255,255,255,0.9)' : 'text.secondary'),
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                      color: isOwnMessage ? '#fff' : '#667eea'
                                    }
                                  }}
                                >
                                  <Badge 
                                    badgeContent={message.likes} 
                                    color="primary"
                                    sx={{ 
                                      '& .MuiBadge-badge': {
                                        fontSize: '0.6rem',
                                        height: '14px',
                                        minWidth: '14px'
                                      }
                                    }}
                                  >
                                    <ThumbUp sx={{ 
                                      fontSize: '0.9rem',
                                      fill: message.isLiked ? 'currentColor' : 'none'
                                    }} />
                                  </Badge>
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleReplies(message.id)}
                                  sx={{
                                    padding: '4px',
                                    color: isOwnMessage ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                                  }}
                                >
                                  <Badge 
                                    badgeContent={message.replies?.length || 0} 
                                    color="primary"
                                    sx={{ 
                                      '& .MuiBadge-badge': {
                                        fontSize: '0.6rem',
                                        height: '14px',
                                        minWidth: '14px'
                                      }
                                    }}
                                  >
                                    <MessageCircle size={14} />
                                  </Badge>
                                </IconButton>
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.65rem',
                                  color: isOwnMessage ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                  ml: 1
                                }}
                              >
                                {new Date(message.timestamp).toLocaleString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>

                            {/* Context Menu */}
                            <Menu
                              open={!!contextMenu && contextMenu.messageId === message.id}
                              onClose={handleCloseContextMenu}
                              anchorReference="anchorPosition"
                              anchorPosition={
                                contextMenu
                                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                  : undefined
                              }
                            >
                              <MenuItem onClick={() => {
                                setReplyingTo(message.id);
                                handleCloseContextMenu();
                              }}>
                                <ListItemIcon>
                                  <ReplyIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Reply</ListItemText>
                              </MenuItem>
                              <MenuItem onClick={() => {
                                handlePinMessage(message.id);
                                handleCloseContextMenu();
                              }}>
                                <ListItemIcon>
                                  <Pin size={20} 
                                    style={{ 
                                      transform: message.isPinned ? 'rotate(45deg)' : 'none',
                                      transition: 'transform 0.2s ease-in-out'
                                    }} 
                                  />
                                </ListItemIcon>
                                <ListItemText>{message.isPinned ? 'Unpin' : 'Pin'}</ListItemText>
                              </MenuItem>
                              {contextMenu?.isOwnMessage && (
                                <MenuItem onClick={() => {
                                  handleDeleteMessage(message.id);
                                  handleCloseContextMenu();
                                }}>
                                  <ListItemIcon>
                                    <DeleteIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText>Delete</ListItemText>
                                </MenuItem>
                              )}
                            </Menu>
                          </Paper>

                          {/* Replies Thread - Modern Design */}
                          {shownReplies.some(id => id.toString() === message.id.toString()) &&
                            message.replies && message.replies.length > 0 && (
                            <Box sx={{ 
                              mt: 2, 
                              ml: isOwnMessage ? 0 : 3,
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: -12,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 1,
                                opacity: 0.3
                              }
                            }}>
                              <Stack spacing={1.5}>
                                {message.replies.filter(reply => reply && reply.id).map((reply, replyIndex) => {
                                  // Check if this reply is from the current user - FIXED comparison
                                  const isOwnReply = !!(
                                    currentUser?.id && 
                                    reply.author?.id && 
                                    String(reply.author.id) === String(currentUser.id)
                                  );
                                  
                                  return (
                                    <Box
                                      key={reply.id}
                                      sx={{
                                        display: "flex",
                                        flexDirection: isOwnReply ? "row-reverse" : "row",
                                        alignItems: "flex-start",
                                        gap: 1,
                                        animation: `slideIn 0.3s ease-out ${replyIndex * 0.1}s both`
                                      }}
                                    >
                                      {/* Reply Avatar */}
                                      <Avatar
                                        src={reply.author?.avatar || '/src/assets/profile_img.png'}
                                        sx={{ 
                                          width: 24, 
                                          height: 24,
                                          border: isOwnReply ? '1px solid #e3f2fd' : '1px solid #f3e5f5',
                                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                      />

                                      {/* Reply Bubble */}
                                      <Box sx={{ maxWidth: { xs: "80%", sm: "75%" } }}>
                                        {/* Author Info */}
                                        <Box sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 0.75,
                                          mb: 0.5,
                                          justifyContent: isOwnReply ? "flex-end" : "flex-start"
                                        }}>
                                          <Typography 
                                            variant="caption" 
                                            fontWeight="600"
                                            sx={{ 
                                              color: isOwnReply ? 'primary.main' : 'text.primary',
                                              fontSize: '0.7rem'
                                            }}
                                          >
                                            {reply.author?.name || 'Unknown User'}
                                            {isOwnReply && ' (You)'}
                                          </Typography>
                                          <Typography 
                                            variant="caption" 
                                            sx={{ 
                                              color: 'text.secondary',
                                              fontSize: '0.65rem'
                                            }}
                                          >
                                            {formatTimestamp(reply.timestamp)}
                                          </Typography>
                                        </Box>

                                        {/* Reply Content */}
                                        <Paper
                                          elevation={0}
                                          sx={{
                                            p: { xs: 1, sm: 1.5 },
                                            borderRadius: isOwnReply 
                                              ? '16px 16px 2px 16px'
                                              : '16px 16px 16px 2px',
                                            bgcolor: isOwnReply 
                                              ? 'rgba(102, 126, 234, 0.15)'
                                              : 'rgba(0, 0, 0, 0.04)',
                                            border: `1px solid ${isOwnReply ? 'rgba(102, 126, 234, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`,
                                            position: 'relative',
                                            transition: 'all 0.2s ease',
                                            color: isOwnReply ? 'primary.dark' : 'text.primary',
                                            '&:hover': {
                                              bgcolor: isOwnReply 
                                                ? 'rgba(102, 126, 234, 0.2)'
                                                : 'rgba(0, 0, 0, 0.06)',
                                              transform: 'translateY(-1px)',
                                              boxShadow: isOwnReply
                                                ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                                                : '0 4px 12px rgba(0,0,0,0.1)'
                                            }
                                          }}
                                        >
                                          <Typography 
                                            variant="body2" 
                                            sx={{ 
                                              fontSize: '0.875rem',
                                              lineHeight: 1.4,
                                              color: 'text.primary',
                                              whiteSpace: "pre-wrap",
                                              wordBreak: "break-word"
                                            }}
                                          >
                                            {reply.content}
                                          </Typography>

                                          {/* Reply Actions - Like and Delete */}
                                          <Box sx={{ 
                                            mt: 1, 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            gap: 1
                                          }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              <IconButton
                                                size="small"
                                                onClick={() => handleLikeReply(message.id, reply.id)}
                                                sx={{
                                                  padding: '2px',
                                                  color: reply.isLiked ? '#667eea' : 'text.secondary',
                                                  transition: 'all 0.2s',
                                                  '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    color: '#667eea'
                                                  }
                                                }}
                                              >
                                                <Badge 
                                                  badgeContent={reply.likes || 0} 
                                                  color="primary"
                                                  sx={{ 
                                                    '& .MuiBadge-badge': {
                                                      fontSize: '0.55rem',
                                                      height: '12px',
                                                      minWidth: '12px'
                                                    }
                                                  }}
                                                >
                                                  <ThumbUp sx={{ 
                                                    fontSize: '0.75rem',
                                                    fill: reply.isLiked ? 'currentColor' : 'none'
                                                  }} />
                                                </Badge>
                                              </IconButton>
                                              
                                              {isOwnReply && (
                                                <IconButton
                                                  size="small"
                                                  onClick={() => handleDeleteReply(message.id, reply.id)}
                                                  sx={{
                                                    padding: '2px',
                                                    color: 'error.main',
                                                    opacity: 0.6,
                                                    '&:hover': {
                                                      opacity: 1,
                                                      bgcolor: 'error.50'
                                                    }
                                                  }}
                                                >
                                                  <DeleteIcon sx={{ fontSize: '0.75rem' }} />
                                                </IconButton>
                                              )}
                                            </Box>
                                            
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.6rem',
                                                color: 'text.secondary'
                                              }}
                                            >
                                              {new Date(reply.timestamp).toLocaleString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}
                                            </Typography>
                                          </Box>
                                        </Paper>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Stack>
                            </Box>
                          )}

                          {/* Modern Reply Input */}
                          {replyingTo?.toString() === message.id.toString() && (
                            <Box sx={{ 
                              mt: 2, 
                              ml: isOwnMessage ? 0 : 3,
                              animation: 'slideDown 0.3s ease-out'
                            }}>
                              <Paper 
                                elevation={0}
                                sx={{ 
                                  borderRadius: 4,
                                  border: '2px solid #e3f2fd',
                                  overflow: 'hidden',
                                  transition: 'all 0.2s',
                                  '&:focus-within': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                  }
                                }}
                              >
                                {/* Reply Header */}
                                <Box sx={{
                                  px: 2,
                                  py: 1,
                                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                                  borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <ReplyIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                  <Typography variant="caption" fontWeight="600" color="primary.main">
                                    Replying to {message.author?.name}
                                  </Typography>
                                </Box>

                                <Box sx={{ p: 2 }}>
                                  {/* Reply Text Input */}
                                  <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={4}
                                    placeholder="Write your reply..."
                                    variant="standard"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (replyContent.trim()) {
                                          handleSendReply(message.id);
                                        }
                                      }
                                    }}
                                    InputProps={{
                                      disableUnderline: true,
                                      sx: {
                                        fontSize: '0.875rem',
                                        '& .MuiInputBase-input': {
                                          padding: 0,
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                          color: 'text.secondary',
                                          opacity: 0.8
                                        }
                                      }
                                    }}
                                  />

                                  {/* Reply Actions */}
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mt: 1.5
                                  }}>
                                    
                                    <Stack direction="row" spacing={1}>
                                      <Button
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyContent("");
                                        }}
                                        size="small"
                                        variant="text"
                                        sx={{
                                          color: 'text.secondary',
                                          textTransform: 'none',
                                          minWidth: 60,
                                          '&:hover': {
                                            bgcolor: 'action.hover'
                                          }
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleSendReply(message.id)}
                                        disabled={!replyContent.trim()}
                                        variant="contained"
                                        size="small"
                                        endIcon={<Send fontSize="small" />}
                                        sx={{
                                          borderRadius: 2,
                                          textTransform: 'none',
                                          minWidth: 80,
                                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                          '&:hover': {
                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                          },
                                          '&:disabled': {
                                            background: '#e0e7ff',
                                            color: 'text.disabled'
                                          }
                                        }}
                                      >
                                        Reply
                                      </Button>
                                    </Stack>
                                  </Box>
                                </Box>
                              </Paper>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
          {/* Scroll anchor - positioned at the very bottom */}
          <div 
            ref={messagesEndRef} 
            style={{ 
              height: '1px', 
              visibility: 'hidden',
              clear: 'both'
            }} 
          />
        </Box>

        {/* Modern Message Input */}
        <Box
          sx={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
            p: { xs: 1.5, sm: 2 },
            bgcolor: "background.paper",
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* Image Preview */}
          {image && (
            <Box sx={{ mb: 2 }}>
              <Paper
                elevation={2}
                sx={{
                  maxWidth: 300,
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: "relative",
                  bgcolor: 'grey.50'
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setImage(null)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.7)",
                    color: "white",
                    zIndex: 2,
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                <Box
                  component="img"
                  src={URL.createObjectURL(image)}
                  alt="Image preview"
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    📎 Ready to send
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {/* Input Container */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '2px solid #e3f2fd',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
              '&:focus-within': {
                borderColor: 'primary.main'
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              {/* Main Input */}
              <TextField
                fullWidth
                multiline
                maxRows={6}
                placeholder="Type your message..."
                variant="standard"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onFocus={() => wsSendTyping && wsSendTyping(true)}
                onBlur={() => wsSendTyping && wsSendTyping(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (newMessage.trim() || image) {
                      handleSendMessage();
                    }
                  }
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '1rem',
                    '& .MuiInputBase-input': {
                      padding: 0,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.8
                    }
                  }
                }}
              />

              {/* Actions Row */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 1.5
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* File Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload-modern"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload-modern">
                    <IconButton
                      component="span"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          color: 'primary.main'
                        }
                      }}
                    >
                      <AttachFile fontSize="small" />
                    </IconButton>
                  </label>

                  {/* Connection Status - Hidden on mobile */}
                  <Chip
                    label={wsConnected ? "🟢 Connected" : "🔴 Offline"}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      height: 24,
                      fontSize: '0.7rem',
                      borderColor: wsConnected ? 'success.main' : 'error.main',
                      color: wsConnected ? 'success.dark' : 'error.dark',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  />
                </Box>

                {/* Send Button */}
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={(!newMessage.trim() && !image) || sending}
                  endIcon={sending ? <CircularProgress size={16} /> : <Send fontSize="small" />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    minWidth: { xs: 80, sm: 100 },
                    px: { xs: 2, sm: 3 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                    '&:disabled': {
                      background: '#e0e7ff',
                      color: 'text.disabled'
                    }
                  }}
                >
                  {sending ? (
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Sending</Box>
                  ) : (
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Send</Box>
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
    </>
  );
}
