import axios from 'axios';
import { getAccessToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  
  // Since VITE_API_URL already includes /api, use it directly
  const baseURL = API_URL;
  
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  
  return instance;
};

// ============================================
// Types and Interfaces
// ============================================

export interface StudySlot {
  id?: string;
  user_id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_free?: boolean;
  duration_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ResourceInput {
  workspace_id: string;
  thread_id: string;
  resource_id: string;
  title: string;
  remaining_minutes: number;
  include_revision?: boolean;
  resource_type?: string;
}

export interface SlotInput {
  slot_id?: string;
  week_number: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface SchedulingRules {
  max_consecutive_same_resource?: number;
  mix_threads_across_workspaces?: boolean;
  balance_workspace_focus?: boolean;
}

export interface GeneratePlanRequest {
  max_weeks: number;
  revision_ratio?: number;
  scheduling_rules?: SchedulingRules;
  slots: SlotInput[];
  resources: ResourceInput[];
}

export interface ScheduledResource {
  resource_id: string;
  title: string;
  workspace_id: string;
  thread_id: string;
  workspace_title?: string;
  thread_title?: string;
  allocated_minutes: number;
  task_type: 'study' | 'revision';
  task_id?: string;
}

export interface ScheduleSlot {
  slot_id?: string;
  week_number: number;
  day_of_week: number;
  day_name: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  assigned_resources: ScheduledResource[];
}

export interface StudyPlanResponse {
  plan_id: string;
  user_id: string;
  max_weeks: number;
  revision_ratio: number;
  plan_start_date: string;
  plan_end_date: string;
  generated_at: string;
  total_study_hours: number;
  total_revision_hours: number;
  schedule: ScheduleSlot[];
  warnings?: string[];
  success: boolean;
}

export interface TaskUpdate {
  task_id: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completion_percentage?: number;
  actual_time_spent?: number;
  rating?: number;
  notes?: string;
}

export interface WorkspaceWithThreads {
  id: string;
  title: string;
  threads: ThreadWithResources[];
}

export interface ThreadWithResources {
  id: string;
  name: string;
  workspace_id: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  resource_type: string;
  thread_id: string;
  workspace_id: string;
  estimated_duration?: number;
}

// ============================================
// Study Slot API Functions
// ============================================

export const createStudySlot = async (slot: Omit<StudySlot, 'id' | 'user_id'>): Promise<StudySlot> => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/study-plan/slots', slot);
  return response.data.slot;
};

export const getStudySlots = async (isFree?: boolean): Promise<StudySlot[]> => {
  const api = createAuthenticatedRequest();
  const params = isFree !== undefined ? { is_free: isFree } : {};
  const response = await api.get('/study-plan/slots', { params });
  console.log('Fetched study slots:', response.data.slots);
  return response.data.slots || [];
};

export const updateStudySlot = async (slotId: string, updateData: Partial<StudySlot>): Promise<StudySlot> => {
  const api = createAuthenticatedRequest();
  const response = await api.put(`/study-plan/slots/${slotId}`, updateData);
  return response.data.slot;
};

export const deleteStudySlot = async (slotId: string): Promise<void> => {
  const api = createAuthenticatedRequest();
  await api.delete(`/study-plan/slots/${slotId}`);
};

// ============================================
// Study Plan Generation API Functions
// ============================================

export const generateStudyPlan = async (request: GeneratePlanRequest): Promise<StudyPlanResponse> => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/study-plan/generate', request);
  return response.data;
};

export const analyzeFeasibility = async (request: Omit<GeneratePlanRequest, 'revision_ratio' | 'scheduling_rules'>): Promise<any> => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/study-plan/analyze-feasibility', request);
  return response.data.analysis;
};

export const getPlanHistory = async (status?: string): Promise<any[]> => {
  const api = createAuthenticatedRequest();
  const params = status ? { status } : {};
  const response = await api.get('/study-plan/history', { params });
  return response.data.plans || [];
};

export const dropStudyPlan = async (planId: string): Promise<void> => {
  const api = createAuthenticatedRequest();
  await api.delete(`/study-plan/plans/${planId}`);
};

// ============================================
// Task Management API Functions
// ============================================

export const getTasks = async (planId?: string): Promise<any[]> => {
  const api = createAuthenticatedRequest();
  const params = planId ? { plan_id: planId } : {};
  const response = await api.get('/study-plan/tasks', { params });
  return response.data.tasks || [];
};

export const updateTask = async (taskId: string, update: Omit<TaskUpdate, 'task_id'>): Promise<any> => {
  const api = createAuthenticatedRequest();
  const response = await api.put(`/study-plan/tasks/${taskId}`, update);
  return response.data.task;
};

// ============================================
// Workspace/Resource API Functions
// ============================================

export const getWorkspacesWithThreads = async (): Promise<WorkspaceWithThreads[]> => {
  const api = createAuthenticatedRequest();
  console.log('🏢 [StudyPlanAPI] Fetching workspaces with threads...');
  try {
    const response = await api.get('/study-plan/workspaces');
    console.log('✅ [StudyPlanAPI] Workspaces response:', response.data);
    return response.data.workspaces || [];
  } catch (error: any) {
    console.error('❌ [StudyPlanAPI] Error fetching workspaces:', error.response?.data || error.message);
    throw error;
  }
};
