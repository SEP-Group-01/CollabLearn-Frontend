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
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { 
  Public as PublicIcon, 
  RequestPage as RequestIcon, 
  Lock as LockIcon,
  Group as GroupIcon 
} from '@mui/icons-material';
import { getWorkspacesBySearchTerm, joinWorkspace, sendJoinRequest } from "../api/workspacesApi";
import SearchBar from "../components/SearchBar";

interface WorkspaceSearchResult {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  join_policy: 'Anyone' | 'Requests' | 'Invites';
  admin_ids: string[];
  tags: string[];
  members_count: number;
  role?: string;
  created_at: string;
  updated_at: string;
}

const WorkspaceSearchResults: React.FC = () => {
  const { search } = useParams<{ search: string }>();
  const navigate = useNavigate();
  
  // State management
  const [workspaces, setWorkspaces] = useState<WorkspaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedWorkspaces, setJoinedWorkspaces] = useState<string[]>([]);
  const [requestedWorkspaces, setRequestedWorkspaces] = useState<string[]>([]);
  const [joiningWorkspace, setJoiningWorkspace] = useState<string | null>(null);

  // Fetch workspaces when search term changes
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!search || search.trim() === '') {
        setWorkspaces([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await getWorkspacesBySearchTerm(search.trim());
        setWorkspaces(results);
      } catch (err) {
        console.error("Error fetching workspaces:", err);
        setError("Failed to search workspaces. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [search]);

  // Handle workspace card click
  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/workspace/${workspaceId}`);
  };

  // Handle joining a workspace
  const handleJoin = async (workspace: WorkspaceSearchResult) => {
    if (joiningWorkspace) return; // Prevent multiple requests

    try {
      setJoiningWorkspace(workspace.id);
      setError(null);

      if (workspace.join_policy === 'Anyone') {
        // Direct join
        await joinWorkspace(workspace.id);
        setJoinedWorkspaces([...joinedWorkspaces, workspace.id]);
        navigate(`/workspace/${workspace.id}`);
      } else if (workspace.join_policy === 'Requests') {
        // Send join request
        await sendJoinRequest(workspace.id);
        setRequestedWorkspaces([...requestedWorkspaces, workspace.id]);
      } else {
        // Invites only
        setError("This workspace is invite-only. Please contact an admin for an invitation.");
      }
    } catch (err: any) {
      console.error("Error joining workspace:", err);
      setError(err.response?.data?.message || "Failed to join workspace. Please try again.");
    } finally {
      setJoiningWorkspace(null);
    }
  };

  // Get workspace image with fallback
  const getWorkspaceImage = (workspace: WorkspaceSearchResult): string => {
    if (workspace.image_url) {
      // If it's a Google Images URL, extract the actual image URL from imgurl parameter
      if (workspace.image_url.includes('google.com/imgres') && workspace.image_url.includes('imgurl=')) {
        try {
          const url = new URL(workspace.image_url);
          const imgurl = url.searchParams.get('imgurl');
          if (imgurl) {
            return decodeURIComponent(imgurl);
          }
        } catch (e) {
          console.warn('Failed to parse Google image URL:', e);
        }
      }
      // If it's a direct Google Images URL
      if (workspace.image_url.includes('googleusercontent.com') || workspace.image_url.includes('ggpht.com')) {
        return workspace.image_url;
      }
      // For other URLs, use them directly
      return workspace.image_url;
    }
    // Fallback to a default image
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop";
  };

  // Get button text and action
  const getJoinButtonProps = (workspace: WorkspaceSearchResult) => {
    // If user already has a role in this workspace, they're already a member
    if (workspace.role) {
      return { text: 'Already Joined', disabled: true, variant: 'outlined' as const };
    }
    
    if (joinedWorkspaces.includes(workspace.id)) {
      return { text: 'Joined', disabled: true, variant: 'outlined' as const };
    }
    
    if (requestedWorkspaces.includes(workspace.id)) {
      return { text: 'Request Sent', disabled: true, variant: 'outlined' as const };
    }

    if (workspace.join_policy === 'Anyone') {
      return { text: 'Join', disabled: false, variant: 'contained' as const };
    } else if (workspace.join_policy === 'Requests') {
      return { text: 'Request to Join', disabled: false, variant: 'contained' as const };
    } else {
      return { text: 'Invite Only', disabled: true, variant: 'outlined' as const };
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
            {search ? `Search Results for "${search}"` : 'Explore Workspaces'}
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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            {error}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Search Results */}
        {!loading && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)' 
              },
              gap: 2,
              mt: 10,
            }}
          >
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => {
                const buttonProps = getJoinButtonProps(workspace);
                const isJoining = joiningWorkspace === workspace.id;

                return (
                  <Card
                    key={workspace.id}
                    onClick={() => handleWorkspaceClick(workspace.id)}
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
                        borderColor: "#2563eb",
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
                        image={getWorkspaceImage(workspace)}
                        alt={workspace.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                      {/* Tags display */}
                      {workspace.tags && workspace.tags.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                            maxWidth: "60%",
                          }}
                        >
                          {workspace.tags.slice(0, 2).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                bgcolor: "#fff",
                                color: "#2563eb",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                border: "1px solid #dbeafe",
                                boxShadow: 1,
                              }}
                            />
                          ))}
                          {workspace.tags.length > 2 && (
                            <Chip
                              label={`+${workspace.tags.length - 2}`}
                              size="small"
                              sx={{
                                bgcolor: "#2563eb",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                boxShadow: 1,
                              }}
                            />
                          )}
                        </Box>
                      )}
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
                        color="#1e40af"
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
                        {workspace.description || "No description available"}
                      </Typography>
                      
                      {/* Join Policy and Member Count */}
                      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {workspace.join_policy === 'Anyone' && <PublicIcon sx={{ fontSize: 16, color: '#16a34a' }} />}
                          {workspace.join_policy === 'Requests' && <RequestIcon sx={{ fontSize: 16, color: '#d97706' }} />}
                          {workspace.join_policy === 'Invites' && <LockIcon sx={{ fontSize: 16, color: '#dc2626' }} />}
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748b',
                              fontWeight: 600,
                            }}
                          >
                            {workspace.join_policy === 'Anyone' && 'Open to everyone'}
                            {workspace.join_policy === 'Requests' && 'Requires approval'}
                            {workspace.join_policy === 'Invites' && 'Invite only'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <GroupIcon sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748b',
                              fontWeight: 500,
                            }}
                          >
                            {workspace.members_count} member{workspace.members_count !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant={buttonProps.variant}
                        fullWidth
                        disabled={buttonProps.disabled || isJoining}
                        sx={{
                          bgcolor: buttonProps.variant === 'contained' ? '#dbeafe' : 'transparent',
                          color: '#1e40af',
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: "none",
                          py: 1,
                          fontSize: "1rem",
                          border: `2px solid #dbeafe`,
                          boxShadow: buttonProps.variant === 'contained' ? "0 2px 8px rgba(59,130,246,0.08)" : 'none',
                          transition: "all 0.2s ease",
                          "&:hover": buttonProps.disabled ? {} : {
                            bgcolor: '#1e40af',
                            color: "#ffffff",
                            borderColor: '#1e40af',
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          if (!buttonProps.disabled) handleJoin(workspace);
                        }}
                      >
                        {isJoining ? <CircularProgress size={20} /> : buttonProps.text}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : !loading && search ? (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 8 }}>
                <Typography
                  variant="h6"
                  color="#64748b"
                >
                  No workspaces found for "{search}".
                </Typography>
              </Box>
            ) : !loading && !search ? (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 8 }}>
                <Typography
                  variant="h6"
                  color="#64748b"
                >
                  Enter a search term to find workspaces.
                </Typography>
              </Box>
            ) : null}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WorkspaceSearchResults;