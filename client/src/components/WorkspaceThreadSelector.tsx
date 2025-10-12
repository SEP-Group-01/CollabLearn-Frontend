import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Topic as TopicIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import type { WorkspaceSelection } from '../types/StudyPlanInterfaces';
import { getUserWorkspacesWithThreads } from '../api/studyPlanApi';
import { getUserData } from '../api/authApi';

interface WorkspaceThreadSelectorProps {
  onSelectionChange?: (selections: WorkspaceSelection[]) => void;
  showTitle?: boolean;
}

const WorkspaceThreadSelector: React.FC<WorkspaceThreadSelectorProps> = ({
  onSelectionChange,
  showTitle = true
}) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userData = getUserData();
  const userId = typeof userData?.id === 'string' ? parseInt(userData.id) : userData?.id || 1;

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(workspaces);
    }
  }, [workspaces, onSelectionChange]);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const workspaceData = await getUserWorkspacesWithThreads(userId);
      
      const mappedWorkspaces: WorkspaceSelection[] = workspaceData.map(ws => ({
        workspace_id: ws.workspace_id,
        workspace_name: ws.workspace_name,
        thread_ids: [],
        thread_names: ws.threads.map(t => t.thread_name),
        selected: false,
      }));
      
      setWorkspaces(mappedWorkspaces);
      setError(null);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      setError('Failed to load workspaces');
      
      // Demo data fallback
      setWorkspaces([
        {
          workspace_id: 1,
          workspace_name: 'Machine Learning Fundamentals',
          thread_ids: [],
          thread_names: ['Linear Algebra Basics', 'Neural Networks', 'Optimization Algorithms'],
          selected: false,
        },
        {
          workspace_id: 2,
          workspace_name: 'Web Development',
          thread_ids: [],
          thread_names: ['React Fundamentals', 'Node.js Backend', 'Database Design'],
          selected: false,
        },
        {
          workspace_id: 3,
          workspace_name: 'Data Science',
          thread_ids: [],
          thread_names: ['Statistics', 'Python for Data Science', 'Machine Learning Applications'],
          selected: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceSelection = (workspaceId: number, selected: boolean) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.workspace_id === workspaceId) {
        return {
          ...ws,
          selected,
          // Clear thread selections if workspace is deselected
          thread_ids: selected ? ws.thread_ids : [],
        };
      }
      return ws;
    }));
  };

  const handleThreadSelection = (workspaceId: number, threadIndex: number, threadName: string, selected: boolean) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.workspace_id === workspaceId) {
        const newThreadIds = selected 
          ? [...ws.thread_ids, threadIndex + 1]
          : ws.thread_ids.filter(id => id !== threadIndex + 1);
        
        return {
          ...ws,
          thread_ids: newThreadIds,
          // Auto-select workspace if any thread is selected
          selected: ws.selected || newThreadIds.length > 0,
        };
      }
      return ws;
    }));
  };

  const selectAllThreadsForWorkspace = (workspaceId: number) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.workspace_id === workspaceId) {
        return {
          ...ws,
          selected: true,
          thread_ids: ws.thread_names.map((_, index) => index + 1),
        };
      }
      return ws;
    }));
  };

  const getSelectedCount = () => {
    const selectedWorkspaces = workspaces.filter(ws => ws.selected).length;
    const selectedThreads = workspaces.reduce((total, ws) => total + ws.thread_ids.length, 0);
    return { workspaces: selectedWorkspaces, threads: selectedThreads };
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading workspaces...</Typography>
      </Paper>
    );
  }

  const { workspaces: selectedWorkspaces, threads: selectedThreads } = getSelectedCount();

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
          <FolderIcon color="primary" />
          Select Workspaces & Threads
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6" color="primary.main">
            Selection Summary
          </Typography>
          <Chip 
            label={`${selectedWorkspaces} workspaces`} 
            color={selectedWorkspaces > 0 ? "primary" : "default"}
            size="small"
          />
          <Chip 
            label={`${selectedThreads} threads`} 
            color={selectedThreads > 0 ? "primary" : "default"}
            size="small"
          />
        </Stack>
        {selectedWorkspaces === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select at least one workspace and thread to generate a study plan
          </Typography>
        )}
      </Paper>

      {/* Workspace Selection */}
      <Stack spacing={2}>
        {workspaces.map((workspace) => (
          <Accordion 
            key={workspace.workspace_id}
            expanded={workspace.selected}
            sx={{
              border: workspace.selected ? '2px solid' : '1px solid',
              borderColor: workspace.selected ? 'primary.main' : 'divider',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: workspace.selected ? 'primary.50' : 'background.paper',
                '&:hover': { bgcolor: workspace.selected ? 'primary.100' : 'action.hover' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={workspace.selected}
                      onChange={(e) => handleWorkspaceSelection(workspace.workspace_id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                  label=""
                  sx={{ mr: 0 }}
                />
                <FolderIcon color={workspace.selected ? "primary" : "disabled"} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {workspace.workspace_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {workspace.thread_names.length} threads • {workspace.thread_ids.length} selected
                  </Typography>
                </Box>
                {workspace.selected && (
                  <CheckCircleIcon color="primary" />
                )}
              </Box>
            </AccordionSummary>
            
            <AccordionDetails sx={{ bgcolor: 'background.default' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Select specific threads for this workspace:
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => selectAllThreadsForWorkspace(workspace.workspace_id)}
                  disabled={workspace.thread_ids.length === workspace.thread_names.length}
                >
                  Select All
                </Button>
              </Box>
              
              <FormGroup>
                {workspace.thread_names.map((threadName, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={workspace.thread_ids.includes(index + 1)}
                        onChange={(e) => handleThreadSelection(
                          workspace.workspace_id, 
                          index, 
                          threadName, 
                          e.target.checked
                        )}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TopicIcon fontSize="small" color="action" />
                        <Typography variant="body2">{threadName}</Typography>
                      </Box>
                    }
                    sx={{ 
                      ml: 1,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      {/* Instructions */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="body2" color="info.main">
          <strong>Tip:</strong> Select workspaces and threads that contain the content you want to study. 
          The study plan will include resources from your selected threads and schedule them based on your available time slots.
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkspaceThreadSelector;