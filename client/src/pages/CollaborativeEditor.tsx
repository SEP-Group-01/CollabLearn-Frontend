import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Avatar,
  Divider,
  Popover,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Undo,
  Redo,
  TableChart,
  Image,
  Link,
  GetApp,
  Fullscreen,
  FullscreenExit,
  Palette,
  Highlight,
  LightMode,
  DarkMode,
  People,
  Description,
  Cloud,
  CloudDone,
  CloudOff,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FormatQuote,
  Code,
  Subscript,
  Superscript,
  ArrowBack
} from '@mui/icons-material';

import { useWebSocketCollaboration } from '../lib/websocket/useWebSocketCollaboration';
import type { CollaborationUser } from '../lib/websocket/WebSocketCollaborationClient';
import { currentUser, sharedDocuments, fontOptions, fontSizeOptions, textColors, highlightColors } from '../mocks/EditorMocks';
import { getDocument, type DocumentResponse } from '../api/editorApi';

const CollaborativeEditor = () => {
  // URL Parameters
  const { workspaceId, threadId, documentId } = useParams<{ 
    workspaceId: string; 
    threadId: string; 
    documentId: string; 
  }>();
  const navigate = useNavigate();

  // Document loading states
  const [documentData, setDocumentData] = useState<DocumentResponse | null>(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');

  // States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDocument, setActiveDocument] = useState("Loading...");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [wordCount, setWordCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [tableMenuAnchor, setTableMenuAnchor] = useState<null | HTMLElement>(null);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  const [highlightMenuAnchor, setHighlightMenuAnchor] = useState<null | HTMLElement>(null);

  // Convert currentUser to CollaborationUser type
  const collaborationUser: CollaborationUser = {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    color: '#4caf50', // Default color
    isActive: true
  };

  // WebSocket collaboration hook
  const {
    content: collaborationContent,
    collaborators,
    connectionStatus,
    isConnected,
    connect,
    disconnect,
    sendContentUpdate,
    sendCursorUpdate,
    sendAwarenessUpdate
  } = useWebSocketCollaboration({
    documentId: documentId || 'doc-fallback', // Use documentId from URL
    user: collaborationUser,
    wsUrl: 'http://localhost:3000', // API Gateway Socket.IO server
    autoConnect: false, // We'll connect after loading the document
    debounceMs: 300
  });

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastContentRef = useRef('');

  // Create Material-UI theme
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  // Derived state for save status
  const saveStatus = isConnected ? 'saved' : connectionStatus === 'connecting' ? 'saving' : 'local';

  // Load document from API when component mounts
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        setDocumentError('No document ID provided');
        setDocumentLoading(false);
        return;
      }

      try {
        setDocumentLoading(true);
        setDocumentError(null);
        
        console.log('Loading document:', documentId);
        const document = await getDocument(documentId);
        
        setDocumentData(document);
        setActiveDocument(document.title);
        setEditorContent(document.content || '');
        
        // Initialize editor content if available
        if (editorRef.current) {
          const contentToSet = document.content || '';
          editorRef.current.innerHTML = contentToSet;
          lastContentRef.current = contentToSet;
        }
        
        // Try to connect to WebSocket collaboration after document is loaded
        try {
          console.log('Connecting to WebSocket collaboration...');
          connect();
        } catch (wsError) {
          console.warn('WebSocket collaboration connection failed:', wsError);
          // Document editing still works without WebSocket
        }
        
        console.log('Document loaded successfully:', document);
      } catch (error: any) {
        console.error('Error loading document:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load document';
        setDocumentError(errorMessage);
      } finally {
        setDocumentLoading(false);
      }
    };

    // Only load if we haven't loaded this document yet
    if (documentId && !documentData) {
      loadDocument();
    }
  }, [documentId]); // Only depend on documentId to prevent infinite loops

  // Set editor content when document loads
  useEffect(() => {
    if (editorRef.current) {
      if (editorContent && !documentLoading) {
        // Set the actual document content
        editorRef.current.innerHTML = editorContent;
        lastContentRef.current = editorContent;
      } else if (documentLoading) {
        // Show loading placeholder
        editorRef.current.innerHTML = `
          <h2 style="color: #666;">Loading Document...</h2>
          <p style="color: #999;">Please wait while we load your document content.</p>
        `;
      } else if (documentError) {
        // Show error message
        editorRef.current.innerHTML = `
          <h2 style="color: #f44336;">Error Loading Document</h2>
          <p style="color: #999;">${documentError}</p>
        `;
      }
    }
  }, [editorContent, documentLoading, documentError]);

  // Update word count
  useEffect(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, [collaborationContent]);

  // Handle editor content changes
  const handleEditorChange = useCallback(() => {
    if (!editorRef.current) return;

    const newContent = editorRef.current.innerHTML;
    
    // Only send update if content actually changed
    if (newContent !== lastContentRef.current) {
      lastContentRef.current = newContent;
      sendContentUpdate(newContent);
    }
  }, [sendContentUpdate]);

  // Handle cursor/selection changes
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        const anchor = range.startOffset;
        const head = range.endOffset;
        sendCursorUpdate({ anchor, head });
        
        // Save selection for later use
        savedSelectionRef.current = range.cloneRange();
      }
    }
  }, [sendCursorUpdate]);

  // Update editor content when collaboration content changes
  useEffect(() => {
    if (editorRef.current && collaborationContent !== lastContentRef.current) {
      editorRef.current.innerHTML = collaborationContent;
      lastContentRef.current = collaborationContent;
    }
  }, [collaborationContent]);

  // Handle WebSocket messages
  // (Removed - now handled by WebSocket collaboration hook)

  // Apply remote operations to the document  
  // (Removed - now handled by WebSocket collaboration hook)

  // Handle editor content changes
  // (Updated to use new collaboration system)

  // PDF Export functionality
  const exportToPDF = async () => {
    try {
      showNotification('Generating PDF...', 'info');
      
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for PDF export.');
      }

      const content = editorRef.current?.innerHTML || '';
      const title = activeDocument;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: ${fontFamily}, sans-serif;
              font-size: ${fontSize}px;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #2c3e50;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            h1 { font-size: 2.5em; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            h2 { font-size: 2em; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
            h3 { font-size: 1.5em; }
            p { margin-bottom: 15px; }
            ul, ol { margin-bottom: 15px; padding-left: 30px; }
            li { margin-bottom: 5px; }
            blockquote {
              border-left: 4px solid #3498db;
              margin: 20px 0;
              padding: 10px 20px;
              background-color: #f8f9fa;
              font-style: italic;
            }
            code {
              background-color: #f1f2f6;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
            pre {
              background-color: #f1f2f6;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
              margin: 15px 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="document-header">
            <h1 style="text-align: center; margin-bottom: 10px;">${title}</h1>
            <p style="text-align: center; color: #666; font-size: 0.9em; margin-bottom: 30px;">
              Generated on ${new Date().toLocaleDateString()} | Words: ${wordCount}
            </p>
          </div>
          <div class="document-content">
            ${content}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          showNotification('PDF export completed successfully', 'success');
        }, 500);
      };

    } catch (error) {
      console.error('PDF export error:', error);
      showNotification('Failed to export PDF. Please try again.', 'error');
    }
  };

  // Selection preservation functions
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      console.log('Current selection:', selection.toString());
      const range = selection.getRangeAt(0);
      // Make sure the selection is within our editor
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange();
        console.log('Selection saved:', savedSelectionRef.current);
      }
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && editorRef.current) {
      try {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelectionRef.current);
          editorRef.current.focus();
          console.log('Selection restored:', savedSelectionRef.current);
        }
      } catch (error) {
        console.error('Error restoring selection:', error);
      }
    }
  };

  // Color application functions
  const applyTextColor = (color: string) => {
    setTextColor(color);
    applyFormat('foreColor', color);
    // Small delay to ensure formatting is applied before closing menu
    setTimeout(() => {
      setColorMenuAnchor(null);
    }, 50);
  };

  const applyHighlightColor = (color: string) => {
    setHighlightColor(color);
    applyFormat('hiliteColor', color);
    // Small delay to ensure formatting is applied before closing menu
    setTimeout(() => {
      setHighlightMenuAnchor(null);
    }, 50);
  };

  // Advanced formatting functions
  const applyFormat = (command: string, value?: string) => {
    try {
      // First ensure the editor has focus
      if (editorRef.current) {
        editorRef.current.focus();
      }
      
      // Restore selection if we have one saved
      if (savedSelectionRef.current) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelectionRef.current);
        }
      }
      
      // Apply the format
      const success = document.execCommand(command, false, value);
      console.log(`Applied format ${command} with value ${value}:`, success);
      
      handleEditorChange();
    } catch (error) {
      console.error('Error applying format:', error);
    }
  };

  // Special function for inline code formatting
  const applyInlineCode = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (selectedText) {
          // Wrap selected text in code tags
          const codeElement = document.createElement('code');
          codeElement.style.backgroundColor = '#f1f2f6';
          codeElement.style.padding = '2px 6px';
          codeElement.style.borderRadius = '3px';
          codeElement.style.fontFamily = '"Courier New", monospace';
          codeElement.textContent = selectedText;
          
          range.deleteContents();
          range.insertNode(codeElement);
          
          // Clear selection
          selection.removeAllRanges();
        } else {
          // No selection, insert empty code tags for user to type into
          const codeElement = document.createElement('code');
          codeElement.style.backgroundColor = '#f1f2f6';
          codeElement.style.padding = '2px 6px';
          codeElement.style.borderRadius = '3px';
          codeElement.style.fontFamily = '"Courier New", monospace';
          codeElement.textContent = 'code';
          
          range.insertNode(codeElement);
          
          // Select the text inside for easy replacement
          const newRange = document.createRange();
          newRange.selectNodeContents(codeElement);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        
        handleEditorChange();
      }
    } catch (error) {
      console.error('Error applying inline code:', error);
    }
  };

  const insertTable = (rows: number, cols: number) => {
    // Restore selection before inserting
    restoreSelection();
    
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        if (i === 0) {
          tableHTML += '<th style="padding: 8px; background-color: #f0f0f0;">Header</th>';
        } else {
          tableHTML += '<td style="padding: 8px;">Cell</td>';
        }
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    document.execCommand('insertHTML', false, tableHTML);
    handleEditorChange();
  };

  const insertImage = () => {
    saveSelection();
    const url = prompt('Enter image URL:');
    if (url) {
      restoreSelection();
      const img = `<img src="${url}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Inserted image">`;
      document.execCommand('insertHTML', false, img);
      handleEditorChange();
    }
  };

  const insertLink = () => {
    saveSelection();
    const selectedText = window.getSelection()?.toString() || '';
    const url = prompt('Enter URL:');
    if (url) {
      restoreSelection();
      const text = selectedText || url;
      const link = `<a href="${url}" target="_blank">${text}</a>`;
      document.execCommand('insertHTML', false, link);
      handleEditorChange();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (collaborationContent.trim() && isConnected) {
        showNotification('Document auto-saved', 'info');
      }
    };

    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [collaborationContent, isConnected]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            applyFormat('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormat('italic');
            break;
          case 'u':
            e.preventDefault();
            applyFormat('underline');
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              applyFormat('redo');
            } else {
              applyFormat('undo');
            }
            break;
          case 'y':
            e.preventDefault();
            applyFormat('redo');
            break;
          case 's':
            e.preventDefault();
            showNotification('Document saved automatically', 'success');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Get unique color for each collaborator
  const getCollaboratorRingColor = (index: number) => {
    const colors = [
      '#4caf50', // Green
      '#2196f3', // Blue
      '#ff9800', // Orange
      '#9c27b0', // Purple
      '#f44336', // Red
      '#00bcd4', // Cyan
      '#ffeb3b', // Yellow
      '#795548', // Brown
      '#e91e63', // Pink
      '#607d8b', // Blue Grey
    ];
    return colors[index % colors.length];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Loading State */}
      {documentLoading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Loading document...</Typography>
          <Typography variant="body2" color="text.secondary">
            Document ID: {documentId}
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {documentError && !documentLoading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" color="error">Error Loading Document</Typography>
          <Typography variant="body2" color="text.secondary">
            {documentError}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}`)}
          >
            Back to Thread
          </Button>
        </Box>
      )}

      {/* Main Editor Content */}
      {!documentLoading && !documentError && documentData && (
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top Navigation Bar */}
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ gap: 2, minHeight: '64px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                {/* Back Button */}
                <IconButton 
                  onClick={() => navigate(`/workspace/${workspaceId}/threads/${threadId}`)}
                  sx={{ 
                    bgcolor: "action.hover",
                    '&:hover': {
                      bgcolor: "action.selected",
                    }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Description />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {activeDocument}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {saveStatus === 'saved' && <CloudDone color="success" />}
                  {saveStatus === 'saving' && <Cloud color="action" />}
                  {saveStatus === 'local' && <Description color="info" />}
                  <Typography variant="body2" color="text.secondary">
                    {saveStatus === 'saved' ? 'All changes saved' : 
                     saveStatus === 'saving' ? 'Saving...' : 'Editing locally'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Word Count */}
                <Typography variant="body2" color="text.secondary">
                  Words: {wordCount}
                </Typography>
                
                {/* Zoom Control */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  >
                    <ZoomOut />
                  </IconButton>
                  <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
                    {zoomLevel}%
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  >
                    <ZoomIn />
                  </IconButton>
                </Box>

                {/* Connection Status */}
                <Tooltip title={`Connection: ${connectionStatus === 'disconnected' ? 'Offline mode - document editing available' : connectionStatus}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {connectionStatus === 'connected' && <CloudDone color="success" />}
                    {connectionStatus === 'connecting' && <Cloud color="action" />}
                    {connectionStatus === 'disconnected' && <CloudOff color="warning" />}
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {connectionStatus === 'disconnected' ? 'Offline' : connectionStatus}
                    </Typography>
                  </Box>
                </Tooltip>

                {/* User Presence Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={`${currentUser.name} (You)`}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'lightgray',
                          color: 'darkgray',
                          fontSize: '0.7rem',
                          border: '2px solid #4caf50'
                        }}
                      >
                        {currentUser.avatar}
                      </Avatar>
                    </Tooltip>
                    {collaborators.map((user, index) => (
                      <Tooltip key={user.id} title={user.name}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'lightgray',
                            color: 'darkgray',
                            fontSize: '0.7rem',
                            border: user.isActive ? `2px solid ${getCollaboratorRingColor(index)}` : '2px solid transparent',
                            transition: 'border-color 0.2s ease',
                          }}
                        >
                          {user.avatar}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Fullscreen Toggle */}
                <Tooltip title="Toggle fullscreen">
                  <IconButton onClick={toggleFullscreen}>
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>

                {/* Theme Toggle */}
                <Tooltip title="Toggle theme">
                  <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Enhanced Formatting Toolbar */}
          <Paper elevation={1} sx={{ borderRadius: 0 }}>
            <Toolbar variant="dense" sx={{ gap: 1, minHeight: '48px !important', px: 2 }}>
              {/* File Operations */}
              <Button 
                variant="outlined"
                size="small"
                startIcon={<GetApp />}
                onClick={exportToPDF}
                sx={{ mr: 2 }}
              >
                PDF
              </Button>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Font Family */}
              <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                <Select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    applyFormat('fontName', e.target.value);
                  }}
                  displayEmpty
                >
                  {fontOptions.map(font => (
                    <MenuItem key={font} value={font}>{font}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Font Size */}
              <FormControl size="small" sx={{ minWidth: 70, mr: 1 }}>
                <Select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    applyFormat('fontSize', '3');
                  }}
                >
                  {fontSizeOptions.map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Text Formatting */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Bold (Ctrl+B)">
                  <IconButton onClick={() => applyFormat('bold')}>
                    <FormatBold />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Italic (Ctrl+I)">
                  <IconButton onClick={() => applyFormat('italic')}>
                    <FormatItalic />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Underline (Ctrl+U)">
                  <IconButton onClick={() => applyFormat('underline')}>
                    <FormatUnderlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Strikethrough">
                  <IconButton onClick={() => applyFormat('strikeThrough')}>
                    <FormatStrikethrough />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Color Controls */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Text Color">
                  <IconButton 
                    onClick={(e) => {
                      saveSelection();
                      setColorMenuAnchor(e.currentTarget);
                    }}
                  >
                    <Palette />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Highlight Color">
                  <IconButton 
                    onClick={(e) => {
                      saveSelection();
                      setHighlightMenuAnchor(e.currentTarget);
                    }}
                  >
                    <Highlight />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Lists */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Bullet List">
                  <IconButton onClick={() => applyFormat('insertUnorderedList')}>
                    <FormatListBulleted />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Numbered List">
                  <IconButton onClick={() => applyFormat('insertOrderedList')}>
                    <FormatListNumbered />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Alignment */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Align Left">
                  <IconButton onClick={() => applyFormat('justifyLeft')}>
                    <FormatAlignLeft />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Align Center">
                  <IconButton onClick={() => applyFormat('justifyCenter')}>
                    <FormatAlignCenter />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Align Right">
                  <IconButton onClick={() => applyFormat('justifyRight')}>
                    <FormatAlignRight />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Insert Elements */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Insert Link">
                  <IconButton onClick={insertLink}>
                    <Link />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Insert Image">
                  <IconButton onClick={insertImage}>
                    <Image />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Insert Table">
                  <IconButton onClick={(e) => {
                    saveSelection();
                    setTableMenuAnchor(e.currentTarget);
                  }}>
                    <TableChart />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Text Format Tools */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Blockquote">
                  <IconButton onClick={() => applyFormat('formatBlock', 'blockquote')}>
                    <FormatQuote />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Inline Code">
                  <IconButton onClick={applyInlineCode}>
                    <Code />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Subscript">
                  <IconButton onClick={() => applyFormat('subscript')}>
                    <Subscript />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Superscript">
                  <IconButton onClick={() => applyFormat('superscript')}>
                    <Superscript />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* History */}
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Undo (Ctrl+Z)">
                  <IconButton onClick={() => applyFormat('undo')}>
                    <Undo />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Redo (Ctrl+Y)">
                  <IconButton onClick={() => applyFormat('redo')}>
                    <Redo />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </Toolbar>
          </Paper>

          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Main Content Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                  {/* Editor Area */}
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      minHeight: 600, 
                      p: 4, 
                      position: 'relative',
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  >
                    <Box
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning={true}
                      onInput={handleEditorChange}
                      onBlur={() => {
                        // Save selection when editor loses focus
                        setTimeout(saveSelection, 10);
                      }}
                      onMouseUp={() => {
                        saveSelection();
                        handleSelectionChange();
                      }}
                      onKeyUp={() => {
                        saveSelection();
                        handleSelectionChange();
                      }}
                      sx={{
                        outline: 'none',
                        lineHeight: 1.6,
                        minHeight: 500,
                        fontFamily: fontFamily,
                        fontSize: `${fontSize}px`,
                        color: textColor,
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          color: 'primary.main',
                          marginTop: 3,
                          marginBottom: 2,
                        },
                        '& p': {
                          marginBottom: 2,
                        },
                        '& ul, & ol': {
                          marginBottom: 2,
                          paddingLeft: 4,
                        },
                        '& blockquote': {
                          borderLeft: 4,
                          borderColor: 'primary.main',
                          margin: '20px 0',
                          paddingLeft: 2,
                          backgroundColor: 'grey.50',
                          fontStyle: 'italic',
                        },
                        '& table': {
                          borderCollapse: 'collapse',
                          width: '100%',
                          margin: '20px 0',
                          '& th, & td': {
                            border: '1px solid',
                            borderColor: 'divider',
                            padding: 1.5,
                            textAlign: 'left',
                          },
                          '& th': {
                            backgroundColor: 'grey.100',
                            fontWeight: 'bold',
                          },
                        },
                      }}
                      // Don't use dangerouslySetInnerHTML - we'll set content via useEffect
                    />

                    {/* Collaborative Cursors */}
                    {collaborators.filter(user => user.cursor).map((user, index) => {
                      const cursorColor = getCollaboratorRingColor(collaborators.indexOf(user));
                      return (
                        <Box
                          key={user.id}
                          sx={{
                            position: 'absolute',
                            top: `${100 + index * 40}px`,
                            left: `${200 + index * 50}px`,
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 10,
                          }}
                        >
                          <Box
                            sx={{
                              width: 2,
                              height: 20,
                              bgcolor: cursorColor,
                              animation: 'blink 1s infinite',
                              '@keyframes blink': {
                                '0%, 50%': { opacity: 1 },
                                '51%, 100%': { opacity: 0 },
                              },
                            }}
                          />
                          <Chip
                            label={user.name}
                            size="small"
                            sx={{
                              ml: 0.5,
                              bgcolor: cursorColor,
                              color: 'white',
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* Right Sidebar - Shared Documents */}
            {!isFullscreen && (
              <Paper
                elevation={1}
                sx={{
                  width: isSidebarCollapsed ? 48 : 320,
                  borderRadius: 0,
                  borderLeft: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'width 0.3s ease-in-out',
                  overflow: 'hidden'
                }}
              >
                {/* Sidebar Header with Collapse Button */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 64
                }}>
                  {!isSidebarCollapsed && (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Shared Documents
                      </Typography>
                      <Chip
                        label={`${sharedDocuments.length} documents`}
                        size="small"
                        variant="outlined"
                      />
                    </>
                  )}
                  <IconButton
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    size="small"
                    sx={{ ml: isSidebarCollapsed ? 0 : 1 }}
                  >
                    {isSidebarCollapsed ? <ChevronLeft /> : <ChevronRight />}
                  </IconButton>
                </Box>

                {/* Scrollable Content */}
                {!isSidebarCollapsed && (
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Stack spacing={1}>
                      {sharedDocuments.map((doc) => (
                        <Card
                          key={doc.id}
                          variant={doc.isActive ? "elevation" : "outlined"}
                          elevation={doc.isActive ? 3 : 0}
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              elevation: 2,
                              transform: 'translateY(-1px)',
                            },
                            bgcolor: doc.isActive ? 'primary.50' : 'transparent',
                            borderColor: doc.isActive ? 'primary.main' : 'divider',
                          }}
                          onClick={() => setActiveDocument(doc.title)}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}>
                              <Description fontSize="small" color="action" />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                                {doc.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                              {doc.preview}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                {doc.lastEdited}
                              </Typography>
                              {doc.isActive && (
                                <Chip
                                  label="Active"
                                  size="small"
                                  color="primary"
                                  sx={{ fontSize: '0.6rem', height: 20 }}
                                />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                    
                    {/* Quick Help Section */}
                    <Card variant="outlined" sx={{ mt: 3, bgcolor: 'grey.50' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Keyboard Shortcuts
                        </Typography>
                        <Stack spacing={0.5}>
                          {[
                            { label: 'Bold', shortcut: 'Ctrl+B' },
                            { label: 'Italic', shortcut: 'Ctrl+I' },
                            { label: 'Underline', shortcut: 'Ctrl+U' },
                            { label: 'Undo', shortcut: 'Ctrl+Z' },
                            { label: 'Redo', shortcut: 'Ctrl+Y' },
                          ].map((item) => (
                            <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption">{item.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.shortcut}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Collaboration Info */}
                    <Card variant="outlined" sx={{ mt: 2, bgcolor: 'success.50', borderColor: 'success.200' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'success.main',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                                '100%': { opacity: 1 },
                              },
                            }}
                          />
                          <Typography variant="subtitle2" color="success.dark" sx={{ fontWeight: 600 }}>
                            Live Collaboration
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="success.dark">
                          {collaborators.filter(c => c.isActive).length + 1} people are working on this document. Changes are saved automatically.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        </Box>

        {/* Menus and Dialogs */}
        {/* Enhanced Color Picker Menu */}
        <Popover
          open={Boolean(colorMenuAnchor)}
          anchorEl={colorMenuAnchor}
          onClose={() => setColorMenuAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 3, minWidth: 300 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Text Color</Typography>
            
            {/* Predefined Colors Grid */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Choose from preset colors:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {/* Color categories */}
                {[
                  { label: 'Basic', start: 0, end: 8 },
                  { label: 'Primary', start: 8, end: 16 },
                  { label: 'Light', start: 16, end: 24 },
                  { label: 'Medium', start: 24, end: 32 },
                  { label: 'Dark', start: 32, end: 40 }
                ].map((category) => (
                  <Box key={category.label} sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
                      {category.label}
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(8, 1fr)', 
                      gap: 0.5,
                    }}>
                      {textColors.slice(category.start, category.end).map((color, index) => (
                        <Box
                          key={category.start + index}
                          onClick={() => {
                            applyTextColor(color);
                          }}
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            border: 1,
                            borderColor: color === '#FFFFFF' ? 'grey.300' : 'transparent',
                            borderRadius: 0.5,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.1s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              zIndex: 1,
                              boxShadow: 2,
                            },
                            '&::after': textColor === color ? {
                              content: '""',
                              position: 'absolute',
                              top: -2,
                              left: -2,
                              right: -2,
                              bottom: -2,
                              border: '2px solid',
                              borderColor: 'primary.main',
                              borderRadius: 1,
                            } : {}
                          }}
                          title={color}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Custom Color Picker */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Or choose a custom color:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    applyTextColor(e.target.value);
                  }}
                  style={{ 
                    width: 60, 
                    height: 40, 
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    cursor: 'pointer' 
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Current: {textColor.toUpperCase()}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setColorMenuAnchor(null)}
                    sx={{ mt: 0.5 }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Popover>

        {/* Enhanced Highlight Color Menu */}
        <Popover
          open={Boolean(highlightMenuAnchor)}
          anchorEl={highlightMenuAnchor}
          onClose={() => setHighlightMenuAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 3, minWidth: 300 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Highlight Color</Typography>
            
            {/* Predefined Highlight Colors Grid */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Choose from preset highlights:
              </Typography>
              
              {/* No Highlight Option */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
                  Remove Highlight
                </Typography>
                <Box
                  onClick={() => {
                    applyHighlightColor('transparent');
                  }}
                  sx={{
                    width: 24,
                    height: 24,
                    background: 'linear-gradient(45deg, transparent 30%, #ff0000 30%, #ff0000 70%, transparent 70%)',
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 0.5,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.1s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      zIndex: 1,
                      boxShadow: 2,
                    },
                  }}
                  title="Remove Highlight"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                {/* Highlight color categories */}
                {[
                  { label: 'Popular', start: 0, end: 8 },
                  { label: 'Light', start: 8, end: 16 },
                  { label: 'Pastel', start: 16, end: 24 },
                  { label: 'Soft', start: 24, end: 32 }
                ].map((category) => (
                  <Box key={category.label} sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
                      {category.label}
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(8, 1fr)', 
                      gap: 0.5,
                    }}>
                      {highlightColors.slice(category.start, category.end).map((color, index) => (
                        <Box
                          key={category.start + index}
                          onClick={() => {
                            applyHighlightColor(color);
                          }}
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            border: 1,
                            borderColor: color === '#FFFFFF' ? 'grey.300' : 'transparent',
                            borderRadius: 0.5,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.1s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              zIndex: 1,
                              boxShadow: 2,
                            },
                            '&::after': highlightColor === color ? {
                              content: '""',
                              position: 'absolute',
                              top: -2,
                              left: -2,
                              right: -2,
                              bottom: -2,
                              border: '2px solid',
                              borderColor: 'primary.main',
                              borderRadius: 1,
                            } : {}
                          }}
                          title={color}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Custom Highlight Color Picker */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Or choose a custom highlight:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                  type="color"
                  value={highlightColor === 'transparent' ? '#ffff00' : highlightColor}
                  onChange={(e) => {
                    applyHighlightColor(e.target.value);
                  }}
                  style={{ 
                    width: 60, 
                    height: 40, 
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    cursor: 'pointer' 
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Current: {highlightColor === 'transparent' ? 'None' : highlightColor.toUpperCase()}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setHighlightMenuAnchor(null)}
                    sx={{ mt: 0.5 }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Popover>

        {/* Table Insert Menu */}
        <Popover
          open={Boolean(tableMenuAnchor)}
          anchorEl={tableMenuAnchor}
          onClose={() => setTableMenuAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 3, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Insert Table</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  type="number"
                  label="Rows"
                  defaultValue={3}
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ width: 80 }}
                  id="table-rows"
                />
                <TextField
                  size="small"
                  type="number"
                  label="Cols"
                  defaultValue={3}
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ width: 80 }}
                  id="table-cols"
                />
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  const rows = Number((document.getElementById('table-rows') as HTMLInputElement)?.value || 3);
                  const cols = Number((document.getElementById('table-cols') as HTMLInputElement)?.value || 3);
                  insertTable(rows, cols);
                  setTableMenuAnchor(null);
                }}
              >
                Insert Table
              </Button>
            </Stack>
          </Box>
        </Popover>

        {/* Notifications */}
        {notification && (
          <Snackbar
            open={true}
            autoHideDuration={4000}
            onClose={() => setNotification(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setNotification(null)}
              severity={notification.type}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        )}

        {/* Hidden file input for image uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                const img = `<img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image">`;
                document.execCommand('insertHTML', false, img);
                handleEditorChange();
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </Box>
      )}
    </ThemeProvider>
  );
};

export default CollaborativeEditor;