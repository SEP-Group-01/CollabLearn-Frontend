import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
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
import {quizzes, userRole, workspaceName, threadName} from '../mocks/Quizzes'


const QuizesPage = () => {
  
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleCreateQuiz = () => {
    navigate('/create-quiz')
  }

  const handleAttemptQuiz = (quizId: string) => {
    console.log('Attempting quiz:', quizId)
    // Navigate to quiz attempt page
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
                {workspaceName}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <GroupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                {threadName}
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
            {quizzes.map((quiz, index) => (
              <LazyQuizCard
                key={quiz.id}
                quiz={quiz}
                index={index}
                totalQuizzes={quizzes.length}
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