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
  Assignment as AssignmentIcon
} from '@mui/icons-material'

import QuizSkeleton from '../components/QuizSkelton'
import type {LazyQuizCardProps} from '../types/QuizInterfaces'

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