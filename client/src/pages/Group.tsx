import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SidebarComponent from "../components/SideBar";
import {
  Box,
  Grid,
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

type SubModule = {
  id: number;
  title: string;
  description: string;
  resources: number;
  sessions: number;
  enrolled: boolean;
};

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const groupId = id || "1";
  const [collapsed, setCollapsed] = useState(false);

  const initialGroup = useMemo(
    () => ({
      id: Number(groupId),
      title: groupId === "1" ? "Machine Learning Fundamentals" : `Group #${groupId}`,
      category: "Computer Science",
      requiresApproval: Number(groupId) % 2 === 1,
      isMember: false,
      isPending: false,
      members: 245 + Number(groupId),
      studyHours: 24 + Number(groupId),
      description:
        "Learn the basics of ML algorithms and applications. Understand core concepts, implement algorithms from scratch, and collaborate on practical projects.",
    }),
    [groupId]
  );

  const initialModules: SubModule[] = useMemo(
    () => [
      {
        id: 1,
        title: "Linear Algebra Basics",
        description: "Foundation concepts in linear algebra for ML (vectors, matrices, eigen stuff).",
        resources: 12,
        sessions: 4,
        enrolled: false,
      },
      {
        id: 2,
        title: "Neural Networks",
        description: "From perceptrons to deep networks: activations, loss functions, backprop.",
        resources: 18,
        sessions: 6,
        enrolled: false,
      },
      {
        id: 3,
        title: "Optimization and Gradient Descent",
        description: "Intuition + math for optimization: GD, momentum, Adam, LR schedules.",
        resources: 9,
        sessions: 3,
        enrolled: false,
      },
      {
        id: 4,
        title: "Model Evaluation",
        description: "Metrics, validation, overfitting, cross-validation and confusion matrix.",
        resources: 11,
        sessions: 3,
        enrolled: false,
      },
    ],
    []
  );

  const [group, setGroup] = useState(initialGroup);
  const [modules, setModules] = useState<SubModule[]>(initialModules);

  const handleJoinOrRequest = () => {
    if (group.requiresApproval) {
      setGroup((g) => ({ ...g, isPending: true }));
    } else {
      setGroup((g) => ({ ...g, isMember: true }));
    }
  };

  const handleEnrollModule = (moduleId: number) => {
    setModules((mods) =>
      mods.map((m) => (m.id === moduleId ? { ...m, enrolled: !m.enrolled } : m))
    );
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
              {group.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontSize: { xs: "0.85rem", md: "1rem" } }}
            >
              {group.description}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" gap={1}>
              <Chip label={group.category} size="small" />
              {group.isMember && (
                <Chip
                  size="small"
                  color="success"
                  icon={<CheckCircle fontSize="small" />}
                  label="Member"
                />
              )}
              {group.isPending && (
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
                  {group.members} members
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
            {!group.isMember && !group.isPending && (
              <Button
                variant={group.requiresApproval ? "outlined" : "contained"}
                onClick={handleJoinOrRequest}
                size="small"
              >
                {group.requiresApproval ? "Request" : "Join Group"}
              </Button>
            )}
            {group.isPending && (
              <Button variant="outlined" disabled startIcon={<Pending />} size="small">
                Requested
              </Button>
            )}
            <Button
              component={Link}
              to={`/dashboard/study-plan?groupId=${groupId}`}
              variant="contained"
              startIcon={<MenuBook />}
              size="small"
            >
              Plan
            </Button>
            <Button component={Link} to={`/forum`} startIcon={<Forum />} size="small" />
          </Stack>
        </Box>

        {/* Submodules */}
        <Box mb={2}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Modules
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enroll in modules to track progress and access resources
          </Typography>
        </Box>

        <Grid container spacing={2} direction="column">
          {modules.map((m) => (
            <Grid item xs={12} key={m.id}>
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
                  title={
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1} flex="1 1 auto" minWidth={0}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                          {m.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <School fontSize="small" />
                          <Typography variant="body2" noWrap>
                            {m.resources} resources
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant={m.enrolled ? "outlined" : "contained"}
                        color={m.enrolled ? "inherit" : "primary"}
                        onClick={() => handleEnrollModule(m.id)}
                        size="small"
                        sx={{ flexShrink: 0 }}
                      >
                        {m.enrolled ? "Enrolled" : "Enroll"}
                      </Button>
                    </Box>
                  }
                  subheader={m.description}
                  subheaderTypographyProps={{ color: "text.secondary", sx: { fontSize: "0.75rem", mb: 0 } }}
                  sx={{ pb: 0 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}