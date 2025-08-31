import React, { useState } from "react";
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
} from "@mui/material";
import { mockWorkspaces } from "../mocks/Workspace";
import SearchBar from "../components/SearchBar";

const WorkspaceListPage: React.FC = () => {
  const { search } = useParams<{ search: string }>();
  const navigate = useNavigate();
  const [joinedWorkspaces, setJoinedWorkspaces] = useState<number[]>([]);

  const filteredWorkspaces = !search
    ? mockWorkspaces
    : mockWorkspaces.filter(workspace =>
        workspace.title.toLowerCase().includes(search.toLowerCase())
      );

  const handleJoin = (workspaceId: number) => {
    setJoinedWorkspaces([...joinedWorkspaces, workspaceId]);
    navigate(`/workspace/${workspaceId}`);
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
        <Grid container spacing={2} justifyContent="center" mt={10}>
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map((workspace) => {
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
                        borderColor: workspace.darkColor,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 160,
                        overflow: "hidden",
                        bgcolor: workspace.lightColor,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={workspace.image}
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
                          border: `2px solid ${workspace.lightColor}`,
                          boxShadow: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: workspace.darkColor,
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                        >
                          {workspace.category}
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
                        color={workspace.darkColor}
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
                      {!isJoined && (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: workspace.lightColor,
                            color: workspace.darkColor,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            py: 1,
                            fontSize: "1rem",
                            border: `2px solid ${workspace.lightColor}`,
                            boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: workspace.darkColor,
                              color: "#ffffff",
                              borderColor: workspace.darkColor,
                            },
                          }}
                          onClick={() => handleJoin(workspace.id)}
                        >
                          Join
                        </Button>
                      )}
                      {isJoined && (
                        <Button
                          variant="outlined"
                          fullWidth
                          disabled
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            py: 1,
                            fontSize: "1rem",
                            color: workspace.darkColor,
                            borderColor: workspace.darkColor,
                            bgcolor: workspace.lightColor,
                          }}
                        >
                          Joined
                        </Button>
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
                No workspaces found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default WorkspaceListPage;