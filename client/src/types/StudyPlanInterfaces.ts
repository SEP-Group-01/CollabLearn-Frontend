// Study Plan Service Types
export interface TimeSlot {
  id?: string; // UUID string from backend
  user_id?: string;
  day_of_week: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  start_time: string; // Format: "HH:MM"
  end_time: string;   // Format: "HH:MM"
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudyPlanResource {
  id: string; // UUID string from backend
  name: string;
  type: "document" | "quiz" | "video" | "link";
  workspace_id: string;
  thread_id: string;
  estimated_duration: number; // in minutes
  difficulty_level: "easy" | "medium" | "hard";
  content_url?: string;
  description?: string;
}

export interface StudyPlanRequest {
  user_id: string;
  workspace_ids: string[];
  thread_ids: string[];
  priority_level: "high" | "medium" | "low";
  learning_style?: "visual" | "auditory" | "kinesthetic" | "reading";
  difficulty_preference?: "easy" | "medium" | "hard";
  session_duration_preference?: number; // in minutes
}

export interface StudySession {
  id: string; // UUID string from backend
  resource: StudyPlanResource;
  time_slot: TimeSlot;
  week_number: number;
  allocated_time: number; // in minutes
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  completion_date?: string;
  actual_time_spent?: number;
  user_rating?: number; // 1-5 scale
  notes?: string;
}

export interface StudyPlanResult {
  id: string; // UUID string from backend
  user_id: string;
  schedule: StudySession[];
  total_coverage_percentage: number;
  total_allocated_hours: number;
  plan_duration_weeks: number;
  status: "active" | "completed" | "paused";
  created_at: string;
  updated_at: string;
}

export interface StudyPlanStats {
  total_sessions: number;
  completed_sessions: number;
  total_hours_planned: number;
  total_hours_completed: number;
  average_session_rating: number;
  current_week: number;
  progress_percentage: number;
  streak_days: number;
  upcoming_sessions: StudySession[];
}

// Frontend-specific interfaces
export interface TimeSlotFormData {
  [key: string]: Array<{
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>;
}

export interface WorkspaceSelection {
  workspace_id: string;
  workspace_name: string;
  thread_ids: string[];
  thread_names: string[];
  selected: boolean;
}

export interface StudyPlanGenerationForm {
  time_slots: TimeSlot[];
  workspace_selections: WorkspaceSelection[];
  priority_level: "high" | "medium" | "low";
  learning_style: "visual" | "auditory" | "kinesthetic" | "reading";
  difficulty_preference: "easy" | "medium" | "hard";
  session_duration_preference: number;
}

// API Response types
export interface StudyPlanApiResponse {
  success: boolean;
  message: string;
  data: StudyPlanResult;
}

export interface TimeSlotApiResponse {
  success: boolean;
  message: string;
  data: TimeSlot[];
}

export interface WorkspaceApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    workspace_id: string;
    workspace_name: string;
    threads: Array<{
      thread_id: string;
      thread_name: string;
      resource_count: number;
    }>;
  }>;
}