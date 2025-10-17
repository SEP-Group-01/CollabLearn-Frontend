import { useState, useEffect } from "react"
import SidebarComponent from "../components/SideBar"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar
} from "@mui/material"
import {
  ArrowBack,
  Description,
  PlayCircle,
  Link as LinkIcon,
  Edit as EditIcon,
  ArrowForward,
  Add as AddIcon,
  PictureAsPdf,
  TextSnippet,
} from "@mui/icons-material"

import { getThread, getThreadResources, getThreadQuizzes } from "../api/threadsApi"
import { createDocument, checkAdminOrModerator, getDocumentsByThread } from "../api/editorApi"

import type { ThreadData, Document, Link, Video } from "../types/ThreadInterfaces"

// Extend Document interface with additional properties for editing documents
type EditingDocument = Document & {
  userPermission?: 'read' | 'write' | 'admin';
}

export default function ThreadPage() {
  const { workspaceId, threadId } = useParams<{ workspaceId: string; threadId: string }>()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  
  // State for real data
  const [threadData, setThreadData] = useState<ThreadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingDocuments, setEditingDocuments] = useState<EditingDocument[]>([])
  const [editingDocsLoading, setEditingDocsLoading] = useState(false)

  // State for document creation modal
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingPermissions, setCheckingPermissions] = useState(true)
  const [documentForm, setDocumentForm] = useState({
    title: '',
    content: '',
    isPublic: false
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // Helper functions to format data - moved above useEffect so they are initialized
  // before being referenced inside the effect (avoids TDZ/ReferenceError)
  
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size"
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(1)} MB`
    if (kb >= 1) return `${kb.toFixed(1)} KB`
    return `${bytes} B`
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date"
    return new Date(dateString).toLocaleDateString()
  }

  const getDisplayName = (userId?: string): string => {
    // You might want to fetch user names from an API
    // For now, return a placeholder
    return userId ? `User ${userId.slice(0, 8)}` : "Unknown user"
  }

  useEffect(() => {
    const fetchThreadData = async () => {
      if (!threadId || !workspaceId) {
        setError("Thread ID or Workspace ID is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch thread details, resources, and quizzes in parallel
        const [threadResponse, resourcesResponse, quizzesResponse] = await Promise.all([
          getThread(threadId),
          getThreadResources(threadId),
          getThreadQuizzes(threadId)
        ])

        // Separate resources by type and add display properties
        const documents: Document[] = resourcesResponse
          .filter((r: any) => r.resource_type === 'document')
          .map((r: any) => ({
            ...r,
            uploadedBy: getDisplayName(r.user_id),
            size: formatFileSize(r.file_size),
            uploadedAt: formatDate(r.created_at)
          }))
        
        const links: Link[] = resourcesResponse
          .filter((r: any) => r.resource_type === 'link')
          .map((r: any) => ({
            ...r,
            addedBy: getDisplayName(r.user_id),
            addedAt: formatDate(r.created_at),
            url: r.firebase_url
          }))
        
        const videos: Video[] = resourcesResponse
          .filter((r: any) => r.resource_type === 'video')
          .map((r: any) => ({
            ...r,
            addedBy: getDisplayName(r.user_id),
            addedAt: formatDate(r.created_at),
            url: r.firebase_url,
            duration: "5:30", // Hardcoded for now
            thumbnail: "", // Hardcoded for now
            views: 0
          }))

        // Transform quizzes and add display properties
        const transformedQuizzes = quizzesResponse.map((q: any) => ({
          ...q,
          title: q.title || "Untitled Quiz",
          description: q.description || "No description available",
          questions: 10, // Hardcoded for now
          timeLimit: 30, // Hardcoded for now
          attempts: 0, // Will be populated from attempts API
          bestScore: null,
          status: "not_started" as const,
          difficulty: "Medium" as const,
          createdBy: getDisplayName(q.creator_id),
          createdAt: formatDate(q.created_at)
        }))

        // Transform the data to match ThreadData interface
        const transformedData: ThreadData = {
          ...threadResponse,
          title: threadResponse.name, // Map name to title for backward compatibility
          workspaceId: workspaceId,
          workspaceTitle: "Workspace", // You might want to fetch this separately
          enrolled: true, // Hardcoded for now
          performance: {
            // Hardcoded values as requested
            progress: 75,
            lastScore: 85,
            completedQuizzes: 3,
            totalQuizzes: quizzesResponse.length,
            studyTime: 120,
            averageScore: 78,
            rank: 5,
            totalStudents: 25,
            completionRate: 60
          },
          resources: {
            documents,
            links,
            videos
          },
          quizzes: transformedQuizzes,
          currentlyEditing: editingDocuments // Use real editing documents data
        }

        setThreadData(transformedData)
      } catch (err) {
        console.error("Error fetching thread data:", err)
        setError("Failed to load thread data")
      } finally {
        setLoading(false)
      }
    }

    fetchThreadData()
  }, [threadId, workspaceId])

  // Check admin/moderator permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (!threadId) return

      try {
        setCheckingPermissions(true)
        const result = await checkAdminOrModerator(threadId)
        setIsAdmin(result.isAdminOrModerator)
      } catch (error) {
        console.error('Error checking permissions:', error)
        setIsAdmin(false)
      } finally {
        setCheckingPermissions(false)
      }
    }

    checkPermissions()
  }, [threadId])



  // Fetch editing documents for this thread
  useEffect(() => {
    const fetchEditingDocuments = async () => {
      if (!threadId) return

      try {
        setEditingDocsLoading(true)
        const documents = await getDocumentsByThread(threadId)
        
        // Transform documents to match the Document interface expected by the UI
        const transformedDocs: EditingDocument[] = documents.map(doc => ({
          id: doc.id,
          title: doc.title,
          mime_type: 'application/vnd.collaborative-document', // For collaborative documents
          uploadedBy: getDisplayName(doc.createdBy),
          uploadedAt: formatDate(doc.updatedAt),
          size: 'Collaborative Doc',
          user_id: doc.createdBy,
          thread_id: doc.threadId,
          resource_type: 'document' as const,
          created_at: doc.createdAt,
          updated_at: doc.updatedAt,
          isCurrentlyEditing: doc.isCurrentlyEditing || false,
          editedBy: doc.lastEditedBy,
          lastEditTime: doc.lastEditedAt,
          userPermission: doc.userPermission || 'read'
        }))
        
        setEditingDocuments(transformedDocs)
      } catch (error) {
        console.error('Error fetching editing documents:', error)
      } finally {
        setEditingDocsLoading(false)
      }
    }

    fetchEditingDocuments()
  }, [threadId])

  // Update threadData when editingDocuments changes
  useEffect(() => {
    if (threadData && editingDocuments.length !== threadData.currentlyEditing.length) {
      setThreadData(prev => prev ? { ...prev, currentlyEditing: editingDocuments } : null)
    }
  }, [editingDocuments, threadData])

  // Handle document creation
  const handleCreateDocument = async () => {
    if (!threadId || !documentForm.title.trim()) return

    try {
      setCreateLoading(true)
      const newDocument = await createDocument({
        title: documentForm.title,
        content: documentForm.content || '',
        threadId: threadId,
        isPublic: documentForm.isPublic
      })

      setSnackbar({
        open: true,
        message: 'Document created successfully!',
        severity: 'success'
      })

      // Reset form and close modal
      setDocumentForm({ title: '', content: '', isPublic: false })
      setCreateModalOpen(false)

      // Refresh the editing documents list
      try {
        const documents = await getDocumentsByThread(threadId)
        const transformedDocs: EditingDocument[] = documents.map(doc => ({
          id: doc.id,
          title: doc.title,
          mime_type: 'application/vnd.collaborative-document',
          uploadedBy: getDisplayName(doc.createdBy),
          uploadedAt: formatDate(doc.updatedAt),
          size: 'Collaborative Doc',
          user_id: doc.createdBy,
          thread_id: doc.threadId,
          resource_type: 'document' as const,
          created_at: doc.createdAt,
          updated_at: doc.updatedAt,
          isCurrentlyEditing: doc.isCurrentlyEditing || false,
          editedBy: doc.lastEditedBy,
          lastEditTime: doc.lastEditedAt,
          userPermission: doc.userPermission || 'read'
        }))
        setEditingDocuments(transformedDocs)
      } catch (error) {
        console.error('Error refreshing documents list:', error)
      }

      // Navigate to the collaborative editor for the new document
      navigate(`/workspace/${workspaceId}/threads/${threadId}/editor/${newDocument.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
      setSnackbar({
        open: true,
        message: 'Failed to create document. Please try again.',
        severity: 'error'
      })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleModalClose = () => {
    setCreateModalOpen(false)
    setDocumentForm({ title: '', content: '', isPublic: false })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !threadData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error || "Failed to load thread data"}
        </Alert>
      </Box>
    )
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <Description />
    
    if (mimeType.includes("pdf")) {
      return <PictureAsPdf color="error" />
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return <Description color="info" />
    } else if (mimeType.includes("text")) {
      return <TextSnippet color="success" />
    } else {
      return <Description />
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "success"
      case "Medium":
        return "warning"
      case "Hard":
        return "error"
      default:
        return "default"
    }
  }

  const openDocument = (documentId: number | string) => {
    // Check if documentId is valid before navigation
    if (!documentId || documentId === null || documentId === undefined) {
      console.error('❌ Invalid document ID for navigation:', documentId);
      return;
    }
    
    navigate(`/workspace/${workspaceId}/threads/${threadId}/documents/${documentId}`)
  }

  const openDocumentInEditor = (documentId: number | string) => {
    // Check if documentId is valid before navigation
    if (!documentId || documentId === null || documentId === undefined) {
      console.error('❌ Invalid document ID for navigation:', documentId);
      return;
    }

    navigate(`/workspace/${workspaceId}/threads/${threadId}/editor/${documentId}`)
  }

  const navigateToDocuments = () => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}/documents`)
  }

  const navigateToLinks = () => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}/links`)
  }

  const navigateToVideos = () => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}/videos`)
  }

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
    {/* Sidebar - Hidden on small screens, can be toggled */}
      {!isSmallScreen && (
        <Box sx={{
          width: collapsed ? 80 : 240,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: "1px solid #e0e0e0",
        }}>
          <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        </Box>
      )}

     {/* Main Content */}
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        p: { xs: 2, md: 4 },
        maxWidth: "100%",
        overflowX: "hidden",
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>

      {/* Header with Back Button */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={2} 
        sx={{
          mb: 0, // Remove margin since we're using gap in parent
        }}
      >
          <IconButton 
          onClick={() => navigate(`/workspace/${workspaceId}`)} 
          sx={{ 
            bgcolor: "action.hover",
            '&:hover': {
              bgcolor: "action.selected",
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          {loading ? (
            <Typography variant="h5">Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : threadData ? (
            <>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {threadData.title}
              </Typography>
              <Typography color="text.secondary" variant="body1">
                {threadData.description}
              </Typography>
            </>
          ) : (
            <Typography variant="h5">Thread not found</Typography>
          )}
        </Box>
      </Box>
    

      <Box>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            color: "text.primary",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            "&::before": {
              content: '""',
              display: "block",
              width: 8,
              height: 32,
              bgcolor: "primary.main",
              borderRadius: 2
            }
          }}
        >
    📚 Learning Resources
  </Typography>
  
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        md: 'repeat(3, 1fr)' 
      },
      gap: 3,
      alignItems: 'stretch',
    }}
  >
    {[
      {
        title: "Documents",
        icon: <Description fontSize="large" />,
        count: threadData?.resources.documents.length ?? 0,
        onClick: navigateToDocuments,
        color: "primary",
        description: "PDFs, Word docs, and text files"
      },
      {
        title: "External Links",
        icon: <LinkIcon fontSize="large" />,
        count: threadData?.resources.links.length ?? 0,
        onClick: navigateToLinks,
        color: "secondary",
        description: "Courses, tutorials, and references"
      },
      {
        title: "Video Content",
        icon: <PlayCircle fontSize="large" />,
        count: threadData?.resources.videos.length ?? 0,
        onClick: navigateToVideos,
        color: "info",
        description: "Lectures and demonstrations"
      },
    ].map((card, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            borderRadius: 4,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            transition: "all 0.4s cubic-bezier(0.25,0.8,0.25,1)",
            "&:hover": { 
              transform: "translateY(-8px)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)" 
            },
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden"
          }}
          onClick={card.onClick}
        >
          <Box
            sx={{
              bgcolor: `${card.color}.main`,
              color: "white",
              py: 3,
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -20,
                right: -20,
                width: 60,
                height: 60,
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: "50%"
              }
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ opacity: 0.9 }}>
                {card.title}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {card.description}
              </Typography>
            </Box>
          </Box>
          
          <CardContent 
            sx={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center",
              alignItems: "center",
              py: 4,
              position: "relative"
            }}
          >
            <Typography 
              variant="h1" 
              fontWeight="bold" 
              color={`${card.color}.main`}
              sx={{ 
                fontSize: "4rem",
                lineHeight: 1,
                mb: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {card.count}
            </Typography>
            
            <Button
              variant="outlined"
              size="small"
              color={card.color as "primary" | "secondary" | "info" | "inherit" | "success" | "error" | "warning"}
              endIcon={<ArrowForward />}
              sx={{
                mt: 2,
                borderRadius: 20,
                px: 3,
                textTransform: "none",
                fontWeight: "bold",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2
                }
              }}
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      </Box>
    ))}
  </Box>
      </Box>

      {/* Quizzes Section */}
      <Card sx={{ 
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }
      }}>
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            p: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <EditIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                Quizzes
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Test your knowledge and track progress
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                lineHeight: 1
              }}
            >
              {threadData?.quizzes.length ?? 0}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {threadData?.quizzes.length === 0 
                ? 'No quizzes available yet. Check back later for new assessments.'
                : `${threadData?.quizzes.length} quiz${threadData?.quizzes.length === 1 ? '' : 'es'} available to test your knowledge and skills.`
              }
            </Typography>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}/quizzes`)}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Explore
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Currently Editing Documents - Always visible but with different styling when empty */}
      <Card sx={{ 
        bgcolor: "background.paper",
        border: "1px solid", 
        borderColor: "divider",
        borderRadius: 2,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
}}>
  <CardHeader
    title={
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Box display="flex" alignItems="center" gap={1}>
          <EditIcon color={threadData && threadData.currentlyEditing.length > 0 ? "primary" : "disabled"} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {threadData && threadData.currentlyEditing.length > 0 ? "Currently Being Edited" : "No Documents Being Edited"}
          </Typography>
        </Box>
        
        {/* Create Document Button - Only for admins/moderators */}
        {isAdmin && !checkingPermissions && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              borderRadius: 20,
              px: 3,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(25,118,210,0.4)"
              }
            }}
          >
            Create Document
          </Button>
        )}
      </Box>
    }
    sx={{
      py: 1.5,
      borderBottom: "1px solid",
      borderColor: "divider"
    }}
  />
  <CardContent sx={{ p: 0 }}>
    {editingDocsLoading ? (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    ) : threadData && threadData.currentlyEditing.length > 0 ? (
      <Stack spacing={2} sx={{ p: 2 }}>
        {threadData.currentlyEditing.map((doc) => (
          <Card
            key={doc.id}
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { 
                transform: "translateY(-1px)", 
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderColor: "primary.main"
              },
            }}
            onClick={() => {
              // Ensure doc.id exists and is valid before navigation
              if (doc.id && doc.id !== null && doc.id !== undefined) {
                openDocumentInEditor(doc.id);
              } else {
                console.error('❌ Document has invalid ID:', doc);
              }
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box display="flex" alignItems="center" gap={2}>
                <EditIcon color="primary" />
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {doc.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Created by {doc.uploadedBy} • {doc.uploadedAt}
                    </Typography>
                    {(doc as EditingDocument).userPermission && (
                      <Chip 
                        label={(doc as EditingDocument).userPermission!.toUpperCase()} 
                        size="small"
                        color={
                          (doc as EditingDocument).userPermission === 'admin' ? 'error' :
                          (doc as EditingDocument).userPermission === 'write' ? 'primary' : 'default'
                        }
                        sx={{ height: 18, fontSize: '0.7rem' }}
                      />
                    )}
                    {doc.isCurrentlyEditing && doc.editedBy && (
                      <Chip 
                        label={`Editing: ${getDisplayName(doc.editedBy)}`}
                        size="small"
                        color="warning"
                        sx={{ height: 18, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="small" 
                  startIcon={<EditIcon />}
                >
                  Open Editor
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    ) : (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        textAlign="center" 
        sx={{ p: 3 }}
      >
        No documents are currently being edited. Start collaborating by opening a document!
      </Typography>
    )}
  </CardContent>
</Card>
    
    {/* Create Document Modal */}
    
    <Dialog 
      open={createModalOpen} 
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle 
        sx={{ 
          fontWeight: "bold",
          pb: 1
        }}
      >
        Create New Document
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: "normal" }}>
          Create a collaborative document for this thread
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Document Title"
            variant="outlined"
            fullWidth
            required
            value={documentForm.title}
            onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Meeting Notes, Project Plan, Research Document"
            helperText="Give your document a descriptive title"
          />
          
          <TextField
            label="Initial Content (Optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={documentForm.content}
            onChange={(e) => setDocumentForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="You can add some initial content here, or leave it blank and start editing later..."
            helperText="You can always edit this content later in the collaborative editor"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={documentForm.isPublic}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Make document public
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Public documents can be viewed by anyone with the link
                </Typography>
              </Box>
            }
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleModalClose}
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateDocument}
          variant="contained"
          disabled={!documentForm.title.trim() || createLoading}
          startIcon={createLoading ? <CircularProgress size={16} /> : <AddIcon />}
          sx={{ 
            textTransform: 'none',
            minWidth: 120
          }}
        >
          {createLoading ? 'Creating...' : 'Create Document'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Snackbar for notifications */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </Box>
    </Box>
  )
}