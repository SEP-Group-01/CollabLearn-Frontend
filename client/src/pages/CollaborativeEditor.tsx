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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Slider
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
  ArrowBack,
  Upload,
  Delete,
  AspectRatio,
  OpenWith,
  RotateRight,
  Crop,
  TableRows
} from '@mui/icons-material';

import { useWebSocketCollaboration } from '../lib/websocket/useWebSocketCollaboration';
import type { CollaborationUser } from '../lib/websocket/WebSocketCollaborationClient';
import { currentUser as mockUser, sharedDocuments, fontOptions, fontSizeOptions, textColors, highlightColors } from '../mocks/EditorMocks';
import { getUserData } from '../api/authApi';
import { getDocument, type DocumentResponse } from '../api/editorApi';
import { uploadImageWithProgress } from '../api/imageApi';
import type { ImageMetadata } from '../lib/imageUtils';
import { 
  createImageElement, 
  validateImageFile, 
  generateImageId, 
  fileToBase64, 
  extractImagesFromClipboard 
} from '../lib/imageUtils';

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

  // Context menus and dialogs
  const [imageContextMenu, setImageContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    imageElement: HTMLImageElement;
    imageMetadata: ImageMetadata | null;
  } | null>(null);
  const [tableContextMenu, setTableContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    cellElement: HTMLTableCellElement;
  } | null>(null);
  const [imageEditDialog, setImageEditDialog] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<{
    element: HTMLImageElement;
    metadata: ImageMetadata | null;
  } | null>(null);
  const [selectedLinkData, setSelectedLinkData] = useState<{
    element: HTMLAnchorElement | null;
    text: string;
    url: string;
    isEdit: boolean;
  } | null>(null);

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(new Map());
  const [dragOver, setDragOver] = useState(false);

  // Get real user data from authentication system
  const authUserData = getUserData();
  const currentUser = authUserData || mockUser; // Fallback to mock if not authenticated

  // Convert currentUser to CollaborationUser type
  const collaborationUser: CollaborationUser = {
    id: currentUser.id?.toString() || 'anonymous-' + Date.now(),
    name: authUserData ? `${authUserData.first_name} ${authUserData.last_name}`.trim() || authUserData.email : mockUser.name,
    avatar: authUserData ? `${authUserData.first_name?.charAt(0) || ''}${authUserData.last_name?.charAt(0) || ''}`.toUpperCase() || 'A' : mockUser.avatar,
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
    sendContentUpdate,
    sendCursorUpdate
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

  // Helper function to extract image metadata from element
  const extractImageMetadataFromElement = (imgElement: HTMLImageElement): ImageMetadata | null => {
    try {
      const src = imgElement.src;
      const alt = imgElement.alt;
      const width = imgElement.naturalWidth;
      const height = imgElement.naturalHeight;
      
      return {
        id: Date.now().toString(), // Fallback ID
        url: src,
        firebasePath: '', // Unknown
        originalName: alt || 'image.png',
        mimeType: 'image/png', // Default
        size: 0, // Unknown
        width,
        height,
        documentId: documentId || '',
        workspaceId: workspaceId || '',
        threadId: threadId || '',
        uploadedAt: new Date(),
        uploadedBy: collaborationUser.id,
        position: { x: 0, y: 0, index: 0 }
      };
    } catch (error) {
      console.error('Error extracting image metadata:', error);
      return null;
    }
  };

  // Image context menu handler
  const handleImageContextMenu = (e: MouseEvent, img: HTMLImageElement, metadata: ImageMetadata) => {
    e.preventDefault();
    console.log('🖼️ Image right-clicked:', { img, metadata });
    setImageContextMenu({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      imageElement: img,
      imageMetadata: metadata
    });
  };

  // Render collaborator cursors
  const renderCollaboratorCursors = useCallback(() => {
    if (!editorRef.current) return;
    
    // Remove existing cursors
    const existingCursors = editorRef.current.querySelectorAll('.collaborator-cursor, .collaborator-selection');
    existingCursors.forEach(cursor => cursor.remove());
    
    // Render cursors for each collaborator
    collaborators.forEach((collaborator, index) => {
      if (collaborator.cursor && collaborator.id !== collaborationUser.id) {
        console.log('🎯 Rendering cursor for:', collaborator.name, 'at anchor:', collaborator.cursor.anchor);
        try {
          const cursorPosition = createCursorAtOffset(editorRef.current!, collaborator.cursor.anchor);
          
          if (cursorPosition) {
            console.log('✅ Cursor position calculated:', cursorPosition, 'for user:', collaborator.name);
            
            // Create cursor element
            const cursorElement = document.createElement('div');
            cursorElement.className = 'collaborator-cursor';
            cursorElement.style.position = 'absolute';
            cursorElement.style.left = `${cursorPosition.x}px`;
            cursorElement.style.top = `${cursorPosition.y}px`;
            cursorElement.style.width = '3px'; // Made slightly wider for visibility
            cursorElement.style.height = '22px'; // Made slightly taller
            cursorElement.style.backgroundColor = getCollaboratorRingColor(collaborator.id);
            cursorElement.style.pointerEvents = 'none';
            cursorElement.style.zIndex = '1000';
            cursorElement.style.animation = 'blink 1s infinite';
            cursorElement.style.borderRadius = '1px';
            cursorElement.style.boxShadow = '0 0 3px rgba(0,0,0,0.3)'; // Add shadow for visibility
            
            // Add debugging info as data attribute
            cursorElement.setAttribute('data-user', collaborator.name);
            cursorElement.setAttribute('data-anchor', collaborator.cursor.anchor.toString());
            cursorElement.setAttribute('data-position', `${cursorPosition.x},${cursorPosition.y}`);
            
            // Add blinking animation
            const style = document.createElement('style');
            style.textContent = `
              @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.3; }
              }
            `;
            if (!document.head.querySelector('[data-cursor-animation]')) {
              style.setAttribute('data-cursor-animation', '');
              document.head.appendChild(style);
            }
            
            // Create cursor label
            const labelElement = document.createElement('div');
            labelElement.className = 'collaborator-cursor-label';
            labelElement.textContent = collaborator.name; // Remove coordinate debugging
            labelElement.style.position = 'absolute';
            labelElement.style.top = '-28px';
            labelElement.style.left = '0';
            labelElement.style.backgroundColor = getCollaboratorRingColor(collaborator.id);
            labelElement.style.color = 'white';
            labelElement.style.padding = '2px 6px';
            labelElement.style.borderRadius = '3px';
            labelElement.style.fontSize = '11px';
            labelElement.style.fontWeight = '500';
            labelElement.style.whiteSpace = 'nowrap';
            labelElement.style.pointerEvents = 'none';
            labelElement.style.opacity = '0.9';
            labelElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
            cursorElement.appendChild(labelElement);
            
            editorRef.current!.appendChild(cursorElement);
            
            console.log('✅ Cursor rendered with enhanced debugging for user:', collaborator.name);
          } else {
            console.warn('❌ Could not calculate cursor position for user:', collaborator.name);
          }
        } catch (error) {
          console.warn('Error rendering collaborator cursor:', error);
        }
      }
    });
  }, [collaborators, collaborationUser.id]);

  // Helper function to create cursor at specific text offset
  const createCursorAtOffset = (editor: Element, offset: number): { x: number; y: number } | null => {
    try {
      // Get all text content as a single string to validate offset
      const allTextContent = editor.textContent || '';
      console.log('📏 Total text length:', allTextContent.length, 'Target offset:', offset, 'Zoom level:', zoomLevel);
      
      if (offset > allTextContent.length) {
        console.warn('⚠️ Offset', offset, 'exceeds total text length', allTextContent.length);
        // Clamp to end of content
        offset = allTextContent.length;
      }
      
      // Special case: if offset is 0, position at the very beginning
      if (offset === 0) {
        const firstChild = editor.firstChild;
        if (firstChild) {
          const range = document.createRange();
          if (firstChild.nodeType === Node.TEXT_NODE) {
            range.setStart(firstChild, 0);
          } else {
            range.setStartBefore(firstChild);
          }
          range.collapse(true);
          
          const rect = range.getBoundingClientRect();
          const editorRect = editor.getBoundingClientRect();
          
          // Get the Paper element (editor's parent) which has the transform
          const paperElement = editor.parentElement;
          const paperRect = paperElement ? paperElement.getBoundingClientRect() : editorRect;
          
          console.log('📐 Rects:', { 
            range: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
            editor: { left: editorRect.left, top: editorRect.top, width: editorRect.width, height: editorRect.height },
            paper: { left: paperRect.left, top: paperRect.top, width: paperRect.width, height: paperRect.height }
          });
          
          // Position relative to the editor element (the contentEditable Box)
          let x = rect.left - editorRect.left;
          let y = rect.top - editorRect.top;
          
          // Apply offset compensation for cursor positioning issue
          // Based on user feedback: cursors appear 5 letters left and 1.5 lines above
          
          // Get computed styles to calculate more accurate character width and line height
          const editorStyles = window.getComputedStyle(editor as HTMLElement);
          const fontSize = parseFloat(editorStyles.fontSize) || 14;
          const lineHeight = parseFloat(editorStyles.lineHeight) || fontSize * 1.5;
          
          // Estimate character width based on font size
          const charWidth = fontSize * 0.6; // More accurate character width estimation
          
          // Compensate for the offset: move 5 characters right and 1.5 lines down
          const xOffset = 5 * charWidth;
          const yOffset = 1.5 * lineHeight;
          x += xOffset; // Move right by 5 character widths
          y += yOffset; // Move down by 1.5 line heights
          
          console.log('📐 Cursor at start (with offset compensation):', { 
            fontSize, 
            lineHeight, 
            charWidth, 
            xOffset, 
            yOffset,
            finalPos: { x, y }
          });
          return { x, y };
        }
      }
      
      // Create a tree walker to traverse all text nodes
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Accept all text nodes, including empty ones for accurate positioning
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      let currentOffset = 0;
      let targetNode: Text | null = null;
      let targetOffsetInNode = 0;
      
      // Find the exact text node and offset
      let node;
      while (node = walker.nextNode()) {
        const textNode = node as Text;
        const nodeLength = textNode.textContent?.length || 0;
        
        console.log('📍 Text node:', JSON.stringify(textNode.textContent?.slice(0, 20)), 'Length:', nodeLength, 'Current offset:', currentOffset);
        
        if (currentOffset + nodeLength >= offset) {
          targetNode = textNode;
          targetOffsetInNode = offset - currentOffset;
          console.log('🎯 Found target node at offset:', targetOffsetInNode, 'in node:', JSON.stringify(textNode.textContent?.slice(0, 20)));
          break;
        }
        currentOffset += nodeLength;
      }
      
      if (!targetNode) {
        console.warn('❌ Could not find target text node for offset:', offset);
        // Fallback: position at end of last text node
        const lastWalker = document.createTreeWalker(
          editor,
          NodeFilter.SHOW_TEXT,
          null
        );
        let lastNode: Text | null = null;
        while (lastWalker.nextNode()) {
          lastNode = lastWalker.currentNode as Text;
        }
        if (lastNode) {
          targetNode = lastNode;
          targetOffsetInNode = lastNode.textContent?.length || 0;
        } else {
          return null;
        }
      }
      
      // Create a range at the target position
      const range = document.createRange();
      range.setStart(targetNode, Math.min(targetOffsetInNode, targetNode.textContent?.length || 0));
      range.collapse(true);
      
      // Get the bounding rectangle of the range
      const rect = range.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      
      // Account for Material-UI Box padding structure:
      // 1. Outer Box has p: 3 (24px padding)
      // 2. Paper has p: 4 (32px padding) 
      // 3. Paper may have zoom transform
      
      // Calculate base position relative to editor
      let x = rect.left - editorRect.left;
      let y = rect.top - editorRect.top;
      
      // Apply offset compensation for cursor positioning issue
      // Based on user feedback: cursors appear 5 letters left and 1.5 lines above
      // We need to compensate by moving right and down
      
      // Get computed styles to calculate more accurate character width and line height
      const editorStyles = window.getComputedStyle(editor as HTMLElement);
      const fontSize = parseFloat(editorStyles.fontSize) || 14;
      const lineHeight = parseFloat(editorStyles.lineHeight) || fontSize * 1.5;
      
      // Estimate character width based on font size (typically 0.5-0.6 times font size for monospace-like)
      const charWidth = fontSize * 0.6; // More accurate character width estimation
      
      // Compensate for the offset: move 4 characters right and 1 line down
      const xOffset = 4 * charWidth;
      const yOffset = 1.4 * lineHeight;
      x += xOffset; // Move right by 5 character widths
      y += yOffset; // Move down by 1.5 line heights
      
      console.log('📐 Offset compensation applied:', { 
        fontSize, 
        lineHeight, 
        charWidth, 
        xOffset, 
        yOffset,
        originalPos: { x: x - xOffset, y: y - yOffset },
        adjustedPos: { x, y }
      });
      
      // Get the Paper element (editor's parent) to check for transforms
      const paperElement = editor.parentElement;
      if (paperElement) {
        const paperStyles = window.getComputedStyle(paperElement);
        const transform = paperStyles.transform;
        
        // If there's a scale transform, we need to account for it
        if (transform && transform !== 'none') {
          const scaleMatch = transform.match(/scale\(([^)]+)\)/);
          if (scaleMatch) {
            const scale = parseFloat(scaleMatch[1]);
            console.log('📐 Detected zoom scale:', scale);
            // Apply zoom compensation to the offset adjustments
            x = (x * scale);
            y = (y * scale);
          }
        }
      }
      
      console.log('📐 Final cursor position (with offset compensation):', { x, y }, 'for zoom level:', zoomLevel + '%');
      
      return { x, y };
    } catch (error) {
      console.error('❌ Error calculating cursor position:', error);
      return null;
    }
  };

  // Helper function to get all text nodes
  const getTextNodes = (element: Element): Text[] => {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }
    
    return textNodes;
  };

  // Initialize context menu handlers for all elements in the editor
  const initializeContextMenuHandlers = useCallback(() => {
    if (!editorRef.current) return;
    
    console.log('🔧 Initializing context menu handlers...');
    
    // Remove existing listeners first to prevent duplicates
    const images = editorRef.current.querySelectorAll('img');
    const tables = editorRef.current.querySelectorAll('table');
    
    // Add context menu listeners to all images
    images.forEach((img) => {
      // Remove existing listener if any
      const element = img as any;
      if (element.__contextMenuHandler) {
        img.removeEventListener('contextmenu', element.__contextMenuHandler);
      }
      
      // Create new handler
      const contextMenuHandler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖼️ Image context menu triggered via handler');
        const mouseEvent = e as MouseEvent;
        const imgElement = e.target as HTMLImageElement;
        const metadata = extractImageMetadataFromElement(imgElement);
        if (metadata) {
          handleImageContextMenu(mouseEvent, imgElement, metadata);
        }
      };
      
      // Store handler reference for removal later
      element.__contextMenuHandler = contextMenuHandler;
      img.addEventListener('contextmenu', contextMenuHandler);
    });
    
    // Add context menu listeners to all tables
    tables.forEach((table) => {
      // Remove existing listener if any
      const element = table as any;
      if (element.__contextMenuHandler) {
        table.removeEventListener('contextmenu', element.__contextMenuHandler);
      }
      
      // Create new handler
      const contextMenuHandler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📊 Table context menu triggered via handler');
        const mouseEvent = e as MouseEvent;
        const target = e.target as HTMLElement;
        const cell = target.closest('td, th') as HTMLTableCellElement;
        
        if (cell) {
          console.log('📊 Table context menu opened for cell:', cell);
          setTableContextMenu({
            mouseX: mouseEvent.clientX - 2,
            mouseY: mouseEvent.clientY - 4,
            cellElement: cell
          });
        }
      };
      
      // Store handler reference for removal later
      element.__contextMenuHandler = contextMenuHandler;
      table.addEventListener('contextmenu', contextMenuHandler);
    });
    
    console.log(`🔧 Initialized context menus for ${images.length} images and ${tables.length} tables`);
  }, []);

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
        // Initialize context menus for loaded content
        setTimeout(() => {
          initializeContextMenuHandlers();
        }, 100);
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
  }, [editorContent, documentLoading, documentError, initializeContextMenuHandlers]);

  // Render collaborator cursors when collaborators change
  useEffect(() => {
    if (collaborators.length > 0) {
      console.log('👥 Rendering cursors for collaborators:', collaborators.map(c => ({ id: c.id, name: c.name, cursor: c.cursor })));
      renderCollaboratorCursors();
    }
  }, [collaborators, renderCollaboratorCursors]);

  // Re-render cursors when editor scrolls
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleScroll = () => {
      console.log('📜 Editor scrolled, re-rendering cursors');
      renderCollaboratorCursors();
    };

    editor.addEventListener('scroll', handleScroll);
    return () => editor.removeEventListener('scroll', handleScroll);
  }, [renderCollaboratorCursors]);

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
    
    // Only send update if content actually changed and is different from collaboration content
    if (newContent !== lastContentRef.current && newContent !== collaborationContent) {
      console.log('📝 Sending content update:', { 
        newLength: newContent.length, 
        lastLength: lastContentRef.current.length,
        collaborationLength: collaborationContent.length 
      });
      lastContentRef.current = newContent;
      sendContentUpdate(newContent);
    }
  }, [sendContentUpdate, collaborationContent]);

  // Handle cursor/selection changes
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        // Calculate global text positions
        const anchor = getGlobalTextOffset(editorRef.current, range.startContainer, range.startOffset);
        const head = getGlobalTextOffset(editorRef.current, range.endContainer, range.endOffset);
        
        console.log('📍 Sending cursor update:', { anchor, head });
        sendCursorUpdate({ anchor, head });
        
        // Save selection for later use
        savedSelectionRef.current = range.cloneRange();
      }
    }
  }, [sendCursorUpdate]);

  // Helper function to calculate global text offset
  const getGlobalTextOffset = (root: Element, targetNode: Node, targetOffset: number): number => {
    console.log('🔍 Calculating global offset for target node:', targetNode, 'offset:', targetOffset);
    
    // Create a tree walker to traverse all text nodes in the same order as createCursorAtOffset
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Accept all text nodes, including empty ones for accurate positioning
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let globalOffset = 0;
    
    let node;
    while (node = walker.nextNode()) {
      const textNode = node as Text;
      
      if (textNode === targetNode) {
        const result = globalOffset + targetOffset;
        console.log('✅ Found target node, global offset:', result);
        return result;
      }
      
      globalOffset += textNode.textContent?.length || 0;
    }
    
    console.warn('❌ Target node not found in tree walk');
    return globalOffset;
  };

  // Update editor content when collaboration content changes
  useEffect(() => {
    if (editorRef.current && collaborationContent !== lastContentRef.current) {
      console.log('🔄 Updating editor content from collaboration:', { 
        newContent: collaborationContent.length, 
        lastContent: lastContentRef.current.length 
      });
      
      // Store current cursor position
      const selection = window.getSelection();
      let cursorPosition = 0;
      if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        cursorPosition = range.startOffset;
      }
      
      // Update content
      editorRef.current.innerHTML = collaborationContent;
      lastContentRef.current = collaborationContent;
      
      // Restore cursor position
      try {
        if (selection && editorRef.current.firstChild) {
          const range = document.createRange();
          const textNode = editorRef.current.firstChild;
          const maxOffset = textNode.textContent?.length || 0;
          range.setStart(textNode, Math.min(cursorPosition, maxOffset));
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (error) {
        console.warn('Could not restore cursor position:', error);
      }
      
      // Initialize context menu handlers for new elements
      setTimeout(() => {
        initializeContextMenuHandlers();
      }, 100);
    }
  }, [collaborationContent, initializeContextMenuHandlers]);

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

  // Special function for inline code formatting with toggle
  const applyInlineCode = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Check if we're inside a code element
        const parentCode = range.commonAncestorContainer.parentElement?.closest('code');
        
        if (parentCode) {
          // Remove code formatting
          const text = parentCode.textContent || '';
          const textNode = document.createTextNode(text);
          parentCode.parentNode?.replaceChild(textNode, parentCode);
          showNotification('Code formatting removed', 'info');
        } else {
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
            showNotification('Code formatting applied', 'info');
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
        }
        
        handleEditorChange();
      }
    } catch (error) {
      console.error('Error applying inline code:', error);
    }
  };

  // Toggle blockquote formatting
  const toggleBlockquote = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const parentBlockquote = range.commonAncestorContainer.parentElement?.closest('blockquote');
    
    if (parentBlockquote) {
      // Remove blockquote
      const content = parentBlockquote.innerHTML;
      const div = document.createElement('div');
      div.innerHTML = content;
      parentBlockquote.parentNode?.replaceChild(div, parentBlockquote);
      showNotification('Blockquote removed', 'info');
    } else {
      // Apply blockquote
      applyFormat('formatBlock', 'blockquote');
      showNotification('Blockquote applied', 'info');
    }
    
    handleEditorChange();
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
    
    // Initialize context menu handlers for new elements
    setTimeout(() => {
      initializeContextMenuHandlers();
    }, 100);
    
    handleEditorChange();
  };

  // Table manipulation functions
  const handleTableAction = (action: 'addRowBefore' | 'addRowAfter' | 'removeRow' | 'addColBefore' | 'addColAfter' | 'removeCol') => {
    if (!tableContextMenu) return;
    
    const cell = tableContextMenu.cellElement;
    const row = cell.parentElement as HTMLTableRowElement;
    const table = row.parentElement as HTMLTableElement;
    const rowIndex = Array.from(table.rows).indexOf(row);
    const colIndex = Array.from(row.cells).indexOf(cell);
    
    switch (action) {
      case 'addRowBefore':
        insertTableRow(table, rowIndex, false);
        break;
      case 'addRowAfter':
        insertTableRow(table, rowIndex, true);
        break;
      case 'removeRow':
        if (table.rows.length > 1) {
          table.deleteRow(rowIndex);
        }
        break;
      case 'addColBefore':
        insertTableColumn(table, colIndex, false);
        break;
      case 'addColAfter':
        insertTableColumn(table, colIndex, true);
        break;
      case 'removeCol':
        if (table.rows[0].cells.length > 1) {
          removeTableColumn(table, colIndex);
        }
        break;
    }
    
    setTableContextMenu(null);
    handleEditorChange();
    showNotification(`Table ${action.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'success');
  };

  const insertTableRow = (table: HTMLTableElement, index: number, after: boolean) => {
    const newRow = table.insertRow(after ? index + 1 : index);
    const cellCount = table.rows[0].cells.length;
    
    for (let i = 0; i < cellCount; i++) {
      const cell = newRow.insertCell();
      cell.style.padding = '8px';
      cell.style.border = '1px solid #ddd';
      cell.textContent = 'Cell';
    }
  };

  const insertTableColumn = (table: HTMLTableElement, index: number, after: boolean) => {
    const colIndex = after ? index + 1 : index;
    
    Array.from(table.rows).forEach((row, rowIndex) => {
      const cell = row.insertCell(colIndex);
      cell.style.padding = '8px';
      cell.style.border = '1px solid #ddd';
      cell.textContent = rowIndex === 0 ? 'Header' : 'Cell';
      if (rowIndex === 0) {
        cell.style.backgroundColor = '#f0f0f0';
      }
    });
  };

  const removeTableColumn = (table: HTMLTableElement, index: number) => {
    Array.from(table.rows).forEach(row => {
      if (row.cells[index]) {
        row.deleteCell(index);
      }
    });
  };

  // Image handling functions
  const handleImageUpload = async (files: File[]) => {
    console.log('🖼️ [Editor] Starting image upload for files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    if (!workspaceId || !threadId || !documentId) {
      console.error('❌ [Editor] Missing required IDs:', { workspaceId, threadId, documentId });
      showNotification('Missing workspace, thread, or document information', 'error');
      return;
    }

    for (const file of files) {
      console.log('🖼️ [Editor] Processing file:', file.name);
      
      const validation = validateImageFile(file);
      if (!validation.valid) {
        console.error('❌ [Editor] File validation failed:', validation.error);
        showNotification(validation.error || 'Invalid image file', 'error');
        continue;
      }

      const imageId = generateImageId();
      console.log('🖼️ [Editor] Generated image ID:', imageId);
      
      setUploadingImages(prev => new Set(prev).add(imageId));
      setUploadProgress(prev => new Map(prev).set(imageId, 0));

      try {
        // Get cursor position for insertion
        const selection = window.getSelection();
        let insertPosition = 0;
        if (selection && selection.rangeCount > 0 && editorRef.current) {
          const range = selection.getRangeAt(0);
          if (editorRef.current.contains(range.commonAncestorContainer)) {
            insertPosition = range.startOffset;
          }
        }

        console.log('🖼️ [Editor] Insert position:', insertPosition);

        // Create preview image while uploading
        const previewUrl = await fileToBase64(file);
        const previewImg = `<img src="${previewUrl}" style="max-width: 100%; height: auto; margin: 10px 0; opacity: 0.7; border: 2px dashed #ccc;" alt="Uploading..." data-uploading-id="${imageId}">`;
        
        // Insert preview image at cursor position
        if (selection && selection.rangeCount > 0) {
          document.execCommand('insertHTML', false, previewImg);
          handleEditorChange();
        }

        console.log('🖼️ [Editor] Starting upload with uploadImageWithProgress...');

        // Upload image to Firebase
        const result = await uploadImageWithProgress({
          file,
          documentId,
          workspaceId,
          threadId,
          position: insertPosition,
          onProgress: (progress) => {
            console.log('📊 [Editor] Upload progress:', progress + '%');
            setUploadProgress(prev => new Map(prev).set(imageId, progress));
          }
        });

        console.log('🖼️ [Editor] Upload result:', result);

        if (result.success && result.imageMetadata) {
          console.log('✅ [Editor] Upload successful, replacing preview image');
          console.log('🖼️ [Editor] Image metadata:', result.imageMetadata);
          
          // Replace preview with actual image
          const actualImgWrapper = createImageElement(result.imageMetadata, {
            maxWidth: 800,
            className: 'editor-image',
            onContextMenu: (e, img, metadata) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🖼️ Image context menu from createImageElement:', { img, metadata });
              handleImageContextMenu(e, img, metadata);
            }
          });

          console.log('🖼️ [Editor] Created image wrapper element:', actualImgWrapper);
          const img = actualImgWrapper.querySelector('img');
          if (img) {
            console.log('🖼️ [Editor] Image src:', img.src);
            console.log('🖼️ [Editor] Image alt:', img.alt);
          }

          // Find and replace the preview image
          if (editorRef.current) {
            const previewElement = editorRef.current.querySelector(`[data-uploading-id="${imageId}"]`);
            console.log('🖼️ [Editor] Preview element found:', previewElement);
            if (previewElement) {
              previewElement.replaceWith(actualImgWrapper);
              console.log('🖼️ [Editor] Preview replaced with actual image');
              handleEditorChange();
              // Re-initialize context menus for the new image
              setTimeout(() => {
                initializeContextMenuHandlers();
              }, 100);
            } else {
              console.log('⚠️ [Editor] No preview element found, appending image');
              editorRef.current.appendChild(actualImgWrapper);
              handleEditorChange();
              // Re-initialize context menus for the new image
              setTimeout(() => {
                initializeContextMenuHandlers();
              }, 100);
            }
          }

          // Update document images state
          showNotification('Image uploaded successfully', 'success');
        } else {
          console.error('❌ [Editor] Upload failed:', result.error);
          
          // Remove preview image on failure
          if (editorRef.current) {
            const previewElement = editorRef.current.querySelector(`[data-uploading-id="${imageId}"]`);
            if (previewElement) {
              previewElement.remove();
              handleEditorChange();
            }
          }
          showNotification(result.error || 'Failed to upload image', 'error');
        }
      } catch (error: any) {
        console.error('❌ [Editor] Image upload error:', error);
        // Remove preview image on error
        if (editorRef.current) {
          const previewElement = editorRef.current.querySelector(`[data-uploading-id="${imageId}"]`);
          if (previewElement) {
            previewElement.remove();
            handleEditorChange();
          }
        }
        showNotification(`Upload failed: ${error.message}`, 'error');
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
        setUploadProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(imageId);
          return newMap;
        });
      }
    }
  };

  // Handle paste events for images
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!e.clipboardData) return;

    const images = await extractImagesFromClipboard(e.clipboardData);
    if (images.length > 0) {
      e.preventDefault();
      handleImageUpload(images);
    }
  }, [workspaceId, threadId, documentId]);

  // Handle drag and drop for images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  // Image editing functions
  const handleImageEdit = (action: 'resize' | 'move' | 'rotate' | 'crop' | 'delete' | 'alignLeft' | 'alignCenter' | 'alignRight') => {
    if (!imageContextMenu) return;
    
    const { imageElement, imageMetadata } = imageContextMenu;
    
    switch (action) {
      case 'delete':
        handleImageDelete(imageElement);
        break;
      case 'alignLeft':
        handleImageAlignment(imageElement, 'left');
        break;
      case 'alignCenter':
        handleImageAlignment(imageElement, 'center');
        break;
      case 'alignRight':
        handleImageAlignment(imageElement, 'right');
        break;
      case 'resize':
      case 'move':
      case 'rotate':
      case 'crop':
        setSelectedImageForEdit({ element: imageElement, metadata: imageMetadata });
        setImageEditDialog(true);
        break;
    }
    
    setImageContextMenu(null);
  };

  const handleImageAlignment = (imgElement: HTMLImageElement, alignment: 'left' | 'center' | 'right') => {
    const wrapper = imgElement.closest('.editor-image-wrapper') as HTMLElement;
    const targetElement = wrapper || imgElement;
    
    // Reset previous alignment styles
    targetElement.style.float = '';
    targetElement.style.margin = '';
    targetElement.style.display = '';
    
    switch (alignment) {
      case 'left':
        targetElement.style.float = 'left';
        targetElement.style.margin = '10px 20px 10px 0';
        break;
      case 'center':
        targetElement.style.display = 'block';
        targetElement.style.margin = '10px auto';
        break;
      case 'right':
        targetElement.style.float = 'right';
        targetElement.style.margin = '10px 0 10px 20px';
        break;
    }
    
    handleEditorChange();
    showNotification(`Image aligned ${alignment}`, 'success');
  };

  const handleImageDelete = (imgElement: HTMLImageElement) => {
    const wrapper = imgElement.closest('.editor-image-wrapper');
    if (wrapper) {
      wrapper.remove();
    } else {
      imgElement.remove();
    }
    handleEditorChange();
    showNotification('Image deleted', 'success');
  };

  // Insert image from file picker
  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleImageUpload(files);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const insertLink = () => {
    saveSelection();
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    
    // Check if we're editing an existing link
    const parentElement = selection?.anchorNode?.parentElement;
    const existingLink = parentElement?.closest('a') as HTMLAnchorElement;
    
    if (existingLink) {
      // Editing existing link
      setSelectedLinkData({
        element: existingLink,
        text: existingLink.textContent || '',
        url: existingLink.href || '',
        isEdit: true
      });
    } else {
      // Creating new link
      setSelectedLinkData({
        element: null,
        text: selectedText,
        url: '',
        isEdit: false
      });
    }
    
    setLinkDialog(true);
  };

  const handleLinkSave = (url: string, text: string) => {
    if (!selectedLinkData) return;
    
    if (selectedLinkData.isEdit && selectedLinkData.element) {
      // Update existing link
      selectedLinkData.element.href = url;
      selectedLinkData.element.textContent = text;
    } else {
      // Create new link
      restoreSelection();
      const linkHtml = `<a href="${url}" target="_blank">${text || url}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    }
    
    handleEditorChange();
    setLinkDialog(false);
    setSelectedLinkData(null);
    showNotification(selectedLinkData.isEdit ? 'Link updated' : 'Link inserted', 'success');
  };

  const handleLinkRemove = () => {
    if (!selectedLinkData?.element) return;
    
    const link = selectedLinkData.element;
    const text = link.textContent || '';
    const textNode = document.createTextNode(text);
    link.parentNode?.replaceChild(textNode, link);
    
    handleEditorChange();
    setLinkDialog(false);
    setSelectedLinkData(null);
    showNotification('Link removed', 'success');
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

  // Paste event listener for images and context menu initialization
  useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement) {
      const pasteHandler = (e: Event) => {
        if (e instanceof ClipboardEvent) {
          handlePaste(e);
        }
      };
      
      editorElement.addEventListener('paste', pasteHandler);
      
      // Initialize context menu handlers when component mounts
      setTimeout(() => {
        initializeContextMenuHandlers();
      }, 500);
      
      return () => {
        editorElement.removeEventListener('paste', pasteHandler);
      };
    }
  }, [handlePaste, initializeContextMenuHandlers]);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Get unique color for each collaborator based on their user ID
  const getCollaboratorRingColor = (userId: string) => {
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
    
    // Generate a consistent index based on user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Image Styles */}
      <style>{`
        .editor-image-wrapper {
          position: relative;
          display: inline-block;
          margin: 10px 0;
        }
        
        .editor-image-wrapper img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        
        .editor-image-wrapper:hover img {
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        .resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #4caf50;
          border: 2px solid white;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10;
        }
        
        .editor-image-wrapper:hover .resize-handle {
          opacity: 1;
        }
        
        .resize-nw { top: -5px; left: -5px; cursor: nw-resize; }
        .resize-ne { top: -5px; right: -5px; cursor: ne-resize; }
        .resize-sw { bottom: -5px; left: -5px; cursor: sw-resize; }
        .resize-se { bottom: -5px; right: -5px; cursor: se-resize; }
        
        .editor-content img {
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }
        
        .editor-content img:hover {
          border-color: #4caf50;
          transform: scale(1.01);
        }
        
        .editor-content img.selected {
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
        }
        
        /* Collaborator cursor styles - Remove old CSS-based cursors */
        .collaborator-cursor {
          /* These styles are now applied via JavaScript for better control */
        }
        
        .collaborator-cursor-label {
          /* These styles are now applied via JavaScript for better control */
        }
        
        .collaborator-selection {
          background-color: currentColor;
          opacity: 0.2;
          pointer-events: none;
          position: absolute;
          z-index: 999;
        }
      `}</style>
      
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
                    <Tooltip title={`${collaborationUser.name} (You)`}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'lightgray',
                          color: 'darkgray',
                          fontSize: '0.7rem',
                          border: `2px solid ${getCollaboratorRingColor(collaborationUser.id)}`
                        }}
                      >
                        {collaborationUser.avatar}
                      </Avatar>
                    </Tooltip>
                    {collaborators.map((user) => {
                      const ringColor = getCollaboratorRingColor(user.id);
                      console.log('👤 Rendering avatar for user:', user.name, 'ID:', user.id, 'isActive:', user.isActive, 'Color:', ringColor);
                      return (
                        <Tooltip key={user.id} title={user.name}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'lightgray',
                              color: 'darkgray',
                              fontSize: '0.7rem',
                              border: `2px solid ${ringColor}`, // Always show color ring, remove isActive condition
                              transition: 'border-color 0.2s ease',
                              opacity: user.isActive ? 1 : 0.7, // Use opacity instead of border for inactive users
                            }}
                          >
                            {user.avatar}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
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
                  <IconButton onClick={toggleBlockquote}>
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
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      sx={{
                        outline: 'none',
                        lineHeight: 1.6,
                        minHeight: 500,
                        fontFamily: fontFamily,
                        fontSize: `${fontSize}px`,
                        color: textColor,
                        ...(dragOver && {
                          backgroundColor: 'action.hover',
                          border: '2px dashed',
                          borderColor: 'primary.main',
                        }),
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
                        '& .editor-image': {
                          cursor: 'pointer',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        },
                      }}
                      // Don't use dangerouslySetInnerHTML - we'll set content via useEffect
                    />

                    {/* Collaborative cursors are now rendered dynamically via JavaScript in renderCollaboratorCursors */}
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

        {/* Upload Progress Indicators */}
        {uploadingImages.size > 0 && (
          <Box
            sx={{
              position: 'fixed',
              top: 80,
              right: 20,
              zIndex: 1300,
              maxWidth: 350,
            }}
          >
            {Array.from(uploadingImages).map((imageId) => {
              const progress = uploadProgress.get(imageId) || 0;
              return (
                <Card key={imageId} sx={{ mb: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Upload />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">Uploading image...</Typography>
                      <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Drag Overlay */}
        {dragOver && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              border: '3px dashed',
              borderColor: 'primary.main',
              zIndex: 1200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="primary">
                Drop images here to upload
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Release to upload to the document
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Image Context Menu */}
        <Menu
          open={imageContextMenu !== null}
          onClose={() => setImageContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={
            imageContextMenu !== null
              ? { top: imageContextMenu.mouseY, left: imageContextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => handleImageEdit('resize')}>
            <ListItemIcon>
              <AspectRatio fontSize="small" />
            </ListItemIcon>
            <ListItemText>Resize</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleImageEdit('move')}>
            <ListItemIcon>
              <OpenWith fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleImageEdit('rotate')}>
            <ListItemIcon>
              <RotateRight fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rotate</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleImageEdit('crop')}>
            <ListItemIcon>
              <Crop fontSize="small" />
            </ListItemIcon>
            <ListItemText>Crop</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleImageEdit('alignLeft')}>
            <ListItemIcon>
              <FormatAlignLeft fontSize="small" />
            </ListItemIcon>
            <ListItemText>Align Left</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleImageEdit('alignCenter')}>
            <ListItemIcon>
              <FormatAlignCenter fontSize="small" />
            </ListItemIcon>
            <ListItemText>Align Center</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleImageEdit('alignRight')}>
            <ListItemIcon>
              <FormatAlignRight fontSize="small" />
            </ListItemIcon>
            <ListItemText>Align Right</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleImageEdit('delete')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Table Context Menu */}
        <Menu
          open={tableContextMenu !== null}
          onClose={() => setTableContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={
            tableContextMenu !== null
              ? { top: tableContextMenu.mouseY, left: tableContextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => handleTableAction('addRowBefore')}>
            <ListItemIcon>
              <TableRows fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Row Before</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleTableAction('addRowAfter')}>
            <ListItemIcon>
              <TableRows fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Row After</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleTableAction('removeRow')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Remove Row</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleTableAction('addColBefore')}>
            <ListItemIcon>
              <TableChart fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Column Before</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleTableAction('addColAfter')}>
            <ListItemIcon>
              <TableChart fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Column After</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleTableAction('removeCol')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Remove Column</ListItemText>
          </MenuItem>
        </Menu>

        {/* Image Edit Dialog */}
        <Dialog open={imageEditDialog} onClose={() => setImageEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogContent>
            {selectedImageForEdit && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedImageForEdit.metadata?.originalName || 'Image'}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Resize</Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      label="Width (px)"
                      type="number"
                      size="small"
                      defaultValue={selectedImageForEdit.element.offsetWidth}
                      onChange={(e) => {
                        const width = parseInt(e.target.value);
                        if (width > 0) {
                          selectedImageForEdit.element.style.width = `${width}px`;
                        }
                      }}
                    />
                    <TextField
                      label="Height (px)"
                      type="number"
                      size="small"
                      defaultValue={selectedImageForEdit.element.offsetHeight}
                      onChange={(e) => {
                        const height = parseInt(e.target.value);
                        if (height > 0) {
                          selectedImageForEdit.element.style.height = `${height}px`;
                        }
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Rotation</Typography>
                  <Slider
                    defaultValue={0}
                    min={-180}
                    max={180}
                    step={15}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => {
                      selectedImageForEdit.element.style.transform = `rotate(${value}deg)`;
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Position</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="X Position (px)"
                      type="number"
                      size="small"
                      onChange={(e) => {
                        const wrapper = selectedImageForEdit.element.closest('.editor-image-wrapper') as HTMLElement;
                        if (wrapper) {
                          wrapper.style.position = 'relative';
                          wrapper.style.left = `${e.target.value}px`;
                        }
                      }}
                    />
                    <TextField
                      label="Y Position (px)"
                      type="number"
                      size="small"
                      onChange={(e) => {
                        const wrapper = selectedImageForEdit.element.closest('.editor-image-wrapper') as HTMLElement;
                        if (wrapper) {
                          wrapper.style.position = 'relative';
                          wrapper.style.top = `${e.target.value}px`;
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImageEditDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              handleEditorChange();
              setImageEditDialog(false);
              setSelectedImageForEdit(null);
              showNotification('Image updated', 'success');
            }} variant="contained">Apply</Button>
          </DialogActions>
        </Dialog>

        {/* Link Dialog */}
        <Dialog open={linkDialog} onClose={() => setLinkDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedLinkData?.isEdit ? 'Edit Link' : 'Insert Link'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Link Text"
                fullWidth
                defaultValue={selectedLinkData?.text || ''}
                onChange={(e) => {
                  if (selectedLinkData) {
                    setSelectedLinkData({
                      ...selectedLinkData,
                      text: e.target.value
                    });
                  }
                }}
              />
              <TextField
                label="URL"
                fullWidth
                placeholder="https://example.com"
                defaultValue={selectedLinkData?.url || ''}
                onChange={(e) => {
                  if (selectedLinkData) {
                    setSelectedLinkData({
                      ...selectedLinkData,
                      url: e.target.value
                    });
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            {selectedLinkData?.isEdit && (
              <Button onClick={handleLinkRemove} color="error">
                Remove Link
              </Button>
            )}
            <Button onClick={() => setLinkDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => selectedLinkData && handleLinkSave(selectedLinkData.url, selectedLinkData.text)}
              variant="contained"
              disabled={!selectedLinkData?.url}
            >
              {selectedLinkData?.isEdit ? 'Update' : 'Insert'}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Box>
      )}
    </ThemeProvider>
  );
};

export default CollaborativeEditor;