import axios from "axios";
import { getAccessToken } from "./authApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create a new thread in a workspace
export const createThread = async (workspaceId: string, threadData: { name: string; description: string }) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/threads/${workspaceId}/create`, threadData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Get all threads in a workspace
export const getThreadsByWorkspace = async (workspaceId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/threads`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get a specific thread by ID
export const getThread = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/${threadId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Update thread details
export const updateThread = async (threadId: string, threadData: { name?: string; title?: string; description?: string }) => {
    const token = getAccessToken();
    const response = await axios.put(`${API_URL}/threads/${threadId}`, threadData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Delete a thread
export const deleteThread = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.delete(`${API_URL}/threads/${threadId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Subscribe to a thread
export const subscribeToThread = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/threads/${threadId}/subscribe`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Unsubscribe from a thread
export const unsubscribeFromThread = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/threads/${threadId}/unsubscribe`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get thread subscribers
export const getThreadSubscribers = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/${threadId}/subscribers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log('Thread subscribers:', response.data);
    return response.data;
};

// Assign moderators to a thread
export const assignModerators = async (threadId: string, userIds: string[]) => {
    const token = getAccessToken();
    const response = await axios.post(`${API_URL}/threads/${threadId}/moderators`, { userIds }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Remove moderators from a thread
export const removeModerators = async (threadId: string, userIds: string[]) => {
    const token = getAccessToken();
    const response = await axios.delete(`${API_URL}/threads/${threadId}/moderators`, {
        data: { userIds },
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Get thread statistics (resources, quizzes, etc.)
export const getThreadStats = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/${threadId}/stats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log('Thread stats:', response.data);
    return response.data;
};

// Get thread resources
export const getThreadResources = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/${threadId}/resources`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get thread quizzes
export const getThreadQuizzes = async (threadId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/${threadId}/quizzes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get quiz attempts for a specific quiz
export const getQuizAttempts = async (quizId: string) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/threads/quizzes/${quizId}/attempts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};