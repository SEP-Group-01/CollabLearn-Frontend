import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Group as GroupIcon,
  Lock as LockIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SidebarComponent from '../components/SideBar';
import { getAccessToken, isAuthenticated } from '../api/authApi';
import { getUserWorkspaces } from '../api/workspacesApi';

interface WorkspaceCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  join_policy: 'Anyone' | 'Requests' | 'Invites';
  tags: string[];
  members_count: number;
  role?: string;
  created_at: string;
  updated_at: string;
}

const MyWorkspaces = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyWorkspaces = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!isAuthenticated()) {
          setError('Please log in to view your workspaces');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Get access token
        const token = getAccessToken();
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        console.log('[MyWorkspaces] Fetching workspaces with token:', token.substring(0, 20) + '...');

        // Fetch user's workspaces - token is sent automatically in headers by axios
        const response = await getUserWorkspaces();
        console.log('[MyWorkspaces] Fetched workspaces:', response);

        if (!response || response.length === 0) {
          setWorkspaces([]);
          setError(null);
        } else {
          setWorkspaces(response);
        }
      } catch (err: any) {
        console.error('[MyWorkspaces] Error fetching workspaces:', err);

        // Check if it's an authentication error
        if (err.response?.status === 401 || err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response?.status === 403 || err.message?.includes('403')) {
          setError('You do not have permission to view these workspaces.');
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch workspaces';
          setError(`Error: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyWorkspaces();
  }, [navigate]);

  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/workspace/${workspaceId}`);
  };

  const getWorkspaceImage = (workspace: WorkspaceCard): string => {
    if (workspace.image_url) {
      // If it's a Google Images URL, extract the actual image URL from imgurl parameter
      if (workspace.image_url.includes('google.com/imgres') && workspace.image_url.includes('imgurl=')) {
        try {
          const url = new URL(workspace.image_url);
          const imgurl = url.searchParams.get('imgurl');
          if (imgurl) return decodeURIComponent(imgurl);
        } catch (e) {
          console.warn('Failed to parse Google image URL:', e);
        }
      }
      // If it's a direct Google Images URL
      if (
        workspace.image_url.includes('googleusercontent.com') ||
        workspace.image_url.includes('ggpht.com')
      ) {
        return workspace.image_url;
      }
      // For other URLs, use them directly
      return workspace.image_url;
    }
    // Fallback to a default image
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop';
  };

  const getJoinPolicyIcon = (policy: string) => {
    switch (policy) {
      case 'Anyone':
        return <PublicIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      case 'Requests':
        return <LockIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      case 'Invites':
        return <LockIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />

      <Box
        sx={{
          flex: 1,
          ml: collapsed ? '80px' : '250px',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 6, flexGrow: 1 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="primary"
              sx={{
                mb: 1,
                letterSpacing: 0.5,
              }}
            >
              My Workspaces
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Access all the workspaces you're a member of
            </Typography>
            <Divider sx={{ maxWidth: 300, mx: 'auto', mb: 2 }} />
          </Box>

          {/* Loading State */}
          {loading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading your workspaces...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                fontSize: '1rem',
                p: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Empty State */}
          {!loading && workspaces.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <GroupIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No Workspaces Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You haven't joined any workspaces yet. Start by searching for workspaces to join!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/Workspaces-list')}
              >
                Explore Workspaces
              </Button>
            </Box>
          )}

          {/* Workspaces Grid */}
          {!loading && workspaces.length > 0 && (
            <Grid container spacing={3}>
              {workspaces.map((workspace) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={workspace.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => handleWorkspaceClick(workspace.id)}
                  >
                    {/* Workspace Image */}
                    <CardMedia
                      component="img"
                      height={180}
                      image={getWorkspaceImage(workspace)}
                      alt={workspace.title}
                      sx={{
                        objectFit: 'cover',
                        backgroundColor: '#f5f5f5',
                      }}
                    />

                    {/* Workspace Content */}
                    <CardContent sx={{ flexGrow: 1, pb: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 1,
                        }}
                      >
                        {workspace.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '3em',
                          lineHeight: '1.5em',
                        }}
                      >
                        {workspace.description || 'No description available'}
                      </Typography>

                      {/* Join Policy Badge */}
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          icon={getJoinPolicyIcon(workspace.join_policy) || undefined}
                          label={workspace.join_policy}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor:
                              workspace.join_policy === 'Anyone'
                                ? '#e8f5e9'
                                : '#fff3e0',
                          }}
                        />
                      </Box>

                      {/* Tags */}
                      {workspace.tags && workspace.tags.length > 0 && (
                        <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: '28px' }}>
                          {workspace.tags.slice(0, 2).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="filled"
                              sx={{
                                height: 24,
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                          {workspace.tags.length > 2 && (
                            <Chip
                              label={`+${workspace.tags.length - 2}`}
                              size="small"
                              variant="filled"
                              sx={{
                                height: 24,
                                bgcolor: '#f5f5f5',
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                        </Box>
                      )}

                      {/* Spacer to push members count to bottom */}
                      <Box sx={{ flexGrow: 1 }} />

                      {/* Members Count */}
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 'auto', pt: 1 }}>
                        <GroupIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {workspace.members_count || 0} member{(workspace.members_count || 0) !== 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                    </CardContent>

                    {/* Action Buttons */}
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWorkspaceClick(workspace.id);
                        }}
                      >
                        Open
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default MyWorkspaces;
