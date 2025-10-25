import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Rating,
  Button,
  Stack,
  Divider,
  TextField,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Chip,
} from "@mui/material";
import {
  ChatBubbleOutline,
  ArrowBack,
  OpenInFull,
  Search,
  Download,
  Share,
  Bookmark,
  BookmarkBorder,
  ZoomIn,
  ZoomOut,
  Print,
  Send,
  Reply,
  MoreVert,
  FindInPage,
  Edit,
  Save,
  Cancel,
  Checklist as ChecklistIcon,
  FullscreenExit
} from "@mui/icons-material";
import ResourceProgressTracker from '../components/ResourceProgressTracker';
import { useResourceActions } from '../hooks/useResourceActions';
import type { Document as DocumentType, Review } from '../types/ThreadInterfaces';

export default function DocumentDetailsPage() {
  const { docId, workspaceId, threadId } = useParams();
  const navigate = useNavigate();

  // Debug URL parameters
  useEffect(() => {
    console.log('🌍 DocumentDetailsPage mounted with params:', {
      docId,
      workspaceId,
      threadId,
      currentURL: window.location.href,
      pathname: window.location.pathname
    });
  }, [docId, workspaceId, threadId]);

  // State for real document from API
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Current user ID (you should get this from your auth context)
  // Using a valid UUID format that matches backend expectations
  const currentUserId = '123e4567-e89b-12d3-a456-426614174000'; // Replace with actual user UUID from auth
  
  // Debug logging for user ID
  useEffect(() => {
    console.log('🆔 Current User ID being used:', currentUserId);
  }, [currentUserId]);

  // Real API integration
  const { 
    fetchDocuments, 
    handleAddReview,
    fetchReviews, 
    handleUpdateReview, 
    fetchUserReview 
  } = useResourceActions(workspaceId || '', threadId || '');

  // Load reviews for the document
  const loadReviews = useCallback(async (documentId: string) => {
    setReviewsLoading(true);
    try {
      const reviewsData = await fetchReviews('documents', documentId);
      setReviews(reviewsData);
      
      // Load user's current rating from their review if exists
      const userReviewData = await fetchUserReview('documents', documentId, currentUserId);
      console.log('🔍 User review data from API:', userReviewData);
      console.log('🔍 Current user ID for comparison:', currentUserId);
      
      if (userReviewData) {
        setRating(userReviewData.rating);
        setUserHasReview(true);
        setUserReview(userReviewData);
        console.log('✅ User review set:', userReviewData);
      } else {
        setUserHasReview(false);
        setUserReview(null);
        console.log('❌ No user review found');
      }
      
      // Also check if the user's review is in the reviews list
      const userReviewInList = reviewsData.find(review => {
        console.log('🔍 Comparing review user_id:', review.user_id, 'with current user:', currentUserId);
        return review.user_id === currentUserId;
      });
      console.log('🔍 User review found in list:', userReviewInList);
    } catch (err) {
      console.error('❌ Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [fetchReviews, fetchUserReview, currentUserId]);
  // Load document from API
  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const documents = await fetchDocuments();
        console.log('📄 All available documents:', documents.map(doc => ({ id: doc.id, title: doc.title })));
        console.log('🔍 Looking for document with ID:', docId);
        
        // First try exact match (string comparison)
        let foundDoc = documents.find((doc) => doc.id.toString() === docId);
        
        // If not found and docId is "0", "null", undefined, or invalid, try to get the most recent document
        if (!foundDoc && (docId === "0" || docId === "null" || !docId || docId === "undefined")) {
          console.log('🔄 Document ID is invalid (' + docId + '), using most recent document');
          // Sort by ID (assuming higher ID = more recent) and take the first one
          const sortedDocs = documents.sort((a, b) => Number(b.id) - Number(a.id));
          foundDoc = sortedDocs[0];
          
          if (foundDoc) {
            console.log('✅ Using most recent document:', foundDoc);
            // Update the URL to reflect the correct document ID
            const currentPath = window.location.pathname;
            const newPath = currentPath.replace(/\/documents\/[^/]*$/, `/documents/${foundDoc.id}`);
            window.history.replaceState({}, '', newPath);
          }
        }
        
        // If still not found, try numeric comparison
        if (!foundDoc) {
          const numericDocId = parseInt(docId || '0');
          foundDoc = documents.find((doc) => Number(doc.id) === numericDocId);
        }
        
        if (foundDoc) {
          setDocument(foundDoc);
          console.log('✅ Document loaded with ID:', foundDoc.id, 'type:', typeof foundDoc.id);
          console.log('✅ Full document object:', foundDoc);
          // Load reviews for this document using the callback
          await loadReviews(foundDoc.id.toString());
        } else {
          // More detailed error message
          const availableIds = documents.map(doc => doc.id).join(', ');
          setError(`Document with ID "${docId}" not found. Available IDs: ${availableIds}`);
          console.warn('⚠️ Document not found:', {
            searchedId: docId,
            availableDocuments: documents.map(doc => ({ id: doc.id, title: doc.title }))
          });
        }
      } catch (err) {
        console.error('❌ Failed to load document:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (docId && workspaceId && threadId) {
      loadDocument();
    } else {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [docId, workspaceId, threadId, fetchDocuments, loadReviews]);

  // Use the real document's Firebase URL or fallback
  const fileUrl = document?.firebase_url || "/sample.pdf";

  // Review system state
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userHasReview, setUserHasReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showOneReviewMessage, setShowOneReviewMessage] = useState(false);

  // Debug logging for review state
  useEffect(() => {
    console.log('🔍 Review state updated:', {
      reviewsCount: reviews.length,
      userHasReview,
      userReview: userReview ? { id: userReview.id, comment: userReview.comment?.substring(0, 50) + '...' } : null,
      currentUserId
    });
  }, [reviews, userHasReview, userReview, currentUserId]);

  // Handler functions
  const handleSearchInDocument = () => {
    setSearchOpen(true);
  };

  const handleDocumentSearch = (query: string) => {
    setSearchQuery(query);
    // Simulate search results (in real implementation, this would search within the PDF)
    const mockResults = query.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0;
    setSearchResults(mockResults);
    console.log(`🔍 Searching for "${query}" in document, found ${mockResults} results`);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log('📋 Document URL copied to clipboard');
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
      if (e.key === 'F11') {
        e.preventDefault();
        setIsMaximized(!isMaximized);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMaximized]);

  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error || !document) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Document not found'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  const handleAddComment = async () => {
    if (!commentInput.trim()) {
      console.warn('⚠️ Comment input is empty');
      return;
    }
    
    if (!document) {
      console.error('❌ Document is not loaded:', document);
      return;
    }
    
    if (!document.id) {
      console.error('❌ Document ID is missing or undefined:', document);
      return;
    }

    const documentId = document.id.toString();
    console.log('🚀 Adding new comment for document:', documentId, 'with user:', currentUserId);

    try {
      // First check if user already has a review for this resource
      console.log('🔍 Checking if user has existing review...');
      const existingReview = await fetchUserReview('documents', documentId, currentUserId);
      
      if (existingReview) {
        // Show message that only one review is allowed and offer edit option
        setShowOneReviewMessage(true);
        console.log('📝 User already has a review - showing edit option');
        return;
      } else {
        console.log('📝 User has no existing review, creating new one');
        console.log('📝 Review data being sent:', {
          user_id: currentUserId,
          username: 'Anonymous User',
          review: commentInput.trim(),
          ratings: rating || 5
        });
        
        // User has no existing review - create new one
        await handleAddReview('documents', documentId, {
          user_id: currentUserId,
          username: 'Anonymous User', // Replace with actual username from auth
          review: commentInput.trim(),
          ratings: rating > 0 ? rating : 5 // Ensure we always have a valid rating
        });
        
        console.log('✅ New review with comment created successfully');
      }
      
      // Reload reviews to show the updated comment
      await loadReviews(documentId);
      setCommentInput("");
    } catch (err) {
      console.error('❌ Failed to add comment:', err);
    }
  };

  const handleEditReview = () => {
    console.log('🖊️ handleEditReview called');
    console.log('🖊️ userReview:', userReview);
    console.log('🖊️ userHasReview:', userHasReview);
    
    if (userReview) {
      console.log('✅ Setting edit mode with comment:', userReview.comment);
      setIsEditingReview(true);
      setCommentInput(userReview.comment || '');
      setShowOneReviewMessage(false);
    } else {
      console.error('❌ No user review found to edit');
      // Try to fetch the user review again if it's missing
      if (document?.id) {
        console.log('🔄 Attempting to fetch user review again...');
        const documentId = document.id.toString();
        fetchUserReview('documents', documentId, currentUserId)
          .then((reviewData) => {
            if (reviewData) {
              console.log('✅ Found user review on retry:', reviewData);
              setUserReview(reviewData);
              setUserHasReview(true);
              setIsEditingReview(true);
              setCommentInput(reviewData.comment || '');
              setShowOneReviewMessage(false);
            } else {
              console.error('❌ Still no user review found');
            }
          })
          .catch((err) => {
            console.error('❌ Failed to fetch user review on retry:', err);
          });
      }
    }
  };

  const handleSaveEditedReview = async () => {
    if (!commentInput.trim() || !document?.id || !userReview) {
      return;
    }

    const documentId = document.id.toString();
    
    try {
      await handleUpdateReview('documents', documentId, currentUserId, {
        review: commentInput.trim(),
        ratings: userReview.rating // Keep existing rating
      });
      
      setIsEditingReview(false);
      setCommentInput("");
      
      // Reload reviews to show the updated comment
      await loadReviews(documentId);
      console.log('✅ Review updated successfully');
    } catch (err) {
      console.error('❌ Failed to update review:', err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingReview(false);
    setCommentInput("");
    setShowOneReviewMessage(false);
  };

  const handleRatingChange = async (newRating: number) => {
    setRating(newRating);
    
    if (!document) {
      console.error('❌ Document is not loaded:', document);
      return;
    }
    
    if (!document.id) {
      console.error('❌ Document ID is missing or undefined:', document);
      return;
    }
    
    const documentId = document.id.toString();
    console.log('🚀 Updating rating for document:', documentId, 'with user:', currentUserId, 'rating:', newRating);
    
    try {
      // For ratings, use user-specific endpoint (one rating per user per document)
      console.log('📝 Creating/updating rating via user endpoint');
      console.log('📝 Review data being sent:', {
        ratings: newRating,
        review: '' // Empty review for rating-only updates
      });
      
      await handleUpdateReview('documents', documentId, currentUserId, {
        ratings: newRating,
        review: '' // Don't include comment text when just updating rating
      });
      
      // Reload reviews to show the updated rating
      await loadReviews(documentId);
      console.log('✅ Rating updated successfully');
    } catch (err) {
      console.error('❌ Failed to update rating:', err);
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header Bar */}
      {!isMaximized && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            borderRadius: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleBack} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {document?.title || 'Document Viewer'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {document?.description || 'No description available'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      )}

      <Box sx={{ display: "flex", gap: 2, p: isMaximized ? 0 : 2, minHeight: isMaximized ? '100vh' : 'calc(100vh - 120px)' }}>
        {/* Main Document Viewer */}
        <Box 
          sx={isMaximized ? {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            bgcolor: 'background.default',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          } : { 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column'
          }}
        >
          {/* Viewer Controls */}
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
            {isMaximized && (
              <>
                <Tooltip title="Close fullscreen">
                  <IconButton size="small" onClick={handleToggleMaximize}>
                    <ArrowBack />
                  </IconButton>
                </Tooltip>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  {document?.title}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
              </>
            )}
            
            <Tooltip title="Print">
              <IconButton size="small" onClick={() => window.print()}>
                <Print />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isMaximized ? "Minimize" : "Enter fullscreen"}>
              <IconButton size="small" onClick={handleToggleMaximize}>
                {isMaximized ? <FullscreenExit /> : <OpenInFull />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Download">
              <IconButton size="small" onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
          </Paper>

          {/* Document Viewer */}
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
                <iframe
                  src={fileUrl}
                  title="Document Preview"
                  width="100%"
                  height="100%"
                  style={{ 
                    border: "none", 
                    borderRadius: 12,
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: `${100 / (zoom / 100)}%`,
                    height: `${100 / (zoom / 100)}%`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                
                {/* Loading overlay for better UX */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    display: 'none', // Can be controlled by loading state
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography variant="body2" color="text.secondary">
                    Loading document...
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        {!isMaximized && (
          <Box sx={{ width: { xs: "100%", md: 320 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Progress Tracking Section */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                <ChecklistIcon />
                Your Progress
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResourceProgressTracker 
                resourceId={docId || ''} 
                compact={false}
                onProgressUpdate={(progress) => {
                  console.log('Progress updated:', progress);
                }}
              />
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Rate This Document
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Rating
                  name="doc-rating"
                  value={rating}
                  precision={0.5}
                  size="large"
                  onChange={(_, value) => handleRatingChange(value || 0)}
                />
                <Typography variant="body2" color="text.secondary">
                  {rating > 0 ? `${rating}/5` : 'Not rated'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card elevation={2} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', borderRadius: 2, boxShadow: '0 2px 8px rgba(102,126,234,0.08)', minHeight: 220 }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChatBubbleOutline sx={{ mr: 1, fontSize: 20 }} />
                Discussion ({reviews.length})
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1.5} sx={{ flexGrow: 1, mb: 1, maxHeight: 220, overflow: 'auto' }}>
                {reviewsLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <CircularProgress size={18} />
                  </Box>
                )}
                {reviews.length === 0 && !reviewsLoading && (
                  <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary', border: '1px dashed #ddd', borderRadius: 2 }}>
                    <ChatBubbleOutline sx={{ fontSize: 28, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2">
                      No comments yet.
                    </Typography>
                  </Box>
                )}
                {reviews.map((review) => (
                  <Paper key={review.id} elevation={1} sx={{ p: 1.5, bgcolor: review.user_id === currentUserId ? '#e0e7ff' : '#f8fafc', borderLeft: review.user_id === currentUserId ? '3px solid #6366f1' : '3px solid #3b82f6', boxShadow: review.user_id === currentUserId ? '0 1px 4px rgba(102,102,234,0.10)' : 'none', mb: 0.5 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366f1', color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                        {(review.username || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="caption" color="text.secondary">
                          {review.username || 'Anonymous'} • {new Date(review.created_at).toLocaleDateString()}
                          {review.user_id === currentUserId && (
                            <Chip label="Your Review" size="small" color="primary" sx={{ ml: 1, height: 16, fontSize: '0.75rem', fontWeight: 'bold' }} />
                          )}
                        </Typography>
                        {review.rating > 0 && (
                          <Box display="flex" alignItems="center" gap={0.5} mt={0.25}>
                            <Rating value={review.rating} size="small" readOnly sx={{ fontSize: 16 }} />
                            <Typography variant="caption" color="text.secondary">({review.rating}/5)</Typography>
                          </Box>
                        )}
                      </Box>
                      {review.user_id === currentUserId && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={handleEditReview} color="primary">
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    {review.comment && (
                      <Typography variant="body2" sx={{ mt: 0.5, color: '#374151', fontSize: '0.95rem' }}>{review.comment}</Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
              
              {/* One Review Message Alert */}
              {showOneReviewMessage && (
                <Alert severity="info" sx={{ mb: 1, py: 0.5, fontSize: '0.95rem' }} action={
                  <Box display="flex" gap={1}>
                    <Button size="small" startIcon={<Edit />} onClick={handleEditReview} variant="outlined">Edit</Button>
                    <Button size="small" onClick={() => setShowOneReviewMessage(false)}>Cancel</Button>
                  </Box>
                }>
                  You already have a review for this document. You can only have one review per document, but you can edit your existing review.
                </Alert>
              )}
              
              {/* Edit Mode UI */}
              {isEditingReview && userReview && (
                <Box sx={{ mb: 1, p: 1.5, border: '1px solid #2196F3', borderRadius: 2, bgcolor: '#f3f9ff' }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '0.95rem' }}>
                    Editing Your Review
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Current rating: {userReview.rating}/5
                  </Typography>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Edit your review..."
                      sx={{ mb: 0 }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && commentInput.trim()) {
                          handleSaveEditedReview();
                        }
                      }}
                    />
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={handleSaveEditedReview}
                      disabled={!commentInput.trim()}
                      sx={{ alignSelf: 'flex-end', ml: 1 }}
                    >
                      <Send fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
              
              {/* Normal Comment Input (only show if not editing) */}
              {!isEditingReview && (
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder={userHasReview ? "You already have a review. Click to edit it." : "Add your comment..."}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    sx={{ flex: 1 }}
                    disabled={userHasReview}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {userHasReview ? (
                            <IconButton size="small" onClick={handleEditReview} title="Edit your review">
                              <Edit fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton size="small" onClick={handleAddComment} disabled={!commentInput.trim()}>
                              <Send fontSize="small" />
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
        )}
      </Box>

      {/* Search Dialog */}
      <Dialog 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Search />
            Search in Document
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Search query"
            value={searchQuery}
            onChange={(e) => handleDocumentSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ mt: 1 }}
          />
          {searchQuery && (
            <Box mt={2}>
              <Typography variant="body2" color="primary">
                Found {searchResults} results for "{searchQuery}"
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setSearchOpen(false)}>
            Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => { handleDownload(); handleMenuClose(); }}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleShare(); handleMenuClose(); }}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { window.print(); handleMenuClose(); }}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleToggleBookmark(); handleMenuClose(); }}>
          <ListItemIcon>
            {isBookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}