import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Alert,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import type { StudySlot } from '../api/studyPlanApi';

interface WeeklyTimeSlotsProps {
  slots: StudySlot[];
  onAddSlot: (slot: Omit<StudySlot, 'id' | 'user_id'>) => Promise<void>;
  onUpdateSlot: (slotId: string, updateData: Partial<StudySlot>) => Promise<void>;
  onDeleteSlot: (slotId: string) => Promise<void>;
  readonly?: boolean;
}

interface SlotFormData {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WeeklyTimeSlots: React.FC<WeeklyTimeSlotsProps> = ({
  slots,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  readonly = false,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<StudySlot | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to Monday
  const [formData, setFormData] = useState<SlotFormData>({
    day_of_week: 1,
    start_time: '18:00',
    end_time: '20:00',
  });
  const [error, setError] = useState<string>('');

  // Get today's date for calculating actual dates
  const today = new Date();
  const todayDayOfWeek = today.getDay();

  // Calculate the actual date for each day card
  const getDateForDay = (dayOfWeek: number): Date => {
    const daysUntil = (dayOfWeek - todayDayOfWeek + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntil);
    return targetDate;
  };

  // Format date as MM/DD
  const formatDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Group slots by day
  const slotsByDay = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, StudySlot[]>);

  // Sort slots by start time
  Object.keys(slotsByDay).forEach((day) => {
    slotsByDay[parseInt(day)].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  // Calculate slot duration
  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  // Calculate slot position (percentage from 00:00)
  const calculatePosition = (time: string): number => {
    const [hour, min] = time.split(':').map(Number);
    return ((hour * 60 + min) / 1440) * 100; // 1440 minutes in a day
  };

  // Calculate slot height based on duration
  const calculateHeight = (startTime: string, endTime: string): number => {
    const duration = calculateDuration(startTime, endTime);
    return (duration / 1440) * 100; // Percentage of day
  };

  // Check for overlapping slots
  const checkOverlap = (day: number, start: string, end: string, excludeId?: string): boolean => {
    const daySlots = slotsByDay[day] || [];
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    return daySlots.some((slot) => {
      if (excludeId && slot.id === excludeId) return false;

      const slotStart = timeToMinutes(slot.start_time);
      const slotEnd = timeToMinutes(slot.end_time);

      return (
        (startMinutes < slotEnd && endMinutes > slotStart) ||
        (startMinutes >= slotStart && startMinutes < slotEnd) ||
        (endMinutes > slotStart && endMinutes <= slotEnd)
      );
    });
  };

  const timeToMinutes = (time: string): number => {
    const [hour, min] = time.split(':').map(Number);
    return hour * 60 + min;
  };

  const handleOpenDialog = (day: number) => {
    setSelectedDay(day);
    setFormData({
      day_of_week: day,
      start_time: '18:00',
      end_time: '20:00',
    });
    setEditingSlot(null);
    setError('');
    setOpenDialog(true);
  };

  const handleEditSlot = (slot: StudySlot) => {
    setSelectedDay(slot.day_of_week);
    setFormData({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
    });
    setEditingSlot(slot);
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
    setError('');
  };

  const handleSaveSlot = async () => {
    setError('');

    // Validation
    const duration = calculateDuration(formData.start_time, formData.end_time);
    if (duration < 60) {
      setError('Minimum slot duration is 1 hour');
      return;
    }

    if (duration <= 0) {
      setError('End time must be after start time');
      return;
    }

    // Check for overlaps
    if (checkOverlap(formData.day_of_week, formData.start_time, formData.end_time, editingSlot?.id)) {
      setError('This slot overlaps with an existing slot');
      return;
    }

    try {
      if (editingSlot) {
        await onUpdateSlot(editingSlot.id!, formData);
      } else {
        await onAddSlot(formData);
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save slot');
    }
  };

  const handleDeleteSlot = async (slotId: string, isFree: boolean) => {
    if (!isFree) {
      setError('Cannot delete occupied slot. Drop the study plan first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await onDeleteSlot(slotId);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete slot');
      }
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {DAYS_OF_WEEK.map((dayName, dayIndex) => {
          const actualDate = getDateForDay(dayIndex);
          const isToday = dayIndex === todayDayOfWeek;
          const daySlots = slotsByDay[dayIndex] || [];

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dayIndex}>
              <Card
                sx={{
                  height: '550px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isToday ? '2px solid' : '1px solid',
                  borderColor: isToday ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                  bgcolor: isToday ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: isToday
                    ? '0 8px 32px rgba(139, 92, 246, 0.2)'
                    : '0 4px 16px rgba(139, 92, 246, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: isToday ? '#8b5cf6' : '#4c1d95',
                        }}
                      >
                        {dayName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isToday ? '#8b5cf6' : 'rgba(0, 0, 0, 0.6)',
                          fontWeight: isToday ? 600 : 400,
                        }}
                      >
                        {formatDate(actualDate)}
                        {isToday && ' (Today)'}
                      </Typography>
                    </Box>
                    {!readonly && (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(dayIndex)}
                        sx={{
                          color: '#8b5cf6',
                          bgcolor: 'rgba(139, 92, 246, 0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(139, 92, 246, 0.2)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  </Stack>

                  {/* Time slots visualization */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      position: 'relative',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      minHeight: 400,
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
                            fontSize: '0.65rem',
                          }}
                        >
                          {hour}:00
                        </Typography>
                      </Box>
                    ))}

                    {/* Render slots */}
                    {daySlots.map((slot) => {
                      const duration = calculateDuration(slot.start_time, slot.end_time);
                      const topPosition = calculatePosition(slot.start_time);
                      const height = calculateHeight(slot.start_time, slot.end_time);

                      return (
                        <Box
                          key={slot.id}
                          sx={{
                            position: 'absolute',
                            top: `${topPosition}%`,
                            left: '10%',
                            right: '10%',
                            height: `${height}%`,
                            minHeight: '60px',
                            bgcolor: slot.is_free
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(251, 146, 60, 0.15)',
                            border: '2px solid',
                            borderColor: slot.is_free ? '#10b981' : '#fb923c',
                            borderRadius: 2,
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: slot.is_free
                                ? '0 4px 20px rgba(16, 185, 129, 0.3)'
                                : '0 4px 20px rgba(251, 146, 60, 0.3)',
                              zIndex: 10,
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="caption" fontWeight="bold" display="block">
                              {slot.start_time} - {slot.end_time}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {duration} min
                            </Typography>
                          </Box>

                          <Chip
                            label={slot.is_free ? 'Free' : 'Occupied'}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              bgcolor: slot.is_free ? '#10b981' : '#fb923c',
                              color: 'white',
                              border: 'none',
                            }}
                          />

                          {!readonly && slot.is_free && (
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                onClick={() => handleEditSlot(slot)}
                                sx={{ p: 0.25 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteSlot(slot.id!, slot.is_free!)}
                                sx={{ p: 0.25 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          )}
                        </Box>
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
                      {daySlots.length} slot(s) • {daySlots.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)}{' '}
                      min total
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Add/Edit Slot Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Edit Time Slot' : 'Add Time Slot'} - {DAYS_OF_WEEK[selectedDay]}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Start Time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Alert severity="info" icon={<TimeIcon />}>
              Duration: {calculateDuration(formData.start_time, formData.end_time)} minutes
              <br />
              Minimum duration is 60 minutes
            </Alert>

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSlot} variant="contained">
            {editingSlot ? 'Update' : 'Add'} Slot
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeeklyTimeSlots;
