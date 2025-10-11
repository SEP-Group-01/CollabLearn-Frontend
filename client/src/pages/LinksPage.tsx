import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CardMedia, 
  Chip, 
  Avatar,
  Container,
  Paper,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton
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
import { useThreadData } from "../mocks/Threads";
import { useState } from "react";

export default function LinksPage() {
  const { workspaceId, threadId } = useParams();
  const navigate = useNavigate();
  
  // Show error if required params are missing
  if (!threadId || !workspaceId) {
    return (
      <div>
        <h2>Error: Missing Thread or Workspace ID</h2>
        <p>Please navigate to this page from a workspace thread.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }
  
  const threadData = useThreadData(threadId, workspaceId);
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(false);
  };

  // Handle adding new link
  const handleAddLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      alert('Please provide both title and URL for the link.');
      return;
    }

    // Basic URL validation
    try {
      new URL(newLink.url);
    } catch {
      alert('Please enter a valid URL.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
      alert(`Link "${newLink.title}" added successfully!`);
      setIsSubmitting(false);
      handleCloseAddLinkDialog();
      // TODO: Add the link to the thread data or refresh from API
    }, 1500);
  };

  // Helper function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
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

  // Enhanced links data with more YouTube videos and resources
  const enhancedLinks = [
    ...threadData.resources.links,
    // Additional YouTube videos for better demonstration
    {
      id: 100,
      title: "3Blue1Brown - Linear Algebra Series",
      url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      addedBy: "Dr. Johnson",
      addedAt: "2024-01-20",
      description: "Geometric understanding of matrices, determinants, eigenvectors and more. Excellent visual explanations."
    },
    {
      id: 101,
      title: "Neural Networks Explained - 3Blue1Brown",
      url: "https://www.youtube.com/watch?v=aircAruvnKk",
      addedBy: "Maria R.",
      addedAt: "2024-01-21",
      description: "Deep learning series explaining how neural networks work with beautiful visualizations."
    },
    {
      id: 102,
      title: "Gradient Descent - StatQuest",
      url: "https://www.youtube.com/watch?v=sDv4f4s2SB8",
      addedBy: "Alex Chen",
      addedAt: "2024-01-22",
      description: "Clear explanation of gradient descent optimization algorithm with step-by-step examples."
    },
    {
      id: 103,
      title: "Machine Learning Course - Andrew Ng",
      url: "https://www.youtube.com/watch?v=PPLop4L2eGk",
      addedBy: "Dr. Johnson",
      addedAt: "2024-01-23",
      description: "Complete machine learning course by Stanford's Andrew Ng. Comprehensive and beginner-friendly."
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
            🔗 Useful Links & Resources
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Curated external resources, tutorials, and references for {threadData.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${enhancedLinks.length} resource${enhancedLinks.length !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="caption" color="text.disabled">
                From {threadData.workspaceTitle}
              </Typography>
            </Box>
            
            {/* Add Link Button */}
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
              onClick={handleOpenAddLinkDialog}
            >
              Add Link
            </Button>
          </Box>
        </Box>

        {enhancedLinks.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Language sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No external resources yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Check back later for curated links and resources.
            </Typography>
          </Paper>
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
            {enhancedLinks.map((link) => {
              const linkUrl = link.url || '';
              const linkInfo = getLinkTypeAndIcon(linkUrl);
              const youtubeVideoId = getYouTubeVideoId(linkUrl);
              const youtubeThumbnail = getYouTubeThumbnail(linkUrl);

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
                    {youtubeThumbnail && (
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          position: 'relative',
                          backgroundImage: `url(${youtubeThumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => linkUrl && window.open(linkUrl, '_blank')}
                      >
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
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.9)',
                              transform: 'translate(-50%, -50%) scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <PlayCircle sx={{ color: 'white', fontSize: 48 }} />
                        </Box>
                        
                        {/* YouTube Logo Badge - Blue Theme */}
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
                      </CardMedia>
                    )}

                    {/* Non-YouTube Link Preview */}
                    {!youtubeThumbnail && (
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
                        onClick={() => linkUrl && window.open(linkUrl, '_blank')}
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
                        href={linkUrl || '#'} 
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
                        🌐 {linkUrl ? new URL(linkUrl).hostname : 'No URL'}
                      </MuiLink>

                      {/* Meta Information */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                          {(link.addedBy || 'U').charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          Added by {link.addedBy || 'Unknown'}
                        </Typography>
                      </Box>

                      {/* Action Button */}
                      <Button
                        variant="contained"
                        endIcon={<OpenInNew />}
                        fullWidth
                        onClick={() => linkUrl && window.open(linkUrl, '_blank')}
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
      </Container>

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
          borderColor: 'divider'
        }}>
          <Typography variant="h6" fontWeight="bold">
            🔗 Add New Link
          </Typography>
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddLink}
                disabled={!newLink.title.trim() || !newLink.url.trim() || isSubmitting}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Adding Link...' : 'Add Link'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
