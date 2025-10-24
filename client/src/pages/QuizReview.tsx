import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Badge,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Score,
  ArrowBack,
  Quiz as QuizIcon
} from '@mui/icons-material';
import SidebarComponent from '../components/SideBar';
import { getQuizById, getMyAttemptsForQuiz } from '../api/quizApi';

interface QuizAttempt {
  id: string;
  attemptNumber: number;
  marksObtained: number;
  totalMarks: number;
  timeTaken: string;
  completed: boolean;
  created_at: string;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
  }[];
}

interface QuizQuestion {
  id: string;
  question_text: string;
  attachment_url?: string;
  marks: number;
  quiz_options: {
    id: string;
    text: string;
    image_url?: string;
    is_correct: boolean;
    sequence_letter: string;
  }[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  allocated_time: number;
  quiz_questions: QuizQuestion[];
}

const QuizReview: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      if (!quizId) {
        setError('Quiz ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch quiz details
        const quizData = await getQuizById(quizId);
        console.log('[QuizReview] Quiz data:', quizData);
        setQuiz(quizData as any);

        // Fetch user's attempts for this quiz
        const attemptsData = await getMyAttemptsForQuiz(quizId);
        console.log('[QuizReview] Attempts data:', attemptsData);
        setAttempts(attemptsData || []);

        // Select the most recent attempt by default
        if (attemptsData && attemptsData.length > 0) {
          setSelectedAttempt(attemptsData[0]);
        }

      } catch (err) {
        console.error('[QuizReview] Error fetching data:', err);
        setError('Failed to load quiz review data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndAttempts();
  }, [quizId]);

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return 'N/A';
    // timeStr is in HH:MM:SS format
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const getPercentage = (obtained: number, total: number): number => {
    return total > 0 ? Math.round((obtained / total) * 100) : 0;
  };

  const getPerformanceColor = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const isAnswerCorrect = (question: QuizQuestion, userAnswers: string[]): boolean => {
    const correctOptions = question.quiz_options.filter(opt => opt.is_correct);
    const correctIds = correctOptions.map(opt => opt.id);
    
    return userAnswers.length === correctIds.length && 
           userAnswers.every(id => correctIds.includes(id)) &&
           correctIds.every(id => userAnswers.includes(id));
  };

  const getUserAnswersForQuestion = (questionId: string): string[] => {
    if (!selectedAttempt?.answers) return [];
    const answer = selectedAttempt.answers.find(a => a.questionId === questionId);
    return answer ? answer.selectedOptionIds : [];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
        </Box>
      </Box>
    );
  }

  if (!quiz || !attempts.length) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', p: 4 }}>
          <Alert severity="info">No quiz attempts found for review.</Alert>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box sx={{ flexGrow: 1, ml: collapsed ? '80px' : '250px', transition: 'margin-left 0.3s' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Back to Quizzes
            </Button>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuizIcon />
              Quiz Review: {quiz.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {quiz.description}
            </Typography>
          </Box>

          {/* Attempts Selection - Horizontal Tabs */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Your Attempts ({attempts.length})
              </Typography>
              <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                {attempts.map((attempt) => {
                  const percentage = getPercentage(attempt.marksObtained, attempt.totalMarks || quiz.quiz_questions.reduce((sum, q) => sum + q.marks, 0));
                  const isSelected = selectedAttempt?.id === attempt.id;
                  
                  return (
                    <Paper
                      key={attempt.id}
                      elevation={isSelected ? 3 : 1}
                      sx={{
                        p: 2,
                        minWidth: 200,
                        cursor: 'pointer',
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
                        '&:hover': { bgcolor: isSelected ? 'primary.lighter' : 'action.hover' }
                      }}
                      onClick={() => setSelectedAttempt(attempt)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          Attempt #{attempt.attemptNumber}
                        </Typography>
                        <Chip
                          label={`${percentage}%`}
                          color={getPerformanceColor(percentage)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Score: {attempt.marksObtained}/{attempt.totalMarks || quiz.quiz_questions.reduce((sum, q) => sum + q.marks, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time: {formatTime(attempt.timeTaken)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {new Date(attempt.created_at).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

          {/* Selected Attempt Review - Full Width */}
          {selectedAttempt && (
            <Card>
              <CardContent>
                {/* Attempt Summary */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Attempt #{selectedAttempt.attemptNumber} Review
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Score color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Score</Typography>
                          <Typography variant="h6">
                            {selectedAttempt.marksObtained}/{selectedAttempt.totalMarks || quiz.quiz_questions.reduce((sum, q) => sum + q.marks, 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Time Taken</Typography>
                          <Typography variant="h6">{formatTime(selectedAttempt.timeTaken)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Performance</Typography>
                        <Chip
                          label={`${getPercentage(selectedAttempt.marksObtained, selectedAttempt.totalMarks || quiz.quiz_questions.reduce((sum, q) => sum + q.marks, 0))}%`}
                          color={getPerformanceColor(getPercentage(selectedAttempt.marksObtained, selectedAttempt.totalMarks || quiz.quiz_questions.reduce((sum, q) => sum + q.marks, 0)))}
                          sx={{ fontSize: '1rem', height: 32 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ mb: 3 }} />

                    {/* Questions Review */}
                    <Typography variant="h6" gutterBottom>
                      Questions Review
                    </Typography>
                    <Stack spacing={3}>
                      {quiz.quiz_questions.map((question, qIndex) => {
                        const userAnswers = getUserAnswersForQuestion(question.id);
                        const isCorrect = isAnswerCorrect(question, userAnswers);
                        
                        return (
                          <Card key={question.id} variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                <Badge
                                  badgeContent={isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}
                                  sx={{ '& .MuiBadge-badge': { bgcolor: 'transparent' } }}
                                >
                                  <Box sx={{ minWidth: 40, textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary">
                                      Q{qIndex + 1}
                                    </Typography>
                                  </Box>
                                </Badge>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    {question.question_text}
                                  </Typography>
                                  {(question.attachment_url || (question as any).image) && (
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                      <img 
                                        src={question.attachment_url || (question as any).image} 
                                        alt="Question image" 
                                        style={{ maxWidth: '100%', maxHeight: 400, height: 'auto', borderRadius: 8, objectFit: 'contain' }}
                                      />
                                    </Box>
                                  )}
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Marks: {question.marks}
                                  </Typography>
                                  
                                  {/* Options */}
                                  <Stack spacing={1} sx={{ mt: 2 }}>
                                    {question.quiz_options.map((option) => {
                                      const isUserSelected = userAnswers.includes(option.id);
                                      const isCorrectOption = option.is_correct;
                                      const hasImage = option.image_url || (option as any).image;
                                      
                                      let backgroundColor = 'transparent';
                                      let borderColor = 'divider';
                                      let textColor = 'text.primary';
                                      
                                      if (isCorrectOption && isUserSelected) {
                                        backgroundColor = 'success.light';
                                        borderColor = 'success.main';
                                        textColor = 'success.contrastText';
                                      } else if (isCorrectOption && !isUserSelected) {
                                        backgroundColor = 'success.light';
                                        borderColor = 'success.main';
                                        textColor = 'success.contrastText';
                                      } else if (!isCorrectOption && isUserSelected) {
                                        backgroundColor = 'error.light';
                                        borderColor = 'error.main';
                                        textColor = 'error.contrastText';
                                      }
                                      
                                      return (
                                        <Paper
                                          key={option.id}
                                          variant="outlined"
                                          sx={{
                                            p: hasImage ? 2 : 1.5,
                                            bgcolor: backgroundColor,
                                            borderColor: borderColor,
                                            color: textColor,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: hasImage ? 2 : 0,
                                            minHeight: hasImage ? 450 : 'auto'
                                          }}
                                        >
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 24 }}>
                                              {option.sequence_letter}.
                                            </Typography>
                                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                              {option.text}
                                            </Typography>
                                            {isUserSelected && (
                                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                (Your Answer)
                                              </Typography>
                                            )}
                                            {isCorrectOption && (
                                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                ✓ Correct
                                              </Typography>
                                            )}
                                          </Box>
                                          {hasImage && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
                                              <img 
                                                src={option.image_url || (option as any).image} 
                                                alt="Option image" 
                                                style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain', borderRadius: 4 }}
                                              />
                                            </Box>
                                          )}
                                        </Paper>
                                      );
                                    })}
                                  </Stack>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              )}
        </Container>
      </Box>
    </Box>
  );
};

export default QuizReview;