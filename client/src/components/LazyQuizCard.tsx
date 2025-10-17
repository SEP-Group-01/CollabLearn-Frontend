import { useInView } from 'react-intersection-observer'
 import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  Stack,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material'
import {
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
  People,
  Star,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  PlayCircle as PlayCircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'

import QuizSkeleton from '../components/QuizSkelton'
import type {LazyQuizCardProps} from '../types/QuizInterfaces'

const LazyQuizCard = ({ 
  quiz, 
  index, 
  totalQuizzes, 
  userRole: _userRole, 
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

  // Enhanced quiz status logic using studentAttempts data
  const getQuizStatus = () => {
    if (!quiz.studentAttempts || quiz.studentAttempts.length === 0) {
      return {
        status: 'not_attempted',
        buttonText: 'Start Quiz',
        buttonAction: 'start',
        description: 'Take your first attempt at this quiz',
        canShowProgress: false
      }
    }

    const completedAttempts = quiz.studentAttempts.filter(attempt => attempt.completed)
    const activeAttempts = quiz.studentAttempts.filter(attempt => !attempt.completed)
    
    if (activeAttempts.length > 0) {
      return {
        status: 'in_progress',
        buttonText: 'Continue Quiz',
        buttonAction: 'continue',
        description: 'You have an active attempt in progress',
        canShowProgress: true
      }
    }
    
    if (completedAttempts.length > 0) {
      const bestScore = Math.max(...completedAttempts.map(attempt => attempt.marksObtained))
      const lastAttempt = quiz.studentAttempts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
      
      return {
        status: 'completed',
        buttonText: 'Reattempt Quiz',
        buttonAction: 'reattempt',
        description: `Best score: ${bestScore}/${quiz.totalMarks} • Last attempt: ${lastAttempt.date}`,
        canShowProgress: true,
        bestScore,
        lastAttempt
      }
    }

    // Fallback - shouldn't reach here normally
    return {
      status: 'not_attempted',
      buttonText: 'Start Quiz', 
      buttonAction: 'start',
      description: 'Take your first attempt at this quiz',
      canShowProgress: false
    }
  }

  const quizStatus = getQuizStatus()

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
                        Created by {quiz.creator || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {quiz.description || 'No description available'}
                </Typography>

                {/* Quiz Details */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <TimerIcon color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="primary">
                        {formatTime(quiz.timeAllocated || 0)}
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
                        {quiz.totalMarks || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Marks
                      </Typography>
                    </Paper>
                  </Box>
                </Box>

                {/* Topic Tags */}
                <Box sx={{ mb: 3 }}>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(quiz.tags || []).map((tag, index) => (
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
                    {(quiz.resourceTags || []).map((resource, index) => (
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Your Attempt History
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {quizStatus.bestScore !== undefined && (
                          <Chip 
                            label={`Best: ${quizStatus.bestScore}/${quiz.totalMarks}`}
                            color="success"
                            variant="outlined"
                          />
                        )}
                        {quiz.studentAttempts.some(attempt => attempt.completed) && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<ViewIcon />}
                            onClick={() => onReviewAttempt(quiz.id, 0)} // 0 indicates review all attempts
                            sx={{ ml: 1 }}
                          >
                            Review Attempts
                          </Button>
                        )}
                      </Box>
                    </Box>
                    
                    {quiz.studentAttempts
                      .sort((a, b) => b.attemptNumber - a.attemptNumber) // Show latest first
                      .map((attempt) => (
                      <Paper
                        key={attempt.attemptNumber}
                        variant="outlined"
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          bgcolor: attempt.completed ? 'grey.50' : 'warning.50',
                          border: attempt.completed ? undefined : '1px solid',
                          borderColor: attempt.completed ? undefined : 'warning.main'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                Attempt #{attempt.attemptNumber}
                              </Typography>
                              {!attempt.completed && (
                                <Chip 
                                  label="In Progress" 
                                  size="small" 
                                  color="warning" 
                                  variant="filled"
                                />
                              )}
                              {attempt.completed && quizStatus.bestScore === attempt.marksObtained && (
                                <Chip 
                                  label="Best Score" 
                                  size="small" 
                                  color="success" 
                                  variant="filled"
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Date: {attempt.date}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Chip
                                label={`${attempt.marksObtained}/${quiz.totalMarks}`}
                                size="small"
                                color={attempt.completed ? getPerformanceColor(attempt.marksObtained, quiz.totalMarks) : 'default'}
                                variant={attempt.completed ? 'filled' : 'outlined'}
                              />
                              <Chip
                                label={formatTime(attempt.timeTaken)}
                                size="small"
                                variant="outlined"
                                icon={<TimerIcon />}
                              />
                              {attempt.completed && quiz.totalMarks > 0 && (
                                <Chip
                                  label={`${Math.round((attempt.marksObtained / quiz.totalMarks) * 100)}%`}
                                  size="small"
                                  color={getPerformanceColor(attempt.marksObtained, quiz.totalMarks)}
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
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
                        {quiz.totalAttempts || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Attempts
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Star color="warning" sx={{ mb: 1 }} />
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                        {(quiz.averageMarks || 0).toFixed(1)}
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
                      value={quiz.totalMarks ? ((quiz.averageMarks || 0) / quiz.totalMarks) * 100 : 0}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {quiz.totalMarks ? (((quiz.averageMarks || 0) / quiz.totalMarks) * 100).toFixed(1) : 0}% class average
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Average Time: {formatTime(quiz.averageTime || 0)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={quiz.timeAllocated ? ((quiz.averageTime || 0) / quiz.timeAllocated) * 100 : 0}
                      color="secondary"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {quiz.timeAllocated ? (((quiz.averageTime || 0) / quiz.timeAllocated) * 100).toFixed(1) : 0}% of allocated time
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {/* Status indicator */}
                    {quizStatus.status !== 'not_attempted' && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: quizStatus.status === 'completed' ? 'success.light' : 'warning.light',
                        borderRadius: 1,
                        mb: 1
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {quizStatus.status === 'completed' ? 
                            <TrendingUpIcon sx={{ mr: 1, color: 'success.dark' }} /> :
                            <TimerIcon sx={{ mr: 1, color: 'warning.dark' }} />
                          }
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {quizStatus.status === 'completed' ? 
                              `Attempts: ${quiz.studentAttempts?.length || 0}` : 
                              'In Progress'
                            }
                          </Typography>
                        </Box>
                        {quizStatus.bestScore !== undefined && (
                          <Chip 
                            label={`Best: ${quizStatus.bestScore}/${quiz.totalMarks}`}
                            size="small" 
                            color="success" 
                            variant="filled"
                          />
                        )}
                      </Box>
                    )}

                    {/* Main action button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={
                        quizStatus.status === 'not_attempted' ? <PlayCircleIcon /> :
                        quizStatus.status === 'in_progress' ? <PlayArrowIcon /> :
                        <RefreshIcon />
                      }
                      onClick={() => onAttemptQuiz(quiz.id)}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        ...(quizStatus.status === 'in_progress' && {
                          bgcolor: 'warning.main',
                          '&:hover': { bgcolor: 'warning.dark' }
                        })
                      }}
                    >
                      {quizStatus.buttonText}
                    </Button>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {quizStatus.description}
                    </Typography>

                    {/* Additional attempt info for completed quizzes */}
                    {quizStatus.status === 'completed' && quiz.studentAttempts && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          Total attempts: {quiz.studentAttempts.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Success rate: {quiz.totalMarks > 0 ? 
                            // Use averageMarks returned from backend (avg marks across attempts)
                            Math.round(((quiz.averageMarks || 0) / quiz.totalMarks) * 100) : 0}%
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      ) : (
        <QuizSkeleton/>
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

export default LazyQuizCard;