"use client"

import type React from "react"
import SidebarComponent from "../components/SideBar"

import { useState } from "react"
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
  OutlinedInput,
  Rating,
  Fab,
  useTheme,
  useMediaQuery,
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
  Warning,
  Add,
  Upload,
  Search,
  ThumbUp,
  ChatBubbleOutline,
} from "@mui/icons-material"

interface Document {
  id: number
  title: string
  description: string
  type: "pdf" | "doc" | "txt"
  size: string
  uploadedBy: string
  uploadedAt: string
  views: number
  downloads: number
  rating: number
  totalRatings: number
  comments: number
  tags: string[]
  isEditing: boolean
  editor?: string
  editingSince?: string
  likes: number
}

const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Linear Algebra Fundamentals",
    description:
      "Comprehensive guide covering vectors, matrices, eigenvalues, and linear transformations with practical examples and exercises.",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Dr. Johnson",
    uploadedAt: "2024-01-15",
    views: 156,
    downloads: 89,
    rating: 4.5,
    totalRatings: 23,
    comments: 12,
    tags: ["fundamentals", "vectors", "matrices", "eigenvalues"],
    isEditing: true,
    editor: "Alex Chen",
    editingSince: "2 minutes ago",
    likes: 34,
  },
  {
    id: 2,
    title: "Matrix Operations Step-by-Step",
    description:
      "Detailed walkthrough of matrix operations including addition, multiplication, inverse, and determinant calculations with solved examples.",
    type: "doc",
    size: "1.8 MB",
    uploadedBy: "Alex Chen",
    uploadedAt: "2024-01-18",
    views: 98,
    downloads: 45,
    rating: 4.2,
    totalRatings: 18,
    comments: 8,
    tags: ["operations", "multiplication", "inverse", "examples"],
    isEditing: true,
    editor: "Maria Rodriguez",
    editingSince: "15 minutes ago",
    likes: 28,
  },
  {
    id: 3,
    title: "Practice Problems Collection",
    description:
      "Curated collection of linear algebra practice problems with detailed solutions and explanations for self-study.",
    type: "txt",
    size: "156 KB",
    uploadedBy: "Maria Rodriguez",
    uploadedAt: "2024-01-20",
    views: 67,
    downloads: 34,
    rating: 4.0,
    totalRatings: 15,
    comments: 5,
    tags: ["practice", "problems", "solutions", "self-study"],
    isEditing: false,
    likes: 19,
  },
  {
    id: 4,
    title: "Eigenvalues and Eigenvectors Tutorial",
    description:
      "In-depth tutorial explaining eigenvalues and eigenvectors with geometric interpretations and real-world applications.",
    type: "pdf",
    size: "3.2 MB",
    uploadedBy: "Dr. Johnson",
    uploadedAt: "2024-01-22",
    views: 134,
    downloads: 78,
    rating: 4.7,
    totalRatings: 31,
    comments: 16,
    tags: ["eigenvalues", "eigenvectors", "tutorial", "applications"],
    isEditing: false,
    likes: 42,
  },
  {
    id: 5,
    title: "Vector Spaces and Linear Independence",
    description:
      "Comprehensive notes on vector spaces, subspaces, linear independence, and basis with proofs and examples.",
    type: "doc",
    size: "2.1 MB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "2024-01-25",
    views: 89,
    downloads: 56,
    rating: 4.3,
    totalRatings: 20,
    comments: 9,
    tags: ["vector-spaces", "independence", "basis", "proofs"],
    isEditing: false,
    likes: 25,
  },
  {
    id: 6,
    title: "Linear Transformations Visualized",
    description:
      "Visual guide to understanding linear transformations with interactive examples and geometric interpretations.",
    type: "pdf",
    size: "4.1 MB",
    uploadedBy: "Mike Chen",
    uploadedAt: "2024-01-28",
    views: 112,
    downloads: 67,
    rating: 4.6,
    totalRatings: 25,
    comments: 14,
    tags: ["transformations", "visual", "geometry", "interactive"],
    isEditing: false,
    likes: 38,
  },
]

export default function ModuleDocumentsPage() {
  const { groupId, moduleId } = useParams()
  const navigate = useNavigate()
   const [collapsed, setCollapsed] = useState(false);
   const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [addDocumentOpen, setAddDocumentOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags] = useState<string[]>([])
  // Note: setSelectedTags would be used for tag filtering functionality (not implemented yet)
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    type: "pdf" as "pdf" | "doc" | "txt",
    tags: [] as string[],
  })

  const currentlyEditing = mockDocuments.filter((doc) => doc.isEditing)
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => doc.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const allTags = Array.from(new Set(mockDocuments.flatMap((doc) => doc.tags)))

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <PictureAsPdf color="error" sx={{ fontSize: 32 }} />
      case "doc":
        return <Description color="info" sx={{ fontSize: 32 }} />
      case "txt":
        return <TextSnippet color="success" sx={{ fontSize: 32 }} />
      default:
        return <Description sx={{ fontSize: 32 }} />
    }
  }

  const handleDocumentClick = (docId: number) => {
    navigate(`/dashboard/groups/${groupId}/modules/${moduleId}/documents/${docId}`)
  }

  const handleDocumentQuery = () => {
    navigate(`/query`)
  }

  const handleAddDocument = () => {
    // Here you would typically make an API call to add the document
    console.log("Adding document:", newDocument)
    setAddDocumentOpen(false)
    setNewDocument({ title: "", description: "", type: "pdf", tags: [] })
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
      }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/dashboard/groups/${groupId}/modules/${moduleId}`)}
          >
            Back to Module
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Button 
            variant="contained"
            startIcon={<Search />} 
            onClick={() => handleDocumentQuery()}
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
            onClick={() => setAddDocumentOpen(true)}
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

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        </CardContent>
      </Card>

      {/* Currently Editing Alert */}
      {currentlyEditing.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Warning />
              Documents Currently Being Edited ({currentlyEditing.length})
            </Box>
          </AlertTitle>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            These documents are currently being edited by other users.
          </Typography>
        </Alert>
      )}

      {/* Documents Grid */}
      <Stack spacing={3}>
        {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                border: doc.isEditing ? "2px solid" : "1px solid",
                borderColor: doc.isEditing ? "warning.main" : "divider",
                width: "100%",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
              }}
              onClick={() => handleDocumentClick(doc.id)}
            >
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, gap: 2 }}>
                {/* Document Icon and Basic Info */}
                <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: { xs: "auto", md: "300px" } }}>
                  <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                    {getFileIcon(doc.type)}
                  </Box>
                  <Box flexGrow={1} minWidth={0}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                      {doc.size} • {doc.uploadedBy} • {doc.uploadedAt}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Box flexGrow={1} sx={{ minWidth: { xs: "auto", md: "200px" } }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.4
                    }}
                  >
                    {doc.description}
                  </Typography>
                </Box>

                {/* Rating and Stats */}
                <Box 
                  display="flex" 
                  flexDirection={{ xs: "row", md: "column" }} 
                  alignItems={{ xs: "space-between", md: "flex-end" }} 
                  justifyContent="space-between"
                  gap={1}
                  sx={{ minWidth: { xs: "auto", md: "150px" } }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={doc.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({doc.totalRatings})
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <ThumbUp fontSize="small" color="action" />
                      <Typography variant="body2">{doc.likes}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <ChatBubbleOutline fontSize="small" color="action" />
                      <Typography variant="body2">{doc.comments}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Menu Button */}
                <Box>
                  <IconButton size="small" onClick={(e) => handleMenuClick(e)}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>

              {/* Action Buttons */}
              <Box 
                p={2} 
                sx={{ 
                  display: "flex", 
                  flexDirection: "row",
                  gap: 1,
                  minWidth: { xs: "auto", md: "120px" },
                  borderLeft: { xs: "none", md: "1px solid" },
                  borderTop: { xs: "1px solid", md: "none" },
                  borderColor: "divider"
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDocumentClick(doc.id)
                  }}
                >
                  View
                </Button>
              </Box>
            </Card>
        ))}
      </Stack>

      {/* No Results */}
      {filteredDocuments.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Box>
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

      {/* Add Document Dialog */}
      <Dialog open={addDocumentOpen} onClose={() => setAddDocumentOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Document Title"
              value={newDocument.title}
              onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newDocument.description}
              onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={newDocument.type}
                label="Document Type"
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as "pdf" | "doc" | "txt" })}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="doc">Document</MenuItem>
                <MenuItem value="txt">Text</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={newDocument.tags}
                onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value as string[] })}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {allTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<Upload />} component="label" fullWidth>
              Upload File
              <input type="file" hidden accept=".pdf,.doc,.docx,.txt" />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDocumentOpen(false)}>Cancel</Button>
          <Button onClick={handleAddDocument} variant="contained">
            Add Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add document"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setAddDocumentOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
    </Box>
  )
}
