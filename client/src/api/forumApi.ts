import axios, { AxiosError } from 'axios';
import type { MessageType, ReplyType } from '../types/ForumInterfaces';
import { getAccessToken, getUserData } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
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

// Forum API Functions
export const getForumMessages = async (workspaceId: string): Promise<MessageType[]> => {
  if (!workspaceId || workspaceId.length < 10) {
    throw new Error('Invalid workspace ID provided');
  }
  
  try {
    const api = createAuthenticatedRequest();
    const fullPath = `/workspaces/${workspaceId}/forum/messages`;
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
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

  try {
    const api = createAuthenticatedRequest();
    const authorId = getCurrentUserId(); // Get current user ID
    const requestPath = `/workspaces/${workspaceId}/forum/messages`;
    
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
    
    // Re-throw the error for proper error handling in components
    throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to create message');
  }
};

export const createReply = async (
  workspaceId: string,
  messageId: number, 
  content: string
): Promise<ReplyType> => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

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
    
    // Re-throw the error for proper error handling in components
    throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to create reply');
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