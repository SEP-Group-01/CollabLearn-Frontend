import type React from "react"
import SidebarComponent from "../components/SideBar"
import { useResourceActions } from '../hooks/useResourceActions';
import type { Document as DocumentType } from '../types/ThreadInterfaces';

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  AlertTitle,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Fab,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Snackbar,
} from "@mui/material"
import {
  ArrowBack,
  Description,
  PictureAsPdf,
  TextSnippet,
  Download,
  Share,
  Edit,
  MoreVert,
  Add,
  Upload,
  Search,
  InsertDriveFile,
} from "@mui/icons-material"

export default function ThreadDocumentsPage() {
  const { workspaceId, threadId } = useParams<{ workspaceId: string; threadId: string }>();
  const navigate = useNavigate();
  
  // Validation state
  const [validationError, setValidationError] = useState('');
  
  // Check if IDs are provided and valid
  useEffect(() => {
    console.log('🔍 Raw URL params:', { workspaceId, threadId });
    
    if (!workspaceId || !threadId) {
      setValidationError('Missing workspace ID or thread ID in URL');
      return;
    }
    
    // More flexible UUID format validation (also accepts shortened versions)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const shortUuidRegex = /^[0-9a-f-]{32,36}$/i; // More flexible format
    
    if (!uuidRegex.test(workspaceId) && !shortUuidRegex.test(workspaceId)) {
      console.warn('⚠️ Workspace ID format may be invalid:', workspaceId);
      console.warn('📝 Continuing anyway, backend may handle different ID formats...');
    }
    
    if (!uuidRegex.test(threadId) && !shortUuidRegex.test(threadId)) {
      console.warn('⚠️ Thread ID format may be invalid:', threadId);
      console.warn('📝 Continuing anyway, backend may handle different ID formats...');
    }
    
    console.log('📍 Current route params:', { workspaceId, threadId });
    setValidationError(''); // Clear any previous validation errors
  }, [workspaceId, threadId]);
  
  // Real API integration
  const { 
    handleDocumentUpload, 
    fetchDocuments, 
    uploading, 
    error, 
    clearError,
    getFileSize 
  } = useResourceActions(workspaceId || '', threadId || '');
  
  // State for real documents from API
  const [realDocuments, setRealDocuments] = useState<DocumentType[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  
  // UI state
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    type: "all" as "all" | "pdf" | "doc" | "txt",
    sortBy: "newest" as "newest" | "oldest" | "name" | "size",
    showAdvanced: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    type: "pdf" as "pdf" | "doc" | "txt",
  });

  // Load documents from API on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const documents = await fetchDocuments();
        setRealDocuments(documents);
        console.log('✅ Documents loaded:', documents);
      } catch (err) {
        console.error('❌ Failed to load documents:', err);
      } finally {
        setLoadingDocuments(false);
      }
    };
    
    if (!validationError) {
      loadDocuments();
    }
  }, [fetchDocuments, validationError]);

  // Filter and sort documents based on search and filters
  const filteredDocuments = realDocuments
    .filter((doc) => {
      // Text search
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Type filter
      const matchesType = searchFilters.type === "all" || doc.type === searchFilters.type;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (searchFilters.sortBy) {
        case "newest":
          return new Date(b.uploadedAt || b.created_at || 0).getTime() - new Date(a.uploadedAt || a.created_at || 0).getTime();
        case "oldest":
          return new Date(a.uploadedAt || a.created_at || 0).getTime() - new Date(b.uploadedAt || b.created_at || 0).getTime();
        case "name":
          return a.title.localeCompare(b.title);
        case "size":
          return (b.file_size || 0) - (a.file_size || 0);
        default:
          return 0;
      }
    });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getFileIcon = (fileType: string, size: number = 32) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) {
      return <PictureAsPdf color="error" sx={{ fontSize: size }} />;
    } else if (type.includes('doc') || type.includes('word')) {
      return <Description color="info" sx={{ fontSize: size }} />;
    } else if (type.includes('text') || type.includes('txt')) {
      return <TextSnippet color="success" sx={{ fontSize: size }} />;
    } else {
      return <InsertDriveFile sx={{ fontSize: size }} />;
    }
  };

  const handleDocumentClick = (docId: string) => {
    // Check if docId is valid before navigation
    if (!docId || docId === 'null' || docId === 'undefined') {
      console.error('❌ Invalid document ID for navigation:', docId);
      return;
    }
    
    // Navigate to document details page for better viewing experience
    navigate(`/workspace/${workspaceId}/threads/${threadId}/documents/${docId}`);
    console.log('📖 Navigating to document details for ID:', docId);
  };

  const handleDocumentQuery = () => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}/query`);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate title with filename (without extension)
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setNewDocument(prev => ({
        ...prev,
        title: prev.title || fileName
      }));
    }
  };

  const handleAddDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    if (!newDocument.title.trim()) {
      alert('Please provide a title for the document.');
      return;
    }

    // Check if we have valid workspace and thread IDs
    if (!workspaceId || !threadId) {
      alert('Cannot upload document: Missing workspace or thread information.');
      return;
    }

    try {
      const uploadData = {
        userId: '123e4567-e89b-12d3-a456-426614174000', // TODO: Replace with actual authenticated user ID
        title: newDocument.title,
        description: newDocument.description || '',
        file: selectedFile,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        }
      };
      
      console.log('🚀 Attempting to upload document:', {
        fileName: selectedFile.name,
        fileSize: getFileSize(selectedFile.size),
        title: newDocument.title
      });
      console.log('📍 Using workspace ID:', workspaceId, 'thread ID:', threadId);
      console.log('⚠️ NOTE: Make sure user ID exists in database or create user first!');
      
      const createdDocument = await handleDocumentUpload(uploadData);
      
      // Add to local state
      setRealDocuments(prev => [createdDocument, ...prev]);
      
      console.log('✅ Document uploaded via API:', createdDocument);
      
      // Store the document title for success message
      const documentTitle = newDocument.title;
      
      // Close dialog and reset form immediately after success
      setAddDocumentOpen(false);
      setNewDocument({ title: "", description: "", type: "pdf" });
      setSelectedFile(null);
      setUploadProgress(0);
      
      // Show success notification with snackbar
      setSuccessMessage(`Document "${documentTitle}" uploaded successfully!`);
      setShowSuccessSnackbar(true);
    } catch (err) {
      console.error('❌ Failed to upload document via API:', err);
      
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
        
        // Show more specific error messages based on status code
        let errorMessage = 'Failed to upload document. Please try again.';
        
        if (axiosError.response?.status === 404) {
          errorMessage = 'Workspace or thread not found. Please check if the workspace and thread exist in your database.';
        } else if (axiosError.response?.status === 500) {
          const backendMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
          if (backendMessage?.includes('foreign key constraint') && backendMessage?.includes('user_id')) {
            errorMessage = 'User not found in database. Please create a user with ID: 123e4567-e89b-12d3-a456-426614174000 in your users table first.';
          } else if (backendMessage?.includes('file size')) {
            errorMessage = 'File size too large. Please upload a smaller file.';
          } else if (backendMessage?.includes('file type')) {
            errorMessage = 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.';
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
        alert('Failed to upload document. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Box sx={{
        width: collapsed ? 80 : 240,
        flexShrink: 0,
        bgcolor: "background.paper",
        borderRight: "1px solid #e0e0e0",
        display: { xs: 'none', md: 'block' }
      }}>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          p: { xs: 2, md: 4 },
          maxWidth: "100%",
          overflowX: "hidden",
        }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}`)}
            >
              Back to Thread
            </Button>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleDocumentQuery}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                border: 0,
                borderRadius: 3,
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                color: 'white',
                height: 48,
                padding: '0 30px',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1BA8D4 90%)',
                  boxShadow: '0 4px 8px 3px rgba(33, 203, 243, .4)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover:before': {
                  left: '100%',
                },
                transition: 'all 0.2s ease-in-out',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  },
                  '50%': {
                    boxShadow: '0 3px 15px 4px rgba(33, 203, 243, .5)',
                  },
                  '100%': {
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  },
                },
              }}
            >
              Query Documents
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setAddDocumentOpen(true);
                // Clear any previous success messages
                setShowSuccessSnackbar(false);
                setSuccessMessage('');
              }}
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
              Add Document
            </Button>
          </Box>
        </Box>

        {/* Page Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Thread Documents
        </Typography>
        <Typography color="text.secondary" paragraph>
          Access all documents, notes, and resources for this thread. Rate, comment, and collaborate with your peers.
        </Typography>

        {/* Error Alert */}
        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => { clearError(); setValidationError(''); }}>
            {validationError || error}
          </Alert>
        )}

        {/* Enhanced Search and Filter */}
        <Card 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                🔍 Search & Filter Documents
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => setSearchFilters(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
                sx={{ color: 'white', textTransform: 'none' }}
              >
                {searchFilters.showAdvanced ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>
            
            <TextField
              fullWidth
              placeholder="Search documents by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
            
            {/* Advanced Filters */}
            {searchFilters.showAdvanced && (
              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'white' }}>Type</InputLabel>
                  <Select
                    value={searchFilters.type}
                    label="Type"
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, type: e.target.value as "all" | "pdf" | "doc" | "txt" }))}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '& .MuiSelect-select': { color: 'black' }
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="doc">Document</MenuItem>
                    <MenuItem value="txt">Text</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'white' }}>Sort By</InputLabel>
                  <Select
                    value={searchFilters.sortBy}
                    label="Sort By"
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value as "newest" | "oldest" | "name" | "size" }))}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '& .MuiSelect-select': { color: 'black' }
                    }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="size">Size (Large to Small)</MenuItem>
                  </Select>
                </FormControl>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchFilters({ type: "all", sortBy: "newest", showAdvanced: false });
                  }}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Clear All
                </Button>
              </Box>
            )}
            
            {/* Search Results Summary */}
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Total: {realDocuments.length} documents
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Validation Error - Show if IDs are missing */}
        {validationError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Invalid Route</AlertTitle>
            <Typography variant="body2">
              {validationError}
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/')} color="error" sx={{ mt: 2 }}>
              Go to Home
            </Button>
          </Alert>
        ) : (
          <>
            {/* Loading Indicator */}
            {loadingDocuments && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Upload Progress */}
            {uploading && uploadProgress > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    Uploading document... {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </CardContent>
              </Card>
            )}

            {/* Enhanced Empty State */}
            {filteredDocuments.length === 0 && !loadingDocuments ? (
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '2px dashed #cbd5e1',
                  borderRadius: 4,
                  textAlign: 'center',
                  py: 8,
                  px: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 2s infinite',
                  },
                  '@keyframes shimmer': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                  }
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    '& svg': {
                      animation: 'bounce 2s infinite',
                    },
                    '@keyframes bounce': {
                      '0%, 20%, 50%, 80%, 100%': {
                        transform: 'translateY(0)'
                      },
                      '40%': {
                        transform: 'translateY(-10px)'
                      },
                      '60%': {
                        transform: 'translateY(-5px)'
                      }
                    }
                  }}
                >
                  <InsertDriveFile sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
                  background: 'linear-gradient(45deg, #64748b, #94a3b8)',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>
                  {searchTerm ? 'No matching documents found' : 'No documents yet'}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" mb={4} sx={{ maxWidth: 400, mx: 'auto' }}>
                  {searchTerm 
                    ? `No documents match your search for "${searchTerm}". Try adjusting your search terms or filters.`
                    : 'Upload your first document to get started with collaborative learning!'
                  }
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => {
                      setAddDocumentOpen(true);
                      // Clear any previous success messages
                      setShowSuccessSnackbar(false);
                      setSuccessMessage('');
                    }}
                    sx={{
                      background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                      }
                    }}
                  >
                    Add Your First Document
                  </Button>
                  
                  {searchTerm && (
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        setSearchTerm("");
                        setSearchFilters({ type: "all", sortBy: "newest", showAdvanced: false });
                      }}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.50',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Clear Search
                    </Button>
                  )}
                </Stack>
              </Card>
            ) : (
              <Stack spacing={2}>
                {filteredDocuments.map((doc, index) => (
                  <Card
                    key={`doc-${doc.id}-${doc.title}-${index}`}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden",
                      minHeight: "70px",
                      "&:hover": { 
                        transform: "translateY(-1px)", 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: "primary.main",
                        "& .document-preview-hint": {
                          opacity: 1,
                        },
                        "& .document-action-buttons": {
                          opacity: 1,
                        }
                      },
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "4px",
                        background: doc.type === 'pdf' ? '#ef4444' : doc.type === 'doc' ? '#3b82f6' : '#10b981',
                        opacity: 0,
                        transition: "opacity 0.2s"
                      },
                      "&:hover:before": {
                        opacity: 1
                      }
                    }}
                    onClick={() => {
                      // Ensure doc.id exists and is valid before navigation
                      if (doc.id && doc.id !== null && doc.id !== undefined) {
                        handleDocumentClick(doc.id.toString());
                      } else {
                        console.error('❌ Document has invalid ID:', doc);
                      }
                    }}
                  >
                    {/* Preview hint overlay */}
                    <Box
                      className="document-preview-hint"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        opacity: 0,
                        transition: "all 0.2s ease-in-out",
                        zIndex: 2
                      }}
                    >
                      <Chip
                        label="Click to view"
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          height: '20px',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    </Box>

                    <CardContent sx={{ 
                      flexGrow: 1, 
                      display: "flex", 
                      flexDirection: "row", 
                      alignItems: "center", 
                      gap: 2,
                      p: 1.5,
                      '&:last-child': { pb: 1.5 }
                    }}>
                      {/* File Icon */}
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          background: doc.type === 'pdf' 
                            ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                            : doc.type === 'doc'
                            ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                            : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        {getFileIcon(doc.mime_type || 'document', 24)}
                      </Box>

                      {/* File Details */}
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                          background: 'linear-gradient(45deg, #1e293b, #475569)',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {doc.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {doc.description || 'No description'}
                        </Typography>
                      </Box>

                      {/* Meta Info */}
                      <Box display="flex" gap={1} alignItems="center" sx={{ flexShrink: 0 }}>
                        <Chip 
                          label={doc.type?.toUpperCase()} 
                          size="small" 
                          color={doc.type === 'pdf' ? 'error' : doc.type === 'doc' ? 'info' : 'success'}
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'max-content' }}>
                          {getFileSize(doc.file_size || 0)}
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Action Buttons */}
                    <Box
                      className="document-action-buttons"
                      sx={{
                        p: 1,
                        display: "flex",
                        flexDirection: "row",
                        gap: 0.5,
                        borderLeft: "1px solid",
                        borderColor: "divider",
                        opacity: { xs: 1, md: 0 },
                        transition: "all 0.2s ease-in-out",
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                      }}
                    >
                      <Tooltip title="Download/View Document">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (doc.firebase_url) {
                              window.open(doc.firebase_url, '_blank');
                              console.log('📥 Downloading document:', doc.title);
                            } else {
                              console.warn('⚠️ No download URL available for:', doc.title);
                              alert('Download URL not available for this document.');
                            }
                          }}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <Download sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="More actions">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e);
                          }}
                          sx={{
                            backgroundColor: 'grey.100',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              backgroundColor: 'grey.200',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <MoreVert sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}
          </>
        )}

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <Download sx={{ mr: 1 }} />
            Download
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Share sx={{ mr: 1 }} />
            Share
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        </Menu>

        {/* Enhanced Add Document Dialog */}
        <Dialog 
          open={addDocumentOpen} 
          onClose={() => {
            setAddDocumentOpen(false);
            setSelectedFile(null);
            setNewDocument({ title: "", description: "", type: "pdf" });
            setUploadProgress(0);
            clearError(); // Clear any existing errors when dialog is closed
          }} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
            }
          }}
        >
          {/* Enhanced Header */}
          <DialogTitle 
            sx={{ 
              p: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20H20z"/%3E%3C/g%3E%3C/svg%3E")',
              }
            }}
          >
            <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Add sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h5" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Add New Document
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Upload and organize your learning materials
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 4 }}>
              <Box 
                display="flex" 
                gap={4} 
                sx={{ 
                  flexDirection: { xs: 'column', md: 'row' },
                  minHeight: '500px'
                }}
              >
                {/* Left Column - File Upload */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3
                  }}>
                    <Upload sx={{ fontSize: 20 }} />
                    File Upload
                  </Typography>

                  {/* Enhanced Drag & Drop Upload Area */}
                  <Box
                    component="label"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 200,
                      border: selectedFile ? '2px solid' : '2px dashed',
                      borderColor: selectedFile ? 'success.main' : 'grey.300',
                      borderRadius: 3,
                      background: selectedFile 
                        ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                        : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      },
                      '&::before': selectedFile ? {} : {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        animation: 'shimmer 2s infinite',
                      },
                      '@keyframes shimmer': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' }
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        const file = files[0];
                        setSelectedFile(file);
                        const fileName = file.name.replace(/\.[^/.]+$/, "");
                        setNewDocument(prev => ({
                          ...prev,
                          title: prev.title || fileName
                        }));
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      hidden 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                    
                    {selectedFile ? (
                      // File Selected State
                      <Box textAlign="center" sx={{ zIndex: 1, position: 'relative' }}>
                        <Box sx={{ mb: 2 }}>
                          {getFileIcon(selectedFile.type || 'document', 48)}
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                          File Selected
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {getFileSize(selectedFile.size)}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFile(null);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Remove File
                        </Button>
                      </Box>
                    ) : (
                      // Upload Prompt State
                      <Box textAlign="center" sx={{ zIndex: 1, position: 'relative' }}>
                        <Box
                          sx={{
                            mb: 2,
                            '& svg': {
                              animation: 'float 3s ease-in-out infinite',
                            },
                            '@keyframes float': {
                              '0%, 100%': { transform: 'translateY(0px)' },
                              '50%': { transform: 'translateY(-10px)' },
                            }
                          }}
                        >
                          <Upload sx={{ fontSize: 48, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Drop your file here
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          or click to browse files
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Supports PDF, DOC, DOCX, TXT (Max 10MB)
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Box sx={{ mt: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="primary.main" fontWeight="medium">
                          Uploading... {uploadProgress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                          }
                        }} 
                      />
                    </Box>
                  )}
                </Box>

                {/* Divider */}
                <Box 
                  sx={{ 
                    width: { xs: '100%', md: '1px' }, 
                    height: { xs: '1px', md: 'auto' },
                    background: 'linear-gradient(45deg, #e0e7ff, #c7d2fe)',
                    my: { xs: 2, md: 0 },
                    mx: { xs: 0, md: 2 }
                  }} 
                />

                {/* Right Column - Document Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3
                  }}>
                    <Edit sx={{ fontSize: 20 }} />
                    Document Details
                  </Typography>

                  <Stack spacing={3}>
                    {/* Enhanced Title Field */}
                    <TextField
                      fullWidth
                      label="Document Title"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'grey.300',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { fontWeight: 'medium' }
                      }}
                    />

                    {/* Enhanced Description Field */}
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                      placeholder="Add a detailed description of your document..."
                      variant="outlined"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'grey.300',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { fontWeight: 'medium' }
                      }}
                    />

                    {/* Enhanced Document Type */}
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: 'medium' }}>Document Type</InputLabel>
                      <Select
                        value={newDocument.type}
                        label="Document Type"
                        onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as "pdf" | "doc" | "txt" })}
                        sx={{
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'grey.300',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                          }
                        }}
                      >
                        <MenuItem value="pdf">
                          <Box display="flex" alignItems="center" gap={1}>
                            <PictureAsPdf color="error" />
                            PDF Document
                          </Box>
                        </MenuItem>
                        <MenuItem value="doc">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Description color="info" />
                            Word Document
                          </Box>
                        </MenuItem>
                        <MenuItem value="txt">
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextSnippet color="success" />
                            Text File
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {/* File Info Summary */}
                    {selectedFile && (
                      <Card variant="outlined" sx={{ 
                        p: 2, 
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        border: '1px solid #bae6fd',
                        borderRadius: 2
                      }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                          File Summary
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {getFileIcon(selectedFile.type || 'document', 32)}
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedFile.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          {/* Enhanced Actions */}
          <DialogActions 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderTop: '1px solid #e2e8f0',
              gap: 2
            }}
          >
            <Button 
              onClick={() => {
                // Close dialog and reset all form data
                setAddDocumentOpen(false);
                setSelectedFile(null);
                setNewDocument({ title: "", description: "", type: "pdf" });
                setUploadProgress(0);
                clearError(); // Clear any existing errors
              }}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'medium',
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.400',
                  backgroundColor: 'grey.50'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddDocument} 
              variant="contained"
              disabled={!selectedFile || !newDocument.title.trim() || (uploadProgress > 0 && uploadProgress < 100)}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'grey.300',
                  color: 'grey.500',
                  boxShadow: 'none',
                  transform: 'none',
                }
              }}
            >
              {uploadProgress > 0 && uploadProgress < 100 
                ? `Uploading... ${uploadProgress}%` 
                : 'Add Document'
              }
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add document"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => {
            setAddDocumentOpen(true);
            // Clear any previous success messages
            setShowSuccessSnackbar(false);
            setSuccessMessage('');
          }}
        >
          <Add />
        </Fab>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={4000}
          onClose={() => setShowSuccessSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSuccessSnackbar(false)} 
            severity="success" 
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
