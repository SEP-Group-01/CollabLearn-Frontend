import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import type { TimeSlot } from '../types/StudyPlanInterfaces';
import { getUserTimeSlots, createTimeSlot, updateTimeSlot, deleteTimeSlot } from '../api/studyPlanApi';
import { getUserData } from '../api/authApi';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
] as const;

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

interface TimeSlotsManagerProps {
  onTimeSlotsChange?: (timeSlots: TimeSlot[]) => void;
  showTitle?: boolean;
}

const TimeSlotsManager: React.FC<TimeSlotsManagerProps> = ({ 
  onTimeSlotsChange, 
  showTitle = true 
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    is_available: true,
  });

  const userData = getUserData();
  const userId = typeof userData?.id === 'string' ? parseInt(userData.id) : userData?.id || 1; // Fallback for demo

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await getUserTimeSlots(userId);
      setTimeSlots(slots);
      setError(null);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots');
      // For demo purposes, set some default time slots
      setTimeSlots([
        {
          id: 1,
          day_of_week: 'Monday',
          start_time: '09:00',
          end_time: '11:00',
          is_available: true,
        },
        {
          id: 2,
          day_of_week: 'Wednesday',
          start_time: '14:00',
          end_time: '16:00',
          is_available: true,
        },
        {
          id: 3,
          day_of_week: 'Friday',
          start_time: '10:00',
          end_time: '12:00',
          is_available: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (onTimeSlotsChange) {
      onTimeSlotsChange(timeSlots);
    }
  }, [timeSlots, onTimeSlotsChange]);

  const handleAddTimeSlot = async () => {
    try {
      if (!newSlot.day_of_week || !newSlot.start_time || !newSlot.end_time) {
        setError('Please fill in all fields');
        return;
      }

      if (newSlot.start_time >= newSlot.end_time) {
        setError('End time must be after start time');
        return;
      }

      const createdSlot = await createTimeSlot(userId, newSlot as Omit<TimeSlot, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
      setTimeSlots(prev => [...prev, createdSlot]);
      setNewSlot({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00',
        is_available: true,
      });
      setError(null);
    } catch (err) {
      console.error('Error creating time slot:', err);
      // For demo purposes, add locally
      const demoSlot: TimeSlot = {
        id: Date.now(),
        day_of_week: newSlot.day_of_week!,
        start_time: newSlot.start_time!,
        end_time: newSlot.end_time!,
        is_available: newSlot.is_available!,
      };
      setTimeSlots(prev => [...prev, demoSlot]);
      setNewSlot({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00',
        is_available: true,
      });
    }
  };

  const handleEditTimeSlot = async () => {
    if (!editingSlot) return;

    try {
      if (editingSlot.start_time >= editingSlot.end_time) {
        setError('End time must be after start time');
        return;
      }

      const updatedSlot = await updateTimeSlot(userId, editingSlot.id!, editingSlot);
      setTimeSlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? updatedSlot : slot
      ));
      setEditDialogOpen(false);
      setEditingSlot(null);
      setError(null);
    } catch (err) {
      console.error('Error updating time slot:', err);
      // For demo purposes, update locally
      setTimeSlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? editingSlot : slot
      ));
      setEditDialogOpen(false);
      setEditingSlot(null);
    }
  };

  const handleDeleteTimeSlot = async (slotId: number) => {
    try {
      await deleteTimeSlot(userId, slotId);
      setTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
    } catch (err) {
      console.error('Error deleting time slot:', err);
      // For demo purposes, delete locally
      setTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
    }
  };

  const openEditDialog = (slot: TimeSlot) => {
    setEditingSlot({ ...slot });
    setEditDialogOpen(true);
  };

  const getTimeSlotsByDay = () => {
    const slotsByDay: Record<string, TimeSlot[]> = {};
    daysOfWeek.forEach(day => {
      slotsByDay[day] = timeSlots.filter(slot => 
        slot.day_of_week === day && slot.is_available
      );
    });
    return slotsByDay;
  };

  const calculateTotalHours = () => {
    return timeSlots.reduce((total, slot) => {
      if (!slot.is_available) return total;
      const start = new Date(`1970-01-01T${slot.start_time}:00`);
      const end = new Date(`1970-01-01T${slot.end_time}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return total + diffHours;
    }, 0);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading time slots...</Typography>
      </Paper>
    );
  }

  const slotsByDay = getTimeSlotsByDay();
  const totalHours = calculateTotalHours();

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
          <TimeIcon color="primary" />
          Available Study Time Slots
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="primary.main">
              Total Weekly Hours: {totalHours.toFixed(1)}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {timeSlots.filter(s => s.is_available).length} available time slots
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {daysOfWeek.map(day => (
                <Chip
                  key={day}
                  label={`${day}: ${slotsByDay[day].length}`}
                  size="small"
                  color={slotsByDay[day].length > 0 ? "primary" : "default"}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Paper>

      {/* Add New Time Slot */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Add New Time Slot
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          alignItems: { xs: 'stretch', sm: 'center' } 
        }}>
          <TextField
            select
            label="Day"
            value={newSlot.day_of_week}
            onChange={(e) => setNewSlot(prev => ({ ...prev, day_of_week: e.target.value as typeof daysOfWeek[number] }))}
            sx={{ flex: 1, minWidth: 120 }}
            size="small"
          >
            {daysOfWeek.map(day => (
              <MenuItem key={day} value={day}>{day}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Start Time"
            value={newSlot.start_time}
            onChange={(e) => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
            sx={{ flex: 1, minWidth: 120 }}
            size="small"
          >
            {timeOptions.map(time => (
              <MenuItem key={time} value={time}>{time}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="End Time"
            value={newSlot.end_time}
            onChange={(e) => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
            sx={{ flex: 1, minWidth: 120 }}
            size="small"
          >
            {timeOptions.map(time => (
              <MenuItem key={time} value={time}>{time}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTimeSlot}
            sx={{ flexShrink: 0, minWidth: 120 }}
          >
            Add Slot
          </Button>
        </Box>
      </Paper>

      {/* Existing Time Slots */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {daysOfWeek.map(day => (
          <Card variant="outlined" key={day}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {day}
              </Typography>
              {slotsByDay[day].length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No time slots
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {slotsByDay[day].map(slot => (
                    <Paper
                      key={slot.id}
                      sx={{
                        p: 1.5,
                        bgcolor: 'primary.50',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {slot.start_time} - {slot.end_time}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(slot)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTimeSlot(slot.id!)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Time Slot</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Day"
              value={editingSlot?.day_of_week || ''}
              onChange={(e) => setEditingSlot(prev => prev ? { ...prev, day_of_week: e.target.value as typeof daysOfWeek[number] } : null)}
              fullWidth
            >
              {daysOfWeek.map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Start Time"
                value={editingSlot?.start_time || ''}
                onChange={(e) => setEditingSlot(prev => prev ? { ...prev, start_time: e.target.value } : null)}
                sx={{ flex: 1 }}
              >
                {timeOptions.map(time => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="End Time"
                value={editingSlot?.end_time || ''}
                onChange={(e) => setEditingSlot(prev => prev ? { ...prev, end_time: e.target.value } : null)}
                sx={{ flex: 1 }}
              >
                {timeOptions.map(time => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditTimeSlot} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeSlotsManager;