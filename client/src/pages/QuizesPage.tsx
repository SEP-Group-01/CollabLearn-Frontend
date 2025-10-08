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
import { quizzes as mockQuizzes, userRole as mockUserRole } from '../mocks/Quizzes'
import { getQuizzes } from '../api/quizApi'
import { getThread } from '../api/threadsApi'
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
  const [quizzesList, setQuizzesList] = useState<Quiz[]>(mockQuizzes)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [threadName, setThreadName] = useState<string>('')
  const [workspaceName, setWorkspaceName] = useState<string>('')
  const [userRole] = useState<string>(mockUserRole)

  const handleCreateQuiz = () => {
    navigate('/create-quiz')
  }

  const handleAttemptQuiz = (quizId: string) => {
    console.log('Attempting quiz:', quizId)
    // Navigate to quiz attempt page
    navigate('/attempt-quiz')
  }

  const handleReviewAttempt = (quizId: string, attemptNumber: number) => {
    console.log('Reviewing attempt:', quizId, attemptNumber)
    // Navigate to attempt review page
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

  // Fetch quizzes for the thread when threadId changes. If fetch fails or no threadId provided,
  // keep using mock data for view-only display.
  useEffect(() => {
    let mounted = true
    const fetchThreadAndQuizzes = async () => {
      if (!threadId) return
      setLoading(true)
      setError(null)
      try {
        const [threadData, quizzesData] = await Promise.all([
          getThread(threadId),
          getQuizzes(threadId),
        ])

        if (!mounted) return
        // threadData may include workspace name and thread name
  setThreadName(threadData?.name || '')
  // prefer backend-provided workspace name, fall back to workspaceId when available
  setWorkspaceName(threadData?.workspace_name || workspaceId || '')

        setQuizzesList(Array.isArray(quizzesData) ? quizzesData : mockQuizzes)
      } catch (err: unknown) {
        console.error('Failed to fetch thread/quizzes for thread', threadId, err)
        if (!mounted) return
        const message = err instanceof Error ? err.message : String(err)
        setError(message || 'Failed to fetch thread or quizzes')
        setQuizzesList(mockQuizzes)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchThreadAndQuizzes()
    return () => { mounted = false }
  }, [threadId, workspaceId])

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
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Loading quizzes...</Typography>
              </Box>
            )}
            {error && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="error">{error}</Typography>
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