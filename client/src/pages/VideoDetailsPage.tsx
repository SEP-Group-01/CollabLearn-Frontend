import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  Fab,
  Rating,
  Tooltip,
  InputAdornment,
  Chip,
  Divider,
  Slider,
} from "@mui/material";
import {
  ArrowBack,
  OpenInNew,
  Edit,
  Delete,
  ChatBubbleOutline,
  Reply,
  Save,
  Cancel,
  Send,
  ZoomIn,
  ZoomOut,
  Print,
  Share,
  Bookmark,
  BookmarkBorder,
  Download,
  MoreVert,
  OpenInFull,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
} from "@mui/icons-material";

import { useResourceActions } from "../hooks/useResourceActions";
import type { Video, Review } from "../types/ThreadInterfaces";

export default function VideoDetailsPage() {
  const { videoId, workspaceId, threadId } = useParams();
  const navigate = useNavigate();

  // Debug URL parameters
  useEffect(() => {
    console.log('🌍 VideoDetailsPage mounted with params:', {
      videoId,
      workspaceId,
      threadId,
      currentURL: window.location.href,
      pathname: window.location.pathname
    });
  }, [videoId, workspaceId, threadId]);

  // State for real video from API
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [showOneReviewMessage, setShowOneReviewMessage] = useState(false);
  const [userHasReview, setUserHasReview] = useState(false);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock user data - In real app, this would come from auth context
  const currentUser = {
    id: "53e5f9f5-fe11-4728-9996-7e606bb98f96", // Use UUID format consistent with auth
    username: "Development User"
  };

  // Real API integration
  const { 
    fetchVideos, 
    fetchReviews, 
    fetchUserReview, 
    handleAddReview, 
    handleUpdateReview, 
    handleDeleteReview,
    fetchRatingSummary 
  } = useResourceActions(workspaceId || '', threadId || '');

  // Load video from API
  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const videos = await fetchVideos();
        console.log('📹 All available videos:', videos.map(v => ({ id: v.id, title: v.title })));
        console.log('🔍 Looking for video with ID:', videoId);
        
        // First try exact match (string comparison)
        let foundVideo = videos.find((v) => v.id.toString() === videoId);
        
        // If not found and videoId is "0", "null", undefined, or invalid, try to get the most recent video
        if (!foundVideo && (videoId === "0" || videoId === "null" || !videoId || videoId === "undefined")) {
          console.log('🔄 Video ID is invalid (' + videoId + '), using most recent video');
          // Sort by ID (assuming higher ID = more recent) and take the first one
          const sortedVideos = videos.sort((a, b) => Number(b.id) - Number(a.id));
          foundVideo = sortedVideos[0];
          
          if (foundVideo) {
            console.log('✅ Using most recent video:', foundVideo);
            // Update the URL to reflect the correct video ID
            const currentPath = window.location.pathname;
            const newPath = currentPath.replace(/\/videos\/[^/]*$/, `/videos/${foundVideo.id}`);
            window.history.replaceState({}, '', newPath);
          }
        }
        
        // If still not found, try numeric comparison
        if (!foundVideo) {
          const numericVideoId = parseInt(videoId || '0');
          foundVideo = videos.find((v) => Number(v.id) === numericVideoId);
        }
        
        if (foundVideo) {
          setVideo(foundVideo);
          console.log('✅ Video loaded:', foundVideo);
          
          // Load reviews and user review data
          try {
            const [reviewsData, userReviewData] = await Promise.all([
              fetchReviews('videos', foundVideo.id.toString()),
              fetchUserReview('videos', foundVideo.id.toString(), currentUser.id)
            ]);
            
            setReviews(reviewsData);
            setUserReview(userReviewData);
            setUserHasReview(!!userReviewData);
            
            // Set rating to user's existing rating if available
            if (userReviewData) {
              setRating(userReviewData.rating);
              setCommentInput(userReviewData.comment);
            }
            
            console.log('✅ Reviews data loaded:', {
              totalReviews: reviewsData.length,
              userHasReview: !!userReviewData
            });
          } catch (err) {
            console.error('❌ Failed to load reviews data:', err);
            // Don't set error state as this shouldn't prevent video viewing
          }
        } else {
          // More detailed error message
          const availableIds = videos.map(v => v.id).join(', ');
          setError(`Video with ID "${videoId}" not found. Available IDs: ${availableIds}`);
          console.warn('⚠️ Video not found:', {
            searchedId: videoId,
            availableVideos: videos.map(v => ({ id: v.id, title: v.title }))
          });
        }
      } catch (err) {
        console.error('❌ Failed to load video:', err);
        setError('Failed to load video. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (videoId && workspaceId && threadId) {
      loadVideo();
    } else {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [videoId, workspaceId, threadId, fetchVideos, fetchReviews, fetchUserReview, currentUser.id]);

  // Handler functions
  const handleAddComment = async () => {
    // Check if user already has a review but is trying to add a new one
    if (userHasReview && !isEditingReview) {
      setShowOneReviewMessage(true);
      return;
    }

    if (!commentInput.trim() || rating === 0) {
      setError('Please provide both a rating and a comment');
      return;
    }

    if (!video) return;

    setIsSubmittingReview(true);
    setError(null);

    try {
      console.log('🔍 Current userReview state:', userReview);
      console.log('🔍 Current video:', video);
      
      const reviewData = {
        user_id: currentUser.id,
        username: currentUser.username,
        ratings: rating,         // backend expects 'ratings'
        review: commentInput.trim()  // backend expects 'review'
      };

      if (userReview && userReview.id) {
        // Update existing review
        const updatedReview = await handleUpdateReview(
          'videos', 
          video.id.toString(), 
          userReview.id.toString(),
          { ratings: rating, review: commentInput.trim() }  // backend expects 'ratings' and 'review'
        );
        setUserReview(updatedReview);
        
        // Update in reviews list
        setReviews(prevReviews => 
          prevReviews.map(r => r.id === updatedReview.id ? updatedReview : r)
        );
      } else {
        // Add new review
        const newReview = await handleAddReview('videos', video.id.toString(), reviewData);
        setUserReview(newReview);
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setUserHasReview(true);
      }

      console.log('✅ Review submitted successfully');
    } catch (err) {
      console.error('❌ Failed to submit review:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReview = () => {
    console.log('🔄 Starting edit review mode');
    setIsEditingReview(true);
    setShowOneReviewMessage(false);
    if (userReview) {
      setRating(userReview.rating);
      setCommentInput(userReview.comment);
    }
  };

  const handleSaveEditedReview = async () => {
    if (!userReview || !video || !commentInput.trim()) return;

    setIsSubmittingReview(true);
    setError(null);

    try {
      const updatedReview = await handleUpdateReview(
        'videos',
        video.id.toString(),
        userReview.id.toString(),
        { ratings: rating, review: commentInput.trim() }
      );
      
      setUserReview(updatedReview);
      setReviews(prevReviews => 
        prevReviews.map(r => r.id === updatedReview.id ? updatedReview : r)
      );
      setIsEditingReview(false);
      
      console.log('✅ Review updated successfully');
    } catch (err) {
      console.error('❌ Failed to update review:', err);
      setError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingReview(false);
    setShowOneReviewMessage(false);
    if (userReview) {
      setRating(userReview.rating);
      setCommentInput(userReview.comment);
    }
  };

  // Video player handlers
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(prev => !prev);
    console.log(isBookmarked ? 'Bookmark removed' : 'Bookmark added');
  };

  const handleDeleteUserReview = async () => {
    if (!userReview || !video) return;

    setIsSubmittingReview(true);
    setError(null);

    try {
      await handleDeleteReview('videos', video.id.toString(), userReview.id.toString());
      setUserReview(null);
      setReviews(prevReviews => prevReviews.filter(r => r.id !== userReview.id));
      setRating(0);
      setCommentInput('');
      console.log('✅ Review deleted successfully');
    } catch (err) {
      console.error('❌ Failed to delete review:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBack = () => {
    // Go back to thread page
    if (workspaceId && threadId) {
      navigate(`/workspace/${workspaceId}/threads/${threadId}`);
    } else {
      navigate(-1);
    }
  };

  // Helper function to determine if video is local or external
  const isLocalVideo = (url: string) => {
    return !url.startsWith('http') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
  };

  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error || !video) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Video not found'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header Bar */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          borderRadius: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2} minWidth={0} flex={1}>
            <IconButton onClick={handleBack} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Box minWidth={0} flex={1}>
              <Typography variant="h5" fontWeight="bold" noWrap>
                {video.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }} noWrap>
                Added by {video.addedBy} • {video.duration}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
              <IconButton 
                sx={{ color: 'white' }} 
                onClick={handleToggleBookmark}
              >
                {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton 
                sx={{ color: 'white' }} 
                onClick={() => navigator.clipboard.writeText(video.url)}
              >
                <Share />
              </IconButton>
            </Tooltip>
            {!isLocalVideo(video.url) && (
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                onClick={() => window.open(video.url, '_blank')}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  flexShrink: 0
                }}
              >
                Open Video
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 2, 
        p: 2, 
        maxHeight: { xs: 'auto', lg: 'calc(100vh - 120px)' },
        minHeight: { xs: 'calc(100vh - 120px)', lg: 'auto' }
      }}>
        {/* Main Video Viewer */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: { xs: '50vh', lg: 'auto' }
        }}>
          {/* Video Player Controls */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 1.5, 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '& .MuiIconButton-root': {
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                },
                '&:disabled': {
                  color: 'rgba(255,255,255,0.3)'
                }
              }
            }}
          >
            {isLocalVideo(video.url) && (
              <>
                <Tooltip title={isPlaying ? "Pause" : "Play"}>
                  <IconButton size="small" onClick={handlePlayPause}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                  <IconButton size="small" onClick={handleMuteToggle}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Tooltip>
                
                <Box sx={{ width: 100, mx: 1 }}>
                  <Slider
                    size="small"
                    value={isMuted ? 0 : volume}
                    onChange={(_, value) => handleVolumeChange(value as number)}
                    sx={{ 
                      color: 'white',
                      '& .MuiSlider-thumb': {
                        bgcolor: 'white'
                      },
                      '& .MuiSlider-track': {
                        bgcolor: 'white'
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  />
                </Box>
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
              </>
            )}
            
            <Tooltip title="Zoom out">
              <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center', fontWeight: 'bold' }}>
              {zoom}%
            </Typography>
            <Tooltip title="Zoom in">
              <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
            
            <Tooltip title="Print">
              <IconButton size="small" onClick={() => window.print()}>
                <Print />
              </IconButton>
            </Tooltip>
            
            {isLocalVideo(video.url) && (
              <Tooltip title="Fullscreen">
                <IconButton size="small" onClick={() => {
                  const videoElement = document.querySelector('video');
                  if (videoElement) {
                    videoElement.requestFullscreen();
                  }
                }}>
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Download">
              <IconButton size="small" onClick={() => {
                const a = document.createElement('a');
                a.href = video.url;
                a.download = video.title || 'video';
                a.click();
              }}>
                <Download />
              </IconButton>
            </Tooltip>
          </Paper>

          {/* Video Player */}
          <Card 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              height: '100%'
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box 
                sx={{ 
                  flexGrow: 1,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
                  border: '2px solid #e3f2fd',
                  minHeight: '70vh'
                }}
              >
                {isLocalVideo(video.url) ? (
                  <Box
                    component="video"
                    controls
                    sx={{
                      width: '100%',
                      maxHeight: { xs: '40vh', md: '50vh', lg: '70vh' },
                      backgroundColor: '#000',
                      borderRadius: 1,
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'center center'
                    }}
                    src={video.url}
                    poster={video.thumbnail}
                  >
                    Your browser does not support the video tag.
                  </Box>
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    height: { xs: '40vh', md: '50vh', lg: '70vh' },
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    flexDirection: 'column',
                    gap: 3,
                    p: 4,
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center center'
                  }}>
                    <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
                      🎥
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                      {video.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600, textAlign: 'center' }}>
                      Duration: {video.duration}
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: '#f5f5f5', 
                      borderRadius: 2, 
                      border: '1px solid #ddd',
                      maxWidth: '80%',
                      wordBreak: 'break-all',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        External Video - {video.url}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<OpenInNew />}
                      onClick={() => window.open(video.url, '_blank')}
                      sx={{ 
                        mt: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Open Video
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box sx={{ 
          width: { xs: "100%", lg: 380 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row', lg: 'column' },
          gap: 2,
          maxHeight: { xs: 'auto', lg: '100%' }
        }}>
          {/* Rating Section */}
          <Card elevation={3} sx={{ flex: { xs: 1, md: 1, lg: 'none' } }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Video Rating
              </Typography>
              
              {video?.rating_summary ? (
                <Box mb={2}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Rating 
                      value={video.rating_summary.average_rating} 
                      precision={0.1} 
                      size="large" 
                      readOnly 
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {video.rating_summary.average_rating.toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Based on {video.rating_summary.total_reviews} review{video.rating_summary.total_reviews !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              ) : (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    No ratings yet
                  </Typography>
                </Box>
              )}

              <Typography variant="body1" fontWeight="medium" gutterBottom>
                Your Rating:
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Rating
                  name="video-rating"
                  value={rating}
                  precision={0.5}
                  size="large"
                  onChange={(_, value) => setRating(value || 0)}
                />
                <Typography variant="body2" color="text.secondary">
                  {rating > 0 ? `${rating}/5` : 'Not rated'}
                </Typography>
              </Box>
              
              {userReview && (
                <Typography variant="body2" color="primary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  You have already reviewed this video
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card elevation={3} sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            flex: { xs: 2, md: 2, lg: 1 },
            minHeight: { xs: '300px', lg: 'auto' }
          }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <ChatBubbleOutline sx={{ mr: 1 }} />
                Discussion ({reviews.length})
              </Typography>
              
              <Stack spacing={2} sx={{ flexGrow: 1, mb: 2, maxHeight: 400, overflow: 'auto' }}>
                {reviewsLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                {reviews.length === 0 && !reviewsLoading && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary',
                      border: '2px dashed #ddd',
                      borderRadius: 2
                    }}
                  >
                    <ChatBubbleOutline sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2">
                      No comments yet. Start the discussion!
                    </Typography>
                  </Box>
                )}
                {reviews.map((review) => (
                  <Paper key={review.id} elevation={1} sx={{ p: 2, bgcolor: "#f8fafc", borderLeft: '4px solid #3b82f6' }}>
                    <Box display="flex" alignItems="start" gap={1} mb={1}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {(review.username || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="caption" color="text.secondary">
                          {review.username || 'Anonymous'} • {new Date(review.created_at).toLocaleDateString()}
                          {review.user_id === currentUser.id && (
                            <Chip 
                              label="Your Review" 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1, height: 16, fontSize: '0.7rem' }}
                            />
                          )}
                        </Typography>
                        {review.rating > 0 && (
                          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary">
                              ({review.rating}/5)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box display="flex" gap={0.5}>
                        {review.user_id === currentUser.id && (
                          <Tooltip title="Edit your review">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                console.log('🖱️ Edit button clicked in review list');
                                handleEditReview();
                              }}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton size="small">
                          <Reply fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    {review.comment && (
                      <Typography variant="body2">{review.comment}</Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
              
              {/* One Review Message Alert */}
              {showOneReviewMessage && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 2 }}
                  action={
                    <Box display="flex" gap={1}>
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        onClick={() => {
                          console.log('🖱️ Edit My Review button clicked in alert');
                          handleEditReview();
                        }}
                        variant="outlined"
                      >
                        Edit My Review
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => setShowOneReviewMessage(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  }
                >
                  You already have a review for this video. You can only have one review per video, but you can edit your existing review.
                </Alert>
              )}
              
              {/* Edit Mode UI */}
              {isEditingReview && userReview && (
                <Box sx={{ mb: 2, p: 2, border: '2px solid #2196F3', borderRadius: 2, bgcolor: '#f3f9ff' }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Editing Your Review
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Current rating: {userReview.rating}/5 stars
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Edit your review comment..."
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" gap={1} justifyContent="flex-end">
                    <Button 
                      size="small" 
                      startIcon={<Save />}
                      onClick={handleSaveEditedReview}
                      variant="contained"
                      disabled={!commentInput.trim()}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Cancel />}
                      onClick={handleCancelEdit}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
              
              {/* Normal Comment Input (only show if not editing) */}
              {!isEditingReview && (
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder={userHasReview ? "You already have a review. Click to edit it." : "Add your comment to the discussion..."}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    sx={{ flex: 1 }}
                    disabled={userHasReview}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {userHasReview ? (
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                console.log('🖱️ Edit button clicked in input field');
                                handleEditReview();
                              }}
                              title="Edit your existing review"
                            >
                              <Edit />
                            </IconButton>
                          ) : (
                            <IconButton 
                              size="small" 
                              onClick={handleAddComment}
                              disabled={!commentInput.trim()}
                            >
                              <Send />
                            </IconButton>
                          )}
                        </InputAdornment>
                      )
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && commentInput.trim() && !userHasReview) {
                        handleAddComment();
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Floating Search Button */}
      <Fab
        color="primary"
        aria-label="back to thread"
        sx={{ 
          position: "fixed", 
          bottom: 16, 
          right: 16,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          display: { xs: 'flex', lg: 'none' }
        }}
        onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}`)}
      >
        <ArrowBack />
      </Fab>
    </Box>
  );
}
