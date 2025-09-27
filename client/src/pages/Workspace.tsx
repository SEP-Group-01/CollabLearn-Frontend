import React, { useState } from "react";
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
} from "@mui/material";
import {
  Forum,
  School,
  MenuBook,
  Group as GroupIcon,
  Pending,
  CheckCircle,
} from "@mui/icons-material";
import type { Workspace, Thread } from "../types/WorkspaceInterfaces";
import { mockWorkspaces } from "../mocks/Workspace";
import { mockThreads } from "../mocks/Workspace";

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>(
    mockWorkspaces.find((w) => w.id === Number(workspaceId)) || mockWorkspaces[0]
  );
  const [threads, setThreads] = useState<Thread[]>(mockThreads);

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
            background: workspace.image ? `linear-gradient(120deg, rgba(33,150,243,0.12) 0%, rgba(255,255,255,0.85) 100%), url(${workspace.image}) center/cover no-repeat` : 'linear-gradient(120deg, #e3f2fd 0%, #fff 100%)',
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
          {workspace.image && (
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
          {workspace.image && (
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
                src={workspace.image}
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
                <Chip label={workspace.category} size="small" sx={{ fontWeight: 600, bgcolor: '#e3f2fd', color: '#1976d2' }} />
                {workspace.isMember && (
                  <Chip
                    size="small"
                    color="success"
                    icon={<CheckCircle fontSize="small" />}
                    label="Member"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {workspace.isPending && (
                  <Chip
                    size="small"
                    color="warning"
                    icon={<Pending fontSize="small" />}
                    label="Request Pending"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Box display="flex" alignItems="center" gap={0.5} ml="auto" flexShrink={0}>
                  <GroupIcon fontSize="small" sx={{ color: '#1976d2' }} />
                  <Typography variant="body2" noWrap sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {workspace.members} members
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
              {/* Only show join/request button if NOT admin */}
              {!workspace.isAdmin && !workspace.isMember && !workspace.isPending && (
                <Button
                  variant={workspace.requiresApproval ? "outlined" : "contained"}
                  onClick={handleJoinOrRequest}
                  size="medium"
                  sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                >
                  {workspace.requiresApproval ? "Request" : "Join Workspace"}
                </Button>
              )}
              {/* Only show requested if NOT admin */}
              {!workspace.isAdmin && workspace.isPending && (
                <Button variant="outlined" disabled startIcon={<Pending />} size="medium" sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}>
                  Requested
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
              {workspace.isAdmin && (
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
                          {t.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <School fontSize="small" sx={{ color: '#1976d2' }} />
                          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                            {t.resources} resources
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant={t.enrolled ? "outlined" : "contained"}
                        color={t.enrolled ? "inherit" : "primary"}
                        onClick={() => handleEnrollThread(t.id)}
                        size="small"
                        sx={{ flexShrink: 0, fontWeight: 700, borderRadius: 2, px: 2 }}
                      >
                        {t.enrolled ? "Subscribed" : "Subscribe"}
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