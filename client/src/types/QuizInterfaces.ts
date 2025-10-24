export interface Quiz {
  id: string
  title: string
  description: string
  timeAllocated: number // in minutes
  totalMarks: number
  tags: string[]
  resourceTags: string[] // lecture/resource references
  creator: string
  totalAttempts: number
  averageMarks: number
  averageTime: number // in minutes
  questions?: Question[] // Questions for the quiz
  studentAttempts?: {
    attemptNumber: number
    marksObtained: number
    timeTaken: number
    completed: boolean
    date: string
  }[]
}

export interface LazyQuizCardProps {
  quiz: Quiz
  index: number
  totalQuizzes: number
  userRole: string
  onAttemptQuiz: (quizId: string) => void
  onReviewAttempt: (quizId: string, attemptNumber: number) => void
  onDeleteQuiz?: (quizId: string, quizTitle: string) => void
  formatTime: (minutes: number) => string
  getPerformanceColor: (marks: number, total: number) => 'success' | 'warning' | 'error'
}

export interface Option {
    id: string;
    sequenceLetter: string;
    text: string;
    image: File | string | null; // File for creation, string for display
    isCorrect: boolean;
}

export interface Question {
    id: string;
    questionText: string;
    image: File | string | null; // File for creation, string for display
    options: Option[];
    marks: number;
    isEditing: boolean;
}

export interface QuizDetails {
    title: string;
    description: string;
    allocatedTime: number;
    selectedResources: string[];
    topics?: string;
    tags?: string[];
    resourceTags?: string[];
}

export interface DragDropImageUploadProps {
    onImageUpload: (file: File) => void;
    currentImage: File | string | null; // Support File objects, URL strings, or null
    currentImageUrl?: string | null; // Deprecated - use currentImage instead
    label: string;
    fullWidth?: boolean;
    height?: string;
    dragOverId: string;
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent, dropId: string) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}