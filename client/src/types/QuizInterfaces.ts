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
  formatTime: (minutes: number) => string
  getPerformanceColor: (marks: number, total: number) => 'success' | 'warning' | 'error'
}

export interface Option {
    id: string;
    sequenceLetter: string;
    text: string;
    image: File | null;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    questionText: string;
    image: File | null;
    options: Option[];
    marks: number;
    isEditing: boolean;
}

export interface QuizDetails {
    title: string;
    description: string;
    allocatedTime: number;
    topics: string;
    selectedResources: string[];
}

export interface DragDropImageUploadProps {
    onImageUpload: (file: File) => void;
    currentImage: File | null;
    label: string;
    fullWidth?: boolean;
    height?: string;
    dragOverId: string;
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent, dropId: string) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}