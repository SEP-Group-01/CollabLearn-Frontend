export type Document = {
  id: number
  title: string
  type: "pdf" | "doc" | "txt"
  uploadedBy: string
  size: string
  uploadedAt: string
  isCurrentlyEditing?: boolean
  editedBy?: string
  lastEditTime?: string
}

export type Link = {
  id: number
  title: string
  url: string
  addedBy: string
  addedAt: string
  description: string
}

export type Video = {
  id: number
  title: string
  duration: string
  addedBy: string
  addedAt: string
  thumbnail: string
  views?: number
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
