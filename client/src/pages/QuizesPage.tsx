import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// import { useInView } from 'react-intersection-observer'
 import {
  Box,
  Typography,
  Button,
  Container,
  Breadcrumbs,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Quiz as QuizIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import Footer from '../components/Footer'
import SidebarComponent from '../components/SideBar'
import LazyQuizCard from '../components/LazyQuizCard'
import { getQuizzes } from '../api/quizApi'
import { isAuthenticated } from '../api/authApi'
import type { Quiz } from '../types/QuizInterfaces'

type QuizesPageProps = {
  workspaceId?: string
  threadId?: string
}


const QuizesPage = ({ workspaceId: propWorkspaceId, threadId: propThreadId }: QuizesPageProps) => {
  const params = useParams<{ workspaceId: string; threadId: string }>()
  const workspaceId = propWorkspaceId || params.workspaceId
  const threadId = propThreadId || params.threadId
  
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [threadName] = useState<string>('React & TypeScript Fundamentals')
  const [workspaceName] = useState<string>('Advanced Web Development')
  const [userRole] = useState<string>('moderator')

  const handleCreateQuiz = () => {
    // Prefer route params so CreateQuiz always has workspace/thread context in the URL
    if (workspaceId && threadId) {
      navigate(`/workspace/${workspaceId}/threads/${threadId}/create-quiz`)
    } else {
      // Fallback to previous behavior (navigation state) if params not available
      navigate('/create-quiz', { state: { workspaceId, threadId } })
    }
  }

  const handleAttemptQuiz = (quizId: string) => {
    console.log('Attempting quiz:', quizId)
    
    // Find the quiz to determine its status
    const quiz = quizzesList.find(q => q.id === quizId)
    
    if (quiz?.studentAttempts && quiz.studentAttempts.length > 0) {
      const activeAttempts = quiz.studentAttempts.filter(attempt => !attempt.completed)
      const completedAttempts = quiz.studentAttempts.filter(attempt => attempt.completed)
      
      if (activeAttempts.length > 0) {
        // Continue existing attempt
        console.log('Continuing active attempt for quiz:', quizId)
      } else if (completedAttempts.length > 0) {
        // Starting a reattempt
        console.log('Starting reattempt for quiz:', quizId)
      }
    } else {
      // First time attempt
      console.log('Starting first attempt for quiz:', quizId)
    }
    
    // Navigate to quiz attempt page with proper context
    if (workspaceId && threadId) {
      navigate(`/workspace/${workspaceId}/threads/${threadId}/quizzes/${quizId}/attempt`)
    } else {
      // Fallback to previous behavior if params not available
      navigate('/attempt-quiz', { state: { quizId } })
    }
  }

  const handleReviewAttempt = (quizId: string, attemptNumber: number) => {
    console.log('Reviewing attempt:', quizId, attemptNumber)
    // Navigate to quiz review page with proper context
    if (workspaceId && threadId) {
      navigate(`/workspace/${workspaceId}/threads/${threadId}/quizzes/${quizId}/review`)
    } else {
      // Fallback to previous behavior if params not available
      navigate(`/quizzes/${quizId}/review`)
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getPerformanceColor = (marks: number, total: number) => {
    const percentage = (marks / total) * 100
    if (percentage >= 80) return 'success'
    if (percentage >= 60) return 'warning'
    return 'error'
  }

  const sidebarWidth = collapsed ? 80 : 250

  // Debug: Component loaded
  console.log('QuizesPage loaded with threadId:', threadId)
  console.log('QuizesPage quizzesList state:', quizzesList)

  // Fetch quizzes for the thread when threadId changes
  useEffect(() => {
    let mounted = true
    const fetchQuizzes = async () => {
      if (!threadId) {
        setError('Thread ID is missing. Please navigate to this page from a workspace thread.')
        setLoading(false)
        return
      }
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setError('Please log in to view quizzes')
        setLoading(false)
        return
      }
      
      setLoading(true)
      setError(null)
      try {
        console.log('Fetching quizzes for thread:', threadId)
        const quizzesData = await getQuizzes(threadId)
        console.log('Transformed quizzes data:', quizzesData)
        console.log('Is array?', Array.isArray(quizzesData))
        console.log('Data length:', quizzesData?.length)

        // Debug first quiz to see transformation
        if (quizzesData && quizzesData.length > 0) {
          console.log('First quiz details:')
          console.log('- Title:', quizzesData[0].title)
          console.log('- Description:', quizzesData[0].description)
          console.log('- Time Allocated:', quizzesData[0].timeAllocated)
          console.log('- Total Marks:', quizzesData[0].totalMarks)
          console.log('- Creator:', quizzesData[0].creator)
          console.log('- Questions count:', quizzesData[0].questions?.length || 0)
        }

        if (!mounted) return
        const processedQuizzes = Array.isArray(quizzesData) ? quizzesData : []
        console.log('Setting quizzes list to:', processedQuizzes)
        setQuizzesList(processedQuizzes)
      } catch (err: unknown) {
        console.error('Failed to fetch quizzes for thread', threadId, err)
        if (!mounted) return
        const message = err instanceof Error ? err.message : String(err)
        if (message.includes('401') || message.includes('Unauthorized')) {
          setError('Authentication required. Please log in to view quizzes.')
        } else {
          setError(message || 'Failed to fetch quizzes')
        }
        setQuizzesList([]) // Set empty array instead of mock data
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchQuizzes()
    return () => { mounted = false }
  }, [threadId])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Box sx={{ 
        flexGrow: 1, 
        marginLeft: window.innerWidth >= 900 ? `${sidebarWidth}px` : 0,
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {/* Breadcrumb Navigation */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                {workspaceName || 'Workspace'}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <GroupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                {threadName || 'Thread'}
              </Box>
              <Typography color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <QuizIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Quizzes
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Header with Create Quiz Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Available Quizzes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Test your knowledge and track your progress
              </Typography>
            </Box>
            {(userRole === 'moderator' || userRole === 'admin') && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleCreateQuiz()}
                size="large"
              >
                Create Quiz
              </Button>
            )}
          </Box>

          {/* All Quizzes Display */}
          <Stack spacing={0}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Loading quizzes...
                </Typography>
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {!loading && !error && quizzesList.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <QuizIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No quizzes available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {userRole === 'moderator' || userRole === 'admin' 
                    ? 'Get started by creating your first quiz for this thread!'
                    : 'No quizzes have been created for this thread yet.'}
                </Typography>
                {(userRole === 'moderator' || userRole === 'admin') && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleCreateQuiz}
                    size="large"
                  >
                    Create First Quiz
                  </Button>
                )}
              </Box>
            )}
            {quizzesList.map((quiz, index) => (
              <LazyQuizCard
                key={quiz.id}
                quiz={quiz}
                index={index}
                totalQuizzes={quizzesList.length}
                userRole={userRole}
                onAttemptQuiz={handleAttemptQuiz}
                onReviewAttempt={handleReviewAttempt}
                formatTime={formatTime}
                getPerformanceColor={getPerformanceColor}
              />
            ))}
          </Stack>
        </Container>        
        <Footer />
      </Box>
    </Box>
  )
}

export default QuizesPage