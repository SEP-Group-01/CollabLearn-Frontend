import React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useResourceActions } from '../hooks/useResourceActions'
import { getUserData } from '../api/authApi'
import { queryDocuments, getConversations, getConversationMessages } from '../api/queryApi'
import ReactMarkdown from 'react-markdown'
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
      background: '#ffffff',
    }}>
      {/* Header */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        borderRadius: 0, 
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        color: '#111827'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}/documents`)}
              sx={{ 
                color: 'white',
                border: 'none',
                textTransform: 'none',
                fontSize: '0.875rem',
                px: 2,
                py: 0.75,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }
              }}
              variant="contained"
            >
              Back to Documents
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#e5e7eb' }} />
            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ 
                color: '#111827',
                fontSize: '1.1rem',
                mb: 0.25
              }}>
                AI Document Query Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                Select documents and ask questions across multiple sources
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Badge badgeContent={selectedDocuments.length} color="secondary" overlap="rectangular">
              <Chip 
                icon={<SmartToy sx={{ fontSize: '1rem' }} />} 
                label="AI Assistant" 
                size="small"
                sx={{ 
                  backgroundColor: '#f3f4f6',
                  color: '#6366f1',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  height: 28
                }}
              />
            </Badge>
            <Tooltip title="Refresh">
              <IconButton 
                onClick={() => window.location.reload()}
                size="small"
                sx={{ 
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  '&:hover': {
                    backgroundColor: '#f3f4f6'
                  }
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Left Panel - Document Selection */}
        <Paper
          elevation={0}
          sx={{
            width: 360,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            borderRight: "1px solid #e5e7eb",
            background: '#f9fafb',
          }}
        >
          {/* Conversation History Section */}
          <Box sx={{ 
            p: 2, 
            borderBottom: "1px solid #e5e7eb",
            background: '#ffffff',
          }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{
              color: '#111827',
              mb: 1.5,
              fontSize: '0.875rem',
              letterSpacing: '0.5px'
            }}>
              Conversation History
            </Typography>
            
            {conversations.length === 0 ? (
              <Typography variant="caption" sx={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.75rem' }}>
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
                      border: '1px solid',
                      borderColor: currentConversationId === conv.id ? '#6366f1' : '#e5e7eb',
                      backgroundColor: currentConversationId === conv.id ? '#f0f0ff' : '#ffffff',
                      transition: 'all 0.2s ease',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#6366f1',
                        backgroundColor: '#f9fafb',
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="body2" sx={{ fontWeight: '500', mb: 0.5, color: '#111827', fontSize: '0.8rem' }}>
                        {conv.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
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
              variant="contained"
              onClick={() => {
                console.log('[DocumentQuery] Starting new conversation')
                setCurrentConversationId(null)
              }}
              sx={{ 
                mt: 1.5,
                color: 'white',
                textTransform: 'none',
                fontSize: '0.75rem',
                py: 0.75,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }
              }}
            >
              New Conversation
            </Button>
          </Box>

          {/* Document Panel Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: "1px solid #e5e7eb",
            background: '#ffffff',
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography variant="subtitle2" fontWeight="600" sx={{
                color: '#111827',
                fontSize: '0.875rem',
                letterSpacing: '0.5px'
              }}>
                Select Documents
              </Typography>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Tooltip title="Select All">
                  <IconButton 
                    size="small" 
                    onClick={handleSelectAll}
                    sx={{
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      width: 28,
                      height: 28,
                      '&:hover': { backgroundColor: '#e5e7eb' }
                    }}
                  >
                    <SelectAll sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear All">
                  <IconButton 
                    size="small" 
                    onClick={handleClearAll}
                    sx={{
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      width: 28,
                      height: 28,
                      '&:hover': { backgroundColor: '#e5e7eb' }
                    }}
                  >
                    <ClearAll sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  fontSize: '0.8rem',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
                '& input::placeholder': {
                  fontSize: '0.8rem'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: '1rem', color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Selected Documents Summary */}
            {selectedDocuments.length > 0 && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  color: '#166534',
                  '& .MuiAlert-icon': {
                    fontSize: '1rem',
                    color: '#16a34a'
                  }
                }}
              >
                <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
                  {selectedDocuments.length} document{selectedDocuments.length > 1 ? "s" : ""} selected for AI querying
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Document List */}
          <Box sx={{ flexGrow: 1, overflow: "auto", background: '#f9fafb' }}>
            <List sx={{ p: 1 }}>
              {filteredDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    borderBottom: "1px solid #f3f4f6",
                    "&:hover": { 
                      bgcolor: "#ffffff",
                      transform: 'translateX(2px)',
                    },
                    bgcolor: doc.isSelected ? "#f0f0ff" : "transparent",
                    borderRadius: 1.5,
                    mb: 0.75,
                    transition: 'all 0.2s ease',
                    border: doc.isSelected ? '1px solid #6366f1' : '1px solid transparent',
                    py: 0.75,
                    px: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox 
                      checked={doc.isSelected} 
                      onChange={() => handleDocumentToggle(doc.id)} 
                      size="small"
                      sx={{
                        color: '#d1d5db',
                        '&.Mui-checked': {
                          color: '#6366f1',
                        }
                      }}
                    />
                  </ListItemIcon>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{
                        p: 0.5,
                        borderRadius: 1,
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {React.cloneElement(getFileIcon(doc.mime_type || 'document'), { sx: { fontSize: 16 } })}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={doc.isSelected ? "600" : "500"} noWrap sx={{
                          color: '#111827',
                          fontSize: '0.8rem',
                          mb: 0.25
                        }}>
                          {doc.title}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ 
                          color: '#6b7280',
                          fontSize: "0.7rem",
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
              <Box textAlign="center" py={6}>
                <Box sx={{ mb: 1.5 }}>
                  <InsertDriveFile sx={{ fontSize: 40, color: '#d1d5db' }} />
                </Box>
                <Typography variant="subtitle2" fontWeight="600" color="#6b7280" gutterBottom sx={{ fontSize: '0.875rem' }}>
                  No documents found
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
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
          background: '#ffffff',
        }}>
          {/* Chat Messages */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: "auto", 
            p: 2.5,
            background: '#f9fafb',
          }}>
            <Stack spacing={2} sx={{ maxWidth: 800, mx: "auto" }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  display="flex"
                  justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
                  gap={1.5}
                >
                  {message.role === "assistant" && (
                    <Avatar sx={{ 
                      bgcolor: "#6366f1", 
                      width: 36, 
                      height: 36,
                      color: 'white'
                    }}>
                      <SmartToy sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                  )}

                  <Card
                    sx={{
                      maxWidth: "75%",
                      background: message.role === "user" 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "#f9fafb",
                      color: message.role === "user" ? "white" : "#111827",
                      boxShadow: message.role === "user" 
                        ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                        : '0 1px 3px rgba(0, 0, 0, 0.1)',
                      borderRadius: 2.5,
                      border: message.role === "user" ? 'none' : '1px solid #e5e7eb',
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      {message.role === "assistant" ? (
                        <Box 
                          sx={{ 
                            '& p': { 
                              margin: 0, 
                              marginBottom: '0.5em',
                              lineHeight: 1.6,
                              fontSize: '0.875rem',
                              color: '#374151',
                              '&:last-child': { marginBottom: 0 }
                            },
                            '& strong': {
                              fontWeight: 600,
                              color: '#111827'
                            },
                            '& em': {
                              fontStyle: 'italic'
                            },
                            '& code': {
                              backgroundColor: '#e5e7eb',
                              padding: '0.2em 0.4em',
                              borderRadius: '3px',
                              fontSize: '0.85em',
                              fontFamily: 'monospace'
                            },
                            '& pre': {
                              backgroundColor: '#1f2937',
                              color: '#f3f4f6',
                              padding: '1em',
                              borderRadius: '6px',
                              overflowX: 'auto',
                              margin: '0.5em 0'
                            },
                            '& pre code': {
                              backgroundColor: 'transparent',
                              padding: 0,
                              color: 'inherit'
                            },
                            '& ul, & ol': {
                              margin: '0.5em 0',
                              paddingLeft: '1.5em'
                            },
                            '& li': {
                              marginBottom: '0.25em',
                              fontSize: '0.875rem',
                              color: '#374151'
                            },
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                              marginTop: '1em',
                              marginBottom: '0.5em',
                              fontWeight: 600,
                              color: '#111827'
                            },
                            '& blockquote': {
                              borderLeft: '3px solid #667eea',
                              paddingLeft: '1em',
                              margin: '0.5em 0',
                              color: '#6b7280'
                            }
                          }}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: '0.875rem', color: "white" }}>
                          {message.content}
                        </Typography>
                      )}

                      {/* AI References */}
                      {message.role === "assistant" && message.references && message.references.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="caption" fontWeight="600" sx={{ color: '#6b7280', mb: 1, display: 'block', fontSize: '0.75rem' }}>
                            References from selected documents:
                          </Typography>
                          <Stack spacing={1}>
                            {message.references.map((ref, index) => (
                              <Box key={index} sx={{ 
                                p: 1.5, 
                                borderRadius: 1.5,
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: '#d1d5db',
                                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                }
                              }}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.75} flexWrap="wrap">
                                  {getFileIcon(documents.find((d) => d.id === ref.documentId)?.mime_type || "application/pdf")}
                                  <Typography variant="caption" fontWeight="600" sx={{ color: '#111827', fontSize: '0.75rem' }}>
                                    {ref.documentTitle}
                                  </Typography>
                                  {ref.page && (
                                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                                      • Page {ref.page}
                                    </Typography>
                                  )}
                                  {ref.relevanceScore && (
                                    <Chip 
                                      label={`${(ref.relevanceScore * 100).toFixed(0)}%`} 
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        background: '#f0f0ff',
                                        color: '#6366f1',
                                        fontWeight: '600'
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', lineHeight: 1.4 }}>
                                  {ref.text}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={1.5}>
                        <Typography variant="caption" sx={{ color: message.role === "user" ? 'rgba(255, 255, 255, 0.9)' : '#9ca3af', fontSize: '0.7rem' }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {message.role === "assistant" && (
                          <Tooltip title="Copy response">
                            <IconButton 
                              size="small" 
                              onClick={() => copyToClipboard(message.content)}
                              sx={{
                                color: '#9ca3af',
                                '&:hover': {
                                  color: '#6b7280',
                                  background: '#f3f4f6'
                                }
                              }}
                            >
                              <ContentCopy sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  {message.role === "user" && (
                    <Avatar sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: 36, 
                      height: 36,
                      color: 'white'
                    }}>
                      <Person sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                  )}
                </Box>
              ))}

              {/* Loading Message */}
              {isLoading && (
                <Box display="flex" justifyContent="flex-start" gap={1.5}>
                  <Avatar sx={{ 
                    bgcolor: "#6366f1", 
                    width: 36, 
                    height: 36,
                    color: 'white'
                  }}>
                    <SmartToy sx={{ fontSize: '1.2rem' }} />
                  </Avatar>
                  <Card sx={{ 
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={14} sx={{ color: '#6366f1' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
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
          <Paper elevation={0} sx={{ 
            p: 2.5, 
            borderRadius: 0,
            background: '#ffffff',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              {selectedDocuments.length === 0 ? (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 2,
                    py: 0.75,
                    fontSize: '0.75rem',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    color: '#92400e',
                    '& .MuiAlert-icon': {
                      fontSize: '1rem',
                      color: '#f59e0b'
                    }
                  }}
                >
                  <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
                    Please select at least one document from the left panel to start querying.
                  </Typography>
                </Alert>
              ) : (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 2,
                    py: 0.75,
                    fontSize: '0.75rem',
                    background: '#dbeafe',
                    border: '1px solid #60a5fa',
                    color: '#1e3a8a',
                    '& .MuiAlert-icon': {
                      fontSize: '1rem',
                      color: '#3b82f6'
                    }
                  }}
                >
                  <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
                    Ask questions about the {selectedDocuments.length} selected document
                    {selectedDocuments.length > 1 ? "s" : ""}. The AI will search across all selected documents to
                    provide comprehensive answers.
                  </Typography>
                </Alert>
              )}

              <Box display="flex" gap={1.5} alignItems="flex-end">
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder={
                    selectedDocuments.length > 0
                      ? "Ask a question about the selected documents..."
                      : "Select documents first, then ask your question..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || selectedDocuments.length === 0}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                        borderWidth: 2
                      }
                    },
                    '& input::placeholder, & textarea::placeholder': {
                      fontSize: '0.875rem',
                      opacity: 0.7
                    }
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<Send sx={{ fontSize: '1rem' }} />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || selectedDocuments.length === 0}
                  sx={{ 
                    minWidth: 100, 
                    height: 48,
                    px: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: '#e5e7eb',
                      color: '#9ca3af',
                      boxShadow: 'none',
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
