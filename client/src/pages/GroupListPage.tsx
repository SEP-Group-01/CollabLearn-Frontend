import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getAllWorkspaces, searchWorkspaces, joinWorkspace, leaveWorkspace } from "../api/workspacesApi";
import { type Workspace } from "../types/WorkspaceInterfaces";
import SearchBar from "../components/SearchBar";

const WorkspaceListPage: React.FC = () => {
  const { search } = useParams<{ search: string }>();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedWorkspaces, setJoinedWorkspaces] = useState<string[]>([]);

  // Load workspaces on component mount or when search changes
  useEffect(() => {
    const loadWorkspaces = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data: Workspace[];
        if (search) {
          data = await searchWorkspaces(search);
        } else {
          data = await getAllWorkspaces();
        }
        
        setWorkspaces(data);
        
        // Set initially joined workspaces from the data
        const joined = data.filter(w => w.role === 'member' || w.role === 'admin').map(w => w.id);
        setJoinedWorkspaces(joined);
      } catch (err) {
        console.error('Error loading workspaces:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workspaces');
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, [search]);

  const handleJoin = async (workspaceId: string) => {
    try {
      await joinWorkspace(workspaceId);
      setJoinedWorkspaces([...joinedWorkspaces, workspaceId]);
      
      // Update the workspace in the list
      setWorkspaces(workspaces.map(w => 
        w.id === workspaceId ? { ...w, role: 'member' as const, members_count: w.members_count + 1 } : w
      ));
      
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      console.error('Error joining workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to join workspace');
    }
  };

  const handleLeave = async (workspaceId: string) => {
    try {
      await leaveWorkspace(workspaceId);
      setJoinedWorkspaces(joinedWorkspaces.filter(id => id !== workspaceId));
      
      // Update the workspace in the list
      setWorkspaces(workspaces.map(w => 
        w.id === workspaceId ? { ...w, role: 'user' as const, members_count: w.members_count - 1 } : w
      ));
    } catch (err) {
      console.error('Error leaving workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to leave workspace');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)",
        minHeight: "100vh",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
        <Box
          sx={{
            mb: 4,
            textAlign: "center",
            px: { xs: 0.5, md: 0 },
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary"
            sx={{
              mb: 1,
              letterSpacing: 1,
              textShadow: "0 2px 8px #bae6fd",
            }}
          >
            Explore Workspaces
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            Find and join a workspace to start learning together!
          </Typography>
          <Divider sx={{ maxWidth: 320, mx: "auto", mb: 2 }} />
          <Box sx={{ maxWidth: 600, mx: "auto", mb: 2 }}>
            <SearchBar data={search} />
          </Box>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3, mx: "auto", maxWidth: 600 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center" mt={10}>
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => {
                const isJoined = joinedWorkspaces.includes(workspace.id);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={workspace.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: "0 4px 16px rgba(59,130,246,0.08)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        bgcolor: "#ffffff",
                        border: "1px solid #e0e7ef",
                        "&:hover": {
                          transform: "translateY(-6px) scale(1.03)",
                          boxShadow: "0 12px 32px -5px rgba(59,130,246,0.15)",
                          borderColor: "#3b82f6",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 160,
                          overflow: "hidden",
                          bgcolor: "#f1f5f9",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={workspace.image_url || "/default-workspace.jpg"}
                          alt={workspace.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            bgcolor: "#fff",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            border: "2px solid #e2e8f0",
                            boxShadow: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#3b82f6",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                            }}
                          >
                            {workspace.join_policy}
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          p: 3,
                          "&:last-child": { pb: 3 },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#1e293b"
                          gutterBottom
                          sx={{
                            fontSize: "1.15rem",
                            lineHeight: 1.3,
                            mb: 1.5,
                          }}
                        >
                          {workspace.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          sx={{
                            mb: 2,
                            lineHeight: 1.4,
                            flexGrow: 1,
                            fontSize: "0.95rem",
                          }}
                        >
                          {workspace.description}
                        </Typography>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <Chip
                            label={`${workspace.members_count} members`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                          />
                          {workspace.tags && workspace.tags.length > 0 && (
                            <Chip
                              label={workspace.tags[0]}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem", mb: 2 }}
                        >
                          Created {new Date(workspace.created_at).toLocaleDateString()}
                        </Typography>

                        {!isJoined ? (
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              bgcolor: "#e0f2fe",
                              color: "#0369a1",
                              borderRadius: 2,
                              fontWeight: 600,
                              textTransform: "none",
                              py: 1,
                              fontSize: "1rem",
                              border: "2px solid #e0f2fe",
                              boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "#0369a1",
                                color: "#ffffff",
                                borderColor: "#0369a1",
                              },
                            }}
                            onClick={() => handleJoin(workspace.id)}
                          >
                            Join
                          </Button>
                        ) : (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => navigate(`/workspace/${workspace.id}`)}
                              sx={{
                                bgcolor: "#0369a1",
                                "&:hover": { bgcolor: "#075985" },
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: "none",
                                py: 1,
                                fontSize: "1rem",
                              }}
                            >
                              Enter
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleLeave(workspace.id)}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: "none",
                                py: 1,
                                minWidth: "auto",
                                px: 2,
                              }}
                            >
                              Leave
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="#64748b"
                  textAlign="center"
                  sx={{ mt: 8 }}
                >
                  {search
                    ? `No workspaces found matching "${search}"`
                    : "No workspaces available"}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default WorkspaceListPage;