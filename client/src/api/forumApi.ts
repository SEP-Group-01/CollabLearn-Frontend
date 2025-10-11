import axios, { AxiosError } from 'axios';
import type { MessageType, ReplyType } from '../types/ForumInterfaces';
import { getAccessToken, getUserData } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('🔧 API_URL from environment:', API_URL);
console.log('🔧 API_URL ends with /api:', API_URL.endsWith('/api'));

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  
  // If API_URL already includes /api, use it directly. Otherwise add /api
  let baseURL;
  if (API_URL.includes('/api')) {
    baseURL = API_URL; // Already includes /api
  } else {
    baseURL = `${API_URL}/api`; // Need to add /api
  }
  console.log('🔧 Final baseURL used:', baseURL);
  
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  
  // Add request interceptor to log full URLs
  instance.interceptors.request.use((config) => {
    console.log('🔧 Making request to:', (config.baseURL || '') + (config.url || ''));
    return config;
  });
  
  return instance;
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
  console.log('🔍 getForumMessages called with workspaceId:', workspaceId);
  console.log('🔍 WorkspaceId length:', workspaceId.length);
  console.log('🔍 WorkspaceId characters:', workspaceId.split('').map((char, i) => `${i}: '${char}'`));
  
  try {
    console.log('🔧 Fetching forum messages for workspace:', workspaceId);
    const api = createAuthenticatedRequest();
    const fullPath = `/workspaces/${workspaceId}/forum/messages`;
    console.log('🔍 Full request path:', fullPath);
    const response = await api.get(fullPath);
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
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error fetching forum messages:', axiosError);
    console.log('Full error details:', {
      code: axiosError.code,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message
    });
    
    // Check if this is a network/backend issue, server error, or the specific message_likes relationship error
    const shouldUseFallback = axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK' || 
                             (axiosError.response?.status && axiosError.response.status >= 500) || !axiosError.response ||
                             axiosError.code === 'ERR_BAD_RESPONSE' ||
                             axiosError.response?.status === 404 ||
                             (axiosError.message && axiosError.message.includes('message_likes')) ||
                             (axiosError.message && axiosError.message.includes('uuid')) || // Add UUID parsing errors
                             (axiosError.message && axiosError.message.includes('Backend Error')); // Add backend errors
    
    if (shouldUseFallback && workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      const errorType = axiosError.message && axiosError.message.includes('message_likes') ? 'Schema/Likes' : axiosError.response?.status || 'Network';
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
    const requestPath = `/workspaces/${workspaceId}/forum/messages`;
    console.log('🔧 Making POST request to path:', requestPath);
    console.log('🔧 Full URL will be:', api.defaults.baseURL + requestPath);
    
    if (image) {
      // Handle image upload
      const formData = new FormData();
      formData.append('content', content);
      formData.append('authorId', authorId);
      formData.append('image', image);
      
      const response = await api.post(requestPath, formData, {
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
      const response = await api.post(requestPath, {
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
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error creating forum message:', axiosError);
    console.log('Full error details for message creation:', {
      code: axiosError.code,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message
    });
    
    // Check if this is a backend issue (including 500 errors and 404 errors)
    const shouldUseFallback = axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK' || 
                             (axiosError.response?.status && axiosError.response.status >= 500) || !axiosError.response ||
                             axiosError.code === 'ERR_BAD_RESPONSE' ||
                             axiosError.response?.status === 404 ||
                             (axiosError.message && axiosError.message.includes('uuid')) || // Add UUID parsing errors
                             (axiosError.message && axiosError.message.includes('Backend Error')); // Add backend errors
    
    // Temporary mock fallback for testing
    if (shouldUseFallback && workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      console.log(`🎭 Backend error (${axiosError.response?.status || 'Network'}) - Using mock message creation for testing`);
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
    
    throw new Error(axiosError.response?.data?.message || 'Failed to create message');
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
    
    const response = await api.post(`/workspaces/${workspaceId}/forum/messages`, {
      content,
      authorId,
      parent_id: messageId.toString(), // Use parent_id to match your database schema
    });
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error creating reply:', axiosError);
    
    // Check if this is a backend issue - add fallback for replies
    const shouldUseFallback = axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK' || 
                             (axiosError.response?.status && axiosError.response.status >= 500) || !axiosError.response ||
                             axiosError.code === 'ERR_BAD_RESPONSE' ||
                             axiosError.response?.status === 404 ||
                             (axiosError.message && axiosError.message.includes('uuid')) ||
                             (axiosError.message && axiosError.message.includes('Backend Error'));
    
    // Temporary mock fallback for replies when backend is not ready
    if (shouldUseFallback && workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      console.log(`🎭 Backend error creating reply - Using mock reply for testing`);
      const userData = getUserData();
      
      const newReply: ReplyType = {
        id: Date.now(), // Use timestamp as ID for uniqueness
        content,
        author: {
          id: userData ? parseInt(userData.id.toString()) : 1,
          name: userData ? `${userData.first_name} ${userData.last_name}` : 'Mock User',
          avatar: '/src/assets/profile_img2.png',
          role: 'member',
        },
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false
      };
      
      console.log(`✅ Mock reply created for message ${messageId}`);
      return newReply;
    }
    
    throw new Error(axiosError.response?.data?.message || 'Failed to create reply');
  }
};

export const pinMessage = async (workspaceId: string, messageId: number): Promise<{ isPinned: boolean }> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId(); // Get current user ID
    
    const response = await api.put(`/workspaces/${workspaceId}/forum/messages/${messageId}/pin`, {
      userId, // Include userId as required by backend
    });
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error pinning message:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to pin message');
  }
};

export const getWorkspaceInfo = async (workspaceId: string) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/workspaces/${workspaceId}`);
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error fetching workspace info:', axiosError);
    
    // Handle backend errors (500, 404, UUID parsing errors) with fallback
    const shouldUseFallback = axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK' || 
                             (axiosError.response?.status && axiosError.response.status >= 500) || !axiosError.response ||
                             axiosError.code === 'ERR_BAD_RESPONSE' ||
                             axiosError.response?.status === 404 ||
                             (axiosError.message && axiosError.message.includes('uuid'));
    
    // Temporary mock data fallback for testing
    if (shouldUseFallback && workspaceId === '09700b1d-ebc5-4d53-ba83-2434505fd21a') {
      console.log(`🎭 Backend error (${axiosError.response?.status || axiosError.code || 'Network'}) - Using mock workspace info for testing`);
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
    
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch workspace info');
  }
};