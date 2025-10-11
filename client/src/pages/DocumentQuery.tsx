import React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useResourceActions } from '../hooks/useResourceActions'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  Collapse,
  Badge,
  Tooltip,
  InputAdornment,
} from "@mui/material"
import {
  ArrowBack,
  Send,
  SmartToy,
  Person,
  ContentCopy,
  Refresh,
  Description,
  PictureAsPdf,
  TextSnippet,
  Search,
  SelectAll,
  ClearAll,
  FilterList,
  InsertDriveFile,
} from "@mui/icons-material"

// Define interfaces for the query page
interface QueryDocument {
  id: string
  title: string
  description?: string
  type: string
  mime_type?: string
  file_size?: number
  firebase_url?: string
  created_at?: string
  uploadedAt?: string
  uploadedBy?: string
  isSelected: boolean
  views?: number
  tags?: string[]
}

interface ChatMessage {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
  selectedDocuments?: number[]
  references?: {
    documentId: number
    documentTitle: string
    page: number
    section: string
    text: string
  }[]
}


export default function DocumentQuery() {
  const { workspaceId, threadId } = useParams<{ workspaceId: string; threadId: string }>()
  const navigate = useNavigate()
  
  // Real API integration
  const { fetchDocuments } = useResourceActions(workspaceId || '1', threadId || '1')
  
  const [documents, setDocuments] = useState<QueryDocument[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI assistant for document querying. Select one or more documents from the left panel, and I'll help you find information, explain concepts, or answer questions across all selected documents. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load documents from API on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const realDocuments = await fetchDocuments()
        const queryDocuments: QueryDocument[] = realDocuments.map(doc => ({
          id: doc.id.toString(),
          title: doc.title,
          description: doc.description || 'No description available',
          type: doc.type || 'document',
          mime_type: doc.mime_type,
          file_size: doc.file_size,
          firebase_url: doc.firebase_url,
          created_at: doc.created_at,
          uploadedAt: doc.uploadedAt,
          uploadedBy: doc.uploadedBy || 'Unknown',
          isSelected: false,
          views: Math.floor(Math.random() * 100) + 1, // Mock views for now
          tags: ['Programming', 'Tutorial', 'Reference'] // Mock tags for now
        }))
        setDocuments(queryDocuments)
        console.log('✅ Documents loaded for query:', queryDocuments)
      } catch (err) {
        console.error('❌ Failed to load documents:', err)
      }
    }
    
    if (workspaceId && threadId) {
      loadDocuments()
    }
  }, [fetchDocuments, workspaceId, threadId])

  const selectedDocuments = documents.filter((doc) => doc.isSelected)
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTags = selectedTags.length === 0 || (doc.tags && selectedTags.some((tag) => doc.tags!.includes(tag)))
    return matchesSearch && matchesTags
  })

  const allTags = Array.from(new Set(documents.flatMap((doc) => doc.tags || [])))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDocumentToggle = (documentId: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, isSelected: !doc.isSelected } : doc)))
  }

  const handleSelectAll = () => {
    const allSelected = filteredDocuments.every((doc) => doc.isSelected)
    setDocuments((prev) =>
      prev.map((doc) => {
        if (filteredDocuments.some((filtered) => filtered.id === doc.id)) {
          return { ...doc, isSelected: !allSelected }
        }
        return doc
      }),
    )
  }

  const handleClearAll = () => {
    setDocuments((prev) => prev.map((doc) => ({ ...doc, isSelected: false })))
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || selectedDocuments.length === 0) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      selectedDocuments: selectedDocuments.map((doc) => parseInt(doc.id)),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: generateAIResponse(inputValue, selectedDocuments),
        timestamp: new Date(),
        references: generateReferences(selectedDocuments),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 2500)
  }

  const generateAIResponse = (query: string, selectedDocs: QueryDocument[]): string => {
    const docTitles = selectedDocs.map((doc) => doc.title).join(", ")

    if (query.toLowerCase().includes("vector")) {
      return `Based on the selected documents (${docTitles}), vectors are fundamental mathematical objects with both magnitude and direction. The Linear Algebra Fundamentals document explains that vectors can be represented as ordered lists of numbers, while the Vector Space Theory Notes provide detailed coverage of vector spaces and their properties. Linear transformations, as covered in the Linear Transformations Handbook, show how vectors are mapped from one space to another.`
    }
    if (query.toLowerCase().includes("matrix")) {
      return `According to your selected documents (${docTitles}), matrices are rectangular arrays of numbers that represent linear transformations. The Matrix Operations Guide provides comprehensive coverage of matrix arithmetic, while the Linear Algebra Fundamentals explains how matrices relate to linear transformations. The Practice Problems Collection includes numerous examples of matrix calculations.`
    }
    if (query.toLowerCase().includes("eigenvalue")) {
      return `From the selected documents (${docTitles}), eigenvalues are special scalars λ where Av = λv for some non-zero vector v. The Eigenvalue Problem Solutions document provides various methods for finding eigenvalues, while the Linear Algebra Fundamentals covers the theoretical foundation. These concepts are essential for understanding the behavior of linear transformations.`
    }
    return `I've analyzed the selected documents (${docTitles}) and found relevant information that addresses your question. The content spans multiple documents and provides comprehensive coverage of the topic. Could you be more specific about which aspect you'd like me to elaborate on?`
  }

  const generateReferences = (selectedDocs: QueryDocument[]) => {
    return selectedDocs.slice(0, 3).map((doc, index) => ({
      documentId: parseInt(doc.id),
      documentTitle: doc.title,
      page: Math.floor(Math.random() * 50) + 1,
      section: `Section ${index + 2}.${Math.floor(Math.random() * 5) + 1}`,
      text: `Relevant excerpt from ${doc.title} that relates to the query...`,
    }))
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }


  const getFileIcon = (mimeType: string) => {
    const type = mimeType?.toLowerCase() || ''
    if (type.includes('pdf')) {
      return <PictureAsPdf color="error" />
    } else if (type.includes('doc') || type.includes('word')) {
      return <Description color="primary" />
    } else if (type.includes('text') || type.includes('txt')) {
      return <TextSnippet color="info" />
    } else {
      return <InsertDriveFile />
    }
  }

  return (
    <Box sx={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* Header */}
      <Paper elevation={1} sx={{ 
        p: 3, 
        borderRadius: 0, 
        zIndex: 1000,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}/documents`)}
              sx={{ 
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white'
                }
              }}
              variant="outlined"
            >
              Back to Documents
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                🤖 AI Document Query Assistant
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Select documents and ask questions across multiple sources
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Badge badgeContent={selectedDocuments.length} color="secondary" overlap="rectangular">
              <Chip 
                icon={<SmartToy />} 
                label="AI Assistant" 
                sx={{ 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}
              />
            </Badge>
            <Tooltip title="Refresh">
              <IconButton 
                onClick={() => window.location.reload()}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Left Panel - Document Selection */}
        <Paper
          elevation={3}
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          {/* Document Panel Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: "1px solid", 
            borderColor: "divider",
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold" sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                📚 Select Documents
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Select All">
                  <IconButton 
                    size="small" 
                    onClick={handleSelectAll}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'primary.dark' }
                    }}
                  >
                    <SelectAll fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear All">
                  <IconButton 
                    size="small" 
                    onClick={handleClearAll}
                    sx={{
                      backgroundColor: 'grey.400',
                      color: 'white',
                      '&:hover': { backgroundColor: 'grey.600' }
                    }}
                  >
                    <ClearAll fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filters">
                  <IconButton 
                    size="small" 
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{
                      backgroundColor: showFilters ? 'secondary.main' : 'grey.400',
                      color: 'white',
                      '&:hover': { backgroundColor: showFilters ? 'secondary.dark' : 'grey.600' }
                    }}
                  >
                    <FilterList fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="🔍 Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.dark',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filters */}
            <Collapse in={showFilters}>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
                  🏷️ Filter by tags:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {allTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      clickable
                      color={selectedTags.includes(tag) ? "primary" : "default"}
                      onClick={() => {
                        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                      }}
                      sx={{
                        fontWeight: selectedTags.includes(tag) ? 'bold' : 'normal',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>

            {/* Selected Documents Summary */}
            {selectedDocuments.length > 0 && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 2,
                  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  border: '1px solid #b8dabc'
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  ✅ {selectedDocuments.length} document{selectedDocuments.length > 1 ? "s" : ""} selected for AI querying
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Document List */}
          <Box sx={{ flexGrow: 1, overflow: "auto", background: 'white' }}>
            <List sx={{ p: 1 }}>
              {filteredDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: doc.isSelected ? 'primary.main' : "divider",
                    "&:hover": { 
                      bgcolor: "primary.50",
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    },
                    bgcolor: doc.isSelected ? "primary.100" : "transparent",
                    borderRadius: 2,
                    mb: 1,
                    transition: 'all 0.2s ease-in-out',
                    border: doc.isSelected ? '2px solid' : '1px solid transparent',
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox 
                      checked={doc.isSelected} 
                      onChange={() => handleDocumentToggle(doc.id)} 
                      color="primary"
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </ListItemIcon>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Box sx={{
                        p: 0.5,
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        },
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {React.cloneElement(getFileIcon(doc.mime_type || 'document'), { sx: { fontSize: 20 } })}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{
                          background: doc.isSelected ? 'linear-gradient(45deg, #1976d2, #42a5f5)' : 'linear-gradient(45deg, #424242, #616161)',
                          backgroundClip: 'text',
                          color: 'transparent',
                          fontSize: '0.9rem',
                          mb: 0.25
                        }}>
                          {doc.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: "0.75rem",
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {doc.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            {filteredDocuments.length === 0 && (
              <Box textAlign="center" py={8}>
                <Box sx={{
                  mb: 2,
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
                }}>
                  <InsertDriveFile sx={{ fontSize: 48, color: 'text.disabled' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" color="text.secondary" gutterBottom>
                  No documents found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No documents match your search criteria
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Right Panel - Chat Interface */}
        <Box sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column",
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          {/* Chat Messages */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: "auto", 
            p: 3, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  display="flex"
                  justifyContent={message.type === "user" ? "flex-end" : "flex-start"}
                  gap={2}
                >
                  {message.type === "ai" && (
                    <Avatar sx={{ 
                      bgcolor: "primary.main", 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)'
                    }}>
                      <SmartToy />
                    </Avatar>
                  )}

                  <Card
                    sx={{
                      maxWidth: "75%",
                      bgcolor: message.type === "user" 
                        ? "linear-gradient(45deg, #667eea 30%, #764ba2 90%)" 
                        : "white",
                      color: message.type === "user" ? "white" : "text.primary",
                      boxShadow: message.type === "user" 
                        ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                        {message.content}
                      </Typography>

                      {/* AI References */}
                      {message.type === "ai" && message.references && message.references.length > 0 && (
                        <Box mt={3}>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block" fontWeight="bold">
                            📚 References from selected documents:
                          </Typography>
                          <Stack spacing={1}>
                            {message.references.map((ref, index) => (
                              <Paper key={index} variant="outlined" sx={{ 
                                p: 2, 
                                bgcolor: "grey.50",
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'primary.100',
                                '&:hover': {
                                  bgcolor: 'primary.50',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                  {getFileIcon(documents.find((d) => d.id === ref.documentId.toString())?.mime_type || "application/pdf")}
                                  <Typography variant="caption" fontWeight="bold" color="primary">
                                    {ref.documentTitle}
                                  </Typography>
                                </Box>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                        <Typography variant="caption" color={message.type === "user" ? "rgba(255,255,255,0.7)" : "text.secondary"}>
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                        {message.type === "ai" && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Tooltip title="Copy response">
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(message.content)}
                                sx={{
                                  backgroundColor: 'primary.100',
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.200',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  {message.type === "user" && (
                    <Avatar sx={{ 
                      bgcolor: "grey.400", 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      boxShadow: '0 4px 8px rgba(255, 107, 107, 0.3)'
                    }}>
                      <Person />
                    </Avatar>
                  )}
                </Box>
              ))}

              {/* Loading Message */}
              {isLoading && (
                <Box display="flex" justifyContent="flex-start" gap={1}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    <SmartToy fontSize="small" />
                  </Avatar>
                  <Card sx={{ bgcolor: "white" }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Analyzing {selectedDocuments.length} selected document
                          {selectedDocuments.length > 1 ? "s" : ""}...
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Input Area */}
          <Paper elevation={5} sx={{ 
            p: 3, 
            borderRadius: 0,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderTop: '3px solid',
            borderImage: 'linear-gradient(45deg, #667eea, #764ba2) 1'
          }}>
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              {selectedDocuments.length === 0 ? (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                    border: '1px solid #f6c23e',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    ⚠️ Please select at least one document from the left panel to start querying.
                  </Typography>
                </Alert>
              ) : (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
                    border: '1px solid #5bc0de',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    🚀 Ask questions about the {selectedDocuments.length} selected document
                    {selectedDocuments.length > 1 ? "s" : ""}. The AI will search across all selected documents to
                    provide comprehensive answers.
                  </Typography>
                </Alert>
              )}

              <Box display="flex" gap={2} alignItems="flex-end">
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder={
                    selectedDocuments.length > 0
                      ? "💬 Ask a question about the selected documents..."
                      : "Select documents first, then ask your question..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || selectedDocuments.length === 0}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.dark',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || selectedDocuments.length === 0}
                  sx={{ 
                    minWidth: 120, 
                    height: 56, 
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a3f8c 90%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {isLoading ? 'Thinking...' : 'Send'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
