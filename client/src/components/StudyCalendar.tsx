import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  ArrowBackIos,
  ArrowForwardIos,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  SkipNext as SkipIcon,
} from '@mui/icons-material';
import type { StudyPlanResult, StudySession } from '../types/StudyPlanInterfaces';
import { getActiveStudyPlan, updateStudySessionStatus } from '../api/studyPlanApi';
import { getUserData } from '../api/authApi';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface StudyCalendarProps {
  showTitle?: boolean;
  compact?: boolean;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ 
  showTitle = true, 
  compact = false 
}) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlanResult | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [sessionRating, setSessionRating] = useState<number>(5);
  const [actualTimeSpent, setActualTimeSpent] = useState<number>(0);

  const userData = getUserData();
  const userId = typeof userData?.id === 'string' ? parseInt(userData.id) : userData?.id || 1;

  useEffect(() => {
    fetchActiveStudyPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchActiveStudyPlan = async () => {
    try {
      setLoading(true);
      const plan = await getActiveStudyPlan(userId);
      
      if (plan) {
        setStudyPlan(plan);
        setError(null);
      } else {
        // Demo data for when no active plan exists
        setStudyPlan({
          id: 1,
          user_id: userId,
          schedule: [
            {
              id: 1,
              resource: {
                id: 1,
                name: 'Linear Algebra Fundamentals',
                type: 'document',
                workspace_id: 1,
                thread_id: 1,
                estimated_duration: 120,
                difficulty_level: 'medium',
                description: 'Introduction to vectors and matrices',
              },
              time_slot: {
                day_of_week: 'Monday',
                start_time: '09:00',
                end_time: '11:00',
                is_available: true,
              },
              week_number: 1,
              allocated_time: 120,
              status: 'scheduled',
            },
            {
              id: 2,
              resource: {
                id: 2,
                name: 'Neural Networks Quiz',
                type: 'quiz',
                workspace_id: 1,
                thread_id: 2,
                estimated_duration: 45,
                difficulty_level: 'hard',
                description: 'Test your understanding of neural networks',
              },
              time_slot: {
                day_of_week: 'Wednesday',
                start_time: '14:00',
                end_time: '15:00',
                is_available: true,
              },
              week_number: 1,
              allocated_time: 60,
              status: 'completed',
              completion_date: '2024-01-15',
              actual_time_spent: 50,
              user_rating: 4,
            },
            {
              id: 3,
              resource: {
                id: 3,
                name: 'React Hooks Deep Dive',
                type: 'video',
                workspace_id: 2,
                thread_id: 3,
                estimated_duration: 90,
                difficulty_level: 'medium',
                description: 'Advanced React hooks patterns',
              },
              time_slot: {
                day_of_week: 'Friday',
                start_time: '10:00',
                end_time: '11:30',
                is_available: true,
              },
              week_number: 1,
              allocated_time: 90,
              status: 'in_progress',
            },
          ],
          total_coverage_percentage: 75,
          total_allocated_hours: 8.5,
          plan_duration_weeks: 4,
          status: 'active',
          created_at: '2024-01-10',
          updated_at: '2024-01-15',
        });
      }
    } catch (err) {
      console.error('Error fetching study plan:', err);
      setError('No active study plan found. Generate one to see your schedule.');
    } finally {
      setLoading(false);
    }
  };

  const getSessionsForWeek = (week: number) => {
    if (!studyPlan) return {};
    
    const sessionsForWeek = studyPlan.schedule.filter(session => session.week_number === week);
    const sessionsByDay: Record<string, StudySession[]> = {};
    
    daysOfWeek.forEach(day => {
      sessionsByDay[day] = sessionsForWeek.filter(session => 
        session.time_slot.day_of_week === day
      );
    });
    
    return sessionsByDay;
  };

  const handleSessionClick = (session: StudySession) => {
    setSelectedSession(session);
    setCompletionNotes(session.notes || '');
    setSessionRating(session.user_rating || 5);
    setActualTimeSpent(session.actual_time_spent || session.allocated_time);
    setSessionDialogOpen(true);
  };

  const handleSessionStatusUpdate = async (status: 'in_progress' | 'completed' | 'skipped') => {
    if (!selectedSession) return;

    try {
      await updateStudySessionStatus(
        userId,
        selectedSession.id,
        status,
        status === 'completed' ? actualTimeSpent : undefined,
        status === 'completed' ? sessionRating : undefined,
        status === 'completed' ? completionNotes : undefined
      );

      // Update local state
      setStudyPlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          schedule: prev.schedule.map(session => 
            session.id === selectedSession.id
              ? {
                  ...session,
                  status,
                  actual_time_spent: status === 'completed' ? actualTimeSpent : session.actual_time_spent,
                  user_rating: status === 'completed' ? sessionRating : session.user_rating,
                  notes: status === 'completed' ? completionNotes : session.notes,
                  completion_date: status === 'completed' ? new Date().toISOString() : session.completion_date,
                }
              : session
          ),
        };
      });

      setSessionDialogOpen(false);
    } catch (err) {
      console.error('Error updating session status:', err);
      // For demo, update locally anyway
      setStudyPlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          schedule: prev.schedule.map(session => 
            session.id === selectedSession.id
              ? {
                  ...session,
                  status,
                  actual_time_spent: status === 'completed' ? actualTimeSpent : session.actual_time_spent,
                  user_rating: status === 'completed' ? sessionRating : session.user_rating,
                  notes: status === 'completed' ? completionNotes : session.notes,
                  completion_date: status === 'completed' ? new Date().toISOString() : session.completion_date,
                }
              : session
          ),
        };
      });
      setSessionDialogOpen(false);
    }
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'skipped': return 'error';
      default: return 'default';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'quiz': return '📝';
      case 'document': return '📄';
      case 'link': return '🔗';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading study calendar...</Typography>
      </Paper>
    );
  }

  if (error || !studyPlan) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          {error || 'No active study plan found. Generate a study plan to see your scheduled sessions.'}
        </Alert>
      </Paper>
    );
  }

  const sessionsByDay = getSessionsForWeek(currentWeek);
  const totalWeeks = studyPlan.plan_duration_weeks;

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
          <CalendarIcon color="primary" />
          Study Calendar
        </Typography>
      )}

      {/* Week Navigation */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="primary.main">
              Week {currentWeek} of {totalWeeks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Object.values(sessionsByDay).flat().length} sessions scheduled
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              size="small"
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton 
              onClick={() => setCurrentWeek(Math.min(totalWeeks, currentWeek + 1))}
              disabled={currentWeek === totalWeeks}
              size="small"
            >
              <ArrowForwardIos />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Weekly Calendar */}
      <Box sx={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(3, 1fr)' : 'repeat(7, 1fr)', gap: 1 }}>
        {(compact ? daysOfWeek.slice(0, 3) : daysOfWeek).map((day) => (
          <Card key={day} variant="outlined" sx={{ minHeight: 200 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1} textAlign="center">
                {day}
              </Typography>
              
              <Stack spacing={1}>
                {sessionsByDay[day]?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                    No sessions
                  </Typography>
                ) : (
                  sessionsByDay[day]?.map((session) => (
                    <Paper
                      key={session.id}
                      sx={{
                        p: 1,
                        cursor: 'pointer',
                        bgcolor: getStatusColor(session.status) + '.50',
                        border: '1px solid',
                        borderColor: getStatusColor(session.status) + '.200',
                        '&:hover': {
                          bgcolor: getStatusColor(session.status) + '.100',
                          borderColor: getStatusColor(session.status) + '.400',
                        },
                      }}
                      onClick={() => handleSessionClick(session)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Typography sx={{ fontSize: '1.2em' }}>
                          {getResourceIcon(session.resource.type)}
                        </Typography>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight="bold" noWrap>
                            {session.resource.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                            <TimeIcon fontSize="inherit" />
                            {session.time_slot.start_time} - {session.time_slot.end_time}
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip 
                              label={session.status} 
                              size="small" 
                              color={getStatusColor(session.status)}
                              sx={{ fontSize: '0.7rem', height: 18 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {compact && sessionsByDay && Object.values(sessionsByDay).flat().length > 3 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ... and {Object.values(sessionsByDay).flat().length - 3} more sessions this week
          </Typography>
        </Box>
      )}

      {/* Session Detail Dialog */}
      <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedSession && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  {getResourceIcon(selectedSession.resource.type)}
                </Typography>
                <Box>
                  <Typography variant="h6">{selectedSession.resource.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedSession.time_slot.day_of_week}, {selectedSession.time_slot.start_time} - {selectedSession.time_slot.end_time}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            
            <DialogContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {selectedSession.resource.description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={selectedSession.resource.difficulty_level} size="small" />
                    <Chip label={`${selectedSession.allocated_time} min`} size="small" />
                    <Chip 
                      label={selectedSession.status} 
                      color={getStatusColor(selectedSession.status)} 
                      size="small" 
                    />
                  </Stack>
                </Box>

                {selectedSession.status === 'completed' && (
                  <Box>
                    <Typography variant="body2" fontWeight="bold" mb={1}>
                      Completion Details:
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        Time spent: {selectedSession.actual_time_spent} minutes
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">Rating:</Typography>
                        <Rating value={selectedSession.user_rating || 0} size="small" readOnly />
                      </Box>
                      {selectedSession.notes && (
                        <Typography variant="body2">
                          Notes: {selectedSession.notes}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                {selectedSession.status !== 'completed' && (
                  <>
                    <TextField
                      label="Actual time spent (minutes)"
                      type="number"
                      value={actualTimeSpent}
                      onChange={(e) => setActualTimeSpent(parseInt(e.target.value) || 0)}
                      size="small"
                      fullWidth
                    />
                    
                    <Box>
                      <Typography variant="body2" mb={1}>Rate this session:</Typography>
                      <Rating
                        value={sessionRating}
                        onChange={(_, value) => setSessionRating(value || 5)}
                      />
                    </Box>
                    
                    <TextField
                      label="Notes (optional)"
                      multiline
                      rows={3}
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </>
                )}
              </Stack>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSessionDialogOpen(false)}>Close</Button>
              
              {selectedSession.status === 'scheduled' && (
                <>
                  <Button 
                    startIcon={<PlayIcon />}
                    onClick={() => handleSessionStatusUpdate('in_progress')}
                    color="warning"
                  >
                    Start
                  </Button>
                  <Button 
                    startIcon={<SkipIcon />}
                    onClick={() => handleSessionStatusUpdate('skipped')}
                    color="error"
                  >
                    Skip
                  </Button>
                </>
              )}
              
              {selectedSession.status === 'in_progress' && (
                <>
                  <Button 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleSessionStatusUpdate('completed')}
                    color="success"
                    variant="contained"
                  >
                    Complete
                  </Button>
                  <Button 
                    startIcon={<SkipIcon />}
                    onClick={() => handleSessionStatusUpdate('skipped')}
                    color="error"
                  >
                    Skip
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StudyCalendar;