"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Paper,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Card,
  CardContent,
  ButtonGroup,
  ThemeProvider,
  CssBaseline,
  List,
  ListItem,
} from "@mui/material"
import SidebarComponent from '../components/SideBar'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Subscript,
  Superscript,
  Title,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  DataObject,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Link,
  Highlight,
  Image,
  Undo,
  Redo,
  DarkMode,
  LightMode,
  Description,
  People,
  MoreHoriz,
  ChevronRight,
} from "@mui/icons-material"
import { lightTheme, darkTheme } from '../theme/theme'

// Mock data for collaborators
const collaborators = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32&text=AJ",
    color: "bg-blue-500",
    isActive: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=32&width=32&text=BS",
    color: "bg-green-500",
    isActive: true,
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=32&width=32&text=CD",
    color: "bg-purple-500",
    isActive: false,
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=32&width=32&text=DW",
    color: "bg-orange-500",
    isActive: true,
  },
]

// Mock data for shared documents
const sharedDocuments = [
  {
    id: 1,
    title: "Project Proposal 2024",
    lastEdited: "2 hours ago",
    preview: "This document outlines our strategic initiatives...",
    isActive: false,
  },
  {
    id: 2,
    title: "Team Meeting Notes",
    lastEdited: "1 day ago",
    preview: "Weekly sync discussion points and action items...",
    isActive: true,
  },
  {
    id: 3,
    title: "Product Roadmap",
    lastEdited: "3 days ago",
    preview: "Q1-Q4 feature development timeline...",
    isActive: false,
  },
  {
    id: 4,
    title: "Design System Guidelines",
    lastEdited: "1 week ago",
    preview: "Brand colors, typography, and component specs...",
    isActive: false,
  },
]

const highlightColors = [
  { name: "Yellow", class: "bg-yellow-200 dark:bg-yellow-800" },
  { name: "Green", class: "bg-green-200 dark:bg-green-800" },
  { name: "Pink", class: "bg-pink-200 dark:bg-pink-800" },
  { name: "Blue", class: "bg-blue-200 dark:bg-blue-800" },
  { name: "Purple", class: "bg-purple-200 dark:bg-purple-800" },
]

const CollaborativeEditor = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeDocument, setActiveDocument] = useState("Team Meeting Notes")
  const [editorContent, setEditorContent] = useState(`
    <h1>Team Meeting Notes - January 2024</h1>
    <p>Welcome to our weekly team sync. Here are the key discussion points and action items from today's meeting.</p>
    
    <h2>Agenda Items</h2>
    <ul>
      <li>Project status updates</li>
      <li>Resource allocation review</li>
      <li>Upcoming deadlines</li>
    </ul>
    
    <blockquote>
      "Great teams are built on trust, communication, and shared goals." - Team Lead
    </blockquote>
    
    <p>Let's continue collaborating effectively to achieve our objectives.</p>
  `)
  
  const [headingMenuAnchor, setHeadingMenuAnchor] = useState<null | HTMLElement>(null)
  const [highlightMenuAnchor, setHighlightMenuAnchor] = useState<null | HTMLElement>(null)

  const theme = isDarkMode ? darkTheme : lightTheme

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleHeadingMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setHeadingMenuAnchor(event.currentTarget)
  }

  const handleHeadingMenuClose = () => {
    setHeadingMenuAnchor(null)
  }

  const handleHighlightMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setHighlightMenuAnchor(event.currentTarget)
  }

  const handleHighlightMenuClose = () => {
    setHighlightMenuAnchor(null)
  }
  const ToolbarButton = ({
    icon: Icon,
    tooltip,
    isActive = false,
    onClick = () => {},
  }: {
    icon: React.ElementType
    tooltip: string
    isActive?: boolean
    onClick?: () => void
  }) => (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        color={isActive ? "primary" : "default"}
        onClick={onClick}
        sx={{ 
          width: 32, 
          height: 32,
          backgroundColor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'primary.contrastText' : 'inherit',
          '&:hover': {
            backgroundColor: isActive ? 'primary.dark' : 'action.hover',
          }
        }}
      >
        <Icon sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex' }}>
        {/* Sidebar */}
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        
        {/* Main Content */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,
            marginLeft: { xs: 0, md: collapsed ? '80px' : '250px' },
            transition: 'margin-left 0.3s ease',
          }}
        >
          {/* Top Navigation Bar */}
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                <Description />
                <Typography variant="h6" component="h1">
                  {activeDocument}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* User Presence Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Box sx={{ display: 'flex', gap: -1 }}>
                    {collaborators.map((user, index) => (
                      <Tooltip key={user.id} title={`${user.name} ${user.isActive ? "(Active)" : "(Away)"}`}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            user.isActive ? (
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: 'success.main',
                                  border: '2px solid',
                                  borderColor: 'background.paper',
                                }}
                              />
                            ) : null
                          }
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: '12px',
                              bgcolor: user.color.replace('bg-', '').replace('-500', '.main'),
                              marginLeft: index > 0 ? -1 : 0,
                              border: '2px solid',
                              borderColor: 'background.paper',
                            }}
                          >
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                        </Badge>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Theme Toggle */}
                <Tooltip title="Toggle theme">
                  <IconButton onClick={toggleTheme} size="small">
                    {isDarkMode ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>

        {/* Formatting Toolbar */}
        <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', px: 3, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto' }}>
            {/* Text Formatting */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={FormatBold} tooltip="Bold (Ctrl+B)" />
              <ToolbarButton icon={FormatItalic} tooltip="Italic (Ctrl+I)" />
              <ToolbarButton icon={FormatUnderlined} tooltip="Underline (Ctrl+U)" />
              <ToolbarButton icon={StrikethroughS} tooltip="Strikethrough" />
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Script */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={Subscript} tooltip="Subscript" />
              <ToolbarButton icon={Superscript} tooltip="Superscript" />
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Headings */}
            <Tooltip title="Headings">
              <IconButton size="small" onClick={handleHeadingMenuClick}>
                <Title sx={{ fontSize: 16 }} />
                <ChevronRight sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={headingMenuAnchor}
              open={Boolean(headingMenuAnchor)}
              onClose={handleHeadingMenuClose}
            >
              <MenuItem onClick={handleHeadingMenuClose}>
                <Title sx={{ mr: 1 }} />
                Heading 1
              </MenuItem>
              <MenuItem onClick={handleHeadingMenuClose}>
                <Title sx={{ mr: 1, fontSize: '1.2em' }} />
                Heading 2
              </MenuItem>
              <MenuItem onClick={handleHeadingMenuClose}>
                <Title sx={{ mr: 1, fontSize: '1.1em' }} />
                Heading 3
              </MenuItem>
              <MenuItem onClick={handleHeadingMenuClose}>
                <Title sx={{ mr: 1, fontSize: '1em' }} />
                Heading 4
              </MenuItem>
              <MenuItem onClick={handleHeadingMenuClose}>
                <Title sx={{ mr: 1, fontSize: '0.9em' }} />
                Heading 5
              </MenuItem>
              <MenuItem onClick={handleHeadingMenuClose}>
                <Title sx={{ mr: 1, fontSize: '0.8em' }} />
                Heading 6
              </MenuItem>
            </Menu>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Block Elements */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={FormatQuote} tooltip="Blockquote" />
              <ToolbarButton icon={FormatListBulleted} tooltip="Bullet List" />
              <ToolbarButton icon={FormatListNumbered} tooltip="Numbered List" />
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Code */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={Code} tooltip="Inline Code" />
              <ToolbarButton icon={DataObject} tooltip="Code Block" />
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Alignment */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={FormatAlignLeft} tooltip="Align Left" />
              <ToolbarButton icon={FormatAlignCenter} tooltip="Align Center" />
              <ToolbarButton icon={FormatAlignRight} tooltip="Align Right" />
              <ToolbarButton icon={FormatAlignJustify} tooltip="Justify" />
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Insert Elements */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={Link} tooltip="Insert Link" />

              {/* Highlight Dropdown */}
              <Tooltip title="Highlight">
                <IconButton size="small" onClick={handleHighlightMenuClick}>
                  <Highlight sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={highlightMenuAnchor}
                open={Boolean(highlightMenuAnchor)}
                onClose={handleHighlightMenuClose}
              >
                {highlightColors.map((color) => (
                  <MenuItem key={color.name} onClick={handleHighlightMenuClose}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: 1,
                        mr: 1,
                        backgroundColor: color.name.toLowerCase(),
                      }}
                    />
                    {color.name}
                  </MenuItem>
                ))}
              </Menu>

              <ToolbarButton icon={Image} tooltip="Insert Image" />
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* History */}
            <ButtonGroup variant="text" size="small">
              <ToolbarButton icon={Undo} tooltip="Undo (Ctrl+Z)" />
              <ToolbarButton icon={Redo} tooltip="Redo (Ctrl+Y)" />
            </ButtonGroup>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, p: 3 }}>
              <Box sx={{ maxWidth: '4xl', mx: 'auto' }}>
                {/* Editor Area with Collaborative Cursors */}
                <Box sx={{ position: 'relative' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      minHeight: 600,
                      p: 3,
                      border: 1,
                      borderColor: 'divider',
                      '&:focus-within': {
                        borderColor: 'primary.main',
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: -2,
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Box
                      component="div"
                      contentEditable
                      suppressContentEditableWarning={true}
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                      sx={{
                        outline: 'none',
                        lineHeight: 1.6,
                        fontSize: 16,
                        color: 'text.primary',
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          color: 'text.primary',
                        },
                        '& blockquote': {
                          borderLeft: '4px solid',
                          borderColor: 'divider',
                          pl: 2,
                          fontStyle: 'italic',
                          color: 'text.secondary',
                        },
                      }}
                    />

                    {/* Collaborative Cursors */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 80,
                        left: 160,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 2,
                          height: 20,
                          backgroundColor: 'primary.main',
                          animation: 'blink 1s infinite',
                          '@keyframes blink': {
                            '0%, 50%': { opacity: 1 },
                            '51%, 100%': { opacity: 0 },
                          },
                        }}
                      />
                      <Chip
                        label="Alice"
                        size="small"
                        sx={{
                          ml: 0.5,
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '10px',
                          height: 18,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        position: 'absolute',
                        top: 128,
                        left: 240,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 2,
                          height: 20,
                          backgroundColor: 'success.main',
                          animation: 'blink 1s infinite',
                        }}
                      />
                      <Chip
                        label="Bob"
                        size="small"
                        sx={{
                          ml: 0.5,
                          backgroundColor: 'success.main',
                          color: 'success.contrastText',
                          fontSize: '10px',
                          height: 18,
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar - Shared Documents */}
          <Paper
            elevation={0}
            sx={{
              width: 320,
              borderLeft: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Shared Documents
              </Typography>
              <List disablePadding>
                {sharedDocuments.map((doc) => (
                  <ListItem
                    key={doc.id}
                    sx={{
                      p: 0,
                      mb: 1,
                      cursor: 'pointer',
                      borderRadius: 1,
                    }}
                    onClick={() => setActiveDocument(doc.title)}
                  >
                    <Card
                      variant={doc.isActive ? "elevation" : "outlined"}
                      sx={{
                        width: '100%',
                        backgroundColor: doc.isActive ? 'primary.light' : 'background.paper',
                        borderColor: doc.isActive ? 'primary.main' : 'divider',
                        '&:hover': {
                          backgroundColor: doc.isActive ? 'primary.light' : 'action.hover',
                        },
                        transition: 'all 0.2s',
                      }}
                      elevation={doc.isActive ? 2 : 0}
                    >
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: doc.isActive ? 'primary.contrastText' : 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {doc.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: doc.isActive ? 'primary.contrastText' : 'text.secondary',
                                mt: 0.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {doc.preview}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: doc.isActive ? 'primary.contrastText' : 'text.disabled',
                                mt: 1,
                                display: 'block',
                              }}
                            >
                              {doc.lastEdited}
                            </Typography>
                          </Box>
                          <IconButton size="small" sx={{ ml: 1 }}>
                            <MoreHoriz sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default CollaborativeEditor