import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Tooltip,
  Grid,
} from '@mui/material';
import type { ScheduleSlot } from '../api/studyPlanApi';

interface StudyCalendarProps {
  schedule: ScheduleSlot[];
  onTaskUpdate?: (taskId: string, update: any) => Promise<void>;
  readonly?: boolean;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ schedule, onTaskUpdate, readonly = false }) => {
  const [hoveredTaskKey, setHoveredTaskKey] = useState<string | null>(null); // Track hovered TASK, not slot

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

          <Grid container spacing={2} justifyContent="flex-start">
            {scheduleByWeek[weekNumber].map((slot, slotIndex) => {
              const totalMinutes = slot.assigned_resources.reduce(
                (acc, r) => acc + r.allocated_minutes,
                0
              );

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${slot.day_of_week}-${slotIndex}`}>
                  <Card
                    sx={{
                      height: '700px',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
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
                          minHeight: 600,
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
                          
                          const taskStatus = (resource as any).status || 'pending';
                          const isCompleted = taskStatus === 'completed';
                          const isSkipped = taskStatus === 'skipped';
                          
                          // Unique key for each task
                          const taskKey = `${weekNumber}-${slot.day_of_week}-${slotIndex}-${resourceIndex}`;
                          const isTaskHovered = hoveredTaskKey === taskKey;

                          return (
                            <Tooltip
                              key={resourceIndex}
                              title={
                                !isTaskHovered ? (
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
                                      Status: {taskStatus}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Workspace: {resource.workspace_title || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Thread: {resource.thread_title || 'N/A'}
                                    </Typography>
                                  </Box>
                                ) : null
                              }
                              arrow
                            >
                              <Box
                                onMouseEnter={() => setHoveredTaskKey(taskKey)}
                                onMouseLeave={() => setHoveredTaskKey(null)}
                                sx={{
                                  position: isTaskHovered ? 'fixed' : 'absolute',
                                  top: isTaskHovered ? '50%' : `${topPosition + offsetTop}%`,
                                  left: isTaskHovered ? '50%' : '8%',
                                  right: isTaskHovered ? 'auto' : '8%',
                                  transform: isTaskHovered ? 'translate(-50%, -50%)' : 'none',
                                  height: isTaskHovered ? 'auto' : `${taskHeight}%`,
                                  minHeight: isTaskHovered ? '120px' : '45px',
                                  maxHeight: isTaskHovered ? '80vh' : undefined,
                                  width: isTaskHovered ? '240px' : 'auto',
                                  bgcolor: isCompleted
                                    ? 'rgba(59, 130, 246, 0.15)'
                                    : isSkipped
                                    ? 'rgba(156, 163, 175, 0.15)'
                                    : resource.task_type === 'revision'
                                    ? 'rgba(236, 72, 153, 0.15)'
                                    : 'rgba(99, 102, 241, 0.15)',
                                  border: '2px solid',
                                  borderColor: isCompleted
                                    ? '#3b82f6'
                                    : isSkipped
                                    ? '#9ca3af'
                                    : resource.task_type === 'revision'
                                    ? '#ec4899'
                                    : '#6366f1',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: 1,
                                  p: isTaskHovered ? 1.5 : 0.5,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  overflow: isTaskHovered ? 'auto' : 'hidden',
                                  cursor: 'default',
                                  transition: 'all 0.2s',
                                  zIndex: isTaskHovered ? 9999 : 1,
                                  boxShadow: isTaskHovered ? '0 20px 60px rgba(139, 92, 246, 0.4)' : 'none',
                                  '&:hover': {
                                    boxShadow: isTaskHovered ? '0 20px 60px rgba(139, 92, 246, 0.4)' : 3,
                                    transform: isTaskHovered ? 'translate(-50%, -50%)' : 'scale(1.02)',
                                    zIndex: isTaskHovered ? 9999 : 10,
                                  },
                                }}
                              >
                                <Typography
                                  variant={isTaskHovered ? "body2" : "caption"}
                                  fontWeight="bold"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: isTaskHovered ? 'normal' : 'nowrap',
                                    fontSize: isTaskHovered ? '0.875rem' : '0.7rem',
                                  }}
                                >
                                  {resource.title}
                                </Typography>
                                {isTaskHovered && (
                                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                                    {resource.workspace_title} • {resource.thread_title}
                                  </Typography>
                                )}
                                <Typography variant="caption" sx={{ fontSize: isTaskHovered ? '0.75rem' : '0.65rem' }}>
                                  {resource.allocated_minutes}m • {resource.task_type}
                                </Typography>
                                <Chip
                                  label={taskStatus}
                                  size="small"
                                  sx={{ 
                                    height: isTaskHovered ? 22 : 16, 
                                    fontSize: isTaskHovered ? '0.7rem' : '0.6rem', 
                                    mt: 0.5,
                                    bgcolor: isCompleted
                                      ? '#3b82f6'
                                      : isSkipped
                                      ? '#9ca3af'
                                      : resource.task_type === 'revision'
                                      ? '#ec4899'
                                      : '#6366f1',
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                                
                                {/* Status buttons on hover */}
                                {!readonly && isTaskHovered && resource.task_id && (
                                  <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                                    <Button
                                      size="small"
                                      variant={taskStatus === 'completed' ? 'contained' : 'outlined'}
                                      color="primary"
                                      sx={{ fontSize: '0.65rem', py: 0.5, minWidth: 'auto' }}
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        if (onTaskUpdate && resource.task_id) {
                                          try {
                                            await onTaskUpdate(resource.task_id, { status: 'completed' });
                                            (resource as any).status = 'completed';
                                          } catch (err) {
                                            console.error('Failed to update task:', err);
                                          }
                                        }
                                      }}
                                    >
                                      ✓ Done
                                    </Button>
                                    <Button
                                      size="small"
                                      variant={taskStatus === 'skipped' ? 'contained' : 'outlined'}
                                      color="warning"
                                      sx={{ fontSize: '0.65rem', py: 0.5, minWidth: 'auto' }}
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        if (onTaskUpdate && resource.task_id) {
                                          try {
                                            await onTaskUpdate(resource.task_id, { status: 'skipped' });
                                            (resource as any).status = 'skipped';
                                          } catch (err) {
                                            console.error('Failed to update task:', err);
                                          }
                                        }
                                      }}
                                    >
                                      Skip
                                    </Button>
                                  </Stack>
                                )}
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
    </Box>
  );
};

export default StudyCalendar;
