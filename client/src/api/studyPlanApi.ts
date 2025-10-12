// Study Plan API functions
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface StudyPlanRequest {
  userId: string;
  workspaceId: string;
  threadId?: string;
  preferences?: {
    studyHours: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
  };
}

export interface StudyPlanResponse {
  success: boolean;
  studyPlan: {
    id: string;
    title: string;
    description: string;
    duration: number; // in days
    tasks: StudyTask[];
  };
  message: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  type: 'reading' | 'quiz' | 'assignment' | 'video';
  estimatedTime: number; // in minutes
  difficulty: string;
  resources: string[];
  dueDate?: string;
}

export const generateStudyPlan = async (
  request: StudyPlanRequest
): Promise<StudyPlanResponse> => {
  try {
    console.log('Sending study plan request:', request);

    const response = await fetch(`${API_URL}/query/generate-study-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to generate study plan' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      studyPlan: result.studyPlan || result,
      message: result.message || 'Study plan generated successfully'
    };

  } catch (error: any) {
    console.error('Error generating study plan:', error);
    throw new Error(error.message || "Failed to generate study plan");
  }
};

export const getStudyPlan = async (userId: string, workspaceId: string) => {
  try {
    const response = await fetch(`${API_URL}/query/get-study-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, workspaceId })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching study plan:', error);
    throw new Error(error.message || "Failed to fetch study plan");
  }
};

  // Time-slot (availability) related API helpers
  export const getUserTimeSlots = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/timeslots/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching user time slots:', err);
      throw new Error(err?.message || 'Failed to fetch time slots');
    }
  };

  export const createTimeSlot = async (userId: number, slot: any) => {
    try {
      const body = JSON.stringify({ userId, ...slot });
      const response = await fetch(`${API_URL}/timeslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!response.ok) {
        const err = await response.text().catch(() => `HTTP ${response.status}`);
        throw new Error(err || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error creating time slot:', err);
      throw new Error(err?.message || 'Failed to create time slot');
    }
  };

  export const updateTimeSlot = async (userId: number, slotId: number, slot: any) => {
    try {
      const response = await fetch(`${API_URL}/timeslots/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...slot }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error updating time slot:', err);
      throw new Error(err?.message || 'Failed to update time slot');
    }
  };

  export const deleteTimeSlot = async (userId: number, slotId: number) => {
    try {
      const response = await fetch(`${API_URL}/timeslots/${slotId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error deleting time slot:', err);
      throw new Error(err?.message || 'Failed to delete time slot');
    }
  };

  // Fetch workspaces for a user together with their threads
  export const getUserWorkspacesWithThreads = async (userId: number) => {
    try {
      // endpoint assumed: /workspaces/user/:userId/threads — update if your backend differs
      const response = await fetch(`${API_URL}/workspaces/user/${userId}/threads`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching user workspaces with threads:', err);
      throw new Error(err?.message || 'Failed to fetch workspaces');
    }
  };

  // Get the user's active study plan (if any)
  export const getActiveStudyPlan = async (userId: number) => {
    try {
      // assumed endpoint; update to match your backend if different
      const response = await fetch(`${API_URL}/study-plans/active/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching active study plan:', err);
      throw new Error(err?.message || 'Failed to fetch active study plan');
    }
  };

  // Update the status of a study session (in-progress, completed, skipped)
  export const updateStudySessionStatus = async (
    userId: number,
    sessionId: number,
    status: 'in_progress' | 'completed' | 'skipped',
    actualTimeSpent?: number,
    rating?: number,
    notes?: string
  ) => {
    try {
      const body = JSON.stringify({ userId, status, actualTimeSpent, rating, notes });
      // assumed endpoint; update if your backend path differs
      const response = await fetch(`${API_URL}/study-plans/sessions/${sessionId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => `HTTP ${response.status}`);
        throw new Error(errText || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error updating study session status:', err);
      throw new Error(err?.message || 'Failed to update study session status');
    }
  };