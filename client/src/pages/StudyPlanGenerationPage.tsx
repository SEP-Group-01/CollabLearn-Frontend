import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  DeleteForever as DropIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SidebarComponent from '../components/SideBar';
import WeeklyTimeSlots from '../components/TimeSlotsManager';
import WorkspaceThreadSelector from '../components/WorkspaceThreadSelector';
import StudyCalendar from '../components/StudyCalendar';
import {
  getStudySlots,
  createStudySlot,
  updateStudySlot,
  deleteStudySlot,
  getWorkspacesWithThreads,
  generateStudyPlan,
  dropStudyPlan,
  getTasks,
  updateTask,
  type StudySlot,
  type WorkspaceWithThreads,
  type Resource,
  type ResourceInput,
  type StudyPlanResponse,
} from '../api/studyPlanApi';

const StudyPlanGenerationPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Step 1: Time Slots
  const [slots, setSlots] = useState<StudySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Step 2: Workspaces and Resources
  const [workspaces, setWorkspaces] = useState<WorkspaceWithThreads[]>([]);
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [resourceMap, setResourceMap] = useState<Map<string, { resource: Resource; workspaceId: string; threadId: string }>>(new Map());
  const [workspacesLoading, setWorkspacesLoading] = useState(false);

  // Step 3: Plan Configuration
  const [maxWeeks, setMaxWeeks] = useState(2);
  const [revisionRatio, setRevisionRatio] = useState(0.25);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlanResponse | null>(null);
  const [planTasks, setPlanTasks] = useState<any[]>([]);

  // Dialogs
  const [showDropDialog, setShowDropDialog] = useState(false);

  // Load initial data
  useEffect(() => {
    loadSlots();
    loadWorkspaces();
  }, []);

  const loadSlots = async () => {
    setSlotsLoading(true);
    try {
      const fetchedSlots = await getStudySlots();
      setSlots(fetchedSlots);
    } catch (err: any) {
      setError('Failed to load time slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const loadWorkspaces = async () => {
    setWorkspacesLoading(true);
    try {
      const fetchedWorkspaces = await getWorkspacesWithThreads();
      setWorkspaces(fetchedWorkspaces);
    } catch (err: any) {
      setError('Failed to load workspaces');
    } finally {
      setWorkspacesLoading(false);
    }
  };

  const handleAddSlot = async (slot: Omit<StudySlot, 'id' | 'user_id'>) => {
    try {
      const newSlot = await createStudySlot(slot);
      setSlots([...slots, newSlot]);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to create slot');
    }
  };

  const handleUpdateSlot = async (slotId: string, updateData: Partial<StudySlot>) => {
    try {
      const updated = await updateStudySlot(slotId, updateData);
      setSlots(slots.map((s) => (s.id === slotId ? updated : s)));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to update slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await deleteStudySlot(slotId);
      setSlots(slots.filter((s) => s.id !== slotId));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to delete slot');
    }
  };

  const handleResourceToggle = (resource: Resource, workspaceId: string, threadId: string) => {
    const newSelected = new Set(selectedResources);
    const newResourceMap = new Map(resourceMap);

    if (newSelected.has(resource.id)) {
      newSelected.delete(resource.id);
      newResourceMap.delete(resource.id);
    } else {
      newSelected.add(resource.id);
      newResourceMap.set(resource.id, { resource, workspaceId, threadId });
    }

    setSelectedResources(newSelected);
    setResourceMap(newResourceMap);
  };

  const handleWorkspaceToggle = (workspaceId: string, select: boolean) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (!workspace) return;

    const newSelected = new Set(selectedResources);
    const newResourceMap = new Map(resourceMap);

    workspace.threads.forEach((thread) => {
      thread.resources.forEach((resource) => {
        if (select) {
          newSelected.add(resource.id);
          newResourceMap.set(resource.id, { resource, workspaceId, threadId: thread.id });
        } else {
          newSelected.delete(resource.id);
          newResourceMap.delete(resource.id);
        }
      });
    });

    setSelectedResources(newSelected);
    setResourceMap(newResourceMap);
  };

  const handleThreadToggle = (workspaceId: string, threadId: string, select: boolean) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (!workspace) return;

    const thread = workspace.threads.find((t) => t.id === threadId);
    if (!thread) return;

    const newSelected = new Set(selectedResources);
    const newResourceMap = new Map(resourceMap);

    thread.resources.forEach((resource) => {
      if (select) {
        newSelected.add(resource.id);
        newResourceMap.set(resource.id, { resource, workspaceId, threadId });
      } else {
        newSelected.delete(resource.id);
        newResourceMap.delete(resource.id);
      }
    });

    setSelectedResources(newSelected);
    setResourceMap(newResourceMap);
  };

  const handleGeneratePlan = async () => {
    setError('');
    setLoading(true);

    try {
      // Prepare resources
      const resources: ResourceInput[] = Array.from(resourceMap.values()).map(({ resource, workspaceId, threadId }) => ({
        workspace_id: workspaceId,
        thread_id: threadId,
        resource_id: resource.id,
        title: resource.title,
        remaining_minutes: resource.estimated_duration || 120, // Default 2 hours if not specified
        include_revision: true,
        resource_type: resource.resource_type,
      }));

      // Prepare slots with week numbers
      const freeSlots = slots.filter((s) => s.is_free);
      const slotsInput = [];

      for (let week = 1; week <= maxWeeks; week++) {
        for (const slot of freeSlots) {
          slotsInput.push({
            slot_id: slot.id,
            week_number: week,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
          });
        }
      }

      const plan = await generateStudyPlan({
        max_weeks: maxWeeks,
        revision_ratio: revisionRatio,
        slots: slotsInput,
        resources,
      });

      setGeneratedPlan(plan);
      
      // Reload slots to show occupied ones
      await loadSlots();
      
      // Load tasks
      const tasks = await getTasks(plan.plan_id);
      setPlanTasks(tasks);

      // Plan generated successfully - it will automatically display in section 3
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDropPlan = async () => {
    if (!generatedPlan) return;

    setLoading(true);
    try {
      await dropStudyPlan(generatedPlan.plan_id);
      setGeneratedPlan(null);
      setPlanTasks([]);
      await loadSlots(); // Reload to show freed slots
      setShowDropDialog(false);
      // Plan dropped successfully - section 3 will show configuration again
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to drop study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, update: any) => {
    try {
      const updatedTask = await updateTask(taskId, update);
      setPlanTasks(planTasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const canGenerate = slots.filter((s) => s.is_free).length > 0 && selectedResources.size > 0;

  const sidebarWidth = sidebarCollapsed ? 80 : 250;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <SidebarComponent collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(240, 242, 255, 0.98) 50%, 
              rgba(255, 255, 255, 0.95) 100%
            ),
            repeating-linear-gradient(
              45deg,
              rgba(139, 92, 246, 0.02) 0px,
              rgba(139, 92, 246, 0.02) 2px,
              transparent 2px,
              transparent 10px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(59, 130, 246, 0.02) 0px,
              rgba(59, 130, 246, 0.02) 2px,
              transparent 2px,
              transparent 10px
            )
          `,
          minHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 6 }}>
          {/* Hero Header */}
          <Fade in timeout={800}>
            <Box
              component={motion.div}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
              sx={{
                mb: 6,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <SparkleIcon
                sx={{
                  fontSize: 60,
                  color: 'rgba(139, 92, 246, 0.3)',
                  mb: 2,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                    '50%': { opacity: 0.6, transform: 'scale(1.1)' },
                  },
                }}
              />
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Study Plan Generator
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontWeight: 400,
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                Create an optimized study schedule based on your available time and learning goals
              </Typography>
            </Box>
          </Fade>

          {error && (
            <Zoom in>
              <Alert
                severity="error"
                onClose={() => setError('')}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
                }}
              >
                {error}
              </Alert>
            </Zoom>
          )}

          {/* Section 1: Time Slots */}
          <Fade in timeout={1000}>
            <Paper
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              elevation={0}
              sx={{
                mb: 5,
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ScheduleIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#4c1d95' }}>
                      1. Configure Time Slots
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      Add your available study time slots for each day of the week
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ p: 3 }}>
                {slotsLoading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: '#8b5cf6' }} />
                  </Box>
                ) : (
                  <WeeklyTimeSlots
                    slots={slots}
                    onAddSlot={handleAddSlot}
                    onUpdateSlot={handleUpdateSlot}
                    onDeleteSlot={handleDeleteSlot}
                    readonly={false}
                  />
                )}
              </Box>
            </Paper>
          </Fade>

          {/* Section 2: Resource Selection */}
          <Fade in timeout={1200}>
            <Paper
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              elevation={0}
              sx={{
                mb: 5,
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <SchoolIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#1e3a8a' }}>
                      2. Select Learning Resources
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      Choose workspaces, threads, and resources for your study plan
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ p: 3 }}>
                {workspacesLoading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: '#3b82f6' }} />
                  </Box>
                ) : (
                  <WorkspaceThreadSelector
                    workspaces={workspaces}
                    selectedResources={selectedResources}
                    onResourceToggle={handleResourceToggle}
                    onWorkspaceToggle={handleWorkspaceToggle}
                    onThreadToggle={handleThreadToggle}
                  />
                )}
              </Box>
            </Paper>
          </Fade>

          {/* Section 3: Plan Configuration */}
          <Fade in timeout={1400}>
            <Paper
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              elevation={0}
              sx={{
                mb: 5,
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CalendarIcon sx={{ fontSize: 32, color: '#10b981' }} />
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#064e3b' }}>
                      3. Generate & View Plan
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      Configure your plan settings and generate your optimized schedule
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ p: 3 }}>
                {!generatedPlan ? (
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Study Plan Duration: {maxWeeks} week{maxWeeks > 1 ? 's' : ''}
                      </Typography>
                      <Slider
                        value={maxWeeks}
                        onChange={(_, value) => setMaxWeeks(value as number)}
                        min={1}
                        max={12}
                        marks
                        valueLabelDisplay="auto"
                        sx={{
                          color: '#10b981',
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Revision Ratio: {(revisionRatio * 100).toFixed(0)}%
                      </Typography>
                      <Slider
                        value={revisionRatio}
                        onChange={(_, value) => setRevisionRatio(value as number)}
                        min={0}
                        max={0.5}
                        step={0.05}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 0.25, label: '25%' },
                          { value: 0.5, label: '50%' },
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                        sx={{
                          color: '#8b5cf6',
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                        Percentage of time allocated for revision
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)' }} />

                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#4c1d95' }}>
                        Plan Summary
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                          📅 {slots.filter((s) => s.is_free).length} available time slots per week
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                          📚 {selectedResources.size} resources selected
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                          ⏱️ {maxWeeks} week duration
                        </Typography>
                      </Stack>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGeneratePlan}
                      disabled={loading || !canGenerate}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SparkleIcon />}
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a4293 100%)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      fullWidth
                    >
                      {loading ? 'Generating Your Perfect Schedule...' : 'Generate Study Plan'}
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ color: '#064e3b' }}>
                            ✨ Your Study Plan is Ready!
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                            {generatedPlan.total_study_hours.toFixed(1)} hours study •{' '}
                            {generatedPlan.total_revision_hours.toFixed(1)} hours revision
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DropIcon />}
                          onClick={() => setShowDropDialog(true)}
                          sx={{
                            borderRadius: 2,
                            borderWidth: 2,
                            '&:hover': {
                              borderWidth: 2,
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          Drop Plan
                        </Button>
                      </Stack>
                    </Box>

                    <StudyCalendar schedule={generatedPlan.schedule} onTaskUpdate={handleTaskUpdate} />
                  </Stack>
                )}
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Drop Plan Confirmation Dialog */}
      <Dialog
        open={showDropDialog}
        onClose={() => setShowDropDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>Drop Study Plan?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
            Are you sure you want to drop this study plan? This will delete all scheduled tasks and free up your time
            slots. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowDropDialog(false)} sx={{ borderRadius: 2, px: 3 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDropPlan}
            color="error"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
              },
            }}
          >
            {loading ? 'Dropping...' : 'Drop Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyPlanGenerationPage;
