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
        >
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" noWrap sx={{ mb: 1 }}>
              {workspace.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontSize: { xs: "0.85rem", md: "1rem" } }}
            >
              {workspace.description}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" gap={1}>
              <Chip label={workspace.category} size="small" />
              {workspace.isMember && (
                <Chip
                  size="small"
                  color="success"
                  icon={<CheckCircle fontSize="small" />}
                  label="Member"
                />
              )}
              {workspace.isPending && (
                <Chip
                  size="small"
                  color="warning"
                  icon={<Pending fontSize="small" />}
                  label="Request Pending"
                />
              )}
              <Box display="flex" alignItems="center" gap={0.5} ml="auto" flexShrink={0}>
                <GroupIcon fontSize="small" />
                <Typography variant="body2" noWrap>
                  {workspace.members} members
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mt={{ xs: 2, md: 0 }}
            flexShrink={0}
          >
            {/* Only show join/request button if NOT admin */}
            {!workspace.isAdmin && !workspace.isMember && !workspace.isPending && (
              <Button
                variant={workspace.requiresApproval ? "outlined" : "contained"}
                onClick={handleJoinOrRequest}
                size="small"
              >
                {workspace.requiresApproval ? "Request" : "Join Workspace"}
              </Button>
            )}
            {/* Only show requested if NOT admin */}
            {!workspace.isAdmin && workspace.isPending && (
              <Button variant="outlined" disabled startIcon={<Pending />} size="small">
                Requested
              </Button>
            )}
            <Button
              component={Link}
              to={`/study-plan?workspaceId=${workspaceId}`}
              variant="contained"
              startIcon={<MenuBook />}
              size="small"
            >
              Plan
            </Button>
            <Button component={Link} to={`/forum`} startIcon={<Forum />} size="small" />
            {workspace.isAdmin && (
              <Button
                component={Link}
                to={`/workspace-manage?workspaceId=${workspaceId}`}
                variant="contained"
                color="primary"
                startIcon={<GroupIcon />}
                size="small"
                sx={{ fontWeight: 600 }}
              >
                Manage Workspace
              </Button>
            )}
          </Stack>
        </Box>

        {/* Threads */}
        <Box mb={2}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Threads
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                  backgroundColor: "#E3F2FD",
                  flexDirection: "column",
                  transition: "box-shadow 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                    backgroundColor: "#BBDEFB",
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
                        onClick={() => handleEnrollThread(t.id)}
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
      </Box>
    </Box>
  );
}