import axios from 'axios'
import { getAccessToken } from './authApi'
import type { Quiz } from '../types/QuizInterfaces'

// Support optional API prefix (some backends expose endpoints under /api)
const rawBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : 'http://localhost:3000'
const rawPrefix = import.meta.env.VITE_API_PREFIX ?? '/api'

// normalize base (remove trailing slashes)
const API_BASE = rawBase.replace(/\/+$/, '')

// normalize prefix (ensure leading slash when present)
let API_PREFIX = String(rawPrefix)
if (API_PREFIX && !API_PREFIX.startsWith('/')) API_PREFIX = `/${API_PREFIX}`

// If API_BASE already ends with the prefix (e.g. VITE_API_URL contains '/api'), avoid duplicating
if (API_PREFIX && API_BASE.endsWith(API_PREFIX)) {
  API_PREFIX = ''
}

const API_URL = `${API_BASE}${API_PREFIX}`

// Debug info to help diagnose wrong base/prefix during development
if (import.meta.env.DEV) {
  console.debug('[quizApi] API_BASE=', API_BASE, 'API_PREFIX=', API_PREFIX, 'API_URL=', API_URL)
}

// Helper to try multiple candidate URLs (useful when backend may or may not use the API prefix)
const tryGetWithFallback = async (candidates: string[]) => {
  const attempts: { url: string; status?: number; data?: unknown; error?: string }[] = []
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else {
    console.warn('[quizApi] No access token found - requests may fail with 401')
  }

  // collect attempts instead of storing lastErr
  if (import.meta.env.DEV) {
    console.debug('[quizApi] tryGetWithFallback candidates:', candidates)
    console.debug('[quizApi] token present:', !!token)
  }
  for (const url of candidates) {
    try {
      if (import.meta.env.DEV) console.debug('[quizApi] attempting GET', url)
      const res = await axios.get(url, { headers })
      if (import.meta.env.DEV) console.debug('[quizApi] success GET', url, 'status', res.status)
      // record successful attempt
      attempts.push({ url, status: res.status, data: res.data })
      return res.data
    } catch (err: unknown) {
      const maybeResponse = (err as unknown) as { response?: { status?: number; data?: unknown }; message?: string }
      const status = maybeResponse?.response?.status
      const data = maybeResponse?.response?.data
      const message = (err as Error)?.message || String(err)
      if (import.meta.env.DEV) console.debug('[quizApi] GET failed', url, 'status', status, 'data', data, 'message', message)
      attempts.push({ url, status, data, error: message })
      // if non-404 server error, provide detailed error info but don't throw immediately
      if (status && status !== 404) {
        console.error(`[quizApi] Server error ${status} for ${url}:`, data || message)
        // For 500 errors, add more context
        if (status === 500) {
          console.error('[quizApi] Backend server error - check your backend logs for database/server issues')
        }
        const e = new Error(`Server error ${status}: ${message}`) as Error & { attempts?: typeof attempts }
        e.attempts = attempts
        throw e
      }
      // otherwise try next candidate
    }
  }
  // all candidates exhausted — throw an Error with details about each attempt
  const e = new Error('All attempts failed') as Error & { attempts?: typeof attempts }
  e.attempts = attempts
  throw e
}

/**
 * Get all quizzes for a specific thread
 * GET /threads/:threadId/quizzes
 */
export const getQuizzes = async (threadId: string): Promise<Quiz[]> => {
  const candidates = [
    `${API_URL}/quizzes/thread/${threadId}`,
    `${API_BASE}/quizzes/thread/${threadId}`,
  ]
  
  console.log('[getQuizzes] Trying URLs:', candidates)
  console.log('[getQuizzes] API_URL:', API_URL)
  console.log('[getQuizzes] API_BASE:', API_BASE)
  
  try {
    const result = await tryGetWithFallback(candidates)
    const transformedResult = result.map((quiz: any) => ({
    ...quiz,
    title: quiz.title || `Quiz ${quiz.id?.slice(0, 8)}`,
    description: quiz.description || 'No description available',
    timeAllocated: quiz.allocated_time || quiz.timeAllocated || 30,
    totalMarks: quiz.total_marks || quiz.totalMarks || (quiz.questions?.reduce((total: number, q: any) => total + (q.marks || 0), 0)) || 0,
    creator: quiz.users?.name || quiz.creator || 'Unknown',
    questions: quiz.questions?.map((question: any) => ({
      ...question,
      text: question.question || question.text,
      options: question.answer_option?.map((option: any) => ({
        ...option,
        text: option.text || option.option_text || option.answer,
        isCorrect: option.is_correct !== undefined ? option.is_correct : option.isCorrect
      })) || question.options || []
    })) || []
  }))
  
  console.log('[getQuizzes] Success with result:', result)
  console.log('[getQuizzes] Transformed result:', transformedResult)
  return transformedResult
  } catch (error) {
    console.error('[getQuizzes] Backend error, returning empty array:', error)
    // Return empty array instead of crashing the app
    // This allows the UI to show "No quizzes available" instead of an error
    return []
  }
}

/**
 * Get a single quiz by its id
 * GET /quizzes/:quizId
 */
export const getQuizById = async (quizId: string): Promise<Quiz> => {
  const candidates = [
    `${API_URL}/quizzes/${quizId}`,
    `${API_BASE}/quizzes/${quizId}`,
  ]
  const result = await tryGetWithFallback(candidates)
  
  // Transform the quiz data to match frontend expectations
  const transformedQuiz = {
    ...result,
    title: result.title || `Quiz ${result.id?.slice(0, 8)}`,
    description: result.description || 'No description available',
    timeAllocated: result.allocated_time || result.timeAllocated || 30,
    totalMarks: result.total_marks || result.totalMarks || (result.questions?.reduce((total: number, q: any) => total + (q.marks || 0), 0)) || 0,
    creator: result.users?.name || result.creator || 'Unknown',
    questions: result.questions?.map((question: any) => ({
      ...question,
      text: question.question || question.text,
      options: question.answer_option?.map((option: any) => ({
        ...option,
        text: option.text || option.option_text || option.answer,
        isCorrect: option.is_correct !== undefined ? option.is_correct : option.isCorrect
      })) || question.options || []
    })) || []
  }
  
  console.log('[getQuizById] Original result:', result)
  console.log('[getQuizById] Transformed result:', transformedQuiz)
  
  return transformedQuiz as Quiz
}

/**
 * Create a new quiz in a thread
 * POST /threads/:threadId/quizzes/create
 * quizData should be a plain object (JSON) containing title, description, timeAllocated, totalMarks, tags, resourceTags, etc.
 */
export const createQuiz = async (threadId: string, quizData: Partial<Quiz> | FormData) => {
  const token = getAccessToken()
  const isFormData = quizData instanceof FormData
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }
  if (!isFormData) headers['Content-Type'] = 'application/json'

  try {
    // Use the correct API Gateway endpoint that actually works
    const response = await axios.post(`${API_URL}/quizzes/thread/${threadId}`, quizData, {
      headers,
    })
    return response.data
  } catch (error: any) {
    console.error('[createQuiz] Backend error:', error)
    
    // Provide more specific error messages
    if (error.response?.status === 500) {
      throw new Error('Server error: Please check if your backend database is connected and running properly.')
    } else if (error.response?.status === 401) {
      throw new Error('Authentication error: Please log in again.')
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found: Please check if your backend server has the quiz creation endpoint.')
    } else {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create quiz')
    }
  }
}

/**
 * Update an existing quiz
 * PUT /quizzes/:quizId
 */
export const updateQuiz = async (quizId: string, quizData: Partial<Quiz>) => {
  const token = getAccessToken()
  const response = await axios.put(`${API_URL}/quizzes/${quizId}`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

/**
 * Delete a quiz
 * DELETE /quizzes/:quizId
 */
export const deleteQuiz = async (quizId: string) => {
  const token = getAccessToken()
  const response = await axios.delete(`${API_URL}/quizzes/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

/**
 * Submit an attempt for a quiz
 * POST /quizzes/:quizId/attempts
 * attemptData can include answers, timeTaken (in seconds or minutes as decided by backend), marksObtained (if auto-graded), etc.
 */
export const submitQuizAttempt = async (quizId: string, attemptData: Record<string, unknown>) => {
  const token = getAccessToken()
  const response = await axios.post(`${API_URL}/quizzes/${quizId}/attempts`, attemptData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

/**
 * Get all attempts for a quiz (class attempts)
 * GET /quizzes/:quizId/attempts
 */
export const getQuizAttempts = async (quizId: string) => {
  const token = getAccessToken()
  const response = await axios.get(`${API_URL}/quizzes/${quizId}/attempts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

/**
 * Get attempts for current logged-in user for a quiz
 * GET /quizzes/:quizId/attempts/me
 */
export const getMyAttemptsForQuiz = async (quizId: string) => {
  const token = getAccessToken()
  const response = await axios.get(`${API_URL}/quizzes/${quizId}/attempts/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

/**
 * Get a single attempt by id
 * GET /attempts/:attemptId
 */
export const getAttemptById = async (attemptId: string) => {
  const token = getAccessToken()
  const response = await axios.get(`${API_URL}/attempts/${attemptId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

/**
 * Grade or update an attempt (if moderator/admin)
 * PUT /attempts/:attemptId
 */
export const updateAttempt = async (attemptId: string, updateData: Record<string, unknown>) => {
  const token = getAccessToken()
  const response = await axios.put(`${API_URL}/attempts/${attemptId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export default {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizAttempts,
  getMyAttemptsForQuiz,
  getAttemptById,
  updateAttempt,
}
// // Using fetch instead of axios to avoid import issues
// const API_URL = "http://localhost:3000";

// import type { QuizDetails, Question } from '../types/QuizInterfaces'

// // Simple quiz creation function
// // quizDetails: object containing title, description, allocatedTime, topics, selectedResources
// // questions: array of question objects
// // threadId: optional - associate quiz to a thread
// export const createQuiz = async (quizDetails: QuizDetails, questions: Question[], threadId?: string) => {
//   try {
//     // Convert questions to API format
//     const apiQuestions = questions.map((question: Question) => ({
//       questionText: question.questionText,
//       options: question.options
//         .filter((opt) => (opt.text.trim() || opt.image))
//         .map((opt) => ({
//           sequenceLetter: opt.sequenceLetter,
//           text: opt.text,
//           isCorrect: opt.isCorrect
//         })),
//       marks: question.marks
//     }));

//     const totalMarks = apiQuestions.reduce((sum, q) => sum + (q.marks || 0), 0)

//     const requestData: Record<string, unknown> = {
//       title: quizDetails.title,
//       description: quizDetails.description,
//       timeAllocated: quizDetails.allocatedTime,
//       totalMarks,
//       topics: quizDetails.topics,
//       selectedResources: quizDetails.selectedResources,
//       questions: apiQuestions
//     };

//     if (threadId) {
//       requestData['thread_id'] = threadId
//     }

//     console.log('Sending quiz data to API:', requestData);

//     // Backend uses common prefix `/quizzes` for quiz service
//     // POST /quizzes to create a new quiz
//     const response = await fetch(`${API_URL}/quizzes`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestData)
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({ message: 'Failed to create quiz' }));
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     return {
//       success: true,
//       quizId: result.id || result.quizId || 'unknown',
//       message: result.message || 'Quiz created successfully'
//     };

//   } catch (error: unknown) {
//     console.error('Error creating quiz:', error);
//     const message = error instanceof Error ? error.message : String(error)
//     throw new Error(message || "Failed to create quiz");
//   }
// };

// export const getQuizzes = async (threadId?: string) => {
//   try {
//     // GET /quizzes?thread_id=... (thread scoped) or /quizzes for all
//     const url = threadId ? `${API_URL}/quizzes?thread_id=${encodeURIComponent(threadId)}` : `${API_URL}/quizzes`;
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error: unknown) {
//     console.error('Error fetching quizzes:', error);
//     const message = error instanceof Error ? error.message : String(error)
//     throw new Error(message || "Failed to fetch quizzes");
//   }
// };

// export const getQuizById = async (quizId: string) => {
//   try {
//     const response = await fetch(`${API_URL}/quizzes/${quizId}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error: unknown) {
//     console.error('Error fetching quiz:', error);
//     const message = error instanceof Error ? error.message : String(error)
//     throw new Error(message || "Failed to fetch quiz");
//   }
// };