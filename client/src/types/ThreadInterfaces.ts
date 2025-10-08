export type Document = {
  id: string // UUID
  thread_id: string // UUID
  user_id: string // UUID
  resource_type: "document"
  title: string
  description?: string
  firebase_path?: string
  firebase_url?: string
  file_name?: string
  file_size?: number
  mime_type?: string
  created_at: string
  updated_at: string
  uploadedBy?: string // For display purposes
  size?: string // For display purposes (formatted file_size)
  uploadedAt?: string // For display purposes (formatted created_at)
  isCurrentlyEditing?: boolean
  editedBy?: string
  lastEditTime?: string
}

export type Link = {
  id: string // UUID
  thread_id: string // UUID
  user_id: string // UUID
  resource_type: "link"
  title: string
  description?: string
  firebase_url?: string // The actual link URL
  created_at: string
  updated_at: string
  addedBy?: string // For display purposes
  addedAt?: string // For display purposes (formatted created_at)
  url?: string // For backward compatibility
}

export type Video = {
  id: string // UUID
  thread_id: string // UUID
  user_id: string // UUID
  resource_type: "video"
  title: string
  description?: string
  firebase_path?: string
  firebase_url?: string
  file_name?: string
  file_size?: number
  mime_type?: string
  created_at: string
  updated_at: string
  addedBy?: string // For display purposes
  addedAt?: string // For display purposes (formatted created_at)
  duration?: string // For display purposes
  thumbnail?: string // For display purposes
  views?: number
  url?: string // For backward compatibility
}

export type QuizType = {
  id: string // UUID
  thread_id: string // UUID
  creator_id: string // UUID
  created_at: string
  title?: string // For display purposes
  description?: string // For display purposes
  questions?: number // For display purposes
  timeLimit?: number // For display purposes
  attempts?: number // From quiz_attempt table
  bestScore?: number | null // From quiz_attempt table
  status?: "not_started" | "in_progress" | "completed" // For display purposes
  difficulty?: "Easy" | "Medium" | "Hard" // For display purposes
  createdBy?: string // For display purposes
}

export type ThreadData = {
  id: string // UUID
  workspace_id: string // UUID
  name: string
  description?: string
  total_estimated_hours?: number
  created_at: string
  updated_at: string
  title?: string // For backward compatibility (maps to name)
  workspaceId?: string // For backward compatibility (maps to workspace_id)
  workspaceTitle?: string // For display purposes
  enrolled?: boolean // For display purposes
  performance: {
    progress: number
    lastScore: number | null
    completedQuizzes: number
    totalQuizzes: number
    studyTime: number
    averageScore: number
    rank: number
    totalStudents: number
    completionRate: number
  }
  resources: {
    documents: Document[]
    links: Link[]
    videos: Video[]
  }
  quizzes: QuizType[]
  currentlyEditing: Document[]
}
