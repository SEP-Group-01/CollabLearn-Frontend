import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Container,
  Chip,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  People,
  Public,
  Lock,
  Mail,
} from "@mui/icons-material";
import { getTopWorkspaces } from "../api/workspacesApi";
import { isAuthenticated } from "../api/authApi";
import type { Workspace } from "../types/WorkspaceInterfaces";

const WorkspacesSection: React.FC = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggedIn = isAuthenticated();

  // Fetch top workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const data = await getTopWorkspaces(10);
        setWorkspaces(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching top workspaces:", err);
        setError("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Auto-sliding functionality
  useEffect(() => {
    if (!isAutoSliding || workspaces.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, workspaces.length - 2));
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isAutoSliding, workspaces.length]);

  // Handle manual navigation
  const handlePrevious = () => {
    setIsAutoSliding(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.max(1, workspaces.length - 2)) % Math.max(1, workspaces.length - 2));
    
    // Resume auto-sliding after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const handleNext = () => {
    setIsAutoSliding(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, workspaces.length - 2));
    
    // Resume auto-sliding after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  // Handle workspace card click
  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
  };

  // Handle join button click
  const handleJoinClick = (e: React.MouseEvent, workspace: Workspace) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Navigate to workspace details for join action
    navigate(`/workspace/${workspace.id}`);
  };

  // Get join policy icon
  const getJoinPolicyIcon = (joinPolicy: string) => {
    switch (joinPolicy.toLowerCase()) {
      case "anyone":
        return <Public sx={{ fontSize: 16 }} />;
      case "requests":
        return <Mail sx={{ fontSize: 16 }} />;
      case "invites":
        return <Lock sx={{ fontSize: 16 }} />;
      default:
        return <Public sx={{ fontSize: 16 }} />;
    }
  };

  // Get workspace image URL with fallback
  const getWorkspaceImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80";
    }

    // Handle Google Images URLs - extract the actual image URL
    if (imageUrl.includes('google.com/imgres') || imageUrl.includes('imgurl=')) {
      try {
        const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
        const actualImageUrl = urlParams.get('imgurl');
        if (actualImageUrl) {
          return decodeURIComponent(actualImageUrl);
        }
      } catch (error) {
        console.warn('Failed to parse Google Images URL:', error);
      }
    }

    // For Supabase URLs or direct image URLs, return as is
    return imageUrl;
  };

  // Get join policy color
  const getJoinPolicyColor = (joinPolicy: string) => {
    switch (joinPolicy.toLowerCase()) {
      case "anyone":
        return { bg: "#dcfce7", text: "#166534" };
      case "requests":
        return { bg: "#fef3c7", text: "#92400e" };
      case "invites":
        return { bg: "#fecaca", text: "#991b1b" };
      default:
        return { bg: "#dcfce7", text: "#166534" };
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box sx={{ display: "flex", gap: 3, overflow: "hidden" }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} sx={{ minWidth: 320, height: 360, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={180} />
          <CardContent>
            <Skeleton variant="text" height={28} width="80%" />
            <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
            <Skeleton variant="text" height={16} width="100%" sx={{ mt: 2 }} />
            <Skeleton variant="text" height={16} width="90%" />
            <Skeleton variant="rectangular" height={36} sx={{ mt: 3, borderRadius: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  if (loading) {
    return (
      <Box
        component="section"
        id="workspaces"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: "#ffffff",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={5}>
            <Typography variant="h4" fontWeight="bold" color="#0f172a" gutterBottom>
              Top Study Workspaces
            </Typography>
            <Typography variant="subtitle1" color="#475569">
              Discover popular collaborative learning spaces
            </Typography>
          </Box>
          <LoadingSkeleton />
        </Container>
      </Box>
    );
  }

  if (error || workspaces.length === 0) {
    return (
      <Box
        component="section"
        id="workspaces"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: "#ffffff",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={5}>
            <Typography variant="h4" fontWeight="bold" color="#0f172a" gutterBottom>
              Top Study Workspaces
            </Typography>
            <Typography variant="subtitle1" color="#475569">
              Discover popular collaborative learning spaces
            </Typography>
          </Box>
          {error ? (
            <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
              {error}
            </Alert>
          ) : (
            <Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
              No workspaces available at the moment.
            </Alert>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      id="workspaces"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(148, 163, 184, 0.03) 100%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#0f172a"
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                mb: 1,
              }}
            >
              Top Study Workspaces
            </Typography>
            <Typography
              variant="subtitle1"
              color="#475569"
              sx={{
                maxWidth: 500,
                mx: "auto",
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Discover popular collaborative learning spaces ranked by community engagement
            </Typography>
          </Box>
        </motion.div>

        {/* Workspaces Carousel */}
        <Box sx={{ position: "relative" }}>
          {/* Navigation Arrows */}
          {workspaces.length > 3 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  bgcolor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    transform: "translateY(-50%) scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowBackIos sx={{ fontSize: 20 }} />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  bgcolor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    transform: "translateY(-50%) scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowForwardIos sx={{ fontSize: 20 }} />
              </IconButton>
            </>
          )}

          {/* Cards Container */}
          <Box
            sx={{
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <motion.div
              animate={{
                x: `-${currentIndex * (320 + 24)}px`, // 320px card width + 24px gap
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                display: "flex",
                gap: "24px",
                width: `${workspaces.length * (320 + 24)}px`,
              }}
            >
              {workspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ minWidth: "320px" }}
                >
                  <Card
                    onClick={() => handleWorkspaceClick(workspace)}
                    sx={{
                      height: 380,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      bgcolor: "#ffffff",
                      border: "1px solid #f1f5f9",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 16px 24px -8px rgba(0, 0, 0, 0.15)",
                        borderColor: "#e2e8f0",
                        "& .card-image": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    {/* Image Container */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 180,
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getWorkspaceImageUrl(workspace.image_url)}
                        alt={workspace.title}
                        className="card-image"
                        onError={(e) => {
                          // Fallback to a default image if the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80";
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />

                      {/* Join Policy Badge */}
                      <Chip
                        icon={getJoinPolicyIcon(workspace.join_policy)}
                        label={workspace.join_policy}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: getJoinPolicyColor(workspace.join_policy).bg,
                          color: getJoinPolicyColor(workspace.join_policy).text,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          border: "none",
                          "& .MuiChip-icon": {
                            color: getJoinPolicyColor(workspace.join_policy).text,
                          },
                        }}
                      />
                    </Box>

                    {/* Content */}
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
                        color="#0f172a"
                        gutterBottom
                        sx={{
                          fontSize: "1.1rem",
                          lineHeight: 1.3,
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
                          fontSize: "0.875rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {workspace.description || "Join this workspace to start learning together."}
                      </Typography>

                      {/* Members Count */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <People sx={{ fontSize: 16, color: "#64748b", mr: 0.5 }} />
                        <Typography variant="caption" color="#64748b" fontWeight={500}>
                          {workspace.members_count || 0} members
                        </Typography>
                      </Box>

                      {/* Join Button - Show only if logged in */}
                      {isLoggedIn && (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => handleJoinClick(e, workspace)}
                          sx={{
                            bgcolor: "#2563eb",
                            color: "#ffffff",
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            py: 1,
                            fontSize: "0.9rem",
                            "&:hover": {
                              bgcolor: "#1e40af",
                            },
                          }}
                        >
                          {workspace.role === "member" || workspace.role === "admin" ? "Open" : "Join"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </Box>
        </Box>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mt={6}>
            <Button
              variant="outlined"
              onClick={() => navigate("/workspaces-list")}
              sx={{
                borderColor: "#e2e8f0",
                color: "#475569",
                bgcolor: "#f8fafc",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderWidth: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#2563eb",
                  borderColor: "#2563eb",
                  color: "#ffffff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              Explore All Workspaces
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WorkspacesSection;