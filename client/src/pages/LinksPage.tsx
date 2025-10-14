import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CardMedia, 
  Avatar,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Fab
} from "@mui/material";
import { 
  ArrowBack, 
  PlayCircle, 
  OpenInNew, 
  Language, 
  YouTube,
  Article,
  School,
  Code,
  Add,
  Close,
  Link
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useResourceActions } from '../hooks/useResourceActions';
import type { Link as LinkType } from '../types/ThreadInterfaces';

// YouTube Thumbnail Component with fallback handling
const YouTubeThumbnail = ({ videoId, onClick }: { videoId: string; onClick: () => void }) => {
  const [currentSrc, setCurrentSrc] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const thumbnailUrls = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/default.jpg`
  ];

  const handleImageError = () => {
    console.log(`❌ Failed to load thumbnail: ${thumbnailUrls[currentSrc]}`);
    if (currentSrc < thumbnailUrls.length - 1) {
      console.log(`🔄 Trying next thumbnail quality: ${thumbnailUrls[currentSrc + 1]}`);
      setCurrentSrc(currentSrc + 1);
    } else {
      console.log('🎯 Using fallback icon-based thumbnail');
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log(`✅ Successfully loaded thumbnail: ${thumbnailUrls[currentSrc]}`);
  };

  if (imageError) {
    // Fallback to icon-based thumbnail
    return (
      <CardMedia
        component="div"
        sx={{
          height: 200,
          position: 'relative',
          background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        <YouTube sx={{ color: 'white', fontSize: 64 }} />
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            p: 1,
            borderRadius: 1,
            fontSize: '0.75rem',
            textAlign: 'center'
          }}
        >
          YouTube Video
        </Box>
      </CardMedia>
    );
  }

  return (
    <CardMedia
      component="img"
      height="200"
      image={thumbnailUrls[currentSrc]}
      onError={handleImageError}
      onLoad={handleImageLoad}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        objectFit: 'cover',
        position: 'relative'
      }}
    />
  );
};

export default function LinksPage() {
  const { workspaceId, threadId } = useParams();
  const navigate = useNavigate();
  
  // Validation state
  const [validationError, setValidationError] = useState('');
  
  // Check if IDs are provided and valid
  useEffect(() => {
    if (!workspaceId || !threadId) {
      setValidationError('Missing workspace ID or thread ID in URL');
      return;
    }
    
    // Basic ID validation - ensure they exist and are reasonable length
    if (workspaceId.length < 10 || threadId.length < 10) {
      console.warn('⚠️ Workspace ID or Thread ID seems too short:', { workspaceId, threadId });
    }
    
    console.log('📍 Current route params:', { workspaceId, threadId });
    setValidationError(''); // Clear any previous validation errors
  }, [workspaceId, threadId]);
  
  // Real API integration
  const { 
    handleLinkCreate, 
    fetchLinks, 
    uploading, 
    error, 
    clearError 
  } = useResourceActions(workspaceId || '', threadId || '');
  
  // State for real links from API
  const [realLinks, setRealLinks] = useState<LinkType[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  
  // Dialog state
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });

  // Load links from API on component mount
  useEffect(() => {
    const loadLinks = async () => {
      console.log('🔄 Loading links for workspace:', workspaceId, 'thread:', threadId);
      setLoadingLinks(true);
      setRealLinks([]); // Clear existing links first
      
      try {
        const links = await fetchLinks();
        console.log('📦 Raw API response:', links);
        setRealLinks(links);
        console.log('✅ Links loaded successfully:', links.length, 'links found');
        console.log('📋 Links data:', links.map(link => ({ id: link.id, title: link.title, url: link.url })));
        
        if (links.length === 0) {
          console.log('ℹ️ No links found in database for this workspace/thread combination');
          console.log('💡 Try adding a link using the "Add Link" button to test the functionality');
        }
      } catch (err) {
        console.error('❌ Failed to load links:', err);
        console.error('🔍 Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          workspaceId,
          threadId,
          timestamp: new Date().toISOString()
        });
        
        // Show user-friendly error message
        if (err instanceof Error && 'response' in err) {
          const axiosError = err as Error & { response?: { status?: number; data?: unknown } };
          if (axiosError.response?.status === 404) {
            console.warn('⚠️ Workspace or thread not found - this might be a new workspace/thread');
          } else if (axiosError.response?.status && axiosError.response.status >= 500) {
            console.error('🚨 Server error - backend might be down');
          }
        }
      } finally {
        setLoadingLinks(false);
      }
    };
    
    if (workspaceId && threadId) {
      loadLinks();
    } else {
      console.warn('⚠️ Missing workspace ID or thread ID, skipping link loading');
    }
  }, [fetchLinks, workspaceId, threadId]);

  // Manual refresh function
  const handleRefreshLinks = async () => {
    console.log('🔄 Manual refresh triggered');
    setLoadingLinks(true);
    setRealLinks([]); // Clear current links
    
    try {
      const links = await fetchLinks();
      setRealLinks(links);
      console.log('✅ Manual refresh successful:', links.length, 'links loaded');
    } catch (err) {
      console.error('❌ Manual refresh failed:', err);
    } finally {
      setLoadingLinks(false);
    }
  };

  // Handle link form changes
  const handleLinkChange = (field: string, value: string) => {
    setNewLink(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle opening add link dialog
  const handleOpenAddLinkDialog = () => {
    setAddLinkDialogOpen(true);
    setNewLink({ title: '', url: '', description: '' });
  };

  // Handle closing add link dialog
  const handleCloseAddLinkDialog = () => {
    setAddLinkDialogOpen(false);
    setNewLink({ title: '', url: '', description: '' });
    clearError();
  };

  // Handle link click
  const handleLinkClick = (link: LinkType) => {
    // Navigate to link detail page for better viewing experience
    navigate(`/workspace/${workspaceId}/threads/${threadId}/links/${link.id}`);
    console.log('🔗 Navigating to link details for ID:', link.id);
  };

  // Handle adding new link with real API
  const handleAddLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      alert('Please provide both title and URL for the link.');
      return;
    }

    // Check if we have valid workspace and thread IDs
    if (!workspaceId || !threadId) {
      alert('Cannot add link: Missing workspace or thread information.');
      return;
    }

    // Basic URL validation
    try {
      new URL(newLink.url);
    } catch {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      const linkData = {
        userId: '123e4567-e89b-12d3-a456-426614174000', // TODO: Replace with actual authenticated user ID
        title: newLink.title,
        url: newLink.url,
        description: newLink.description || ''
      };
      
      console.log('🚀 Attempting to create link with data:', linkData);
      console.log('📍 Using workspace ID:', workspaceId, 'thread ID:', threadId);
      console.log('⚠️ NOTE: Make sure user ID exists in database or create user first!');
      
      const createdLink = await handleLinkCreate(linkData);
      console.log('✅ Link created via API:', createdLink);
      
      // Refresh the entire links list from the server instead of just adding to local state
      // This ensures we get the most up-to-date data
      console.log('🔄 Refreshing links list after creation...');
      await handleRefreshLinks();
      
      // Close dialog and show success
      handleCloseAddLinkDialog();
      alert(`Link "${newLink.title}" added successfully!`);
    } catch (err) {
      console.error('❌ Failed to add link via API:', err);
      
      // Enhanced error logging
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as Error & {
          response?: {
            status?: number;
            data?: { message?: string; error?: string };
          };
          config?: unknown;
        };
        console.error('❌ Backend response status:', axiosError.response?.status);
        console.error('❌ Backend response data:', axiosError.response?.data);
        console.error('❌ Request config:', axiosError.config);
        
        // Show more specific error messages based on status code
        let errorMessage = 'Failed to add link. Please try again.';
        
        if (axiosError.response?.status === 404) {
          errorMessage = 'Workspace or thread not found. Please check if the workspace and thread exist in your database.';
        } else if (axiosError.response?.status === 500) {
          const backendMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
          if (backendMessage?.includes('foreign key constraint') && backendMessage?.includes('user_id')) {
            errorMessage = 'User not found in database. Please create a user with ID: 123e4567-e89b-12d3-a456-426614174000 in your users table first.';
          } else if (backendMessage?.includes('uuid')) {
            errorMessage = 'Invalid user ID format. Please check the user authentication.';
          } else if (backendMessage?.includes('thread')) {
            errorMessage = 'Thread not found or invalid. Please verify the thread exists.';
          } else if (backendMessage?.includes('workspace')) {
            errorMessage = 'Workspace not found or invalid. Please verify the workspace exists.';
          } else {
            errorMessage = `Server error: ${backendMessage || 'Unknown error occurred'}`;
          }
        } else {
          errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error || 
                        `Server error (${axiosError.response?.status}): ${axiosError.message}`;
        }
        
        alert(errorMessage);
      } else {
        alert('Failed to add link. Please try again.');
      }
    }
  };

  // Helper function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Helper function to determine link type and icon - Blue Theme
  const getLinkTypeAndIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { type: 'YouTube Video', icon: <YouTube sx={{ color: '#1976d2' }} />, color: '#1976d2' };
    } else if (url.includes('github.com')) {
      return { type: 'GitHub Repository', icon: <Code sx={{ color: '#1565c0' }} />, color: '#1565c0' };
    } else if (url.includes('khanacademy.org')) {
      return { type: 'Khan Academy', icon: <School sx={{ color: '#0d47a1' }} />, color: '#0d47a1' };
    } else if (url.includes('mit.edu') || url.includes('.edu')) {
      return { type: 'Educational Resource', icon: <School sx={{ color: '#1e88e5' }} />, color: '#1e88e5' };
    } else if (url.includes('tensorflow.org') || url.includes('pytorch.org')) {
      return { type: 'Documentation', icon: <Article sx={{ color: '#42a5f5' }} />, color: '#42a5f5' };
    } else {
      return { type: 'External Link', icon: <Language sx={{ color: '#64b5f6' }} />, color: '#64b5f6' };
    }
  };

  // Enhanced links data with more YouTube videos and resources - REMOVED FOR BACKEND ONLY
  // Using only real API data now

  // Use only real API links
  const allLinks = realLinks;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          p: { xs: 2, md: 4 },
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}`)}
          >
            Back to Thread
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddLinkDialog}
            disabled={uploading}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              border: 0,
              borderRadius: 3,
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
              color: 'white',
              height: 48,
              padding: '0 25px',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                boxShadow: '0 4px 8px 3px rgba(76, 175, 80, .4)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {uploading ? 'Adding...' : 'Add Link'}
          </Button>
        </Box>

        {/* Page Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Thread Links
        </Typography>
        <Typography color="text.secondary" paragraph>
          Access all links and external resources for this thread. Browse, rate and discover useful content.
        </Typography>
        {/* Error Alert */}
        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => { clearError(); setValidationError(''); }}>
            {validationError || error}
          </Alert>
        )}

        {/* Validation Error - Show if IDs are missing */}
        {validationError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" color="error.main" mb={1}>
              Invalid Route
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {validationError}
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/')} color="error">
              Go to Home
            </Button>
          </Alert>
        ) : (
          <>
            {/* Loading Indicator */}
            {loadingLinks && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Enhanced Empty State */}
            {allLinks.length === 0 && !loadingLinks ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 4,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '2px dashed #e0e0e0',
                }}
              >
                <Language sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" mb={1}>
                  No Links Added Yet
                </Typography>
                <Typography variant="body1" color="text.disabled" mb={3}>
                  This thread doesn't have any external resources yet. Be the first to add a useful link!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenAddLinkDialog}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                >
                  Add First Link
                </Button>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    md: 'repeat(2, 1fr)', 
                    lg: 'repeat(3, 1fr)' 
                  }, 
                  gap: 3 
                }}
              >
                {allLinks.map((link) => {
                  const linkInfo = getLinkTypeAndIcon(link.url);
                  const youtubeVideoId = getYouTubeVideoId(link.url);

                  return (
                    <Card key={link.id}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        {/* YouTube Video Preview */}
                        {youtubeVideoId && (
                          <Box sx={{ position: 'relative' }}>
                            <YouTubeThumbnail 
                              videoId={youtubeVideoId} 
                              onClick={() => handleLinkClick(link)} 
                            />
                            
                            {/* Play Button Overlay */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                borderRadius: '50%',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                  transform: 'translate(-50%, -50%) scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                              onClick={() => handleLinkClick(link)}
                            >
                              <PlayCircle sx={{ color: 'white', fontSize: 48 }} />
                            </Box>
                            
                            {/* YouTube Logo Badge */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                backgroundColor: '#1976d2',
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <YouTube sx={{ fontSize: 16 }} />
                              YouTube
                            </Box>
                          </Box>
                        )}

                        {/* Non-YouTube Link Preview */}
                        {!youtubeVideoId && (
                          <CardMedia
                            component="div"
                            sx={{
                              height: 120,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: `${linkInfo.color}15`,
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            onClick={() => handleLinkClick(link)}
                          >
                            <Box sx={{ color: linkInfo.color, fontSize: 48 }}>
                              {linkInfo.icon}
                            </Box>
                            
                            {/* Link Type Badge */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                backgroundColor: linkInfo.color,
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {linkInfo.type}
                            </Box>
                          </CardMedia>
                        )}

                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography variant="h6" fontWeight="bold" mb={1} sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {link.title}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" mb={2} sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {link.description}
                          </Typography>

                          {/* Link URL Preview */}
                          <MuiLink 
                            href={link.url} 
                            target="_blank" 
                            sx={{ 
                              fontSize: '0.75rem', 
                              color: 'text.disabled',
                              textDecoration: 'none',
                              display: 'block',
                              mb: 2,
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            🌐 {new URL(link.url).hostname}
                          </MuiLink>

                          {/* Meta Information */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                              {link.addedBy.charAt(0)}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                              Added by {link.addedBy}
                            </Typography>
                          </Box>

                          {/* Action Button */}
                          <Button
                            variant="contained"
                            endIcon={<OpenInNew />}
                            fullWidth
                            onClick={() => handleLinkClick(link)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              backgroundColor: linkInfo.color,
                              '&:hover': {
                                backgroundColor: linkInfo.color,
                                filter: 'brightness(0.9)'
                              }
                            }}
                          >
                            {youtubeVideoId ? 'Watch Video' : 'Visit Resource'}
                          </Button>
                        </CardContent>
                      </Card>
                  );
                })}
              </Box>
            )}
          </>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add link"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpenAddLinkDialog}
        >
          <Add />
        </Fab>

        {/* Add Link Dialog */}
        <Dialog
          open={addLinkDialogOpen}
          onClose={handleCloseAddLinkDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontWeight: 'bold'
          }}>
            🔗 Add New Link
            <IconButton onClick={handleCloseAddLinkDialog} size="small">
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Add a useful link or resource to share with the group
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Link Title */}
              <TextField
                label="Link Title"
                placeholder="Enter a descriptive title for the link"
                fullWidth
                value={newLink.title}
                onChange={(e) => handleLinkChange('title', e.target.value)}
                required
              />
              
              {/* Link URL */}
              <TextField
                label="Link URL"
                placeholder="https://example.com"
                fullWidth
                value={newLink.url}
                onChange={(e) => handleLinkChange('url', e.target.value)}
                required
                InputProps={{
                  startAdornment: <Link sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              
              {/* Link Description */}
              <TextField
                label="Description (Optional)"
                placeholder="Brief description of what this link contains"
                fullWidth
                multiline
                rows={3}
                value={newLink.description}
                onChange={(e) => handleLinkChange('description', e.target.value)}
              />

              {/* Link Preview */}
              {newLink.url && (
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <Typography variant="caption" color="text.secondary" mb={1} display="block">
                    Link Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getLinkTypeAndIcon(newLink.url).icon}
                    <Typography variant="body2" fontWeight="bold">
                      {getLinkTypeAndIcon(newLink.url).type}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.disabled">
                    {newLink.url}
                  </Typography>
                </Box>
              )}
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseAddLinkDialog}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddLink}
                  disabled={!newLink.title.trim() || !newLink.url.trim() || uploading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {uploading ? 'Adding Link...' : 'Add Link'}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
