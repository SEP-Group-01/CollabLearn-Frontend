import axios from "axios";
import { getAccessToken } from "./authApi";
import type { 
  Workspace, 
  WorkspaceFormData
} from "../types/WorkspaceInterfaces";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  
  let baseURL;
  if (API_URL.includes('/api')) {
    baseURL = API_URL;
  } else {
    baseURL = `${API_URL}/api`;
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

// Get all workspaces
export const getAllWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get('/workspaces');
    
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn('Unexpected getAllWorkspaces response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching all workspaces:', error);
    if ((error as any).response?.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error((error as any).response?.data?.message || (error as any).message || 'Failed to fetch workspaces');
  }
};

// Search workspaces
export const searchWorkspaces = async (searchTerm: string): Promise<Workspace[]> => {
  if (!searchTerm.trim()) {
    return getAllWorkspaces();
  }
  
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/workspaces/search?q=${encodeURIComponent(searchTerm)}`);
    
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn('Unexpected searchWorkspaces response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error searching workspaces:', error);
    if ((error as any).response?.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error((error as any).response?.data?.message || (error as any).message || 'Failed to search workspaces');
  }
};

// Get user's workspaces
export const getUserWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get('/workspaces/my');
    
    if (response.data && response.data.success === true && response.data.data) {
      return response.data.data;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn('Unexpected getUserWorkspaces response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    if ((error as any).response?.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error((error as any).response?.data?.message || (error as any).message || 'Failed to fetch user workspaces');
  }
};

export const createWorkspace = async (workspaceData: Partial<WorkspaceFormData> | FormData) => {
  const token = getAccessToken();
  
  // Check if workspaceData is FormData (for image uploads)
  const isFormData = workspaceData instanceof FormData;
  
  const headers: any = {
    Authorization: `Bearer ${token}`,
  };
  
  // Don't set Content-Type for FormData, let axios handle it
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // Debug logging for FormData
  if (isFormData) {
    console.log("Creating workspace with FormData:");
    for (let [key, value] of (workspaceData as FormData).entries()) {
      console.log(`${key}:`, value);
    }
  } else {
    console.log("Creating workspace with JSON data:", workspaceData);
  }
  console.log("Headers:", headers);
  
  const response = await axios.post(`${API_URL}/workspaces/create`, workspaceData, {
    headers,
  });
  return response.data;
};

export const getWoorkspacesBySearchTerm = async (searchTerm: string) => {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/workspaces/search/${searchTerm}`);
    return response.data;
};

export const joinWorkspace = async (workspaceId: string) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/workspaces/join', { workspaceId });
    return response.data;
};

export const leaveWorkspace = async (workspaceId: string) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/workspaces/leave', { workspaceId });
    return response.data;
};

export const sendJoinRequest = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/request`, { workspaceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const cancelJoinRequest = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/cancel-request`, { workspaceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const validateEmail = async (workspaceId: string, email: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/validate-email`, { workspaceId, email }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const sendBulkInvites = async (workspaceId: string, emails: string[]) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/bulk-invite`, { workspaceId, emails }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const acceptInvite = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/accept-invite`, { workspaceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const declineInvite = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/decline-invite`, { workspaceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getWorkspaceInvites = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/invites`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteInvite = async (inviteId: string) => {
    const token = getAccessToken();
    const response = await axios.delete(`${API_URL}/workspaces/invites/${inviteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getThreadsByWorkspaceId = async (workspaceId: string) => {
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/threads`);
    return response.data;
};

export const getUserRoleInWorkspace = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/user-role`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getUserRoleInThread = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/${threadId}/role`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createThreadInWorkspace = async (workspaceId: string, threadData: { title: string; description: string }) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/${workspaceId}/threads/create`, threadData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get workspace data by ID - now returns workspace with role included
export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    return response.data;
};
