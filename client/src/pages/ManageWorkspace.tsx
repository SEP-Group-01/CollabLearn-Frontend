import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Forum as ForumIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  MailOutline as MailIcon,
  Quiz as QuizIcon,
  Folder as ResourceIcon,
  Visibility as ViewIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  SupervisorAccount as ModeratorIcon,
  HowToReg as RequestIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
} from '@mui/icons-material';
import SidebarComponent from '../components/SideBar';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DragDropImageUpload from '../components/DragDropImageUpload';
import { 
  getWorkspace, 
  updateWorkspace, 
  getWorkspaceMembers,
  removeMember,
  promoteToAdmin,
  removeAdminRole,
  getWorkspaceJoinRequests,
  approveJoinRequest,
  rejectJoinRequest
} from '../api/workspacesApi';
import { 
  createThread, 
  getThreadsByWorkspace, 
  updateThread, 
  deleteThread,
  getThreadSubscribers,
  assignModerators,
  removeModerators,
  getThreadStats
} from '../api/threadsApi';
import type { Workspace } from '../types/WorkspaceInterfaces';

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  joinedAt: string;
  avatar?: string;
}

interface WorkspaceThread {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  subscriberCount: number;
  resourceCount: number;
  quizCount: number;
  moderators?: string[];
}

interface ThreadSubscriber {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isModerator: boolean;
}

interface NewThreadData {
  name: string;
  description: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ManageWorkspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Workspace data
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [threads, setThreads] = useState<WorkspaceThread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);

  // Utility function to convert relative image URLs to absolute URLs and handle Google Images URLs
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
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return imageUrl.startsWith('/') ? `${API_URL}${imageUrl}` : `${API_URL}/${imageUrl}`;
  };
  
  // Editing states
  const [editingWorkspace, setEditingWorkspace] = useState(false);
  const [editingThread, setEditingThread] = useState<string | null>(null);
  const [threadEditData, setThreadEditData] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });
  const [workspaceFormData, setWorkspaceFormData] = useState({
    title: '',
    description: '',
    joinPolicy: 'Anyone' as 'Anyone' | 'Requests' | 'Invites',
    image: null as File | null,
    tags: [] as string[],
  });
  
  // Thread creation
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [newThreadData, setNewThreadData] = useState<NewThreadData>({
    name: '',
    description: '',
  });
  const [createThreadLoading, setCreateThreadLoading] = useState(false);
  
  // Tag management
  const [currentTag, setCurrentTag] = useState('');
  
  // Thread deletion
  const [deleteThreadDialog, setDeleteThreadDialog] = useState<{
    open: boolean;
    thread: WorkspaceThread | null;
    confirmText: string;
  }>({
    open: false,
    thread: null,
    confirmText: '',
  });
  
  // Moderator assignment
  const [moderatorDialog, setModeratorDialog] = useState<{
    open: boolean;
    thread: WorkspaceThread | null;
    subscribers: ThreadSubscriber[];
    selectedModerators: string[];
    selectedForPromotion: string[];
    selectedForRemoval: string[];
    loading: boolean;
  }>({
    open: false,
    thread: null,
    subscribers: [],
    selectedModerators: [],
    selectedForPromotion: [],
    selectedForRemoval: [],
    loading: false,
  });
  
  // Confirmation dialog
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

  // Join requests management
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(false);
  const [joinRequestDialog, setJoinRequestDialog] = useState<{
    open: boolean;
    request: JoinRequest | null;
    action: 'approve' | 'reject';
  }>({
    open: false,
    request: null,
    action: 'approve',
  });

  // Fetch workspace data
  useEffect(() => {
    const fetchData = async () => {
      if (!workspaceId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [workspaceData, membersData] = await Promise.all([
          getWorkspace(workspaceId),
          getWorkspaceMembers(workspaceId),
        ]);
        
        // Check if user is admin
        if (workspaceData.role !== 'admin') {
          setError('You do not have permission to manage this workspace');
          return;
        }
        
        setWorkspace(workspaceData);
        
        // Process workspace image URL
        if (workspaceData.image_url) {
          const processedImageUrl = getFullImageUrl(workspaceData.image_url);
          console.log('Original image URL:', workspaceData.image_url);
          console.log('Processed image URL:', processedImageUrl);
          setWorkspace(prev => prev ? { ...prev, image_url: processedImageUrl || workspaceData.image_url } : null);
        }
        
        // Ensure members is always an array
        if (Array.isArray(membersData)) {
          setMembers(membersData);
        } else if (membersData && Array.isArray(membersData.members)) {
          setMembers(membersData.members);
        } else {
          console.warn('Invalid members data received:', membersData);
          setMembers([]);
        }
        
        // Fetch threads
        await fetchThreads();
        
        // Fetch join requests
        await fetchJoinRequests();
        
        // Initialize form data
        setWorkspaceFormData({
          title: workspaceData.title,
          description: workspaceData.description,
          joinPolicy: workspaceData.join_policy,
          image: null,
          tags: workspaceData.tags || [],
        });
        
      } catch (err) {
        console.error('Error fetching workspace data:', err);
        setError('Failed to load workspace data');
        // Ensure members is always an array even on error
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [workspaceId]);

  // Fetch threads with statistics
  const fetchThreads = async () => {
    if (!workspaceId) return;
    
    try {
      setThreadsLoading(true);
      const threadsData = await getThreadsByWorkspace(workspaceId);
      
      // Enhance threads with statistics
      const threadsWithStats = await Promise.all(
        threadsData.map(async (thread: any) => {
          try {
            const stats = await getThreadStats(thread.id);
            return {
              ...thread,
              subscriberCount: stats.subscriber_count || 0,
              resourceCount: stats.resource_count || 0,
              quizCount: stats.quiz_count || 0,
            };
          } catch (err) {
            console.warn(`Failed to fetch stats for thread ${thread.id}:`, err);
            return {
              ...thread,
              subscriberCount: 0,
              resourceCount: 0,
              quizCount: 0,
            };
          }
        })
      );
      
      setThreads(threadsWithStats);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setThreads([]);
    } finally {
      setThreadsLoading(false);
    }
  };

  // Fetch join requests
  const fetchJoinRequests = async () => {
    if (!workspaceId) return;
    
    try {
      setJoinRequestsLoading(true);
      const requestsData = await getWorkspaceJoinRequests(workspaceId);
      setJoinRequests(requestsData);
    } catch (err) {
      console.error('Error fetching join requests:', err);
      setJoinRequests([]);
    } finally {
      setJoinRequestsLoading(false);
    }
  };

  // Show confirmation dialog
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

  // Handle workspace update
  const handleUpdateWorkspace = async () => {
    if (!workspace || !workspaceId) return;
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('title', workspaceFormData.title);
      formData.append('description', workspaceFormData.description);
      formData.append('joinPolicy', workspaceFormData.joinPolicy);
      formData.append('tags', JSON.stringify(workspaceFormData.tags));
      
      if (workspaceFormData.image) {
        formData.append('image', workspaceFormData.image);
      }
      
      const updatedWorkspace = await updateWorkspace(workspaceId, formData);
      setWorkspace(updatedWorkspace);
      setEditingWorkspace(false);
      
    } catch (err) {
      console.error('Error updating workspace:', err);
      setError('Failed to update workspace');
    } finally {
      setLoading(false);
    }
  };

  // Handle thread creation
  const handleCreateThread = async () => {
    if (!workspaceId || !newThreadData.name.trim()) return;
    
    try {
      setCreateThreadLoading(true);
      await createThread(workspaceId, newThreadData);
      
      // Reset form and close dialog
      setNewThreadData({ name: '', description: '' });
      setShowCreateThread(false);
      
      // Refresh threads
      await fetchThreads();
      
    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread');
    } finally {
      setCreateThreadLoading(false);
    }
  };

  // Handle thread edit
  const handleEditThread = (thread: WorkspaceThread) => {
    setEditingThread(thread.id);
    setThreadEditData({
      name: thread.name,
      description: thread.description,
    });
  };

  // Handle thread update
  const handleUpdateThread = async (threadId: string) => {
    try {
      await updateThread(threadId, threadEditData);
      setEditingThread(null);
      await fetchThreads();
    } catch (err) {
      console.error('Error updating thread:', err);
      setError('Failed to update thread');
    }
  };

  // Handle thread deletion
  const handleDeleteThread = (thread: WorkspaceThread) => {
    setDeleteThreadDialog({
      open: true,
      thread,
      confirmText: '',
    });
  };

  const confirmDeleteThread = async () => {
    const { thread, confirmText } = deleteThreadDialog;
    if (!thread || confirmText !== thread.name) return;
    
    try {
      await deleteThread(thread.id);
      setDeleteThreadDialog({ open: false, thread: null, confirmText: '' });
      await fetchThreads();
    } catch (err) {
      console.error('Error deleting thread:', err);
      setError('Failed to delete thread');
    }
  };

  // Handle moderator assignment
  const handleAssignModerators = async (thread: WorkspaceThread) => {
    try {
      setModeratorDialog(prev => ({ ...prev, loading: true }));
      const subscribersData = await getThreadSubscribers(thread.id);
      
      console.log('Raw subscribers data:', subscribersData);
      
      // Transform the backend data structure to match our interface
      const transformedSubscribers = (subscribersData || []).map((sub: any) => {
        const userId = sub.user_id || sub.users?.id;
        const firstName = sub.users?.first_name || '';
        const lastName = sub.users?.last_name || '';
        const name = `${firstName} ${lastName}`.trim() || 'Unknown User';
        
        return {
          id: userId,
          name: name,
          email: sub.users?.email || '',
          avatar: sub.users?.avatar,
          isModerator: sub.isModerator || false, // Read from top level, not nested
        };
      });
      
      console.log('Transformed subscribers:', transformedSubscribers);
      
      setModeratorDialog({
        open: true,
        thread,
        subscribers: transformedSubscribers,
        selectedModerators: thread.moderators || [],
        selectedForPromotion: [],
        selectedForRemoval: [],
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError('Failed to load subscribers');
      setModeratorDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const confirmAssignModerators = async () => {
    const { thread, selectedForPromotion } = moderatorDialog;
    if (!thread || selectedForPromotion.length === 0) return;
    
    try {
      await assignModerators(thread.id, selectedForPromotion);
      setModeratorDialog({
        open: false,
        thread: null,
        subscribers: [],
        selectedModerators: [],
        selectedForPromotion: [],
        selectedForRemoval: [],
        loading: false,
      });
      await fetchThreads();
    } catch (err) {
      console.error('Error assigning moderators:', err);
      setError('Failed to assign moderators');
    }
  };

  const confirmRemoveModerators = async () => {
    const { thread, selectedForRemoval } = moderatorDialog;
    if (!thread || selectedForRemoval.length === 0) return;
    
    try {
      await removeModerators(thread.id, selectedForRemoval);
      setModeratorDialog({
        open: false,
        thread: null,
        subscribers: [],
        selectedModerators: [],
        selectedForPromotion: [],
        selectedForRemoval: [],
        loading: false,
      });
      await fetchThreads();
    } catch (err) {
      console.error('Error removing moderators:', err);
      setError('Failed to remove moderators');
    }
  };

  // Handle member removal
  const handleRemoveMember = (member: WorkspaceMember) => {
    showConfirmationDialog(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from this workspace? They will lose access to all threads and resources.`,
      async () => {
        await removeMember(workspaceId!, member.id);
        setMembers(prev => Array.isArray(prev) ? prev.filter(m => m.id !== member.id) : []);
      },
      'error',
      'Remove Member'
    );
  };

  // Handle admin promotion
  const handlePromoteToAdmin = (member: WorkspaceMember) => {
    showConfirmationDialog(
      'Promote to Admin',
      `Are you sure you want to promote ${member.name} to admin? They will have full management access to this workspace.`,
      async () => {
        await promoteToAdmin(workspaceId!, member.id);
        setMembers(prev => 
          prev.map(m => m.id === member.id ? { ...m, role: 'admin' } : m)
        );
      },
      'warning',
      'Promote to Admin'
    );
  };

  // Handle admin removal
  const handleRemoveAdmin = (member: WorkspaceMember) => {
    // Check if this is the last admin
    const adminCount = Array.isArray(members) ? members.filter(m => m.role === 'admin').length : 0;
    if (adminCount === 1) {
      showConfirmationDialog(
        'Cannot Remove Admin',
        `${member.name} is the only admin in this workspace. Please promote another member to admin first before removing admin privileges.`,
        async () => {
          // No action needed - this is just an informational dialog
        },
        'error',
        'Understood'
      );
      return;
    }
    
    showConfirmationDialog(
      'Remove Admin Privileges',
      `Are you sure you want to remove admin privileges from ${member.name}? They will become a regular member.`,
      async () => {
        await removeAdminRole(workspaceId!, member.id);
        setMembers(prev => 
          Array.isArray(prev) ? prev.map(m => m.id === member.id ? { ...m, role: 'member' } : m) : []
        );
      },
      'warning',
      'Remove Admin'
    );
  };

  // Handle join request approval
  const handleApproveJoinRequest = (request: JoinRequest) => {
    setJoinRequestDialog({
      open: true,
      request,
      action: 'approve',
    });
  };

  // Handle join request rejection
  const handleRejectJoinRequest = (request: JoinRequest) => {
    setJoinRequestDialog({
      open: true,
      request,
      action: 'reject',
    });
  };

  // Confirm join request action
  const confirmJoinRequestAction = async () => {
    const { request, action } = joinRequestDialog;
    if (!request || !workspaceId) return;

    try {
      if (action === 'approve') {
        await approveJoinRequest(workspaceId, request.id);
      } else {
        await rejectJoinRequest(workspaceId, request.id);
      }
      
      // Refresh join requests and members
      await fetchJoinRequests();
      if (action === 'approve') {
        // Refresh members list as well since we added a new member
        const membersData = await getWorkspaceMembers(workspaceId);
        if (Array.isArray(membersData)) {
          setMembers(membersData);
        } else if (membersData && Array.isArray(membersData.members)) {
          setMembers(membersData.members);
        }
      }
      
      setJoinRequestDialog({ open: false, request: null, action: 'approve' });
    } catch (err) {
      console.error(`Error ${action}ing join request:`, err);
      setError(`Failed to ${action} join request`);
    }
  };

  // Tag management functions
  const handleAddTag = () => {
    if (currentTag.trim() && !workspaceFormData.tags.includes(currentTag.trim())) {
      setWorkspaceFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setWorkspaceFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  if (loading) {
    return (
      <Box display="flex">
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box
          component="main"
          flexGrow={1}
          p={4}
          sx={{
            ml: collapsed ? { xs: 0, md: "80px" } : { xs: 0, md: "240px" },
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

  if (error) {
    return (
      <Box display="flex">
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box
          component="main"
          flexGrow={1}
          p={4}
          sx={{
            ml: collapsed ? { xs: 0, md: "80px" } : { xs: 0, md: "240px" },
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (!workspace) return null;

  const joinPolicyOptions = [
    {
      value: 'Anyone',
      label: 'Anyone can join',
      description: 'Public workspace - anyone can join immediately',
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
    },
    {
      value: 'Requests',
      label: 'Join by request',
      description: 'Users must request to join and be approved',
      icon: <MailIcon sx={{ fontSize: 20 }} />,
    },
    {
      value: 'Invites',
      label: 'Invite only',
      description: 'Only invited users can join',
      icon: <LockIcon sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <Box display="flex">
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box
        component="main"
        flexGrow={1}
        p={{ xs: 2, md: 4 }}
        sx={{
          ml: collapsed ? { xs: 0, md: "80px" } : { xs: 0, md: "240px" },
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <IconButton 
            onClick={() => navigate(`/workspace/${workspaceId}`)}
            sx={{ 
              bgcolor: "action.hover",
              '&:hover': { bgcolor: "action.selected" }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Manage Workspace
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {workspace.title}
            </Typography>
          </Box>
        </Box>

        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
            mb: 3,
            alignItems: 'stretch',
          }}
        >
          {/* Workspace Settings */}
          <Box>
            <Card sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={2}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Workspace Settings
                    </Typography>
                  </Box>
                }
                action={
                  !editingWorkspace && (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditingWorkspace(true)}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                {editingWorkspace ? (
                  <Stack spacing={3}>
                    <TextField
                      label="Workspace Title"
                      value={workspaceFormData.title}
                      onChange={(e) => setWorkspaceFormData(prev => ({ ...prev, title: e.target.value }))}
                      fullWidth
                      required
                    />
                    
                    <TextField
                      label="Description"
                      value={workspaceFormData.description}
                      onChange={(e) => setWorkspaceFormData(prev => ({ ...prev, description: e.target.value }))}
                      multiline
                      rows={3}
                      fullWidth
                    />

                    <DragDropImageUpload
                      onImageUpload={(file: File) => setWorkspaceFormData(prev => ({ ...prev, image: file }))}
                      currentImage={workspaceFormData.image}
                      label="Upload workspace image"
                      height="180px"
                      dragOverId="workspace-image"
                      isDragOver={false}
                      onDragOver={() => {}}
                      onDragLeave={() => {}}
                      onDrop={() => {}}
                    />

                    {/* Tags Management */}
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Tags
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add tags to help others find your workspace
                      </Typography>
                      
                      {/* Add new tag */}
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          placeholder="Add a tag..."
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleAddTag}
                                  disabled={!currentTag.trim()}
                                  sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    '&:disabled': { bgcolor: 'grey.300' },
                                  }}
                                  size="small"
                                >
                                  <AddIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>

                      {/* Display current tags */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {workspaceFormData.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            color="primary"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              '& .MuiChip-deleteIcon': {
                                '&:hover': { color: 'error.main' },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <FormControl>
                      <Typography variant="h6" gutterBottom>
                        Join Policy
                      </Typography>
                      <RadioGroup
                        value={workspaceFormData.joinPolicy}
                        onChange={(e) => setWorkspaceFormData(prev => ({ ...prev, joinPolicy: e.target.value as any }))}
                      >
                        {joinPolicyOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={
                              <Box display="flex" alignItems="center" gap={1.5} py={0.5}>
                                {option.icon}
                                <Box>
                                  <Typography variant="body1" fontWeight={500}>
                                    {option.label}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {option.description}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{ 
                              alignItems: 'flex-start',
                              py: 1,
                              px: 2,
                              m: 0,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: workspaceFormData.joinPolicy === option.value ? 'primary.main' : 'divider',
                              bgcolor: workspaceFormData.joinPolicy === option.value ? 'action.selected' : 'transparent',
                              mb: 1,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleUpdateWorkspace}
                        disabled={!workspaceFormData.title.trim()}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditingWorkspace(false);
                          setWorkspaceFormData({
                            title: workspace.title,
                            description: workspace.description,
                            joinPolicy: workspace.join_policy,
                            image: null,
                            tags: workspace.tags || [],
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {workspace.image_url && (
                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Workspace Image
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            height: '180px',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.50',
                          }}
                        >
                          <img
                            src={workspace.image_url}
                            alt="Workspace"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              console.error('Workspace image failed to load:', workspace.image_url);
                              // Replace with a placeholder or hide the container
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show a placeholder message
                              const container = target.parentElement;
                              if (container) {
                                container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #666; font-size: 14px;">Image not available</div>';
                              }
                            }}
                            onLoad={() => {
                              console.log('Workspace image loaded successfully:', workspace.image_url);
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Title
                      </Typography>
                      <Typography variant="h6">
                        {workspace.title}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {workspace.description || 'No description provided'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Join Policy
                      </Typography>
                      <Chip 
                        label={workspace.join_policy}
                        icon={joinPolicyOptions.find(opt => opt.value === workspace.join_policy)?.icon}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    
                    {/* Tags Display */}
                    {workspace.tags && workspace.tags.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Tags
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {workspace.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              color="primary"
                              variant="filled"
                              sx={{ borderRadius: 2 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Members
                      </Typography>
                      <Typography variant="h6">
                        {workspace.members_count}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Right Column: Members and Join Requests stacked vertically */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            {/* Member Management - Top Half */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={2}>
                    <GroupIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Members ({Array.isArray(members) ? members.length : 0})
                    </Typography>
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ p: 0, flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(members) && members.length > 0 ? (
                        members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {member.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {member.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {member.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={member.role}
                                size="small"
                                color={member.role === 'admin' ? 'primary' : 'default'}
                                icon={member.role === 'admin' ? <AdminIcon /> : undefined}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={0.5}>
                                {member.role === 'member' ? (
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePromoteToAdmin(member)}
                                    title="Promote to Admin"
                                  >
                                    <PersonAddIcon fontSize="small" />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveAdmin(member)}
                                    title="Remove Admin Privileges"
                                  >
                                    <AdminIcon fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveMember(member)}
                                  title="Remove Member"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="text.secondary" py={2}>
                              {loading ? 'Loading members...' : 'No members found'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                </Box>
              </CardContent>
            </Card>

            {/* Join Requests Management - Bottom Half */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={2}>
                    <RequestIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Join Requests ({joinRequests.length})
                    </Typography>
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ p: 0, flexGrow: 1, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                {workspace.join_policy !== 'Requests' && joinRequests.length === 0 ? (
                  <Box textAlign="center" py={4} px={3}>
                    <RequestIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Join Policy Not Set to Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set the workspace join policy to "Join by request" to receive join requests from users.
                    </Typography>
                  </Box>
                ) : joinRequestsLoading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : joinRequests.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Requested</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {joinRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {request.userName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {request.userName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {request.userEmail}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(request.requestedAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleApproveJoinRequest(request)}
                                  title="Approve Request"
                                  color="success"
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRejectJoinRequest(request)}
                                  title="Reject Request"
                                  color="error"
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box textAlign="center" py={4} px={3}>
                    <RequestIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Join Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workspace.join_policy === 'Requests' 
                        ? 'No pending join requests at the moment.'
                        : 'Join requests will appear here when users request to join this workspace.'
                      }
                    </Typography>
                  </Box>
                )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Thread Management - Full Width */}
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={2}>
                  <ForumIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Thread Management ({threads.length})
                  </Typography>
                </Box>
              }
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateThread(true)}
                >
                  Create Thread
                </Button>
              }
            />
            <CardContent>
              {threadsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : threads.length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2,
                  }}
                >
                  {threads.map((thread) => (
                    <Card key={thread.id} variant="outlined" sx={{ p: 0 }}>
                      <CardContent>
                        {editingThread === thread.id ? (
                          <Stack spacing={2}>
                            <TextField
                              size="small"
                              value={threadEditData.name}
                              onChange={(e) => setThreadEditData(prev => ({ ...prev, name: e.target.value }))}
                              fullWidth
                              autoFocus
                            />
                            <TextField
                              size="small"
                              value={threadEditData.description}
                              onChange={(e) => setThreadEditData(prev => ({ ...prev, description: e.target.value }))}
                              multiline
                              rows={2}
                              fullWidth
                            />
                            <Box display="flex" gap={1}>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<CheckIcon />}
                                onClick={() => handleUpdateThread(thread.id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CloseIcon />}
                                onClick={() => setEditingThread(null)}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Stack>
                        ) : (
                          <>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                                {thread.name}
                              </Typography>
                              <Box display="flex" gap={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditThread(thread)}
                                  title="Edit Thread"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleAssignModerators(thread)}
                                  title="Assign Moderators"
                                >
                                  <ModeratorIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteThread(thread)}
                                  title="Delete Thread"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ mb: 2, lineHeight: 1.4 }}
                            >
                              {thread.description || 'No description provided'}
                            </Typography>
                            
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 1,
                              }}
                            >
                              <Box textAlign="center">
                                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                  <PeopleIcon fontSize="small" color="action" />
                                  <Typography variant="h6" fontWeight="bold">
                                    {thread.subscriberCount}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Subscribers
                                </Typography>
                              </Box>
                              
                              <Box textAlign="center">
                                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                  <ResourceIcon fontSize="small" color="action" />
                                  <Typography variant="h6" fontWeight="bold">
                                    {thread.resourceCount}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Resources
                                </Typography>
                              </Box>
                              
                              <Box textAlign="center">
                                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                  <QuizIcon fontSize="small" color="action" />
                                  <Typography variant="h6" fontWeight="bold">
                                    {thread.quizCount}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Quizzes
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Button
                              size="small"
                              startIcon={<ViewIcon />}
                              sx={{ mt: 2 }}
                              onClick={() => navigate(`/workspace/${workspaceId}/threads/${thread.id}`)}
                              fullWidth
                            >
                              View Thread
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <ForumIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Threads Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first thread to start discussions and share learning resources.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Create Thread Dialog */}
        <Dialog
          open={showCreateThread}
          onClose={() => setShowCreateThread(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Thread</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Thread Name"
                value={newThreadData.name}
                onChange={(e) => setNewThreadData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={newThreadData.description}
                onChange={(e) => setNewThreadData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateThread(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateThread}
              disabled={!newThreadData.name.trim() || createThreadLoading}
            >
              {createThreadLoading ? <CircularProgress size={20} /> : 'Create Thread'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Thread Dialog */}
        <Dialog
          open={deleteThreadDialog.open}
          onClose={() => setDeleteThreadDialog({ open: false, thread: null, confirmText: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Thread</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Alert severity="error">
                <Typography variant="h6" gutterBottom>
                  This action cannot be undone!
                </Typography>
                <Typography variant="body2">
                  Deleting this thread will permanently remove all discussions, resources, and quizzes associated with it.
                </Typography>
              </Alert>
              
              {deleteThreadDialog.thread && (
                <>
                  <Typography variant="body1">
                    Please type <strong>"{deleteThreadDialog.thread.name}"</strong> to confirm deletion:
                  </Typography>
                  <TextField
                    value={deleteThreadDialog.confirmText}
                    onChange={(e) => setDeleteThreadDialog(prev => ({ ...prev, confirmText: e.target.value }))}
                    placeholder="Enter thread name"
                    fullWidth
                    error={deleteThreadDialog.confirmText !== '' && deleteThreadDialog.confirmText !== deleteThreadDialog.thread.name}
                    helperText={
                      deleteThreadDialog.confirmText !== '' && deleteThreadDialog.confirmText !== deleteThreadDialog.thread.name
                        ? "Thread name doesn't match"
                        : ""
                    }
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteThreadDialog({ open: false, thread: null, confirmText: '' })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteThread}
              disabled={!deleteThreadDialog.thread || deleteThreadDialog.confirmText !== deleteThreadDialog.thread.name}
            >
              Delete Thread
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Moderators Dialog */}
        <Dialog
          open={moderatorDialog.open}
          onClose={() => setModeratorDialog({ open: false, thread: null, subscribers: [], selectedModerators: [], selectedForPromotion: [], selectedForRemoval: [], loading: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Manage Thread Moderators</DialogTitle>
          <DialogContent>
            {moderatorDialog.loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={4} sx={{ mt: 1 }}>
                {/* Current Moderators Section */}
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Current Moderators
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    These members are currently moderators. Select moderators to remove their privileges.
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            {/* Select All checkbox for removal */}
                          </TableCell>
                          <TableCell>Moderator</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {moderatorDialog.subscribers.filter(sub => sub.isModerator).length > 0 ? (
                          moderatorDialog.subscribers
                            .filter(subscriber => subscriber.isModerator)
                            .map((moderator) => (
                              <TableRow key={moderator.id}>
                                <TableCell padding="checkbox">
                                  <Box
                                    component="input"
                                    type="checkbox"
                                    checked={moderatorDialog.selectedForRemoval.includes(moderator.id)}
                                    onChange={(e: any) => {
                                      const isChecked = e.target.checked;
                                      setModeratorDialog(prev => ({
                                        ...prev,
                                        selectedForRemoval: isChecked
                                          ? [...prev.selectedForRemoval, moderator.id]
                                          : prev.selectedForRemoval.filter(id => id !== moderator.id)
                                      }));
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                      {moderator.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" fontWeight={500}>
                                        {moderator.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {moderator.email}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label="Moderator"
                                      size="small"
                                      color="primary"
                                      icon={<ModeratorIcon />}
                                      sx={{ ml: 'auto' }}
                                    />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              <Typography variant="body2" color="text.secondary" py={2}>
                                No moderators assigned to this thread
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Remove Moderators Button */}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={confirmRemoveModerators}
                      disabled={moderatorDialog.loading || moderatorDialog.selectedForRemoval.length === 0}
                      startIcon={<DeleteIcon />}
                    >
                      {moderatorDialog.selectedForRemoval.length > 0 
                        ? `Remove Selected (${moderatorDialog.selectedForRemoval.length})`
                        : 'Remove Moderators'
                      }
                    </Button>
                  </Box>
                </Box>

                <Divider />

                {/* Regular Subscribers Section */}
                <Box>
                  <Typography variant="h6" gutterBottom color="secondary">
                    Thread Subscribers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select subscribers to promote them to moderators.
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            {/* Select All checkbox for promotion */}
                          </TableCell>
                          <TableCell>Subscriber</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {moderatorDialog.subscribers.filter(sub => !sub.isModerator).length > 0 ? (
                          moderatorDialog.subscribers
                            .filter(subscriber => !subscriber.isModerator)
                            .map((subscriber) => (
                              <TableRow key={subscriber.id}>
                                <TableCell padding="checkbox">
                                  <Box
                                    component="input"
                                    type="checkbox"
                                    checked={moderatorDialog.selectedForPromotion.includes(subscriber.id)}
                                    onChange={(e: any) => {
                                      const isChecked = e.target.checked;
                                      setModeratorDialog(prev => ({
                                        ...prev,
                                        selectedForPromotion: isChecked
                                          ? [...prev.selectedForPromotion, subscriber.id]
                                          : prev.selectedForPromotion.filter(id => id !== subscriber.id)
                                      }));
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                      {subscriber.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" fontWeight={500}>
                                        {subscriber.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {subscriber.email}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label="Member"
                                      size="small"
                                      color="default"
                                      sx={{ ml: 'auto' }}
                                    />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              <Typography variant="body2" color="text.secondary" py={2}>
                                No regular subscribers found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Assign Moderators Button */}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      onClick={confirmAssignModerators}
                      disabled={moderatorDialog.loading || moderatorDialog.selectedForPromotion.length === 0}
                      startIcon={<PersonAddIcon />}
                    >
                      {moderatorDialog.selectedForPromotion.length > 0 
                        ? `Assign as Moderators (${moderatorDialog.selectedForPromotion.length})`
                        : 'Assign Moderators'
                      }
                    </Button>
                  </Box>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModeratorDialog({ open: false, thread: null, subscribers: [], selectedModerators: [], selectedForPromotion: [], selectedForRemoval: [], loading: false })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Join Request Action Dialog */}
        <Dialog
          open={joinRequestDialog.open}
          onClose={() => setJoinRequestDialog({ open: false, request: null, action: 'approve' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {joinRequestDialog.action === 'approve' ? 'Approve Join Request' : 'Reject Join Request'}
          </DialogTitle>
          <DialogContent>
            {joinRequestDialog.request && (
              <Box>
                <Typography variant="body1" gutterBottom>
                  {joinRequestDialog.action === 'approve' 
                    ? `Are you sure you want to approve the join request from ${joinRequestDialog.request.userName}?`
                    : `Are you sure you want to reject the join request from ${joinRequestDialog.request.userName}?`
                  }
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {joinRequestDialog.request.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {joinRequestDialog.request.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {joinRequestDialog.request.userEmail}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Requested: {new Date(joinRequestDialog.request.requestedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                {joinRequestDialog.action === 'approve' && (
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    This user will be added as a member of the workspace and will have access to all public threads.
                  </Typography>
                )}
                {joinRequestDialog.action === 'reject' && (
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    This request will be permanently deleted and the user will not be notified.
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinRequestDialog({ open: false, request: null, action: 'approve' })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color={joinRequestDialog.action === 'approve' ? 'success' : 'error'}
              onClick={confirmJoinRequestAction}
              startIcon={joinRequestDialog.action === 'approve' ? <ApproveIcon /> : <RejectIcon />}
            >
              {joinRequestDialog.action === 'approve' ? 'Approve Request' : 'Reject Request'}
            </Button>
          </DialogActions>
        </Dialog>

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
    </Box>
  );
}