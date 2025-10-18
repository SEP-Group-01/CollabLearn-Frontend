import React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useResourceActions } from '../hooks/useResourceActions'
import { getUserData } from '../api/authApi'
import { queryDocuments, getConversations, getConversationMessages } from '../api/queryApi'
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
  InsertDriveFile,
} from "@mui/icons-material"

// Define interfaces for the query page
interface QueryDocument {
  id: string
  title: string
  description?: string
  resource_type: "document" | "video" | "link"
  mime_type?: string
  file_size?: number
  firebase_url?: string
  created_at?: string
  uploadedAt?: string
  uploadedBy?: string
  isSelected: boolean
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  selectedDocuments?: string[]
  references?: {
    documentId: string
    documentTitle: string
    page?: number
    relevanceScore?: number
    text: string
  }[]
}


export default function DocumentQuery() {
  const { workspaceId, threadId } = useParams<{ workspaceId: string; threadId: string }>()
  const navigate = useNavigate()
  
  // Real API integration
  const { fetchDocuments } = useResourceActions(workspaceId || '', threadId || '')
  
  const [documents, setDocuments] = useState<QueryDocument[]>([])
  const [conversations, setConversations] = useState<Array<{id: string; title: string; created_at: string}>>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for document querying. Select one or more documents from the left panel, and I'll help you find information, explain concepts, or answer questions across all selected documents. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const userData = await getUserData()
        if (!userData?.id || !threadId) {
          console.log('[DocumentQuery] Cannot load conversations - missing userId or threadId')
          return
        }
        
        console.log('[DocumentQuery] Loading conversations for user:', userData.id, 'thread:', threadId)
        const response = await getConversations(userData.id, threadId)
        console.log('[DocumentQuery] Conversations response:', response)
        
        if (response.success && response.data) {
          console.log('[DocumentQuery] Setting conversations:', response.data.conversations)
          setConversations(response.data.conversations)
        } else {
          console.error('[DocumentQuery] Failed to load conversations:', response.error)
        }
      } catch (error) {
        console.error('[DocumentQuery] Error loading conversations:', error)
      }
    }
    
    if (threadId) {
      loadConversations()
    }
  }, [threadId])

  // Load conversation messages when a conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) {
        console.log('[DocumentQuery] No conversation selected, showing welcome message')
        // Reset to welcome message
        setMessages([
          {
            id: "1",
            role: "assistant",
            content:
              "Hello! I'm your AI assistant for document querying. Select one or more documents from the left panel, and I'll help you find information, explain concepts, or answer questions across all selected documents. What would you like to know?",
            timestamp: new Date(),
          },
        ])
        return
      }

      console.log('[DocumentQuery] Loading messages for conversation:', currentConversationId)
      const response = await getConversationMessages(currentConversationId)
      console.log('[DocumentQuery] Messages response:', response)
      
      if (response.success && response.data) {
        const loadedMessages = response.data.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          references: msg.references?.map(ref => ({
            documentId: ref.resourceId,
            documentTitle: ref.documentTitle,
            page: ref.pageNumber,
            relevanceScore: ref.relevanceScore,
            text: ref.excerpt || ''
          }))
        }))
        console.log('[DocumentQuery] Setting messages:', loadedMessages)
        setMessages(loadedMessages)
      } else {
        console.error('[DocumentQuery] Failed to load messages:', response.error)
      }
    }

    loadMessages()
  }, [currentConversationId])

  // Load documents from API on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const realDocuments = await fetchDocuments()
        const queryDocuments: QueryDocument[] = realDocuments.map(doc => ({
          id: doc.id,
          title: doc.title,
          description: doc.description || 'No description available',
          resource_type: doc.resource_type || 'document',
          mime_type: doc.mime_type,
          file_size: doc.file_size,
          firebase_url: doc.firebase_url,
          created_at: doc.created_at,
          uploadedAt: doc.uploadedAt || doc.created_at,
          uploadedBy: doc.uploadedBy || 'Unknown',
          isSelected: false,
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
    return matchesSearch
  })

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
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      selectedDocuments: selectedDocuments.map((doc) => doc.id),
    }

    setMessages((prev) => [...prev, userMessage])
    const query = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // Get current user
      const userData = await getUserData()
      if (!userData?.id) {
        throw new Error('User not authenticated')
      }

      console.log('[DocumentQuery] Sending query to API:', {
        userId: userData.id,
        query,
        selectedDocuments: selectedDocuments.map(d => d.id)
      })

      // Call the actual API
      const response = await queryDocuments({
        userId: userData.id,
        conversationId: currentConversationId || undefined,
        query,
        selectedDocuments: selectedDocuments.map((doc) => doc.id),
      })

      console.log('[DocumentQuery] API Response:', response)

      if (response.success && response.data) {
        // Update conversation ID if this was a new conversation
        if (response.data.conversationId && !currentConversationId) {
          setCurrentConversationId(response.data.conversationId)
          // Reload conversations list
          const convsResponse = await getConversations(userData.id, threadId!)
          if (convsResponse.success && convsResponse.data) {
            setConversations(convsResponse.data.conversations)
          }
        }

        // Update user message with actual ID from server
        if (response.data.userMessageId) {
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === userMessage.id 
                ? { ...msg, id: response.data!.userMessageId! }
                : msg
            )
          )
        }

        const aiResponse: ChatMessage = {
          id: response.data.messageId,
          role: "assistant",
          content: response.data.response,
          timestamp: new Date(),
          references: response.data.references.map(ref => ({
            documentId: ref.resourceId,
            documentTitle: ref.documentTitle,
            page: ref.pageNumber,
            relevanceScore: ref.relevanceScore,
            text: ref.excerpt
          })),
        }

        setMessages((prev) => [...prev, aiResponse])
      } else {
        // Handle error response
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${response.error || 'Unknown error occurred'}`,
          timestamp: new Date(),
          references: [],
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('[DocumentQuery] Error querying documents:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error while processing your question. Please try again.`,
        timestamp: new Date(),
        references: [],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
          {/* Conversation History Section */}
          <Box sx={{ 
            p: 2, 
            borderBottom: "2px solid", 
            borderColor: "divider",
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{
              color: 'primary.main',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              💬 Conversation History
            </Typography>
            
            {conversations.length === 0 ? (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No previous conversations
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                {conversations.map((conv) => (
                  <Card
                    key={conv.id}
                    onClick={() => {
                      console.log('[DocumentQuery] Selected conversation:', conv.id)
                      setCurrentConversationId(conv.id)
                    }}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: currentConversationId === conv.id ? 'primary.main' : 'transparent',
                      backgroundColor: currentConversationId === conv.id ? 'primary.50' : 'white',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.light',
                        transform: 'translateX(4px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                        {conv.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(conv.created_at).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
            
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => {
                console.log('[DocumentQuery] Starting new conversation')
                setCurrentConversationId(null)
              }}
              sx={{ mt: 1 }}
            >
              + New Conversation
            </Button>
          </Box>

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
                  justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
                  gap={2}
                >
                  {message.role === "assistant" && (
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
                      background: message.role === "user" 
                        ? "linear-gradient(45deg, #667eea 30%, #764ba2 90%)" 
                        : "white",
                      color: message.role === "user" ? "white" : "text.primary",
                      boxShadow: message.role === "user" 
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
                      {message.role === "assistant" && message.references && message.references.length > 0 && (
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
                                  {getFileIcon(documents.find((d) => d.id === ref.documentId)?.mime_type || "application/pdf")}
                                  <Typography variant="caption" fontWeight="bold" color="primary">
                                    {ref.documentTitle}
                                  </Typography>
                                  {ref.page && (
                                    <Typography variant="caption" color="text.secondary">
                                      • Page {ref.page}
                                    </Typography>
                                  )}
                                  {ref.relevanceScore && (
                                    <Chip 
                                      label={`${(ref.relevanceScore * 100).toFixed(0)}% relevant`} 
                                      size="small" 
                                      color="primary" 
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                  {ref.text}
                                </Typography>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                        <Typography variant="caption" color={message.role === "user" ? "rgba(255,255,255,0.7)" : "text.secondary"}>
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                        {message.role === "assistant" && (
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

                  {message.role === "user" && (
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
