import React, { useState } from "react";
import SidebarComponent from "../components/SideBar";
import TimeSlotsManager from "../components/TimeSlotsManager";
import WorkspaceThreadSelector from "../components/WorkspaceThreadSelector";
import StudyCalendar from "../components/StudyCalendar";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Drawer,
  useMediaQuery,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Schedule as ScheduleIcon,
  Folder as FolderIcon,
  Settings as SettingsIcon,
  PlayArrow as GenerateIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type { 
  TimeSlot, 
  WorkspaceSelection, 
  StudyPlanRequest,
  StudyPlanResult,
} from "../types/StudyPlanInterfaces";
import { generateStudyPlan } from "../api/studyPlanApi";
import { getUserData } from "../api/authApi";

const StudyPlanGenerationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [workspaceSelections, setWorkspaceSelections] = useState<WorkspaceSelection[]>([]);
  const [preferences, setPreferences] = useState({
    priority_level: "medium" as "high" | "medium" | "low",
    learning_style: "reading" as "visual" | "auditory" | "kinesthetic" | "reading",
    difficulty_preference: "medium" as "easy" | "medium" | "hard",
    session_duration_preference: 60,
  });
  const [generated, setGenerated] = useState<StudyPlanResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const userData = getUserData();
  const userId = typeof userData?.id === 'string' ? parseInt(userData.id) : userData?.id || 1;

  const steps = [
    {
      label: "Configure Time Slots",
      description: "Set up your available study times",
      icon: <ScheduleIcon />,
    },
    {
      label: "Select Content",
      description: "Choose workspaces and threads to study",
      icon: <FolderIcon />,
    },
    {
      label: "Set Preferences",
      description: "Customize your learning preferences",
      icon: <SettingsIcon />,
    },
    {
      label: "Generate Plan",
      description: "Create your personalized study schedule",
      icon: <GenerateIcon />,
    },
  ];

  const handleTimeSlotsChange = (newTimeSlots: TimeSlot[]) => {
    setTimeSlots(newTimeSlots);
  };

  const handleWorkspaceSelectionChange = (newSelections: WorkspaceSelection[]) => {
    setWorkspaceSelections(newSelections);
  };

  const handlePreferenceChange = (field: string, value: string | number) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return timeSlots.length > 0;
      case 1:
        return workspaceSelections.some(ws => ws.selected && ws.thread_ids.length > 0);
      case 2:
        return true; // Preferences are optional
      default:
        return true;
    }
  };

  const handleGenerateStudyPlan = async () => {
    try {
      setGenerating(true);
      setError(null);

      const selectedWorkspaceIds = workspaceSelections
        .filter(ws => ws.selected)
        .map(ws => ws.workspace_id);
      
      const selectedThreadIds = workspaceSelections
        .filter(ws => ws.selected)
        .flatMap(ws => ws.thread_ids);

      const request: StudyPlanRequest = {
        user_id: userId,
        workspace_ids: selectedWorkspaceIds,
        thread_ids: selectedThreadIds,
        priority_level: preferences.priority_level,
        learning_style: preferences.learning_style,
        difficulty_preference: preferences.difficulty_preference,
        session_duration_preference: preferences.session_duration_preference,
      };

      const result = await generateStudyPlan(request);
      setGenerated(result);
      setCurrentStep(3); // Move to results view

    } catch (err) {
      console.error('Error generating study plan:', err);
      setError((err as Error).message || 'Failed to generate study plan');
      
      // For demo purposes, create a mock result
      const demoResult: StudyPlanResult = {
        id: Date.now(),
        user_id: userId,
        schedule: [
          {
            id: 1,
            resource: {
              id: 1,
              name: 'Linear Algebra Fundamentals',
              type: 'document',
              workspace_id: workspaceSelections[0]?.workspace_id || 1,
              thread_id: workspaceSelections[0]?.thread_ids[0] || 1,
              estimated_duration: 120,
              difficulty_level: preferences.difficulty_preference,
              description: 'Introduction to vectors and matrices',
            },
            time_slot: timeSlots[0] || {
              day_of_week: 'Monday',
              start_time: '09:00',
              end_time: '11:00',
              is_available: true,
            },
            week_number: 1,
            allocated_time: preferences.session_duration_preference,
            status: 'scheduled',
          },
        ],
        total_coverage_percentage: 85,
        total_allocated_hours: timeSlots.reduce((total, slot) => {
          const start = new Date(`1970-01-01T${slot.start_time}:00`);
          const end = new Date(`1970-01-01T${slot.end_time}:00`);
          return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0),
        plan_duration_weeks: 4,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setGenerated(demoResult);
      setCurrentStep(3);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      handleGenerateStudyPlan();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TimeSlotsManager 
            onTimeSlotsChange={handleTimeSlotsChange}
            showTitle={false}
          />
        );
      case 1:
        return (
          <WorkspaceThreadSelector 
            onSelectionChange={handleWorkspaceSelectionChange}
            showTitle={false}
          />
        );
      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Study Preferences
            </Typography>
            <Stack spacing={3}>
              <TextField
                select
                label="Priority Level"
                value={preferences.priority_level}
                onChange={(e) => handlePreferenceChange('priority_level', e.target.value)}
                fullWidth
                helperText="How important is this study plan to you?"
              >
                <MenuItem value="high">High - Focus intensively</MenuItem>
                <MenuItem value="medium">Medium - Balanced approach</MenuItem>
                <MenuItem value="low">Low - Casual learning</MenuItem>
              </TextField>

              <TextField
                select
                label="Learning Style"
                value={preferences.learning_style}
                onChange={(e) => handlePreferenceChange('learning_style', e.target.value)}
                fullWidth
                helperText="How do you prefer to learn?"
              >
                <MenuItem value="visual">Visual - Images, diagrams, videos</MenuItem>
                <MenuItem value="reading">Reading/Writing - Text-based content</MenuItem>
                <MenuItem value="auditory">Auditory - Audio content, discussions</MenuItem>
                <MenuItem value="kinesthetic">Kinesthetic - Hands-on practice</MenuItem>
              </TextField>

              <TextField
                select
                label="Difficulty Preference"
                value={preferences.difficulty_preference}
                onChange={(e) => handlePreferenceChange('difficulty_preference', e.target.value)}
                fullWidth
                helperText="What level of content challenge do you prefer?"
              >
                <MenuItem value="easy">Easy - Start with basics</MenuItem>
                <MenuItem value="medium">Medium - Balanced challenge</MenuItem>
                <MenuItem value="hard">Hard - Advanced content</MenuItem>
              </TextField>

              <TextField
                label="Preferred Session Duration (minutes)"
                type="number"
                value={preferences.session_duration_preference}
                onChange={(e) => handlePreferenceChange('session_duration_preference', parseInt(e.target.value) || 60)}
                fullWidth
                helperText="How long should each study session be?"
                inputProps={{ min: 15, max: 180, step: 15 }}
              />
            </Stack>
          </Paper>
        );
      case 3:
        return generated ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Study plan generated successfully! Your schedule is now available in your profile.
            </Alert>
            <StudyCalendar />
          </Box>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" mb={2}>
              Ready to Generate Your Study Plan
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Click "Generate Plan" to create your personalized study schedule based on your time slots, selected content, and preferences.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Typography variant="body2">
                <strong>Time Slots:</strong> {timeSlots.length} configured
              </Typography>
              <Typography variant="body2">
                <strong>Content:</strong> {workspaceSelections.filter(ws => ws.selected).length} workspaces, {workspaceSelections.reduce((total, ws) => total + ws.thread_ids.length, 0)} threads
              </Typography>
            </Stack>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Responsive Sidebar */}
      {isMobile ? (
        <>
          <IconButton
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              bgcolor: "#fff",
              boxShadow: 2,
            }}
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            PaperProps={{ sx: { width: 240 } }}
          >
            <SidebarComponent collapsed={false} setCollapsed={() => {}} />
          </Drawer>
        </>
      ) : (
        <Box sx={{ minWidth: 240, bgcolor: "#fff", boxShadow: 2 }}>
          <SidebarComponent collapsed={false} setCollapsed={() => {}} />
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Paper
          elevation={2}
          sx={{
            maxWidth: 1200,
            mx: "auto",
            p: { xs: 2, md: 4 },
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
              Study Plan Generator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a personalized study schedule based on your available time and learning preferences
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Stepper activeStep={currentStep} orientation={isMobile ? "vertical" : "horizontal"} sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  icon={step.icon}
                  optional={
                    <Typography variant="caption">{step.description}</Typography>
                  }
                >
                  {step.label}
                </StepLabel>
                {isMobile && (
                  <StepContent>
                    {currentStep === index && renderStepContent(index)}
                  </StepContent>
                )}
              </Step>
            ))}
          </Stepper>

          {/* Desktop Step Content */}
          {!isMobile && (
            <Box sx={{ mt: 4 }}>
              {renderStepContent(currentStep)}
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              {error && (
                <Alert severity="error" sx={{ flexGrow: 1 }}>
                  {error}
                </Alert>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={handleNextStep}
              disabled={!canProceedToNextStep() || generating}
              sx={{ minWidth: 120 }}
              startIcon={generating ? <CircularProgress size={20} /> : currentStep === steps.length - 1 ? <GenerateIcon /> : null}
            >
              {generating ? "Generating..." : currentStep === steps.length - 1 ? "Generate Plan" : "Next"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default StudyPlanGenerationPage;