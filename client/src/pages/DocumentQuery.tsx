"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  ThumbUp,
  ThumbDown,
  Refresh,
  Description,
  PictureAsPdf,
  TextSnippet,
  Search,
  SelectAll,
  ClearAll,
  FilterList,
  Article,
  Schedule,
  Visibility,
} from "@mui/icons-material"

import { mockDocuments } from "../mocks/Documents"
import type { Document, ChatMessage } from "../types/QueryInterfaces"


export default function DocumentQuery() {
  // const { groupId, moduleId } = useParams()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
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

  const selectedDocuments = documents.filter((doc) => doc.isSelected)
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => doc.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const allTags = Array.from(new Set(documents.flatMap((doc) => doc.tags)))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDocumentToggle = (documentId: number) => {
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
      selectedDocuments: selectedDocuments.map((doc) => doc.id),
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
        references: generateReferences(inputValue, selectedDocuments),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 2500)
  }

  const generateAIResponse = (query: string, selectedDocs: Document[]): string => {
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

  const generateReferences = (query: string, selectedDocs: Document[]) => {
    return selectedDocs.slice(0, 3).map((doc, index) => ({
      documentId: doc.id,
      documentTitle: doc.title,
      page: Math.floor(Math.random() * (doc.pages || 50)) + 1,
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


  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <PictureAsPdf color="error" />
      case "doc":
      case "docx":
        return <Description color="primary" />
      case "txt":
        return <TextSnippet color="info" />
      default:
        return <Article />
    }
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 0, zIndex: 1000 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/dashboard/thread`)}
            >
              Back to Module
            </Button>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Document Querying
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select documents and ask questions across multiple sources
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={selectedDocuments.length} color="primary">
              <Chip icon={<SmartToy />} label="AI Assistant" color="primary" variant="outlined" />
            </Badge>
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Left Panel - Document Selection */}
        <Paper
          elevation={2}
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Document Panel Header */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Select Documents
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Select All">
                  <IconButton size="small" onClick={handleSelectAll}>
                    <SelectAll fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear All">
                  <IconButton size="small" onClick={handleClearAll}>
                    <ClearAll fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filters">
                  <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
                    <FilterList fontSize="small" />
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filters */}
            <Collapse in={showFilters}>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Filter by tags:
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
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>

            {/* Selected Documents Summary */}
            {selectedDocuments.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {selectedDocuments.length} document{selectedDocuments.length > 1 ? "s" : ""} selected for querying
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Document List */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <List sx={{ p: 0 }}>
              {filteredDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:hover": { bgcolor: "action.hover" },
                    bgcolor: doc.isSelected ? "action.selected" : "transparent",
                  }}
                >
                  <ListItemIcon>
                    <Checkbox checked={doc.isSelected} onChange={() => handleDocumentToggle(doc.id)} color="primary" />
                  </ListItemIcon>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                      {getFileIcon(doc.fileType)}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                          {doc.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }} noWrap>
                          {doc.description}
                        </Typography>
                      </Box>
                    </Box>
                   
                   
                    <Box display="flex" alignItems="center" gap={2} color="text.secondary">
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Avatar sx={{ width: 16, height: 16, fontSize: 10 }}>{doc.uploadedBy.charAt(0)}</Avatar>
                        <Typography variant="caption">{doc.uploadedBy}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Visibility sx={{ fontSize: 12 }} />
                        <Typography variant="caption">{doc.views}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule sx={{ fontSize: 12 }} />
                        <Typography variant="caption">{new Date(doc.uploadedAt).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            {filteredDocuments.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No documents found matching your criteria
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Right Panel - Chat Interface */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Chat Messages */}
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, bgcolor: "grey.50" }}>
            <Stack spacing={2} sx={{ maxWidth: 800, mx: "auto" }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  display="flex"
                  justifyContent={message.type === "user" ? "flex-end" : "flex-start"}
                  gap={1}
                >
                  {message.type === "ai" && (
                    <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                      <SmartToy fontSize="small" />
                    </Avatar>
                  )}

                  <Card
                    sx={{
                      maxWidth: "75%",
                      bgcolor: message.type === "user" ? "primary.main" : "white",
                      color: message.type === "user" ? "white" : "text.primary",
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      
                     

                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {message.content}
                      </Typography>

                      {/* AI References */}
                      {message.type === "ai" && message.references && message.references.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            References from selected documents:
                          </Typography>
                          <Stack spacing={1}>
                            {message.references.map((ref, index) => (
                              <Paper key={index} variant="outlined" sx={{ p: 1, bgcolor: "grey.50" }}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                  {getFileIcon(documents.find((d) => d.id === ref.documentId)?.fileType || "pdf")}
                                  <Typography variant="caption" fontWeight="bold" color="primary">
                                    {ref.documentTitle}
                                  </Typography>
                                  
                                </Box>
                               
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                        
                        {message.type === "ai" && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <IconButton size="small" onClick={() => copyToClipboard(message.content)}>
                              <ContentCopy fontSize="small" />
                            </IconButton>
                           
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  {message.type === "user" && (
                    <Avatar sx={{ bgcolor: "grey.400", width: 32, height: 32 }}>
                      <Person fontSize="small" />
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
          <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              {selectedDocuments.length === 0 ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Please select at least one document from the left panel to start querying.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Ask questions about the {selectedDocuments.length} selected document
                    {selectedDocuments.length > 1 ? "s" : ""}. The AI will search across all selected documents to
                    provide comprehensive answers.
                  </Typography>
                </Alert>
              )}

              <Box display="flex" gap={1} alignItems="flex-end">
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
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || selectedDocuments.length === 0}
                  sx={{ minWidth: 100, height: 56, borderRadius: 2 }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
