import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Forum,
  School,
  MenuBook,
  Group as GroupIcon,
  Pending,
  CheckCircle,
  ExitToApp,
  PersonAdd,
  Cancel,
  Check,
} from "@mui/icons-material";
import type { Workspace, Thread } from "../types/WorkspaceInterfaces";
import { 
  getWorkspace, 
  getThreadsByWorkspaceId
} from "../api/workspacesApi";

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workspace data on component mount
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId) {
        setError("Workspace ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch workspace and threads data in parallel
        const [workspaceResponse, threadsResponse] = await Promise.all([
          getWorkspace(workspaceId),
          getThreadsByWorkspaceId(workspaceId),
        ]);

        setWorkspace(workspaceResponse);
        setThreads(threadsResponse);
      } catch (err) {
        console.error("Error fetching workspace data:", err);
        setError("Failed to load workspace data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  const handleRoleAction = () => {
    if (!workspace) return;
    
    // Update role based on current role and join policy
    switch (workspace.role) {
      case 'user':
        if (workspace.join_policy === 'Anyone') {
          setWorkspace((w) => w ? ({ ...w, role: 'member' }) : null);
        } else if (workspace.join_policy === 'Requests') {
          setWorkspace((w) => w ? ({ ...w, role: 'requested' }) : null);
        }
        break;
      case 'requested':
        setWorkspace((w) => w ? ({ ...w, role: 'user' }) : null);
        break;
      case 'invited':
        setWorkspace((w) => w ? ({ ...w, role: 'member' }) : null);
        break;
      case 'member':
        setWorkspace((w) => w ? ({ ...w, role: 'user' }) : null);
        break;
      default:
        break;
    }
  };

  const handleEnrollThread = (threadId: string) => {
    setThreads((ths) =>
      ths.map((t) => (t.id === threadId ? { ...t, subscriber_count: t.subscriber_count > 0 ? t.subscriber_count - 1 : t.subscriber_count + 1 } : t))
    );
  };

  const handleThreadClick = (threadId: string) => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <Box display="flex">
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box
          component="main"
          flexGrow={1}
          p={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            ml: collapsed ? { xs: 0, md: "80px" } : { xs: 0, md: "240px" },
            transition: "margin-left 0.3s ease",
            width: { xs: "100%", md: `calc(100% - ${collapsed ? 80 : 240}px)` },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box display="flex">
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box
          component="main"
          flexGrow={1}
          p={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            ml: collapsed ? { xs: 0, md: "80px" } : { xs: 0, md: "240px" },
            transition: "margin-left 0.3s ease",
            width: { xs: "100%", md: `calc(100% - ${collapsed ? 80 : 240}px)` },
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  // Show content only if workspace data is loaded
  if (!workspace) {
    return null;
  }

  return (
    <Box display="flex">
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box
        component="main"
        flexGrow={1}
        p={{ xs: 2, sm: 3, md: 4 }}
        sx={{
          ml: collapsed ? { xs: 0, md: "80px" } : { xs: 0, md: "240px" },
          transition: "margin-left 0.3s ease",
          width: { xs: "100%", md: `calc(100% - ${collapsed ? 80 : 240}px)` },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
          justifyContent="space-between"
          mb={3}
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{
            background: workspace.image_url ? `linear-gradient(120deg, rgba(33,150,243,0.12) 0%, rgba(255,255,255,0.85) 100%), url(${workspace.image_url}) center/cover no-repeat` : 'linear-gradient(120deg, #e3f2fd 0%, #fff 100%)',
            borderRadius: 4,
            minHeight: 180,
            boxShadow: '0 6px 32px rgba(33,150,243,0.10)',
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 2, md: 5 },
            py: { xs: 2.5, md: 4 },
            mt: 1,
          }}
        >
          {/* Overlay for readability if image exists */}
          {workspace.image_url && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.7)', // Increased opacity for better readability
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Workspace image, only on md+ screens, styled as avatar with border and shadow */}
          {workspace.image_url && (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                mr: 5,
                zIndex: 2,
              }}
            >
              <img
                src={workspace.image_url}
                alt={workspace.title + ' logo'}
                style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: '50%', boxShadow: '0 4px 16px rgba(33,150,243,0.18)', border: '5px solid #fff' }}
              />
            </Box>
          )}
          {/* Content and buttons in a flex row, both with zIndex 2 */}
          <Box display="flex" flex={1} flexDirection={{ xs: 'column', md: 'row' }} width="100%" sx={{ position: 'relative', zIndex: 2 }}>
            <Box flex={1} minWidth={0} pr={{ md: 4 }}>
              <Typography variant="h3" fontWeight={800} noWrap sx={{ mb: 1, color: '#0d2235', letterSpacing: 0.5 }}>
                {workspace.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 1.5, fontSize: { xs: "1.05rem", md: "1.18rem" }, fontWeight: 500, color: '#263238' }}
              >
                {workspace.description}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" gap={1}>
                {workspace.tags.length > 0 && (
                  <Chip label={workspace.tags[0]} size="small" sx={{ fontWeight: 600, bgcolor: '#e3f2fd', color: '#1976d2' }} />
                )}
                {workspace.role === 'member' && (
                  <Chip
                    size="small"
                    color="success"
                    icon={<CheckCircle fontSize="small" />}
                    label="Member"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {workspace.role === 'admin' && (
                  <Chip
                    size="small"
                    color="primary"
                    icon={<CheckCircle fontSize="small" />}
                    label="Admin"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {workspace.role === 'requested' && (
                  <Chip
                    size="small"
                    color="warning"
                    icon={<Pending fontSize="small" />}
                    label="Request Pending"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {workspace.role === 'invited' && (
                  <Chip
                    size="small"
                    color="info"
                    icon={<PersonAdd fontSize="small" />}
                    label="Invited"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Box display="flex" alignItems="center" gap={0.5} ml="auto" flexShrink={0}>
                  <GroupIcon fontSize="small" sx={{ color: '#1976d2' }} />
                  <Typography variant="body2" noWrap sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {workspace.members_count} members
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              mt={{ xs: 2, md: 0 }}
              flexShrink={0}
              sx={{ position: 'relative', zIndex: 2 }}
            >
              {/* Role-based action buttons */}
              {workspace.role === 'user' && workspace.join_policy === 'Anyone' && (
                <Button
                  variant="contained"
                  onClick={handleRoleAction}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Join Workspace
                </Button>
              )}
              {workspace.role === 'user' && workspace.join_policy === 'Requests' && (
                <Button
                  variant="outlined"
                  onClick={handleRoleAction}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Request to Join
                </Button>
              )}
              {workspace.role === 'user' && workspace.join_policy === 'Invites' && (
                <Typography
                  variant="body2"
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary', 
                    fontStyle: 'italic',
                    px: 2.5,
                    py: 1
                  }}
                >
                  This workspace is invite-only
                </Typography>
              )}
              {workspace.role === 'requested' && (
                <Button
                  variant="outlined"
                  onClick={handleRoleAction}
                  startIcon={<Cancel />}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Cancel Request
                </Button>
              )}
              {workspace.role === 'invited' && (
                <Button
                  variant="contained"
                  onClick={handleRoleAction}
                  startIcon={<Check />}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Accept Invite
                </Button>
              )}
              {workspace.role === 'member' && (
                <Button
                  variant="outlined"
                  onClick={handleRoleAction}
                  startIcon={<ExitToApp />}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Leave
                </Button>
              )}
              {workspace.role === 'admin' && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Invite Users
                </Button>
              )}
              
              <Button
                component={Link}
                to={`/study-plan?workspaceId=${workspaceId}`}
                variant="contained"
                startIcon={<MenuBook />}
                size="medium"
                sx={{ fontWeight: 700, borderRadius: 2, px: 2.5, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
              >
                Plan
              </Button>
              <Button component={Link} to={`/forum`} startIcon={<Forum />} size="medium" sx={{ fontWeight: 700, borderRadius: 2, px: 2.5, bgcolor: '#e3f2fd', color: '#1976d2', '&:hover': { bgcolor: '#bbdefb' } }} />
              {workspace.role === 'admin' && (
                <Button
                  component={Link}
                  to={`/workspace-manage?workspaceId=${workspaceId}`}
                  variant="contained"
                  color="primary"
                  startIcon={<GroupIcon />}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  Manage Workspace
                </Button>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Threads */}
        <Box mb={2} mt={4}>
          <Typography variant="h5" fontWeight={800} mb={1} color="#1976d2">
            Threads
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
            Subscribe to threads to track progress and access resources
          </Typography>
        </Box>
        <Stack spacing={2}>
          {threads.map((t) => (
            <Box key={t.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "auto",
                  display: "flex",
                  background: "linear-gradient(120deg, #e3f2fd 0%, #fff 100%)",
                  flexDirection: "column",
                  transition: "box-shadow 0.3s ease, background 0.3s ease",
                  cursor: "pointer",
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(33,150,243,0.08)',
                  '&:hover': {
                    boxShadow: "0 8px 24px rgba(33,150,243,0.18)",
                    background: "linear-gradient(120deg, #bbdefb 0%, #e3f2fd 100%)",
                  },
                  padding: 2,
                }}
              >
                <CardHeader
                  onClick={() => handleThreadClick(t.id)}
                  title={
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1} flex="1 1 auto" minWidth={0}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap color="#1976d2">
                          {t.title || t.description.substring(0, 50) + (t.description.length > 50 ? '...' : '')}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <School fontSize="small" sx={{ color: '#1976d2' }} />
                          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                            {t.resource_count} resources
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant={t.subscriber_count > 0 ? "outlined" : "contained"}
                        color={t.subscriber_count > 0 ? "inherit" : "primary"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnrollThread(t.id);
                        }}
                        size="small"
                        sx={{ flexShrink: 0, fontWeight: 700, borderRadius: 2, px: 2 }}
                      >
                        {t.subscriber_count > 0 ? "Subscribed" : "Subscribe"}
                      </Button>
                    </Box>
                  }
                  subheader={t.description}
                  subheaderTypographyProps={{ color: "text.secondary", sx: { fontSize: "0.85rem", mb: 0, fontWeight: 500 } }}
                  sx={{ pb: 0 }}
                />
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}