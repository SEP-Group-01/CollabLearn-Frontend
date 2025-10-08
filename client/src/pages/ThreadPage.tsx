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
  useMediaQuery
} from "@mui/material"
import {
  ArrowBack,
  PictureAsPdf,
  Description,
  TextSnippet,
  PlayCircle,
  Link as LinkIcon,
  Edit as EditIcon,
  Visibility,
  ArrowForward,
} from "@mui/icons-material"

import { getThread, getThreadResources } from '../api/threadsApi'
import type { ThreadData, Document, Link, Video } from "../types/ThreadInterfaces"

export default function ThreadPage() {
  const { workspaceId, threadId } = useParams<{ workspaceId: string; threadId: string }>()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [threadData, setThreadData] = useState<ThreadData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchThread = async () => {
      if (!threadId) return
      setLoading(true)
      setError(null)
      try {
        const [threadRes, resourcesRes] = await Promise.all([
          getThread(threadId),
          getThreadResources(threadId),
        ])

        if (!mounted) return

        // Map backend shape to frontend ThreadData type
        type BackendResource = {
          id?: string
          user_id?: string
          title?: string
          description?: string
          firebase_url?: string
          firebase_path?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          created_at?: string
        }

        const documents: Document[] = (resourcesRes?.documents || []).map((d: BackendResource, i: number) => ({
          id: i,
          title: d.title || d.file_name || 'Document',
          type: (d.mime_type || '').includes('pdf') ? 'pdf' : (d.mime_type || '').includes('word') ? 'doc' : 'txt',
          uploadedBy: (d.user_id as string) || 'Unknown',
          size: d.file_size ? `${Math.round(d.file_size / 1024)} KB` : '—',
          uploadedAt: d.created_at || '',
        }))

        const links: Link[] = (resourcesRes?.links || []).map((l: BackendResource, i: number) => ({
          id: i,
          title: l.title || l.firebase_url || 'Link',
          url: l.firebase_url || '',
          addedBy: (l.user_id as string) || 'Unknown',
          addedAt: l.created_at || '',
          description: l.description || '',
        }))

        const videos: Video[] = (resourcesRes?.videos || []).map((v: BackendResource & { duration?: string; thumbnail?: string }, i: number) => ({
          id: i,
          title: v.title || v.file_name || 'Video',
          duration: v.duration || '0:00',
          addedBy: (v.user_id as string) || 'Unknown',
          addedAt: v.created_at || '',
          thumbnail: v.thumbnail || '',
          url: v.firebase_url || '',
          description: v.description || '',
        }))

        // For now quizzes come from threadRes.quizzes if present else empty
        type BackendQuiz = {
          id: string
          title?: string
          description?: string
          questions?: unknown[]
          time_allocated?: number
          attempts_count?: number
          best_score?: number
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          creator_id?: string
          created_at?: string
        }

        const quizzes = (threadRes?.quizzes || []).map((q: BackendQuiz) => ({
          id: q.id,
          title: q.title || 'Quiz',
          description: q.description || '',
          questions: q.questions?.length || 0,
          timeLimit: q.time_allocated || 0,
          attempts: q.attempts_count || 0,
          bestScore: q.best_score ?? null,
          status: 'not_started',
          difficulty: q.difficulty || 'Easy',
          createdBy: q.creator_id || '',
          createdAt: q.created_at || '',
        }))

        const mapped: ThreadData = {
          id: threadRes?.id || 0,
          title: threadRes?.name || threadRes?.title || 'Thread',
          description: threadRes?.description || '',
          workspaceId: threadRes?.workspace_id || 0,
          workspaceTitle: threadRes?.workspace_name || '',
          enrolled: true,
          performance: {
            // Hardcoded / placeholder values as requested
            progress: 0,
            lastScore: 0,
            completedQuizzes: quizzes.length,
            totalQuizzes: quizzes.length || 0,
            studyTime: 0,
            averageScore: 0,
            rank: 0,
            totalStudents: 0,
            completionRate: 0,
          },
          resources: { documents, links, videos },
          quizzes,
          currentlyEditing: [], // hardcoded empty per instructions
        }

        setThreadData(mapped)
      } catch (err: unknown) {
        console.error('Failed to fetch thread or resources', err)
        const message = err instanceof Error ? err.message : String(err)
        setError(message || 'Failed to load thread')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchThread()
    return () => { mounted = false }
  }, [threadId])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <PictureAsPdf color="error" />
      case "doc":
        return <Description color="info" />
      case "txt":
        return <TextSnippet color="success" />
      default:
        return <Description />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
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


  const openDocument = (documentId: number) => {
    navigate(`/workspace/${workspaceId}/threads/${threadId}/documents/${documentId}`)
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
    

      {/* Performance Analytics */}
  {threadData && threadData.enrolled && (
        <Card>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                📊 Your Performance Analytics
              </Typography>
            }
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              {/* Performance Stats - Single Row */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
              >
                {/* Last Score */}
                <Box
                  sx={{
                    minWidth: 140,
                    minHeight: '100px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" p={2} bgcolor="primary.50" borderRadius={2}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {threadData.performance.lastScore || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Score
                    </Typography>
                  </Box>
                </Box>
                {/* Average Score */}
                <Box
                  sx={{
                    minWidth: 140,
                    minHeight: '100px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {threadData.performance.averageScore}%
                      </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                  </Box>
                </Box>
                {/* Quizzes Completed */}
                <Box
                  sx={{
                    minWidth: 140,
                    minHeight: '100px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {threadData.performance.completedQuizzes}/{threadData.performance.totalQuizzes}
                      </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quizzes Completed
                    </Typography>
                  </Box>
                </Box>
                {/* Study Time */}
                <Box
                  sx={{
                    minWidth: 140,
                    minHeight: '100px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {threadData.performance.studyTime}h
                      </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Study Time
                    </Typography>
                  </Box>
                </Box>
                {/* Resource Added */}
                <Box
                  sx={{
                    minWidth: 140,
                    minHeight: '100px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resource added
                    </Typography>
                  </Box>
                </Box>
                {/* Documents to Edit */}
                <Box
                  sx={{
                    minWidth: 140,
                    minHeight: '100px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Documents to Edit
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

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
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <EditIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                Quizzes ({threadData?.quizzes.length ?? 0})
              </Typography>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/quizzes')}
                sx={{ 
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2
                }}
              >
                View All
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            {threadData?.quizzes.map((quiz) => (
              <Box
                key={quiz.id}
                sx={{
                  width: '100%',
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {quiz.title}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip size="small" label={quiz.difficulty} color={getDifficultyColor(quiz.difficulty) as any} />
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" gap={2}>
                        <Typography variant="caption" color="text.secondary">
                          {quiz.questions} questions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {quiz.timeLimit} min
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {quiz.attempts} attempts
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Button variant={quiz.status === "not_started" ? "contained" : "outlined"} size="small">
                        {quiz.status === "completed" ? "Review" : quiz.status === "in_progress" ? "Continue" : "Start"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
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
      <Box display="flex" alignItems="center" gap={1}>
  <EditIcon color={threadData && threadData.currentlyEditing.length > 0 ? "primary" : "disabled"} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {threadData && threadData.currentlyEditing.length > 0 ? "Currently Being Edited" : "No Documents Being Edited"}
        </Typography>
      </Box>
    }
    sx={{
      py: 1.5,
      borderBottom: "1px solid",
      borderColor: "divider"
    }}
  />
  <CardContent sx={{ p: 0 }}>
    {threadData && threadData.currentlyEditing.length > 0 ? (
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
            onClick={() => openDocument(doc.id)}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box display="flex" alignItems="center" gap={2}>
                {getFileIcon(doc.type)}
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {doc.title}
                  </Typography>
                 
                  <Typography variant="caption" color="text.secondary">
                    {doc.size} • Originally by {doc.uploadedBy} • {doc.uploadedAt}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="small" 
                  startIcon={<Visibility />}
                >
                  Join Edit
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
    </Box>
    </Box>
    
  )
}