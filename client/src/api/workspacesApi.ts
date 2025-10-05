import axios from "axios";
import { getAccessToken } from "./authApi";
import type { 
  Workspace, 
  WorkspaceFormData
} from "../types/WorkspaceInterfaces";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
    const response = await axios.get(`${API_URL}/workspaces/search/${searchTerm}`);
    return response.data;
};

export const joinWorkspace = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/join`, { workspaceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const leaveWorkspace = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/leave`, { workspaceId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
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

// Update workspace details (title, description, image, join policy)
export const updateWorkspace = async (workspaceId: string, workspaceData: FormData | Partial<Workspace>) => {
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
        console.log("Updating workspace with FormData:");
        for (let [key, value] of (workspaceData as FormData).entries()) {
            console.log(`${key}:`, value);
        }
    } else {
        console.log("Updating workspace with JSON data:", workspaceData);
    }
    
    const response = await axios.put(`${API_URL}/workspaces/${workspaceId}`, workspaceData, {
        headers,
    });
    return response.data;
};

// Get workspace members and their roles
export const getWorkspaceMembers = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/members`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    return response.data;
};

// Remove a member from the workspace
export const removeMember = async (workspaceId: string, memberId: string) => {
    const token = getAccessToken();
    const response = await axios.delete(`${API_URL}/workspaces/${workspaceId}/members/${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Promote a member to admin
export const promoteToAdmin = async (workspaceId: string, memberId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/${workspaceId}/members/${memberId}/promote`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Remove admin role from a member
export const removeAdminRole = async (workspaceId: string, memberId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/${workspaceId}/members/${memberId}/demote`, {}, {
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

// Get join requests for a workspace (admin only)
export const getWorkspaceJoinRequests = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/join-requests`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Approve a join request (admin only)
export const approveJoinRequest = async (workspaceId: string, requestId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/workspaces/${workspaceId}/join-requests/${requestId}/approve`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Reject/Delete a join request (admin only)
export const rejectJoinRequest = async (workspaceId: string, requestId: string) => {
    const token = getAccessToken();
    const response = await axios.delete(`${API_URL}/workspaces/${workspaceId}/join-requests/${requestId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
