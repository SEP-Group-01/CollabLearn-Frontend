import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
 import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Container,
  Paper,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // TextField,
  Breadcrumbs,
  Stack,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Skeleton
} from '@mui/material'
import {
  Add as AddIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  People,
  Star,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'
// import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SidebarComponent from '../components/SideBar'

interface Quiz {
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

// interface CreateQuizData {
//   title: string
//   description: string
//   timeAllocated: number
//   totalMarks: number
//   tags: string[]
//   resourceTags: string[]
// }

// Lazy Quiz Card Component
interface LazyQuizCardProps {
  quiz: Quiz
  index: number
  totalQuizzes: number
  userRole: string
  onAttemptQuiz: (quizId: string) => void
  onReviewAttempt: (quizId: string, attemptNumber: number) => void
  formatTime: (minutes: number) => string
  getPerformanceColor: (marks: number, total: number) => 'success' | 'warning' | 'error'
}

const LazyQuizCard = ({ 
  quiz, 
  index, 
  totalQuizzes, 
  userRole, 
  onAttemptQuiz, 
  onReviewAttempt, 
  formatTime, 
  getPerformanceColor 
}: LazyQuizCardProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px 0px' // Start loading 100px before the element comes into view
  })

  // Skeleton loading component with improved animations
  const SkeletonCard = () => (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: 1 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Skeleton 
                variant="circular" 
                width={48} 
                height={48} 
                sx={{ mr: 2 }}
                animation="wave"
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={32} 
                  animation="wave"
                />
                <Skeleton 
                  variant="text" 
                  width="40%" 
                  height={20} 
                  animation="wave"
                />
              </Box>
            </Box>
            <Skeleton 
              variant="text" 
              width="100%" 
              height={20} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="90%" 
              height={20} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="75%" 
              height={20} 
              sx={{ mb: 3 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Skeleton 
                variant="rectangular" 
                width="50%" 
                height={80} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width="50%" 
                height={80} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            </Box>
            <Skeleton 
              variant="text" 
              width="30%" 
              height={24} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <Skeleton variant="rounded" width={60} height={24} animation="wave" />
              <Skeleton variant="rounded" width={80} height={24} animation="wave" />
              <Skeleton variant="rounded" width={70} height={24} animation="wave" />
            </Box>
            <Skeleton 
              variant="text" 
              width="40%" 
              height={24} 
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={100} 
              sx={{ borderRadius: 1 }}
              animation="wave"
            />
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton 
                variant="text" 
                width="60%" 
                height={24} 
                sx={{ mb: 2 }}
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={120} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton 
                variant="text" 
                width="50%" 
                height={24} 
                sx={{ mb: 2 }}
                animation="wave"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton 
                  variant="rectangular" 
                  width="50%" 
                  height={80} 
                  sx={{ borderRadius: 1 }}
                  animation="wave"
                />
                <Skeleton 
                  variant="rectangular" 
                  width="50%" 
                  height={80} 
                  sx={{ borderRadius: 1 }}
                  animation="wave"
                />
              </Box>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={10} 
                sx={{ mt: 2, borderRadius: 5 }}
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={10} 
                sx={{ mt: 2, borderRadius: 5 }}
                animation="wave"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={48} 
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  )

  return (
    <Box key={quiz.id} ref={ref}>
      {inView ? (
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3, 
            flexDirection: { xs: 'column', md: 'row' },
            opacity: 0,
            animation: 'fadeIn 0.6s ease-in-out forwards',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {/* Left Side - Quiz Information */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, mr: 2 }}>
                    <QuizIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                      {quiz.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <PersonIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Created by {quiz.creator}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {quiz.description}
                </Typography>

                {/* Quiz Details */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <TimerIcon color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="primary">
                        {formatTime(quiz.timeAllocated)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time Allocated
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <GradeIcon color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="primary">
                        {quiz.totalMarks}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Marks
                      </Typography>
                    </Paper>
                  </Box>
                </Box>

                {/* Topic Tags */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Topics Covered:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {quiz.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>

                {/* Resource Tags */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <BookIcon sx={{ mr: 1 }} fontSize="small" />
                    Related Resources:
                  </Typography>
                  <List dense>
                    {quiz.resourceTags.map((resource, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <AssignmentIcon fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={resource}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Side - Attempts and Statistics */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* Student's Previous Attempts */}
              {quiz.studentAttempts && quiz.studentAttempts.length > 0 && (
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Your Previous Attempts
                    </Typography>
                    {quiz.studentAttempts.map((attempt) => (
                      <Paper
                        key={attempt.attemptNumber}
                        variant="outlined"
                        sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              Attempt #{attempt.attemptNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Date: {attempt.date}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Chip
                                label={`${attempt.marksObtained}/${quiz.totalMarks}`}
                                size="small"
                                color={getPerformanceColor(attempt.marksObtained, quiz.totalMarks)}
                              />
                              <Chip
                                label={formatTime(attempt.timeTaken)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => onReviewAttempt(quiz.id, attempt.attemptNumber)}
                          >
                            Review
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Class Statistics */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Class Performance
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <People color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                        {quiz.totalAttempts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Attempts
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Star color="warning" sx={{ mb: 1 }} />
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                        {quiz.averageMarks.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Score
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Average Performance
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(quiz.averageMarks / quiz.totalMarks) * 100}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {((quiz.averageMarks / quiz.totalMarks) * 100).toFixed(1)}% class average
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Average Time: {formatTime(quiz.averageTime)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(quiz.averageTime / quiz.timeAllocated) * 100}
                      color="secondary"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {((quiz.averageTime / quiz.timeAllocated) * 100).toFixed(1)}% of allocated time
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  {quiz.studentAttempts && quiz.studentAttempts.length > 0 ? (
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => onAttemptQuiz(quiz.id)}
                      >
                        Re-attempt Quiz
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        You can retake this quiz to improve your score
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => onAttemptQuiz(quiz.id)}
                      >
                        Start Quiz
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Take your first attempt at this quiz
                      </Typography>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      ) : (
        <SkeletonCard />
      )}
      
      {/* Styled Separator */}
      {index < totalQuizzes - 1 && (
        <Box sx={{ my: 5 }}>
          <Divider 
            sx={{ 
              border: 'none',
              height: '5px',
              background: 'linear-gradient(90deg, transparent 0%, #e0e0e0 20%, #1976d2 50%, #e0e0e0 80%, transparent 100%)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '40px',
                height: '40px',
                backgroundColor: '#f5f5f5',
                border: '2px solid #1976d2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              '&::after': {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '20px',
                zIndex: 1
              }
            }} 
          />
        </Box>
      )}
    </Box>
  )
}

const QuizesPage = () => {
  // const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  // const [createQuizData, setCreateQuizData] = useState<CreateQuizData>({
  //   title: '',
  //   description: '',
  //   timeAllocated: 60,
  //   totalMarks: 100,
  //   tags: [],
  //   resourceTags: []
  // })

  // Mock data - this would come from an API
  const userRole = 'moderator' // 'student', 'moderator', 'admin'
  const workspaceName = 'Advanced Web Development'
  const threadName = 'React & TypeScript Fundamentals'

  const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React components, hooks, and state management including useState, useEffect, and component lifecycle',
      timeAllocated: 45,
      totalMarks: 50,
      tags: ['React', 'JavaScript', 'Hooks'],
      resourceTags: ['Lecture 1: React Basics', 'Lecture 2: Hooks Deep Dive', 'Tutorial: Component State'],
      creator: 'Dr. Sarah Johnson',
      totalAttempts: 127,
      averageMarks: 38.5,
      averageTime: 32,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 42, timeTaken: 28, completed: true, date: '2025-08-10' },
        { attemptNumber: 2, marksObtained: 46, timeTaken: 35, completed: true, date: '2025-08-11' }
      ]
    },
    {
      id: '2',
      title: 'TypeScript Advanced Concepts',
      description: 'Advanced TypeScript features including generics, decorators, type manipulation, and advanced patterns for large-scale applications',
      timeAllocated: 60,
      totalMarks: 75,
      tags: ['TypeScript', 'Advanced', 'Generics'],
      resourceTags: ['Lecture 5: TypeScript Generics', 'Lecture 6: Advanced Types', 'Workshop: Type System'],
      creator: 'Prof. Michael Chen',
      totalAttempts: 89,
      averageMarks: 52.3,
      averageTime: 48
    },
    {
      id: '3',
      title: 'Material-UI Components',
      description: 'Understanding Material-UI component library, theming system, customization patterns, and responsive design principles',
      timeAllocated: 30,
      totalMarks: 40,
      tags: ['Material-UI', 'CSS', 'React'],
      resourceTags: ['Lecture 8: UI Libraries', 'Tutorial: Material-UI Setup', 'Practice: Theme Customization'],
      creator: 'Dr. Emma Williams',
      totalAttempts: 156,
      averageMarks: 32.1,
      averageTime: 22,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 35, timeTaken: 25, completed: true, date: '2025-08-09' }
      ]
    },
    {
      id: '4',
      title: 'State Management with Redux',
      description: 'Redux fundamentals, actions, reducers, middleware, and best practices for managing complex application state',
      timeAllocated: 90,
      totalMarks: 100,
      tags: ['Redux', 'State Management', 'JavaScript'],
      resourceTags: ['Lecture 10: Redux Basics', 'Lecture 11: Middleware', 'Assignment: Redux Store'],
      creator: 'Dr. Alex Rodriguez',
      totalAttempts: 73,
      averageMarks: 68.7,
      averageTime: 72
    },
    {
      id: '5',
      title: 'API Integration & HTTP Requests',
      description: 'Learn to integrate APIs using fetch, axios, and handle asynchronous operations in React applications',
      timeAllocated: 60,
      totalMarks: 80,
      tags: ['API', 'HTTP', 'Async', 'React'],
      resourceTags: ['Lecture 12: REST APIs', 'Tutorial: Axios Setup', 'Practice: API Integration'],
      creator: 'Prof. Sarah Johnson',
      totalAttempts: 142,
      averageMarks: 61.2,
      averageTime: 52,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 58, timeTaken: 45, completed: true, date: '2025-08-12' }
      ]
    },
    {
      id: '6',
      title: 'React Router & Navigation',
      description: 'Implementing client-side routing, navigation guards, and dynamic route parameters in React applications',
      timeAllocated: 45,
      totalMarks: 60,
      tags: ['React Router', 'Navigation', 'SPA'],
      resourceTags: ['Lecture 13: React Router', 'Workshop: Navigation Setup', 'Assignment: Multi-page App'],
      creator: 'Dr. Emma Williams',
      totalAttempts: 98,
      averageMarks: 48.5,
      averageTime: 38
    },
    {
      id: '7',
      title: 'Testing React Components',
      description: 'Unit testing, integration testing, and end-to-end testing strategies for React applications using Jest and Testing Library',
      timeAllocated: 75,
      totalMarks: 90,
      tags: ['Testing', 'Jest', 'React Testing Library'],
      resourceTags: ['Lecture 14: Testing Basics', 'Lecture 15: Advanced Testing', 'Lab: Test Suite Setup'],
      creator: 'Prof. Michael Chen',
      totalAttempts: 67,
      averageMarks: 71.3,
      averageTime: 63,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 78, timeTaken: 58, completed: true, date: '2025-08-13' },
        { attemptNumber: 2, marksObtained: 82, timeTaken: 65, completed: true, date: '2025-08-14' }
      ]
    },
    {
      id: '8',
      title: 'Performance Optimization',
      description: 'React performance optimization techniques including memoization, code splitting, and bundle optimization strategies',
      timeAllocated: 90,
      totalMarks: 100,
      tags: ['Performance', 'Optimization', 'React', 'Webpack'],
      resourceTags: ['Lecture 16: React Performance', 'Tutorial: Code Splitting', 'Workshop: Bundle Analysis'],
      creator: 'Dr. Alex Rodriguez',
      totalAttempts: 54,
      averageMarks: 74.8,
      averageTime: 78
    },
    {
      id: '9',
      title: 'Advanced TypeScript Patterns',
      description: 'Deep dive into advanced TypeScript patterns, utility types, conditional types, and type-level programming',
      timeAllocated: 120,
      totalMarks: 150,
      tags: ['TypeScript', 'Advanced Patterns', 'Utility Types'],
      resourceTags: ['Lecture 17: Advanced TS', 'Lecture 18: Type Magic', 'Project: Type System Design'],
      creator: 'Prof. Sarah Johnson',
      totalAttempts: 39,
      averageMarks: 98.7,
      averageTime: 102
    },
    {
      id: '10',
      title: 'React Hooks Deep Dive',
      description: 'Comprehensive exploration of React hooks including custom hooks, useReducer, useContext, and advanced hook patterns',
      timeAllocated: 75,
      totalMarks: 85,
      tags: ['React Hooks', 'Custom Hooks', 'useContext', 'useReducer'],
      resourceTags: ['Lecture 19: Hook Patterns', 'Tutorial: Custom Hooks', 'Practice: Hook Library'],
      creator: 'Dr. Emma Williams',
      totalAttempts: 156,
      averageMarks: 66.4,
      averageTime: 58,
      studentAttempts: [
        { attemptNumber: 1, marksObtained: 72, timeTaken: 61, completed: true, date: '2025-08-15' }
      ]
    }
  ]

  const handleCreateQuiz = () => {
    // Handle quiz creation
    // console.log('Creating quiz:', createQuizData)
    // setOpenCreateDialog(false)
    // setCreateQuizData({
    //   title: '',
    //   description: '',
    //   timeAllocated: 60,
    //   totalMarks: 100,
    //   tags: [],
    //   resourceTags: []
    // })
    
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

          {/* Create Quiz Dialog */}
          {/* <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  label="Quiz Title"
                  value={createQuizData.title}
                  onChange={(e) => setCreateQuizData({ ...createQuizData, title: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={createQuizData.description}
                  onChange={(e) => setCreateQuizData({ ...createQuizData, description: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Time Allocated (minutes)"
                      type="number"
                      value={createQuizData.timeAllocated}
                      onChange={(e) => setCreateQuizData({ ...createQuizData, timeAllocated: parseInt(e.target.value) })}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Total Marks"
                      type="number"
                      value={createQuizData.totalMarks}
                      onChange={(e) => setCreateQuizData({ ...createQuizData, totalMarks: parseInt(e.target.value) })}
                    />
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  label="Resource Tags (comma-separated)"
                  placeholder="e.g., Lecture 1, Tutorial 2, Assignment 3"
                  value={createQuizData.resourceTags.join(', ')}
                  onChange={(e) => setCreateQuizData({ 
                    ...createQuizData, 
                    resourceTags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Topic Tags (comma-separated)"
                  placeholder="e.g., React, JavaScript, Hooks"
                  value={createQuizData.tags.join(', ')}
                  onChange={(e) => setCreateQuizData({ 
                    ...createQuizData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateQuiz} variant="contained">Create Quiz</Button>
            </DialogActions>
          </Dialog> */}
        </Container>
        
        <Footer />
      </Box>
    </Box>
  )
}

export default QuizesPage
