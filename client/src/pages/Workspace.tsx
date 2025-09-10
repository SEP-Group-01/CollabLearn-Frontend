import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SidebarComponent from "../components/SideBar";
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Chip,
  Button,
  Stack,
  Avatar,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
  Badge,
  Divider,
} from "@mui/material";
import {
  Forum,
  School,
  MenuBook,
  Group as GroupIcon,
  Pending,
  CheckCircle,
  Share,
  Favorite,
  FavoriteBorder,
  Notifications,
  TrendingUp,
  Analytics,
} from "@mui/icons-material";
import type { Workspace, Thread } from "../types/WorkspaceInterfaces";
import { mockWorkspaces } from "../mocks/Workspace";
import { mockThreads } from "../mocks/Workspace";

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace>(
    mockWorkspaces.find((w) => w.id === Number(workspaceId)) || mockWorkspaces[0]
  );
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleJoinOrRequest = () => {
    if (workspace.requiresApproval) {
      setWorkspace((w) => ({ ...w, isPending: true }));
    } else {
      setWorkspace((w) => ({ ...w, isMember: true }));
    }
  };

  const handleEnrollThread = (threadId: number) => {
    setThreads((ths) =>
      ths.map((t) => (t.id === threadId ? { ...t, enrolled: !t.enrolled } : t))
    );
  };

  const handleThreadClick = (threadId: number) => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}`);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
  };

  const getProgressPercentage = () => {
    const enrolledThreads = threads.filter(t => t.enrolled).length;
    return threads.length > 0 ? (enrolledThreads / threads.length) * 100 : 0;
  };

  return (
    <Box display="flex">
      <SidebarComponent collapsed={false} setCollapsed={() => {}} />
      <Box
        component="main"
        flexGrow={1}
        p={{ xs: 2, sm: 3, md: 4 }}
        sx={{
          ml: "240px",
          width: "calc(100% - 240px)",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Enhanced Header Section */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            mb: 4,
            background: `linear-gradient(135deg, ${workspace.lightColor} 0%, ${workspace.darkColor} 100%)`,
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            gap={3}
            p={4}
          >
            {/* Left side - Workspace Image */}
            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                justifyContent: { xs: "center", lg: "flex-start" },
              }}
            >
              <Avatar
                src={workspace.image}
                alt={workspace.title}
                sx={{
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  border: "4px solid white",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              />
            </Box>

            {/* Right side - Workspace Info */}
            <Box flex={1}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                mb={2}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="white"
                  sx={{ mb: { xs: 1, sm: 0 } }}
                >
                  {workspace.title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)" }}
                    >
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={notifications ? "Turn off notifications" : "Turn on notifications"}>
                    <IconButton
                      onClick={handleNotificationToggle}
                      sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)" }}
                    >
                      <Badge color="error" variant="dot" invisible={!notifications}>
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share workspace">
                    <IconButton sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)" }}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Typography
                variant="h6"
                color="rgba(255,255,255,0.9)"
                sx={{ mb: 3, maxWidth: "600px" }}
              >
                {workspace.description}
              </Typography>

              {/* Stats Grid */}
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }}
                gap={3}
                sx={{ mb: 3 }}
              >
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {workspace.members}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Members
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {threads.length}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Threads
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {workspace.studyHours}h
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Study Time
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {Math.round(getProgressPercentage())}%
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Progress
                  </Typography>
                </Box>
              </Box>

              {/* Enhanced Status and Actions */}
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
              >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={workspace.category}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                  {workspace.isMember && (
                    <Chip
                      icon={<CheckCircle fontSize="small" />}
                      label="Member"
                      sx={{
                        bgcolor: "rgba(76, 175, 80, 0.9)",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  {workspace.isPending && (
                    <Chip
                      icon={<Pending fontSize="small" />}
                      label="Request Pending"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.9)",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {!workspace.isAdmin && !workspace.isMember && !workspace.isPending && (
                    <Button
                      variant="contained"
                      onClick={handleJoinOrRequest}
                      sx={{
                        bgcolor: "white",
                        color: workspace.darkColor,
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.9)",
                        },
                      }}
                    >
                      {workspace.requiresApproval ? "Request Access" : "Join Workspace"}
                    </Button>
                  )}
                  {!workspace.isAdmin && workspace.isPending && (
                    <Button
                      variant="outlined"
                      disabled
                      startIcon={<Pending />}
                      sx={{
                        borderColor: "white",
                        color: "white",
                      }}
                    >
                      Request Sent
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to={`/study-plan?workspaceId=${workspaceId}`}
                    variant="outlined"
                    startIcon={<MenuBook />}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Study Plan
                  </Button>
                  <Button
                    component={Link}
                    to={`/forum`}
                    variant="outlined"
                    startIcon={<Forum />}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Forum
                  </Button>
                  {workspace.isAdmin && (
                    <Button
                      component={Link}
                      to={`/workspace-manage?workspaceId=${workspaceId}`}
                      variant="contained"
                      startIcon={<GroupIcon />}
                      sx={{
                        bgcolor: "white",
                        color: workspace.darkColor,
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.9)",
                        },
                      }}
                    >
                      Manage
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Progress Overview */}
        {workspace.isMember && (
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <TrendingUp color="primary" />
                Your Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {threads.filter(t => t.enrolled).length} of {threads.length} threads subscribed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getProgressPercentage()}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${workspace.lightColor} 0%, ${workspace.darkColor} 100%)`,
                },
              }}
            />
          </Paper>
        )}

        {/* Enhanced Threads Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1} display="flex" alignItems="center" gap={1}>
                <School color="primary" />
                Learning Threads
                <Chip 
                  label={`${threads.length} available`} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subscribe to threads to track progress and access resources
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Analytics />}
                size="small"
              >
                Analytics
              </Button>
              <Button
                variant="contained"
                startIcon={<TrendingUp />}
                size="small"
              >
                View All
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            {threads.map((t) => (
              <Box key={t.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "auto",
                    display: "flex",
                    backgroundColor: "#E3F2FD",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      backgroundColor: "#BBDEFB",
                      transform: "translateY(-2px)",
                    },
                    padding: 1.5,
                  }}
                >
                  <CardHeader
                    onClick={() => handleThreadClick(t.id)}
                    title={
                      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1} flex="1 1 auto" minWidth={0}>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {t.title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                            <School fontSize="small" />
                            <Typography variant="body2" noWrap>
                              {t.resources} resources
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant={t.enrolled ? "outlined" : "contained"}
                          color={t.enrolled ? "inherit" : "primary"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollThread(t.id);
                          }}
                          size="small"
                          sx={{ flexShrink: 0 }}
                        >
                          {t.enrolled ? "Subscribed" : "Subscribe"}
                        </Button>
                      </Box>
                    }
                    subheader={t.description}
                    subheaderTypographyProps={{ color: "text.secondary", sx: { fontSize: "0.75rem", mb: 0 } }}
                    sx={{ pb: 0 }}
                  />
                </Card>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}