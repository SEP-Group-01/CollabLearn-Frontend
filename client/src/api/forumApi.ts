import axios from 'axios';
import type { MessageType, ReplyType } from '../types/ForumInterfaces';
import { getAccessToken, getUserData } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Get current user ID from stored user data
const getCurrentUserId = (): string => {
  const userData = getUserData();
  if (!userData || !userData.id) {
    throw new Error('User not authenticated or user ID not found');
  }
  return userData.id.toString(); // Ensure it's a string
};

// Simple in-memory store for mock messages (persists during session)
let mockMessages: MessageType[] = [];

// Forum API Functions
export const getForumMessages = async (workspaceId: string): Promise<MessageType[]> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/api/workspaces/${workspaceId}/forum/messages`);
    console.log('✅ Successfully connected to backend API');
    
    // Check if backend returned an error object instead of data
    if (response.data && typeof response.data === 'object' && response.data.success === false) {
      // Check if this is the specific like relationship error
      if (response.data.error && response.data.error.includes('message_likes')) {
        throw new Error(`Backend Error: ${response.data.error}`);
      }
      throw new Error(`Backend Error: ${response.data.error}`);
    }
    
    // Handle wrapped response format: {success: true, data: [...]}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching forum messages:', error);
    console.log('Full error details:', {
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Check if this is a network/backend issue, server error, or the specific message_likes relationship error
    const shouldUseFallback = error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || 
                             error.response?.status >= 500 || !error.response ||
                             error.code === 'ERR_BAD_RESPONSE' ||
                             (error.message && error.message.includes('message_likes'));
    
    if (shouldUseFallback && workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      const errorType = error.message && error.message.includes('message_likes') ? 'Schema/Likes' : error.response?.status || 'Network';
      console.log(`🎭 Backend error (${errorType}) - Using mock data fallback for testing`);
      
      // Initialize mock messages if empty
      if (mockMessages.length === 0) {
        mockMessages = [
          {
            id: 1,
            content: 'Welcome to the Web Design workspace! This is mock data while your backend is being set up.',
            author: {
              id: 1,
              name: 'System',
              avatar: '/src/assets/profile_img_1.png',
              role: 'admin',
            },
            timestamp: new Date().toISOString(),
            isPinned: true,
            likes: 0, // Keep for compatibility but not used
            replies: [],
            isLiked: false, // Keep for compatibility but not used
          },
        ];
      }
      
      return [...mockMessages]; // Return a copy
    }
    
    // For other errors, throw them
    throw error;
  }
};

export const createForumMessage = async (
  workspaceId: string, 
  content: string, 
  image?: File
): Promise<MessageType> => {
  try {
    const api = createAuthenticatedRequest();
    const authorId = getCurrentUserId(); // Get current user ID
    
    if (image) {
      // Handle image upload
      const formData = new FormData();
      formData.append('content', content);
      formData.append('authorId', authorId);
      formData.append('image', image);
      
      const response = await api.post(`/api/workspaces/${workspaceId}/forum/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle wrapped response format: {success: true, data: {...}}
      if (response.data && response.data.success === true && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } else {
      // Text-only message
      const response = await api.post(`/api/workspaces/${workspaceId}/forum/messages`, {
        content,
        authorId, // Include authorId as required by backend
      });
      
      // Check if backend returned an error object instead of data
      if (response.data && typeof response.data === 'object' && response.data.success === false) {
        throw new Error(`Backend Error: ${response.data.error}`);
      }
      
      // Handle wrapped response format: {success: true, data: {...}}
      if (response.data && response.data.success === true && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    }
  } catch (error: any) {
    console.error('Error creating forum message:', error);
    console.log('Full error details for message creation:', {
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Check if this is a backend issue (including 500 errors)
    const shouldUseFallback = error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || 
                             error.response?.status >= 500 || !error.response ||
                             error.code === 'ERR_BAD_RESPONSE';
    
    // Temporary mock fallback for testing
    if (shouldUseFallback && workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      console.log(`🎭 Backend error (${error.response?.status || 'Network'}) - Using mock message creation for testing`);
      const userData = getUserData();
      
      const newMessage: MessageType = {
        id: Date.now(), // Use timestamp as ID for uniqueness
        content,
        author: {
          id: userData ? parseInt(userData.id.toString()) : 1,
          name: userData ? `${userData.first_name} ${userData.last_name}` : 'Mock User',
          avatar: '/src/assets/profile_img2.png',
          role: 'member',
        },
        timestamp: new Date().toISOString(),
        isPinned: false,
        likes: 0, // Keep for compatibility but not used
        replies: [],
        isLiked: false, // Keep for compatibility but not used
        image: image ? URL.createObjectURL(image) : undefined,
      };
      
      // Check if message already exists to prevent duplicates
      const existingMessage = mockMessages.find(msg => 
        msg.content === content && 
        Math.abs(new Date(msg.timestamp).getTime() - new Date(newMessage.timestamp).getTime()) < 5000
      );
      
      if (!existingMessage) {
        // Add to mock messages store so it persists
        mockMessages.push(newMessage);
        console.log(`✅ Mock message added. Total messages: ${mockMessages.length}`);
      } else {
        console.log(`⚠️ Duplicate message detected, skipping add`);
      }
      
      return newMessage;
    }
    
    throw new Error(error.response?.data?.message || 'Failed to create message');
  }
};

export const createReply = async (
  workspaceId: string,
  messageId: number, 
  content: string
): Promise<ReplyType> => {
  try {
    const api = createAuthenticatedRequest();
    const authorId = getCurrentUserId(); // Get current user ID
    
    const response = await api.post(`/api/workspaces/${workspaceId}/forum/messages`, {
      content,
      authorId,
      parentMessageId: messageId.toString(), // This creates a reply by setting parentMessageId
    });
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error creating reply:', error);
    throw new Error(error.response?.data?.message || 'Failed to create reply');
  }
};

export const pinMessage = async (workspaceId: string, messageId: number): Promise<{ isPinned: boolean }> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId(); // Get current user ID
    
    const response = await api.put(`/api/workspaces/${workspaceId}/forum/messages/${messageId}/pin`, {
      userId, // Include userId as required by backend
    });
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error pinning message:', error);
    throw new Error(error.response?.data?.message || 'Failed to pin message');
  }
};

export const getWorkspaceInfo = async (workspaceId: string) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/api/workspaces/${workspaceId}`);
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching workspace info:', error);
    
    // Temporary mock data fallback for testing
    if (workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      console.log('🎭 Using mock workspace info for testing');
      return {
        id: workspaceId,
        title: 'Web Design',
        description: 'Learn web design from basics to advanced topics.',
        category: 'Design',
        members: 120,
        lightColor: '#E0F2FE',
        darkColor: '#0369A1',
        isAdmin: false,
        isMember: true,
      };
    }
    
    throw new Error(error.response?.data?.message || 'Failed to fetch workspace info');
  }
};