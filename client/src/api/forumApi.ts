import axios from "axios";
import type { MessageType, ReplyType } from "../types/ForumInterfaces";
import { getAccessToken } from "./authApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
};

// Forum API Functions
export const getForumMessages = async (groupId: string): Promise<MessageType[]> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/api/forum/${groupId}/messages`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching forum messages:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

export const createForumMessage = async (
  groupId: string, 
  content: string, 
  image?: File
): Promise<MessageType> => {
  try {
    const api = createAuthenticatedRequest();
    
    if (image) {
      // Handle image upload
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', image);
      
      const response = await api.post(`/api/forum/${groupId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } else {
      // Text-only message
      const response = await api.post(`/api/forum/${groupId}/messages`, {
        content
      });
      return response.data;
    }
  } catch (error: any) {
    console.error('Error creating forum message:', error);
    throw new Error(error.response?.data?.message || 'Failed to create message');
  }
};

export const createReply = async (
  messageId: number, 
  content: string
): Promise<ReplyType> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post(`/api/forum/messages/${messageId}/replies`, {
      content
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating reply:', error);
    throw new Error(error.response?.data?.message || 'Failed to create reply');
  }
};

export const likeMessage = async (messageId: number): Promise<{ likes: number; isLiked: boolean }> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post(`/api/forum/messages/${messageId}/like`);
    return response.data;
  } catch (error: any) {
    console.error('Error liking message:', error);
    throw new Error(error.response?.data?.message || 'Failed to like message');
  }
};

export const likeReply = async (replyId: number): Promise<{ likes: number; isLiked: boolean }> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post(`/api/forum/replies/${replyId}/like`);
    return response.data;
  } catch (error: any) {
    console.error('Error liking reply:', error);
    throw new Error(error.response?.data?.message || 'Failed to like reply');
  }
};

export const pinMessage = async (messageId: number): Promise<{ isPinned: boolean }> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post(`/api/forum/messages/${messageId}/pin`);
    return response.data;
  } catch (error: any) {
    console.error('Error pinning message:', error);
    throw new Error(error.response?.data?.message || 'Failed to pin message');
  }
};

export const getGroupInfo = async (groupId: string) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/api/groups/${groupId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching group info:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch group info');
  }
};
