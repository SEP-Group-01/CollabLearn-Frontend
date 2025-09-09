import React, { useState } from "react";
import SidebarComponent from "../components/SideBar";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

const learningGoals = [
  "Improve weak areas",
  "Complete assignments on time",
];

const focusAreas = [
  "Math",
  "Physics",
  "Chemistry",
  "Programming",
  "History",
  "Biology",
];

const studyModes = ["Individual", "Group"];
const learningStyles = ["Reading", "Practice problems", "Videos", "Discussions"];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getRandomSchedule(form: any) {
  // Demo: Generate a simple weekly schedule
  return daysOfWeek.map((day, idx) => ({
    day,
    hours: form.hoursPerDay || 1,
    tasks: [
      `${form.focusAreas?.[idx % form.focusAreas.length] || "General"}: ${
        form.hoursPerDay || "1"
      } hour study`,
      idx % 2 === 0 ? "Take a 5 min break" : "",
    ].filter(Boolean),
  }));
}

const StudyPlanGenerationPage: React.FC = () => {
  const [form, setForm] = useState({
    learningGoal: "",
    focusAreas: [] as string[],
    customGoal: "",
    hoursPerDay: "",
    availableDays: [] as string[],
    learningStyle: "",
    studyMode: "",
  });
  const [tab, setTab] = useState(0);
  const [generated, setGenerated] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: form[name].includes(value)
        ? form[name].filter((v: string) => v !== value)
        : [...form[name], value],
    });
  };

  const handleGenerate = () => {
    setGenerated({
      schedule: getRandomSchedule(form),
      focus: form.focusAreas.length ? form.focusAreas : ["Math", "Physics"],
      method: form.learningStyle,
      mode: form.studyMode,
      resources: [
        ...(form.learningStyle === "Videos"
          ? ["Recommended YouTube playlists"]
          : []),
        ...(form.learningStyle === "Practice problems"
          ? ["Quiz sets", "Past papers"]
          : []),
        ...(form.studyMode === "Group" ? ["Group session slots"] : []),
      ],
    });
    setTab(0);
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
      <Grid
        container
        sx={{
          flexGrow: 1,
          px: { xs: 0, sm: 1, md: 4 },
          py: { xs: 2, md: 6 },
        }}
        spacing={isMobile ? 2 : 4}
      >
        {/* Center: Study Plan Generation Area */}
        <Grid
          item
          xs={12}
          md={7}
          lg={7}
          sx={{
            display: "flex",
            alignItems: "flex-start", // <-- Now starts at top
            justifyContent: "center",
            order: isMobile ? 2 : 1,
            px: { xs: 1, md: 0 },
            py: { xs: 2, md: 0 },
          }}
        >
          <Paper
            elevation={4}
            sx={{
              width: "100%",
              maxWidth: 600,
              minHeight: 500,
              mx: "auto",
              p: { xs: 2, md: 5 },
              borderRadius: 4,
              bgcolor: "#f1f5f9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={1}
              color="primary"
              textAlign="center"
            >
              Generate Your Study Plan
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
              textAlign="center"
            >
              Fill in your details and preferences to get a personalized study
              schedule for your group.
            </Typography>
            <Divider sx={{ mb: 3, width: "100%" }} />
            {generated ? (
              <>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  centered
                  sx={{ mb: 2 }}
                >
                  <Tab label="Schedule" />
                  <Tab label="Focus Areas" />
                  <Tab label="Methods" />
                  <Tab label="Resources" />
                </Tabs>
                {tab === 0 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      sx={{ mt: 1 }}
                    >
                      Weekly Timetable
                    </Typography>
                    <Stack spacing={1}>
                      {generated.schedule.map((item: any, idx: number) => (
                        <Paper
                          key={item.day}
                          sx={{
                            p: 2,
                            bgcolor: "#fff",
                            borderLeft: "4px solid #38bdf8",
                          }}
                        >
                          <Typography fontWeight="bold">{item.day}</Typography>
                          <Typography variant="body2">
                            {item.tasks.join(", ")}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
                {tab === 1 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      sx={{ mt: 1 }}
                    >
                      Prioritization & Focus Areas
                    </Typography>
                    <Stack spacing={1}>
                      {generated.focus.map((topic: string, idx: number) => (
                        <Paper
                          key={topic}
                          sx={{
                            p: 2,
                            bgcolor: "#f0fdf4",
                            borderLeft: "4px solid #22c55e",
                          }}
                        >
                          <Typography fontWeight="bold">{topic}</Typography>
                          <Typography variant="body2" color="success.main">
                            Suggested order: {idx + 1}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
                {tab === 2 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      sx={{ mt: 1 }}
                    >
                      Study Method Suggestions
                    </Typography>
                    <Typography>
                      Preferred:{" "}
                      <b>{generated.method || "Reading"}</b>
                    </Typography>
                    {generated.method === "Videos" && (
                      <Typography color="info.main" mt={1}>
                        Watch recommended video playlists for your topics.
                      </Typography>
                    )}
                    {generated.method === "Practice problems" && (
                      <Typography color="info.main" mt={1}>
                        Try quizzes and past papers for practice.
                      </Typography>
                    )}
                    {generated.mode === "Group" && (
                      <Typography color="info.main" mt={1}>
                        Join group study sessions scheduled in your workspace.
                      </Typography>
                    )}
                  </Box>
                )}
                {tab === 3 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      sx={{ mt: 1 }}
                    >
                      Resources & Materials
                    </Typography>
                    <Stack spacing={1}>
                      {generated.resources.map((res: string, idx: number) => (
                        <Paper key={idx} sx={{ p: 2, bgcolor: "#f3f4f6" }}>
                          <Typography>{res}</Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
              </>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Fill in your details and click Generate to see your study plan.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right: User Input Area */}
        <Grid
          item
          xs={12}
          md={5}
          lg={5}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            order: isMobile ? 1 : 2,
            px: { xs: 1, md: 0 },
            py: { xs: 2, md: 0 },
          }}
        >
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              maxWidth: 400,
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              bgcolor: "#fff",
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              color="primary"
              textAlign="center"
            >
              Enter Your Details
            </Typography>
            <Stack spacing={3}>
              {/* Learning Goals */}
              <TextField
                select
                label="Target Outcome"
                name="learningGoal"
                value={form.learningGoal}
                onChange={handleChange}
                fullWidth
              >
                {learningGoals.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Custom Goal (optional)"
                name="customGoal"
                value={form.customGoal}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                select
                label="Focus Areas"
                name="focusAreas"
                value={form.focusAreas}
                onChange={(e) =>
                  handleSelect(
                    "focusAreas",
                    typeof e.target.value === "string"
                      ? [e.target.value]
                      : e.target.value
                  )
                }
                SelectProps={{ multiple: true }}
                fullWidth
              >
                {focusAreas.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </TextField>
              {/* Time Availability */}
              <TextField
                label="Preferred study hours per day"
                name="hoursPerDay"
                value={form.hoursPerDay}
                onChange={handleChange}
                type="number"
                fullWidth
              />
              <FormGroup row>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={form.availableDays.includes(day)}
                        onChange={() => handleCheckbox("availableDays", day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>
              {/* Study Preferences */}
              <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                Preferred Learning Style
              </Typography>
              <RadioGroup
                row
                name="learningStyle"
                value={form.learningStyle}
                onChange={handleChange}
              >
                {learningStyles.map((style) => (
                  <FormControlLabel
                    key={style}
                    value={style}
                    control={<Radio />}
                    label={style}
                  />
                ))}
              </RadioGroup>
              <TextField
                select
                label="Study Mode"
                name="studyMode"
                value={form.studyMode}
                onChange={handleChange}
                fullWidth
              >
                {studyModes.map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
                size="large"
              >
                Generate Plan
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudyPlanGenerationPage;