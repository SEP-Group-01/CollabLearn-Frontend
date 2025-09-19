import axios from 'axios';
import type { 
  TimeSlot, 
  StudyPlanRequest, 
  StudyPlanResult, 
  StudyPlanStats,
  TimeSlotApiResponse,
  StudyPlanApiResponse,
  WorkspaceApiResponse
} from '../types/StudyPlanInterfaces';
import { getAccessToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with auth headers
const createAuthHeaders = () => {
  const token = getAccessToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Time Slots Management
export const getUserTimeSlots = async (userId: number): Promise<TimeSlot[]> => {
  try {
    const response = await axios.get<TimeSlotApiResponse>(
      `${API_URL}/api/users/${userId}/time-slots`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch time slots');
  }
};

export const createTimeSlot = async (userId: number, timeSlot: Omit<TimeSlot, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<TimeSlot> => {
  try {
    const response = await axios.post<{ data: TimeSlot }>(
      `${API_URL}/api/users/${userId}/time-slots`,
      timeSlot,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create time slot');
  }
};

export const updateTimeSlot = async (userId: number, timeSlotId: number, timeSlot: Partial<TimeSlot>): Promise<TimeSlot> => {
  try {
    const response = await axios.put<{ data: TimeSlot }>(
      `${API_URL}/api/users/${userId}/time-slots/${timeSlotId}`,
      timeSlot,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update time slot');
  }
};

export const deleteTimeSlot = async (userId: number, timeSlotId: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/api/users/${userId}/time-slots/${timeSlotId}`,
      createAuthHeaders()
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete time slot');
  }
};

// Workspace and Thread Information
export const getUserWorkspacesWithThreads = async (userId: number): Promise<WorkspaceApiResponse['data']> => {
  try {
    const response = await axios.get<WorkspaceApiResponse>(
      `${API_URL}/api/users/${userId}/workspaces`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workspaces');
  }
};

export const getWorkspaceThreads = async (userId: number, workspaceId: number): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${userId}/workspaces/${workspaceId}/threads`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workspace threads');
  }
};

export const getWorkspaceResources = async (userId: number, workspaceId: number): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${userId}/workspaces/${workspaceId}/resources`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workspace resources');
  }
};

// Study Plan Generation
export const generateStudyPlan = async (request: StudyPlanRequest): Promise<StudyPlanResult> => {
  try {
    const response = await axios.post<StudyPlanApiResponse>(
      `${API_URL}/api/study-plans/generate`,
      request,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate study plan');
  }
};

export const getUserStudyPlans = async (userId: number): Promise<StudyPlanResult[]> => {
  try {
    const response = await axios.get<{ data: StudyPlanResult[] }>(
      `${API_URL}/api/users/${userId}/study-plans`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch study plans');
  }
};

export const getStudyPlanById = async (userId: number, planId: number): Promise<StudyPlanResult> => {
  try {
    const response = await axios.get<{ data: StudyPlanResult }>(
      `${API_URL}/api/users/${userId}/study-plans/${planId}`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch study plan');
  }
};

export const getActiveStudyPlan = async (userId: number): Promise<StudyPlanResult | null> => {
  try {
    const response = await axios.get<{ data: StudyPlanResult | null }>(
      `${API_URL}/api/users/${userId}/study-plans/active`,
      createAuthHeaders()
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No active study plan
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch active study plan');
  }
};

// Study Plan Progress Tracking
export const updateStudySessionStatus = async (
  userId: number, 
  sessionId: number, 
  status: 'in_progress' | 'completed' | 'skipped',
  actualTimeSpent?: number,
  userRating?: number,
  notes?: string
): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/api/users/${userId}/study-sessions/${sessionId}`,
      {
        status,
        actual_time_spent: actualTimeSpent,
        user_rating: userRating,
        notes,
        completion_date: status === 'completed' ? new Date().toISOString() : undefined
      },
      createAuthHeaders()
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update study session');
  }
};

export const getStudyPlanStats = async (userId: number, planId?: number): Promise<StudyPlanStats> => {
  try {
    const url = planId 
      ? `${API_URL}/api/users/${userId}/study-plans/${planId}/stats`
      : `${API_URL}/api/users/${userId}/study-plans/stats`;
    
    const response = await axios.get<{ data: StudyPlanStats }>(url, createAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch study plan stats');
  }
};

export const pauseStudyPlan = async (userId: number, planId: number): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/api/users/${userId}/study-plans/${planId}/pause`,
      {},
      createAuthHeaders()
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to pause study plan');
  }
};

export const resumeStudyPlan = async (userId: number, planId: number): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/api/users/${userId}/study-plans/${planId}/resume`,
      {},
      createAuthHeaders()
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resume study plan');
  }
};

export const deleteStudyPlan = async (userId: number, planId: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/api/users/${userId}/study-plans/${planId}`,
      createAuthHeaders()
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete study plan');
  }
};