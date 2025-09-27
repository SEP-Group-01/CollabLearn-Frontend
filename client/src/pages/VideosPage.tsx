import { useState } from "react";
import { Box, Typography, Card, CardContent, Button, Stack, CardMedia, Chip, Avatar, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { ArrowBack, PlayCircle, AccessTime, Visibility, Person, Close, OpenInNew, Add, CloudUpload } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useThreadData } from "../mocks/Threads";
import type { Video } from "../types/ThreadInterfaces";

export default function VideosPage() {
  const { workspaceId, threadId } = useParams();
  const navigate = useNavigate();
  const threadData = useThreadData(threadId || '1', workspaceId || '1');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Helper function to determine if video is local or external
  const isLocalVideo = (url: string) => {
    return !url.startsWith('http') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
  };

  // Handle video click
  const handleVideoClick = (video: Video) => {
    if (isLocalVideo(video.url)) {
      setSelectedVideo(video);
    } else {
      window.open(video.url, '_blank');
    }
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file (.mp4, .webm, .ogg)');
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) return;
    
    setUploadProgress(true);
    
    // Simulate upload process (replace with actual API call)
    setTimeout(() => {
      alert(`Video "${selectedFile.name}" uploaded successfully!`);
      setUploadProgress(false);
      setSelectedFile(null);
      setUploadDialogOpen(false);
      // TODO: Add the video to the thread data or refresh from API
    }, 2000);
  };

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
    setSelectedFile(null);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setUploadProgress(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, md: 4 } }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        sx={{ 
          mb: 3,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        Back to {threadData.title}
      </Button>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          📹 Video Lectures
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Watch comprehensive video tutorials for {threadData.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${threadData.resources.videos.length} video${threadData.resources.videos.length !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Typography variant="caption" color="text.disabled">
              From {threadData.workspaceTitle}
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2
              }}
              onClick={handleOpenUploadDialog}
            >
              Add Video
            </Button>
          </Box>
        </Box>
      </Box>
      {threadData.resources.videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PlayCircle sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            No videos available yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Check back later for video content on this topic.
          </Typography>
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
            gap: 2 
          }}
        >
          {threadData.resources.videos.map((video, idx) => (
            <Card 
              key={idx} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2, 
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(25,118,210,0.12)',
                  borderColor: 'primary.main'
                }
              }}
            >
              {/* Video Thumbnail with Preview */}
              <CardMedia
                component="div"
                onClick={() => handleVideoClick(video)}
                sx={{
                  height: 160,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundImage: `url(${video.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(25,118,210,0.1), rgba(25,118,210,0.3))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    '&::before': {
                      opacity: 1,
                    },
                    '& .play-button': {
                      transform: 'scale(1.2)',
                      backgroundColor: 'rgba(25,118,210,0.9)',
                    }
                  }
                }}
              >
                <PlayCircle 
                  className="play-button"
                  sx={{ 
                    fontSize: 40, 
                    color: 'white', 
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    borderRadius: '50%',
                    p: 1,
                    transition: 'all 0.3s ease',
                    zIndex: 2
                  }} 
                />
                
                {/* Video Type Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: isLocalVideo(video.url) ? '#1976d2' : '#f44336',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}
                >
                  {isLocalVideo(video.url) ? 'LOCAL' : 'EXTERNAL'}
                </Box>
              </CardMedia>

              {/* Video Content */}
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {video.title}
                </Typography>
                
                {video.description && (
                  <Typography variant="body2" color="text.secondary" mb={2} sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {video.description}
                  </Typography>
                )}

                {/* Video Meta Information - Compact */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip 
                    icon={<AccessTime sx={{ fontSize: 14 }} />}
                    label={video.duration}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                  {video.views && (
                    <Chip 
                      icon={<Visibility sx={{ fontSize: 14 }} />}
                      label={`${video.views}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                  )}
                </Box>

                {/* Added By and Action Button - Compact */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                      {video.addedBy.charAt(0)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {video.addedBy}
                    </Typography>
                  </Box>
                  
                  <Button 
                    onClick={() => handleVideoClick(video)}
                    endIcon={isLocalVideo(video.url) ? <PlayCircle sx={{ fontSize: 16 }} /> : <OpenInNew sx={{ fontSize: 16 }} />} 
                    variant="contained" 
                    size="small"
                    sx={{ 
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      px: 1.5
                    }}
                  >
                    {isLocalVideo(video.url) ? 'Play' : 'Watch'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
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
            <Typography variant="h5" fontWeight="bold" mb={0.5}>
              {selectedVideo?.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={isLocalVideo(selectedVideo?.url || '') ? 'Local Video' : 'External Video'}
                size="small"
                color="primary"
                variant="outlined"
              />
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
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      📝 Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                      {selectedVideo.description || 'No description available for this video.'}
                    </Typography>
                    
                    {/* Video URL for External Videos */}
                    {!isLocalVideo(selectedVideo.url) && (
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                          🔗 External Link
                        </Typography>
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
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      📊 Video Details
                    </Typography>
                    <Stack spacing={2}>
                      <Chip 
                        icon={<AccessTime sx={{ fontSize: 16 }} />}
                        label={`Duration: ${selectedVideo.duration}`}
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      />
                      {selectedVideo.views && (
                        <Chip 
                          icon={<Visibility sx={{ fontSize: 16 }} />}
                          label={`${selectedVideo.views} views`}
                          variant="outlined"
                          sx={{ justifyContent: 'flex-start' }}
                        />
                      )}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'grey.50' 
                      }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          <Person sx={{ fontSize: 14 }} />
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
                    </Stack>
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
          <Typography variant="h6" fontWeight="bold">
            📹 Upload New Video
          </Typography>
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

            {/* Upload Button */}
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleVideoUpload}
              disabled={!selectedFile || uploadProgress}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              {uploadProgress ? 'Uploading...' : 'Upload Video'}
            </Button>
            
            {uploadProgress && (
              <Typography variant="caption" color="primary" sx={{ mt: 2, display: 'block' }}>
                Please wait while your video is being uploaded...
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
