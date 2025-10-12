import axios from 'axios';
import { getAccessToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface CreateDocumentData {
  title: string;
  content?: string;
  threadId: string;
  isPublic?: boolean;
}

export interface DocumentResponse {
  id: string;
  title: string;
  content: string;
  yDocState: any;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  threadId?: string;
  isPublic?: boolean;
  allowComments?: boolean;
  allowSuggestions?: boolean;
}

export interface DocumentListItem {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  threadId: string;
  isPublic: boolean;
  allowComments: boolean;
  allowSuggestions: boolean;
  // Add permission info
  userPermission?: 'read' | 'write' | 'admin';
  isCurrentlyEditing?: boolean;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

export interface AdminCheckResponse {
  isAdminOrModerator: boolean;
}

// Check if user is admin or moderator for a thread
export const checkAdminOrModerator = async (threadId: string, token?: string): Promise<AdminCheckResponse> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/check-admin-moderator/${threadId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log('Admin/Moderator check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking admin/moderator status:', error);
    throw error;
  }
};

// Create a new document
export const createDocument = async (data: CreateDocumentData, token?: string): Promise<DocumentResponse> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.post(`${API_URL}/documents`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Get document by ID
export const getDocument = async (documentId: string, token?: string): Promise<DocumentResponse> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.get(`${API_URL}/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Update document
export const updateDocument = async (documentId: string, data: Partial<CreateDocumentData>, token?: string): Promise<DocumentResponse> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.put(`${API_URL}/documents/${documentId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (documentId: string, token?: string): Promise<void> => {
  try {
    const authToken = token || getAccessToken();
    await axios.delete(`${API_URL}/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Get document collaborators
export const getDocumentCollaborators = async (documentId: string, token?: string): Promise<any[]> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.get(`${API_URL}/documents/${documentId}/collaborators`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    throw error;
  }
};

// Join document for collaboration
export const joinDocument = async (documentId: string, token?: string): Promise<any> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.post(`${API_URL}/documents/${documentId}/join`, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error joining document:', error);
    throw error;
  }
};

// Leave document collaboration
export const leaveDocument = async (documentId: string, token?: string): Promise<any> => {
  try {
    const authToken = token || getAccessToken();
    const response = await axios.post(`${API_URL}/documents/${documentId}/leave`, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error leaving document:', error);
    throw error;
  }
};

// Get documents by thread ID
export const getDocumentsByThread = async (threadId: string): Promise<DocumentListItem[]> => {
  try {
    const authToken = getAccessToken();
    const response = await axios.get(`${API_URL}/documents/thread/${threadId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents by thread:', error);
    throw error;
  }
};
