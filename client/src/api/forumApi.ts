import axios, { AxiosError } from 'axios';
import type { MessageType, ReplyType } from '../types/ForumInterfaces';
import { getAccessToken, getUserData } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Please sign in to continue');
  }
  
  // If API_URL already includes /api, use it directly. Otherwise add /api
  let baseURL;
  if (API_URL.includes('/api')) {
    baseURL = API_URL; // Already includes /api
  } else {
    baseURL = `${API_URL}/api`; // Need to add /api
  }
  
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  // Add request interceptor to handle different content types
  instance.interceptors.request.use((config) => {
    // Don't set content-type for FormData, axios will set it automatically with boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  });
  
  return instance;
};

// Get current user ID from stored user data
const getCurrentUserId = (): string => {
  // Get user data directly from localStorage (synchronous)
  const userDataString = localStorage.getItem('user_data');
  const token = getAccessToken();

  if (!token) {
    console.warn('No auth token found');
    throw new Error('Please sign in to continue');
  }

  if (!userDataString) {
    console.warn('No user data found in storage');
    throw new Error('Please sign in to continue');
  }

  try {
    const userData = JSON.parse(userDataString);
    if (!userData.id) {
      console.warn('Invalid user data - missing ID');
      throw new Error('User authentication is invalid');
    }
    return userData.id.toString();
  } catch (error) {
    console.error('Error parsing user data:', error);
    throw new Error('Invalid user data');
  }
};

// Forum API Functions
export const getForumMessages = async (workspaceId: string): Promise<MessageType[]> => {
  if (!workspaceId || workspaceId.length < 10) {
    throw new Error('Invalid workspace ID provided');
  }
  
  try {
    const api = createAuthenticatedRequest();
    const fullPath = `/forum/workspaces/${workspaceId}/forum/messages`;
    const response = await api.get(fullPath);
    
    // Check if backend returned an error object instead of data
    if (response.data && typeof response.data === 'object' && response.data.success === false) {
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
    
    // Re-throw the error for proper error handling in components
    throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to load messages');
  }
};

export const createForumMessage = async (
  workspaceId: string, 
  content: string, 
  image?: File
): Promise<MessageType> => {
  console.log('📨 Creating forum message:', { workspaceId, content, hasImage: !!image });
  
  if (!workspaceId) {
    console.error('❌ Missing workspace ID');
    throw new Error('Workspace ID is required');
  }

  try {
    // Get user data first to ensure authentication
    let authorId: string;
    try {
      console.log('🔍 Getting current user ID...');
      authorId = getCurrentUserId();
      console.log('✅ Got user ID:', authorId);
    } catch (error) {
      console.error('❌ Authentication error:', error);
      console.log('🔐 Auth state:', {
        token: !!getAccessToken(),
        userData: !!getUserData()
      });
      throw new Error('Please sign in to send messages');
    }

    console.log('🔧 Creating authenticated request...');
    const api = createAuthenticatedRequest();
    const requestPath = `/forum/workspaces/${workspaceId}/forum/messages`;
    console.log('📡 Request path:', requestPath);
    
    // Convert image to base64 if present
    let imageBase64: string | undefined;
    if (image) {
      console.log('📸 Converting image to base64...');
      imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
      console.log('✅ Image converted to base64');
    }
    
    // Prepare JSON payload with image as base64
    console.log('📝 Preparing message payload...');
    const payload = {
      content,
      authorId,
      image: imageBase64 // Include base64 image if present
    };
    console.log('📎 Payload prepared:', {
      content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      authorId,
      hasImage: !!imageBase64
    });

    const response = await api.post(requestPath, payload);
    
    // Check if backend returned an error object instead of data
    if (response.data && typeof response.data === 'object' && response.data.success === false) {
      throw new Error(`Backend Error: ${response.data.error}`);
    }
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('❌ Error creating forum message:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        headers: axiosError.config?.headers
      }
    });
    
    // Log request details
    console.log('📋 Request details:', {
      workspaceId,
      contentLength: content.length,
      hasImage: !!image,
      headers: axiosError.config?.headers
    });
    
    if (axiosError.response?.status === 401) {
      console.warn('🔑 Authentication failed - clearing tokens');
      localStorage.removeItem('accessToken');
      throw new Error('Please sign in again to send messages');
    }
    
    // Re-throw the error for proper error handling in components
    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Failed to create message';
    console.error('📛 Final error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const createReply = async (
  workspaceId: string,
  messageId: string, // Changed to string to match UUID
  content: string
): Promise<ReplyType> => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

  try {
    const api = createAuthenticatedRequest();
    const authorId = getCurrentUserId(); // Get current user ID
    
    // Use the dedicated replies endpoint
    const response = await api.post(`/forum/replies`, {
      messageId: messageId, // Parent message ID
      authorId,
      content,
    });
    
    // Handle wrapped response format: {success: true, data: {...}}
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error creating reply:', axiosError);
    
    // Re-throw the error for proper error handling in components
    throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to create reply');
  }
};

export const pinMessage = async (workspaceId: string, messageId: number): Promise<{ isPinned: boolean }> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId(); // Get current user ID
    
    const response = await api.put(`/forum/messages/${messageId}/pin`, {
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
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

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
    
    // Re-throw the error for proper error handling in components
    throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to fetch workspace info');
  }
};

// Toggle like on a message
export const toggleMessageLike = async (
  workspaceId: string,
  messageId: string | number
): Promise<{ liked: boolean; likeCount: number }> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId();
    
    const response = await api.post(`/forum/messages/like`, {
      messageId: typeof messageId === 'string' ? parseInt(messageId) : messageId,
      userId
    });
    
    // Handle wrapped response format
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error toggling message like:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to toggle like');
  }
};

// Toggle like on a reply
export const toggleReplyLike = async (
  messageId: string | number,
  replyId: string | number
): Promise<{ liked: boolean; likeCount: number }> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId();
    
    const response = await api.post(`/forum/messages/${messageId}/replies/${replyId}/like`, {
      userId
    });
    
    // Handle wrapped response format
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error toggling reply like:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to toggle reply like');
  }
};

// Delete a message
export const deleteMessage = async (
  workspaceId: string,
  messageId: string | number
): Promise<void> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId();
    
    await api.delete(`/forum/workspaces/${workspaceId}/messages/${messageId}`, {
      data: { userId }
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error deleting message:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to delete message');
  }
};

// Delete a reply
export const deleteReply = async (
  messageId: string | number,
  replyId: string | number
): Promise<void> => {
  try {
    const api = createAuthenticatedRequest();
    const userId = getCurrentUserId();
    
    await api.delete(`/forum/messages/${messageId}/replies/${replyId}`, {
      data: { userId }
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message?: string}>;
    console.error('Error deleting reply:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to delete reply');
  }
};