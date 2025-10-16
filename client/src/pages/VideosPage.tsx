import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button, Avatar, Dialog, DialogTitle, DialogContent, IconButton, TextField, Alert, CircularProgress, Fab } from "@mui/material";
import { ArrowBack, PlayCircle, Close, Add, CloudUpload, OpenInNew } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceActions } from "../hooks/useResourceActions";
import type { Video } from "../types/ThreadInterfaces";
import ResourceProgressTracker from '../components/ResourceProgressTracker';

export default function VideosPage() {
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
    handleVideoUpload: uploadVideo, 
    fetchVideos,
    uploading, 
    error,
    clearError,
    isValidFileType 
  } = useResourceActions(workspaceId || '', threadId || '');
  
  // State for real videos from API
  const [realVideos, setRealVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load videos from API on component mount
  useEffect(() => {
    const loadVideos = async () => {
      console.log('🔄 Loading videos for workspace:', workspaceId, 'thread:', threadId);
      setLoadingVideos(true);
      setRealVideos([]); // Clear existing videos first
      
      try {
        console.log('📡 Calling fetchVideos API...');
        const videos = await fetchVideos();
        console.log('📦 Raw video API response:', videos);
        console.log('🔍 Response type:', typeof videos, 'Is Array:', Array.isArray(videos));
        
        if (videos && Array.isArray(videos)) {
          setRealVideos(videos);
          console.log('✅ Videos loaded successfully:', videos.length, 'videos found');
          console.log('📋 Videos data:', videos.map(video => ({ 
            id: video.id, 
            title: video.title, 
            url: video.url,
            addedBy: video.addedBy 
          })));
          
          if (videos.length === 0) {
            console.log('ℹ️ No videos found in database for this workspace/thread combination');
            console.log('💡 Try adding a video using the "Add Video" button to test the functionality');
          }
        } else {
          console.warn('⚠️ Invalid videos response format:', videos);
          setRealVideos([]);
        }
      } catch (err) {
        console.error('❌ Failed to load videos:', err);
        console.error('🔍 Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
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
        
        setRealVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };
    
    if (workspaceId && threadId) {
      loadVideos();
    } else {
      console.warn('⚠️ Missing workspace ID or thread ID, skipping video loading');
    }
  }, [fetchVideos, workspaceId, threadId]);

  // Manual refresh function
  const handleRefreshVideos = async () => {
    console.log('🔄 Manual video refresh triggered');
    setLoadingVideos(true);
    setRealVideos([]); // Clear current videos
    
    try {
      console.log('📡 Fetching videos with params:', { workspaceId, threadId });
      const videos = await fetchVideos();
      console.log('📦 Fetched videos response:', videos);
      console.log('🔍 Video response type:', typeof videos, 'Array?', Array.isArray(videos));
      console.log('📋 Video count:', videos?.length || 0);
      
      if (videos && Array.isArray(videos)) {
        setRealVideos(videos);
        console.log('✅ Manual video refresh successful:', videos.length, 'videos loaded');
        
        // Log each video for debugging
        videos.forEach((video, index) => {
          console.log(`📹 Video ${index + 1}:`, {
            id: video.id,
            title: video.title,
            url: video.url,
            addedBy: video.addedBy
          });
        });
      } else {
        console.warn('⚠️ Invalid videos response format:', videos);
        setRealVideos([]);
      }
    } catch (err) {
      console.error('❌ Manual video refresh failed:', err);
      console.error('🔍 Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        workspaceId,
        threadId
      });
      setRealVideos([]);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Helper function to determine if video is local or external
  const isLocalVideo = (url: string) => {
    return !url.startsWith('http') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
  };

  // Handle video click
  const handleVideoClick = (video: Video) => {
    // Navigate to video detail page for better viewing experience
    navigate(`/workspace/${workspaceId}/threads/${threadId}/videos/${video.id}`);
    console.log('📹 Navigating to video details for ID:', video.id);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const allowedTypes = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
      if (isValidFileType(file, allowedTypes)) {
        setSelectedFile(file);
        setVideoTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
        setUploadError(null);
      } else {
        setUploadError('Please select a valid video file (.mp4, .webm, .ogg, .avi, .mov)');
        setSelectedFile(null);
      }
    } else {
      setUploadError('Please select a valid video file');
      setSelectedFile(null);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile || !videoTitle.trim()) {
      setUploadError('Please provide a title for the video');
      return;
    }

    // Check if we have valid workspace and thread IDs
    if (!workspaceId || !threadId) {
      setUploadError('Cannot upload video: Missing workspace or thread information.');
      return;
    }
    
    try {
      setUploadError(null);
      // Calculate total minutes from hours and minutes
      const estimatedCompletionTime = (estimatedHours * 60) + estimatedMinutes;
      
      const uploadData = {
        userId: '123e4567-e89b-12d3-a456-426614174000', // TODO: Replace with actual authenticated user ID
        title: videoTitle,
        description: videoDescription,
        file: selectedFile,
        estimatedCompletionTime // in minutes
      };
      
      console.log('🚀 Attempting to upload video with data:', uploadData);
      console.log('📍 Using workspace ID:', workspaceId, 'thread ID:', threadId);
      console.log('⏱️ Estimated completion time:', estimatedCompletionTime, 'minutes');
      console.log('⚠️ NOTE: Make sure user ID exists in database or create user first!');
      
      const createdVideo = await uploadVideo(uploadData);
      console.log('✅ Video uploaded via API:', createdVideo);
      
      // Add a small delay to allow backend processing
      console.log('⏳ Waiting 1 second for backend processing...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // DEBUGGING: Try fetching from both workspace IDs
      console.log('🔄 Refreshing videos list after upload...');
      await handleRefreshVideos();
      
      // Success - close dialog and reset form
      setSelectedFile(null);
      setVideoTitle('');
      setVideoDescription('');
      setUploadDialogOpen(false);
      
      alert(`Video "${videoTitle}" uploaded successfully! Check console for debugging info.`);
    } catch (error) {
      console.error('❌ Failed to upload video via API:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
    setSelectedFile(null);
    setVideoTitle('');
    setVideoDescription('');
    setEstimatedHours(0);
    setEstimatedMinutes(0);
    setUploadError(null);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setVideoTitle('');
    setVideoDescription('');
    setEstimatedHours(0);
    setEstimatedMinutes(0);
    setUploadError(null);
  };

  // Use only real API videos
  const allVideos = realVideos;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "100%", overflowX: "hidden" }}>
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
            onClick={handleOpenUploadDialog}
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
            {uploading ? 'Uploading...' : 'Add Video'}
          </Button>
        </Box>

        {/* Page Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Thread Videos
        </Typography>
        <Typography color="text.secondary" paragraph>
          Watch comprehensive video content and educational tutorials for this thread.
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
            {loadingVideos && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Enhanced Empty State */}
            {allVideos.length === 0 && !loadingVideos ? (
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
                <PlayCircle sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" mb={1}>
                  No Videos Added Yet
                </Typography>
                <Typography variant="body1" color="text.disabled" mb={3}>
                  This thread doesn't have any video content yet. Be the first to add a useful video!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenUploadDialog}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                >
                  Add First Video
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
                {allVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handleVideoClick(video)}
                  >
                    {/* Video Preview */}
                    <Box
                      onClick={() => handleVideoClick(video)}
                      sx={{
                        height: 120,
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        '&:hover .video-overlay': {
                          opacity: 1,
                        }
                      }}
                    >
                      {isLocalVideo(video.url) ? (
                        <video
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            backgroundColor: '#000'
                          }}
                          muted
                          preload="metadata"
                          src={video.url}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <PlayCircle sx={{ fontSize: 32, color: 'white', opacity: 0.8 }} />
                        </Box>
                      )}
                      
                      {/* Hover Overlay */}
                      <Box
                        className="video-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        <PlayCircle sx={{ fontSize: 28, color: 'white' }} />
                      </Box>

                      {/* Video Type Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: isLocalVideo(video.url) ? '#1976d2' : '#f44336',
                          color: 'white',
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5,
                          fontSize: '0.6rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {isLocalVideo(video.url) ? 'LOCAL' : 'EXT'}
                      </Box>

                      {/* Duration Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5,
                          fontSize: '0.6rem'
                        }}
                      >
                        {video.duration}
                      </Box>
                    </Box>

                    {/* Video Content */}
                    <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="600" 
                        mb={0.5} 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.2,
                          fontSize: '0.8rem'
                        }}
                      >
                        {video.title}
                      </Typography>
                      
                      {/* Author and Meta */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Avatar sx={{ width: 16, height: 16, bgcolor: 'primary.main', fontSize: '0.6rem' }}>
                          {video.addedBy.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {video.addedBy}
                        </Typography>
                      </Box>

                      {/* Progress Tracker */}
                      <Box sx={{ mb: 1 }}>
                        <ResourceProgressTracker 
                          resourceId={video.id.toString()} 
                          compact={true}
                        />
                      </Box>
                        
                      {/* Action Button */}
                      <Button 
                        onClick={() => handleVideoClick(video)}
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ 
                          fontSize: '0.65rem',
                          py: 0.5
                        }}
                      >
                        {isLocalVideo(video.url) ? 'Play' : 'Watch'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Enhanced Video Dialog with Preview */}
        <Dialog
          open={!!selectedVideo}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 3,
              bgcolor: 'background.paper'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Box>
              <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 0.5 }}>
                {selectedVideo?.title}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="primary.main" fontWeight="bold">
                  {isLocalVideo(selectedVideo?.url || '') ? 'Local Video' : 'External Video'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Added by {selectedVideo?.addedBy}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            {selectedVideo && (
              <Box>
                {/* Video Player */}
                <Box sx={{ position: 'relative', bgcolor: '#000' }}>
                  <video
                    controls
                    autoPlay
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '500px',
                      minHeight: '300px',
                      backgroundColor: '#000'
                    }}
                    src={selectedVideo.url}
                    poster={selectedVideo.thumbnail}
                  >
                    Your browser does not support the video tag.
                  </video>
                </Box>
                
                {/* Video Information Panel */}
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
                    {/* Left Column - Description */}
                    <Box>
                      <Box sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                        📝 Description
                      </Box>
                      <Typography variant="body1" color="text.secondary" mb={3}>
                        {selectedVideo.description || 'No description available for this video.'}
                      </Typography>
                      
                      {/* Video URL for External Videos */}
                      {!isLocalVideo(selectedVideo.url) && (
                        <Box>
                          <Box sx={{ fontWeight: 'bold', fontSize: '0.875rem', mb: 1 }}>
                            🔗 External Link
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<OpenInNew />}
                            onClick={() => window.open(selectedVideo.url, '_blank')}
                            sx={{ textTransform: 'none' }}
                          >
                            Open in New Tab
                          </Button>
                        </Box>
                      )}
                    </Box>
                    
                    {/* Right Column - Meta Information */}
                    <Box>
                      <Box sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                        📊 Video Details
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 1, 
                          bgcolor: 'grey.50', 
                          border: '1px solid #e0e0e0' 
                        }}>
                          <Typography variant="body2" fontWeight="bold" color="text.primary">
                            Duration: {selectedVideo.duration || 'Unknown'}
                          </Typography>
                        </Box>
                        
                        {selectedVideo.views && selectedVideo.views > 0 && (
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 1, 
                            bgcolor: 'grey.50', 
                            border: '1px solid #e0e0e0' 
                          }}>
                            <Typography variant="body2" fontWeight="bold" color="text.primary">
                              Views: {selectedVideo.views}
                            </Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          p: 2, 
                          borderRadius: 1, 
                          bgcolor: 'grey.50',
                          border: '1px solid #e0e0e0'
                        }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                            {selectedVideo.addedBy.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Uploaded by
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {selectedVideo.addedBy}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Video Upload Dialog */}
        <Dialog
          open={uploadDialogOpen}
          onClose={handleCloseUploadDialog}
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
            borderColor: 'divider'
          }}>
            <Box sx={{ fontWeight: 'bold' }}>
              📹 Upload New Video
            </Box>
            <IconButton onClick={handleCloseUploadDialog} size="small">
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Upload a video file to add to this thread
              </Typography>
              
              {/* File Upload Area */}
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: selectedFile ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  mb: 3,
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedFile ? 'primary.light' : 'grey.50',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light'
                  }
                }}
                onClick={() => document.getElementById('video-upload-input')?.click()}
              >
                <input
                  id="video-upload-input"
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {selectedFile ? selectedFile.name : 'Choose Video File'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFile 
                    ? `Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : 'Supports .mp4, .webm, .ogg files (Max 100MB)'
                  }
                </Typography>
              </Box>
              
              {/* Video Information Form */}
              {selectedFile && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Video Title *"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Enter a descriptive title for your video"
                  />
                  <TextField
                    fullWidth
                    label="Video Description"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Add a description to help others understand the content"
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Estimated Completion Time */}
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight="medium" mb={1}>
                      Estimated Completion Time (Optional)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Hours"
                        type="number"
                        inputProps={{ min: 0, max: 99 }}
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Minutes"
                        type="number"
                        inputProps={{ min: 0, max: 59 }}
                        value={estimatedMinutes}
                        onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                      How long do you estimate it will take to watch this video?
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Upload Button */}
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={handleVideoUpload}
                disabled={!selectedFile || uploading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </Button>
              
              {uploading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="primary">
                    Please wait while your video is being uploaded...
                  </Typography>
                </Box>
              )}
              
              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {uploadError}
                </Alert>
              )}
            </Box>
          </DialogContent>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add video"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpenUploadDialog}
        >
          <Add />
        </Fab>
      </Box>
    </Box>
  );
}
