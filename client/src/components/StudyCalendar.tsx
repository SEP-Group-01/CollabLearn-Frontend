import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Rating,
  TextField,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import type { ScheduleSlot, ScheduledResource } from '../api/studyPlanApi';

interface StudyCalendarProps {
  schedule: ScheduleSlot[];
  onTaskUpdate?: (taskId: string, update: any) => Promise<void>;
  readonly?: boolean;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ schedule, onTaskUpdate, readonly = false }) => {
  const [selectedTask, setSelectedTask] = useState<{
    task: ScheduledResource;
    slot: ScheduleSlot;
  } | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>('pending');
  const [taskRating, setTaskRating] = useState<number>(0);
  const [taskNotes, setTaskNotes] = useState<string>('');

  // Group schedule by week
  const scheduleByWeek = schedule.reduce((acc, slot) => {
    if (!acc[slot.week_number]) {
      acc[slot.week_number] = [];
    }
    acc[slot.week_number].push(slot);
    return acc;
  }, {} as Record<number, ScheduleSlot[]>);

  // Sort slots within each week by day
  Object.keys(scheduleByWeek).forEach((week) => {
    scheduleByWeek[parseInt(week)].sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week - b.day_of_week;
      }
      return a.start_time.localeCompare(b.start_time);
    });
  });

  const weeks = Object.keys(scheduleByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  const calculatePosition = (time: string): number => {
    const [hour, min] = time.split(':').map(Number);
    return ((hour * 60 + min) / 1440) * 100;
  };

  const calculateHeight = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const duration = endHour * 60 + endMin - (startHour * 60 + startMin);
    return (duration / 1440) * 100;
  };

  const handleTaskClick = (task: ScheduledResource, slot: ScheduleSlot) => {
    setSelectedTask({ task, slot });
    setTaskStatus('pending');
    setTaskRating(0);
    setTaskNotes('');
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
    setTaskStatus('pending');
    setTaskRating(0);
    setTaskNotes('');
  };

  const handleMarkComplete = async () => {
    if (!selectedTask || !onTaskUpdate || !selectedTask.task.task_id) return;

    try {
      await onTaskUpdate(selectedTask.task.task_id, {
        status: taskStatus,
        rating: taskRating || undefined,
        notes: taskNotes || undefined,
        completion_percentage: taskStatus === 'completed' ? 100 : undefined,
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (!schedule || schedule.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">
          No study plan generated yet. Configure your time slots and select resources to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Study Plan Schedule
      </Typography>

      {weeks.map((weekNumber) => (
        <Box key={weekNumber} mb={4}>
          <Typography variant="h6" color="primary" gutterBottom>
            Week {weekNumber}
          </Typography>

          <Grid container spacing={2}>
            {scheduleByWeek[weekNumber].map((slot, slotIndex) => {
              const totalMinutes = slot.assigned_resources.reduce(
                (acc, r) => acc + r.allocated_minutes,
                0
              );

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${slot.day_of_week}-${slotIndex}`}>
                  <Card
                    sx={{
                      height: '500px',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                      <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#4c1d95' }}>
                          {slot.day_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                          {new Date(slot.scheduled_date).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {/* Time visualization */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          position: 'relative',
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.default',
                          minHeight: 300,
                        }}
                      >
                        {/* Time markers */}
                        {[0, 6, 12, 18, 24].map((hour) => (
                          <Box
                            key={hour}
                            sx={{
                              position: 'absolute',
                              top: `${(hour / 24) * 100}%`,
                              left: 0,
                              right: 0,
                              borderTop: 1,
                              borderColor: 'divider',
                              opacity: 0.3,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                left: 2,
                                top: -8,
                                bgcolor: 'background.default',
                                px: 0.5,
                                fontSize: '0.6rem',
                              }}
                            >
                              {hour}:00
                            </Typography>
                          </Box>
                        ))}

                        {/* Slot background */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: `${calculatePosition(slot.start_time)}%`,
                            left: '5%',
                            right: '5%',
                            height: `${calculateHeight(slot.start_time, slot.end_time)}%`,
                            bgcolor: 'action.hover',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        />

                        {/* Render tasks */}
                        {slot.assigned_resources.map((resource, resourceIndex) => {
                          const topPosition = calculatePosition(slot.start_time);
                          const taskHeight = (resource.allocated_minutes / 1440) * 100;
                          const offsetTop =
                            resourceIndex > 0
                              ? slot.assigned_resources
                                  .slice(0, resourceIndex)
                                  .reduce((acc, r) => acc + (r.allocated_minutes / 1440) * 100, 0)
                              : 0;

                          return (
                            <Tooltip
                              key={resourceIndex}
                              title={
                                <Box>
                                  <Typography variant="caption" display="block">
                                    <strong>{resource.title}</strong>
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    Type: {resource.task_type}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    Duration: {resource.allocated_minutes} min
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    Workspace: {resource.workspace_title || 'N/A'}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    Thread: {resource.thread_title || 'N/A'}
                                  </Typography>
                                </Box>
                              }
                              arrow
                            >
                              <Box
                                onClick={() => !readonly && handleTaskClick(resource, slot)}
                                sx={{
                                  position: 'absolute',
                                  top: `${topPosition + offsetTop}%`,
                                  left: '8%',
                                  right: '8%',
                                  height: `${taskHeight}%`,
                                  minHeight: '45px',
                                  bgcolor:
                                    resource.task_type === 'revision'
                                      ? 'rgba(236, 72, 153, 0.15)'
                                      : 'rgba(59, 130, 246, 0.15)',
                                  border: '2px solid',
                                  borderColor: resource.task_type === 'revision' ? '#ec4899' : '#3b82f6',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: 1,
                                  p: 0.5,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  overflow: 'hidden',
                                  cursor: readonly ? 'default' : 'pointer',
                                  transition: 'all 0.2s',
                                  '&:hover': readonly
                                    ? {}
                                    : {
                                        boxShadow: 3,
                                        transform: 'scale(1.02)',
                                        zIndex: 10,
                                      },
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  fontWeight="bold"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  {resource.title}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                  {resource.allocated_minutes}m
                                </Typography>
                                <Chip
                                  label={resource.task_type}
                                  size="small"
                                  color={resource.task_type === 'revision' ? 'secondary' : 'primary'}
                                  sx={{ height: 16, fontSize: '0.6rem', mt: 0.5 }}
                                />
                              </Box>
                            </Tooltip>
                          );
                        })}
                      </Box>

                      {/* Summary */}
                      <Box
                        mt={1.5}
                        sx={{
                          pt: 1.5,
                          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                          minHeight: '40px',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(0, 0, 0, 0.7)',
                            fontWeight: 500,
                            display: 'block',
                          }}
                        >
                          {slot.start_time} - {slot.end_time} • {slot.assigned_resources.length} task(s) •{' '}
                          {totalMinutes} min
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Resource
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedTask.task.title}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Workspace / Thread
                </Typography>
                <Typography variant="body2">
                  {selectedTask.task.workspace_title} / {selectedTask.task.thread_title}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Schedule
                </Typography>
                <Typography variant="body2">
                  {selectedTask.slot.day_name}, {new Date(selectedTask.slot.scheduled_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  {selectedTask.slot.start_time} - {selectedTask.slot.end_time}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Duration & Type
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={`${selectedTask.task.allocated_minutes} minutes`} size="small" />
                  <Chip
                    label={selectedTask.task.task_type}
                    size="small"
                    color={selectedTask.task.task_type === 'revision' ? 'secondary' : 'primary'}
                  />
                </Stack>
              </Box>

              {!readonly && (
                <>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Mark as Completed
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant={taskStatus === 'completed' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<CompletedIcon />}
                        onClick={() => setTaskStatus('completed')}
                      >
                        Completed
                      </Button>
                      <Button
                        variant={taskStatus === 'skipped' ? 'contained' : 'outlined'}
                        size="small"
                        color="warning"
                        onClick={() => setTaskStatus('skipped')}
                      >
                        Skipped
                      </Button>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Rate this session
                    </Typography>
                    <Rating
                      value={taskRating}
                      onChange={(_, value) => setTaskRating(value || 0)}
                      size="large"
                    />
                  </Box>

                  <TextField
                    label="Notes (optional)"
                    multiline
                    rows={3}
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    fullWidth
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            {!readonly && (
              <Button onClick={handleMarkComplete} variant="contained" disabled={!taskStatus}>
                Save Progress
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default StudyCalendar;
