import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle,
  Group,
  BarChart,
  PersonAdd,
  PersonRemove,
  Quiz,
  Description,
  PeopleAlt,
  Forum,
  TrendingUp,
} from "@mui/icons-material";
import SidebarComponent from "../components/SideBar";

const mockRequests = [
  { id: 1, name: "Alice Johnson", avatar: "", status: "pending" },
  { id: 2, name: "Bob Lee", avatar: "", status: "pending" },
];

const mockMembers = [
  { id: 3, name: "Jane Smith", avatar: "", role: "member" },
  { id: 4, name: "Tom Brown", avatar: "", role: "member" },
  { id: 5, name: "You (Admin)", avatar: "", role: "admin" },
];

const analytics = [
  {
    label: "Quizzes Taken",
    value: 32,
    icon: <Quiz color="primary" sx={{ fontSize: 36 }} />,
    color: "primary.main",
    description: "Total quizzes completed by group members.",
  },
  {
    label: "Resources Edited",
    value: 14,
    icon: <Description color="info" sx={{ fontSize: 36 }} />,
    color: "info.main",
    description: "Documents and resources edited collaboratively.",
  },
  {
    label: "Active Users",
    value: 9,
    icon: <PeopleAlt color="success" sx={{ fontSize: 36 }} />,
    color: "success.main",
    description: "Members active in the last 7 days.",
  },
  {
    label: "Threads",
    value: 8,
    icon: <Forum color="warning" sx={{ fontSize: 36 }} />,
    color: "warning.main",
    description: "Active discussion threads in the group.",
  },
  {
    label: "Progress",
    value: "76%",
    icon: <TrendingUp color="secondary" sx={{ fontSize: 36 }} />,
    color: "secondary.main",
    description: "Overall group progress in study plan.",
  },
];

export default function GroupManagePage() {
  const [tab, setTab] = useState(2); // Default to Analytics tab

  const handleAccept = (id: number) => {
    // Accept logic here
  };
  const handleReject = (id: number) => {
    // Reject logic here
  };
  const handleRemove = (id: number) => {
    // Remove member logic here
  };

  // Sidebar width logic (optional, adjust as needed)
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)" }}>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box sx={{ ml: `${sidebarWidth}px`, flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
              Manage Group
            </Typography>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 2,
                "& .MuiTab-root": { fontWeight: 600, fontSize: 18 },
                "& .MuiTabs-indicator": { background: "linear-gradient(90deg,#2563eb,#60a5fa)" },
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Requests" icon={<PersonAdd />} iconPosition="start" />
              <Tab label="Members" icon={<Group />} iconPosition="start" />
              <Tab label="Analytics" icon={<BarChart />} iconPosition="start" />
            </Tabs>
            <Divider sx={{ mb: 2 }} />

            {/* Requests Tab */}
            {tab === 0 && (
              <>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Pending Requests
                </Typography>
                <List>
                  {mockRequests.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No pending requests." />
                    </ListItem>
                  ) : (
                    mockRequests.map((req) => (
                      <ListItem key={req.id}>
                        <Avatar sx={{ mr: 2 }}>{req.name.charAt(0)}</Avatar>
                        <ListItemText primary={req.name} />
                        <ListItemSecondaryAction>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            sx={{ mr: 1 }}
                            onClick={() => handleAccept(req.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleReject(req.id)}
                          >
                            Reject
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </>
            )}

            {/* Members Tab */}
            {tab === 1 && (
              <>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Group Members
                </Typography>
                <List>
                  {mockMembers.map((member) => (
                    <ListItem key={member.id}>
                      <Avatar sx={{ mr: 2 }}>{member.name.charAt(0)}</Avatar>
                      <ListItemText
                        primary={member.name}
                        secondary={
                          member.role === "admin" ? (
                            <Chip label="Admin" color="primary" size="small" />
                          ) : null
                        }
                      />
                      {member.role !== "admin" && (
                        <ListItemSecondaryAction>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<PersonRemove />}
                            onClick={() => handleRemove(member.id)}
                          >
                            Remove
                          </Button>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* Analytics Tab */}
            {tab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Group Analytics
                </Typography>
                <Grid container spacing={3} sx={{ mb: 2 }}>
                  {analytics.map((item, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={item.label}>
                      <Tooltip title={item.description} arrow>
                        <Card
                          sx={{
                            borderRadius: 3,
                            boxShadow: 2,
                            p: 3,
                            textAlign: "center",
                            background: "linear-gradient(120deg,#e0f2fe 60%,#f8fafc 100%)",
                            transition: "box-shadow 0.2s",
                            "&:hover": { boxShadow: 6, background: "linear-gradient(120deg,#bae6fd 60%,#e0f2fe 100%)" },
                          }}
                        >
                          <Box mb={1}>{item.icon}</Box>
                          <Typography variant="h5" fontWeight="bold" color={item.color}>
                            {item.value}
                          </Typography>
                          <Typography color="text.secondary" fontWeight={500}>
                            {item.label}
                          </Typography>
                        </Card>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                  Track your group's progress, activity, and collaboration in real time.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}