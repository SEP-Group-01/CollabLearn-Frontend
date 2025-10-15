import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  RadioButtonUnchecked,
  PlayArrow,
  CheckCircle,
  Refresh,
  ArrowDropDown,
} from '@mui/icons-material';
import { getUserProgress, updateUserProgress, type UserProgress } from '../api/resourseApi';
import { getUserData } from '../api/authApi';

interface ResourceProgressTrackerProps {
  resourceId: string;
  compact?: boolean; // For card view vs detail page view
  onProgressUpdate?: (progress: UserProgress) => void;
}

const progressStates = [
  {
    value: 'not_started' as const,
    label: 'Not Started',
    icon: <RadioButtonUnchecked fontSize="small" />,
    color: '#9e9e9e', // grey
  },
  {
    value: 'in_progress' as const,
    label: 'In Progress',
    icon: <PlayArrow fontSize="small" />,
    color: '#2196f3', // blue
  },
  {
    value: 'completed' as const,
    label: 'Completed',
    icon: <CheckCircle fontSize="small" />,
    color: '#4caf50', // green
  },
  {
    value: 'needs_revision' as const,
    label: 'Needs Revision',
    icon: <Refresh fontSize="small" />,
    color: '#ff9800', // orange
  },
];

export default function ResourceProgressTracker({
  resourceId,
  compact = false,
  onProgressUpdate,
}: ResourceProgressTrackerProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userId, setUserId] = useState<string>('');

  // Get user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserData();
        if (userData && userData.id) {
          setUserId(userData.id.toString());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserId();
  }, []);

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!userId || !resourceId) return;
      
      try {
        setLoading(true);
        const progressData = await getUserProgress(userId, resourceId);
        setProgress(progressData);
      } catch (error) {
        console.error('Error loading progress:', error);
        // Set default progress
        setProgress({
          user_id: userId,
          resource_id: resourceId,
          completion_status: 'not_started',
          progress_percentage: 0,
          started_at: null,
          completed_at: null,
          updated_at: null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId, resourceId]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProgressChange = async (
    newStatus: 'not_started' | 'in_progress' | 'completed' | 'needs_revision'
  ) => {
    if (!userId || !resourceId) return;

    try {
      setUpdating(true);
      const updatedProgress = await updateUserProgress(
        userId,
        resourceId,
        newStatus,
        newStatus === 'completed' ? 100 : undefined
      );
      setProgress(updatedProgress);
      if (onProgressUpdate) {
        onProgressUpdate(updatedProgress);
      }
      handleCloseMenu();
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="caption">Loading...</Typography>
      </Box>
    );
  }

  if (!progress) return null;

  const currentState = progressStates.find(
    (state) => state.value === progress.completion_status
  ) || progressStates[0];

  // Get next logical state
  const getNextState = () => {
    switch (progress.completion_status) {
      case 'not_started':
        return progressStates[1]; // in_progress
      case 'in_progress':
        return progressStates[2]; // completed
      case 'completed':
        return progressStates[3]; // needs_revision
      case 'needs_revision':
        return progressStates[1]; // in_progress
      default:
        return progressStates[1];
    }
  };

  const nextState = getNextState();

  if (compact) {
    // Compact view for cards - shows chip and quick action
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={currentState.icon}
          label={currentState.label}
          size="small"
          sx={{
            backgroundColor: `${currentState.color}20`,
            color: currentState.color,
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: currentState.color,
            },
          }}
        />
        <Tooltip title={`Mark as ${nextState.label}`}>
          <Button
            size="small"
            variant="outlined"
            disabled={updating}
            onClick={() => handleProgressChange(nextState.value)}
            sx={{
              minWidth: 'auto',
              px: 1,
              borderColor: nextState.color,
              color: nextState.color,
              '&:hover': {
                borderColor: nextState.color,
                backgroundColor: `${nextState.color}10`,
              },
            }}
          >
            {updating ? <CircularProgress size={16} /> : nextState.icon}
          </Button>
        </Tooltip>
      </Box>
    );
  }

  // Full view for detail pages - shows dropdown with all options
  return (
    <Box>
      <Button
        variant="contained"
        endIcon={<ArrowDropDown />}
        onClick={handleOpenMenu}
        disabled={updating}
        startIcon={updating ? <CircularProgress size={16} /> : currentState.icon}
        sx={{
          backgroundColor: currentState.color,
          '&:hover': {
            backgroundColor: currentState.color,
            filter: 'brightness(0.9)',
          },
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        {currentState.label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {progressStates.map((state) => (
          <MenuItem
            key={state.value}
            onClick={() => handleProgressChange(state.value)}
            selected={progress.completion_status === state.value}
            sx={{
              '&.Mui-selected': {
                backgroundColor: `${state.color}20`,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: state.color }}>{state.icon}</Box>
              <Typography sx={{ color: state.color, fontWeight: 600 }}>
                {state.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Progress metadata */}
      {progress.started_at && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Started: {new Date(progress.started_at).toLocaleDateString()}
        </Typography>
      )}
      {progress.completed_at && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Completed: {new Date(progress.completed_at).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}
