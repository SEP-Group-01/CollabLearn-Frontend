import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SidebarComponent from "../components/SideBar";
import InviteMembersModal from "../components/InviteMembersModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
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
  getThreadsByWorkspaceId,
  joinWorkspace,
  leaveWorkspace,
  sendJoinRequest,
  cancelJoinRequest,
  acceptInvite,
  declineInvite
} from "../api/workspacesApi";
import { 
  subscribeToThread, 
  unsubscribeFromThread, 
  getThreadStats 
} from '../api/threadsApi';

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  
  // Confirmation dialog states
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
    severity?: 'warning' | 'error' | 'info' | 'success';
    confirmText?: string;
  }>({
    open: false,
    title: '',
    message: '',
    action: async () => {},
  });
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  // Utility function to convert relative image URLs to absolute URLs
  const getFullImageUrl = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl) return null;
    
    // Handle Google Images URLs - extract the actual image URL
    if (imageUrl.includes('google.com/imgres') && imageUrl.includes('imgurl=')) {
      try {
        const url = new URL(imageUrl);
        const imgurl = url.searchParams.get('imgurl');
        if (imgurl) {
          console.log('Extracting image URL from Google search:', decodeURIComponent(imgurl));
          return decodeURIComponent(imgurl);
        }
      } catch (error) {
        console.error('Error parsing Google Images URL:', error);
      }
    }
    
    // If the URL is already absolute, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative URL, prefix with API base URL
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    return imageUrl.startsWith('/') ? `${API_URL}${imageUrl}` : `${API_URL}/${imageUrl}`;
  };

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

        // Process workspace data and convert image URL to absolute URL
        const processedWorkspace = {
          ...workspaceResponse,
          image_url: getFullImageUrl(workspaceResponse.image_url) || workspaceResponse.image_url
        };

        console.log('Original image URL:', workspaceResponse.image_url);
        console.log('Processed image URL:', processedWorkspace.image_url);

        // Enhance threads with statistics
        const threadsWithStats = await Promise.all(
          threadsResponse.map(async (thread: any) => {
            try {
              const stats = await getThreadStats(thread.id);
              return {
                ...thread,
                subscriber_count: stats.subscriber_count || 0,
                resource_count: stats.resource_count || 0,
                quiz_count: stats.quiz_count || 0,
                isSubscribed: stats.is_subscribed || false, // Assuming the API returns subscription status
              };
            } catch (err) {
              console.warn(`Failed to fetch stats for thread ${thread.id}:`, err);
              return {
                ...thread,
                subscriber_count: 0,
                resource_count: 0,
                quiz_count: 0,
                isSubscribed: false,
              };
            }
          })
        );

        setWorkspace(processedWorkspace);
        setThreads(threadsWithStats);
      } catch (err) {
        console.error("Error fetching workspace data:", err);
        setError("Failed to load workspace data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  // Helper function to show confirmation dialog
  const showConfirmationDialog = (
    title: string,
    message: string,
    action: () => Promise<void>,
    severity: 'warning' | 'error' | 'info' | 'success' = 'warning',
    confirmText: string = 'Confirm'
  ) => {
    setConfirmationDialog({
      open: true,
      title,
      message,
      action,
      severity,
      confirmText,
    });
  };

  // Handle confirmation dialog actions
  const handleConfirmationClose = () => {
    setConfirmationDialog(prev => ({ ...prev, open: false }));
  };

  const handleConfirmationConfirm = async () => {
    try {
      setConfirmationLoading(true);
      await confirmationDialog.action();
      setConfirmationDialog(prev => ({ ...prev, open: false }));
    } catch (err) {
      console.error('Error performing confirmed action:', err);
      setError('Failed to perform action. Please try again.');
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Check if user is the last admin
  const checkIfLastAdmin = (): boolean => {
    if (!workspace || workspace.role !== 'admin') {
      return false;
    }
    
    if (workspace.join_policy !== 'Invites') {
      return false;
    }

    // Check if there's only one admin using admin_ids array length
    return workspace.admin_ids && workspace.admin_ids.length === 1;
  };

  const handleRoleAction = async () => {
    if (!workspace || !workspaceId) return;
    
    // Handle specific actions that need confirmation
    if (workspace.role === 'requested') {
      showConfirmationDialog(
        'Cancel Join Request',
        `Are you sure you want to cancel your request to join "${workspace.title}"? You can submit a new request later.`,
        async () => {
          await cancelJoinRequest(workspaceId);
          setWorkspace((w) => w ? ({ ...w, role: 'user' }) : null);
        },
        'warning',
        'Cancel Request'
      );
      return;
    }

    if (workspace.role === 'member' || workspace.role === 'admin') {
      // Check if user is the last admin before allowing leave
      const isLastAdmin = checkIfLastAdmin();
      if (isLastAdmin) {
        showConfirmationDialog(
          'Cannot Leave Workspace',
          `You cannot leave "${workspace.title}" as you are the only admin and workspace is set to "Invite Only". Please assign another admin first or change the workspace join policy.`,
          async () => {
            // No action needed - this is just an informational dialog
          },
          'error',
          'Understood'
        );
        return;
      }
      
      showConfirmationDialog(
        'Leave Workspace',
        `Are you sure you want to leave "${workspace.title}"? You will lose access to all threads, resources, and discussions in this workspace.`,
        async () => {
          await leaveWorkspace(workspaceId);
          setWorkspace((w) => w ? ({ ...w, role: 'user' }) : null);
        },
        'error',
        'Leave Workspace'
      );
      return;
    }

    // Handle actions that don't need confirmation (direct joins, etc.)
    try {
      switch (workspace.role) {
        case 'user':
          if (workspace.join_policy === 'Anyone') {
            await joinWorkspace(workspaceId);
            setWorkspace((w) => w ? ({ ...w, role: 'member' }) : null);
          } else if (workspace.join_policy === 'Requests') {
            await sendJoinRequest(workspaceId);
            setWorkspace((w) => w ? ({ ...w, role: 'requested' }) : null);
          }
          break;
        case 'invited':
          await acceptInvite(workspaceId);
          setWorkspace((w) => w ? ({ ...w, role: 'member' }) : null);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing role action:', error);
      setError('Failed to perform action. Please try again.');
    }
  };

  const handleDeclineInvite = async () => {
    if (!workspace || !workspaceId) return;
    
    showConfirmationDialog(
      'Decline Invitation',
      `Are you sure you want to decline the invitation to join "${workspace.title}"? You won't be able to access this workspace unless invited again.`,
      async () => {
        await declineInvite(workspaceId);
        setWorkspace((w) => w ? ({ ...w, role: 'user' }) : null);
      },
      'warning',
      'Decline Invite'
    );
  };

  const handleEnrollThread = async (threadId: string, isCurrentlySubscribed: boolean) => {
    try {
      if (isCurrentlySubscribed) {
        await unsubscribeFromThread(threadId);
        setThreads((ths) =>
          ths.map((t) => (t.id === threadId ? { ...t, subscriber_count: Math.max(0, t.subscriber_count - 1), isSubscribed: false } : t))
        );
      } else {
        await subscribeToThread(threadId);
        setThreads((ths) =>
          ths.map((t) => (t.id === threadId ? { ...t, subscriber_count: t.subscriber_count + 1, isSubscribed: true } : t))
        );
      }
    } catch (error) {
      console.error('Error handling thread subscription:', error);
      setError('Failed to update subscription. Please try again.');
    }
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
                onError={(e) => {
                  console.error('Image failed to load:', workspace.image_url);
                  console.error('Error event:', e);
                  // Hide the image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', workspace.image_url);
                }}
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
              alignItems="flex-start"
              mt={{ xs: 2, md: 0 }}
              flexShrink={0}
              sx={{ position: 'relative', zIndex: 2 }}
            >
              <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                {/* Role-based action buttons */}
                <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
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
                    <>
                      <Button
                        variant="contained"
                        onClick={handleRoleAction}
                        startIcon={<Check />}
                        size="medium"
                        sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                      >
                        Accept Invite
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleDeclineInvite}
                        startIcon={<Cancel />}
                        size="medium"
                        sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                      >
                        Decline
                      </Button>
                    </>
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
                    <>
                      <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        size="medium"
                        onClick={() => setInviteModalOpen(true)}
                        sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                      >
                        Invite Users
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleRoleAction}
                        startIcon={<ExitToApp />}
                        size="medium"
                        sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
                      >
                        Leave
                      </Button>
                    </>
                  )}
                </Box>
                
                {/* Join Policy Text */}
                <Typography
                  variant="caption"
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    px: 0.5,
                    opacity: 0.8
                  }}
                >
                  Join Policy: {workspace.join_policy}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Navigation Cards Section */}
        {(workspace.role === 'member' || workspace.role === 'admin') && (
          <Box mb={4} mt={3}>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: '1fr',
                sm: workspace.role === 'admin' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                md: workspace.role === 'admin' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
              }}
              gap={2}
            >
              {/* Study Plan Card */}
              <Card
                component={Link}
                to={`/study-plan?workspaceId=${workspaceId}`}
                sx={{
                  p: 3,
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.25)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.35)',
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <MenuBook sx={{ fontSize: 28, mr: 1.5 }} />
                  <Typography variant="h6" fontWeight={700}>
                    Study Plan
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Organize learning schedule
                </Typography>
              </Card>

              {/* Forum Card */}
              <Card
                component={Link}
                to={`/workspace/${workspaceId}/forum`}
                sx={{
                  p: 3,
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
                  color: 'white',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(56, 142, 60, 0.25)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(56, 142, 60, 0.35)',
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Forum sx={{ fontSize: 28, mr: 1.5 }} />
                  <Typography variant="h6" fontWeight={700}>
                    Forum
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Discuss and collaborate
                </Typography>
              </Card>

              {/* Manage Workspace Card - Only for admins */}
              {workspace.role === 'admin' && (
                <Card
                  component={Link}
                  to={`/workspace/${workspaceId}/manage`}
                  sx={{
                    p: 3,
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
                    color: 'white',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(245, 124, 0, 0.25)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(245, 124, 0, 0.35)',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <GroupIcon sx={{ fontSize: 28, mr: 1.5 }} />
                    <Typography variant="h6" fontWeight={700}>
                      Manage Workspace
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                    Admin controls panel
                  </Typography>
                </Card>
              )}
            </Box>
          </Box>
        )}

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
                    <Box display="flex" flexDirection="column" gap={1}>
                      {/* Line 1: Thread Name */}
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ fontSize: '1.25rem' }}>
                          {t.name || t.title || 'Untitled Thread'}
                        </Typography>
                        {/* Show subscribe button only if user is member or admin */}
                        {(workspace?.role === 'member' || workspace?.role === 'admin') && (
                          <Button
                            variant={t.isSubscribed ? "outlined" : "contained"}
                            color={t.isSubscribed ? "inherit" : "primary"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrollThread(t.id, t.isSubscribed || false);
                            }}
                            size="small"
                            sx={{ flexShrink: 0, fontWeight: 700, borderRadius: 2, px: 2 }}
                          >
                            {t.isSubscribed ? "Unsubscribe" : "Subscribe"}
                          </Button>
                        )}
                      </Box>
                      
                      {/* Line 2: Description */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: "0.9rem", 
                          fontWeight: 500,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {t.description}
                      </Typography>
                      
                      {/* Line 3: Stats */}
                      <Box display="flex" alignItems="center" gap={3} mt={0.5}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <GroupIcon fontSize="small" sx={{ color: '#1976d2' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {t.subscriber_count} subscribers
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <School fontSize="small" sx={{ color: '#1976d2' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {t.resource_count} resources
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <MenuBook fontSize="small" sx={{ color: '#1976d2' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {t.quiz_count || 0} quizzes
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  }
                  sx={{ pb: 1 }}
                />
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Invite Members Modal */}
      {workspace && (
        <InviteMembersModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          workspaceId={workspace.id}
          workspaceTitle={workspace.title}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        severity={confirmationDialog.severity}
        confirmText={confirmationDialog.confirmText}
        loading={confirmationLoading}
      />
    </Box>
  );
}