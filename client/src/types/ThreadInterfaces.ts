// Review and Rating interfaces
export type Review = {
  id: number | string
  user_id: string
  username: string
  rating: number  // 1-5 stars (frontend uses 'rating')
  comment: string // frontend uses 'comment'
  created_at: string
  updated_at?: string
  // Backend compatibility fields
  ratings?: number // backend uses 'ratings'
  review?: string  // backend uses 'review'
}

export type ResourceRating = {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export type Document = {
  id: number | string  // Support both numeric and UUID string IDs
  title: string
  type: "pdf" | "doc" | "txt"
  uploadedBy: string
  size: string
  uploadedAt: string
  isCurrentlyEditing?: boolean
  editedBy?: string
  lastEditTime?: string
  // Backend-compatible fields
  description?: string
  file_size?: number
  mime_type?: string
  firebase_url?: string
  created_at?: string
  user_id?: string
  // Review functionality
  reviews?: Review[]
  rating_summary?: ResourceRating
  user_review?: Review  // Current user's review if any
}

export type Link = {
  id: number | string  // Support both numeric and UUID string IDs
  title: string
  url: string
  addedBy: string
  addedAt: string
  description: string
  // Backend-compatible fields
  created_at?: string
  user_id?: string
  // Review functionality
  reviews?: Review[]
  rating_summary?: ResourceRating
  user_review?: Review  // Current user's review if any
}

export type Video = {
  id: number | string  // Support both numeric and UUID string IDs
  title: string
  duration: string
  addedBy: string
  addedAt: string
  thumbnail: string
  views?: number
  url: string
  description?: string
  // Backend-compatible fields
  file_size?: number
  mime_type?: string
  firebase_url?: string
  created_at?: string
  user_id?: string
  // Review functionality
  reviews?: Review[]
  rating_summary?: ResourceRating
  user_review?: Review  // Current user's review if any
}

export type QuizType = {
  id: number
  title: string
  description: string
  questions: number
  timeLimit: number
  attempts: number
  bestScore: number | null
  status: "not_started" | "in_progress" | "completed"
  difficulty: "Easy" | "Medium" | "Hard"
  createdBy: string
  createdAt: string
}

export type ThreadData = {
  id: number
  title: string
  description: string
  workspaceId: number
  workspaceTitle: string
  enrolled: boolean
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
