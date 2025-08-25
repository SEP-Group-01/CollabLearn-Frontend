import { useMemo, useState } from "react"
import SidebarComponent from "../components/SideBar"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Grid,
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

type Document = {
  id: number
  title: string
  type: "pdf" | "doc" | "txt"
  uploadedBy: string
  size: string
  uploadedAt: string
  isCurrentlyEditing?: boolean
  editedBy?: string
  lastEditTime?: string
}

type Link = {
  id: number
  title: string
  url: string
  addedBy: string
  addedAt: string
  description: string
}

type Video = {
  id: number
  title: string
  duration: string
  addedBy: string
  addedAt: string
  thumbnail: string
  views?: number
}

type QuizType = {
  id: number
  title: string
  description: string
  questions: number
  timeLimit: number
  attempts: number
  bestScore: number | null
  status: "not_started" | "in_progress" | "completed"
  difficulty: "Easy" | "Medium" | "Hard"
  createdBy: string
  createdAt: string
}

type ModuleData = {
  id: number
  title: string
  description: string
  groupId: number
  groupTitle: string
  enrolled: boolean
  performance: {
    progress: number
    lastScore: number | null
    completedQuizzes: number
    totalQuizzes: number
    studyTime: number
    averageScore: number
    rank: number
    totalStudents: number
    completionRate: number
  }
  resources: {
    documents: Document[]
    links: Link[]
    videos: Video[]
  }
  quizzes: QuizType[]
  currentlyEditing: Document[]
}

export default function ModulePage() {
  const { groupId, moduleId } = useParams<{ groupId: string; moduleId: string }>()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
   const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Mock module data
  const moduleData: ModuleData = useMemo(
    () => ({
      id: Number(moduleId),
      title:
        moduleId === "1"
          ? "Linear Algebra Basics"
          : moduleId === "2"
            ? "Neural Networks"
            : "Optimization and Gradient Descent",
      description:
        moduleId === "1"
          ? "Foundation concepts in linear algebra for machine learning including vectors, matrices, eigenvalues, and eigenvectors. This module covers essential mathematical concepts that form the backbone of most ML algorithms."
          : moduleId === "2"
            ? "From perceptrons to deep networks: understanding activation functions, loss functions, and backpropagation. Learn how neural networks learn and make predictions through hands-on examples."
            : "Mathematical intuition and practical implementation of optimization algorithms including gradient descent, momentum, Adam optimizer, and learning rate schedules.",
      groupId: Number(groupId),
      groupTitle: "Machine Learning Fundamentals",
      enrolled: true,
      performance: {
        progress: moduleId === "1" ? 75 : moduleId === "2" ? 45 : 0,
        lastScore: moduleId === "1" ? 88 : moduleId === "2" ? 76 : null,
        completedQuizzes: moduleId === "1" ? 3 : moduleId === "2" ? 2 : 0,
        totalQuizzes: moduleId === "1" ? 4 : moduleId === "2" ? 5 : 3,
        studyTime: moduleId === "1" ? 12.5 : moduleId === "2" ? 8.2 : 0,
        averageScore: moduleId === "1" ? 85 : moduleId === "2" ? 78 : 0,
        rank: moduleId === "1" ? 12 : moduleId === "2" ? 18 : 0,
        totalStudents: 45,
        completionRate: moduleId === "1" ? 68 : moduleId === "2" ? 42 : 0,
      },
      resources: {
        documents:
          moduleId === "1"
            ? [
                {
                  id: 1,
                  title: "Linear Algebra Cheat Sheet",
                  type: "pdf",
                  uploadedBy: "Dr. Johnson",
                  size: "2.4 MB",
                  uploadedAt: "2024-01-15",
                },
                {
                  id: 2,
                  title: "Matrix Operations Guide",
                  type: "doc",
                  uploadedBy: "Alex Chen",
                  size: "1.8 MB",
                  uploadedAt: "2024-01-18",
                  isCurrentlyEditing: true,
                  editedBy: "Maria Rodriguez",
                  lastEditTime: "2 minutes ago",
                },
                {
                  id: 3,
                  title: "Practice Problems",
                  type: "txt",
                  uploadedBy: "Maria R.",
                  size: "156 KB",
                  uploadedAt: "2024-01-20",
                },
                {
                  id: 4,
                  title: "Eigenvalues Tutorial",
                  type: "pdf",
                  uploadedBy: "Dr. Johnson",
                  size: "3.1 MB",
                  uploadedAt: "2024-01-22",
                },
              ]
            : moduleId === "2"
              ? [
                  {
                    id: 5,
                    title: "Neural Network Fundamentals",
                    type: "pdf",
                    uploadedBy: "Dr. Johnson",
                    size: "3.2 MB",
                    uploadedAt: "2024-01-22",
                  },
                  {
                    id: 6,
                    title: "Backpropagation Algorithm",
                    type: "txt",
                    uploadedBy: "Alex Chen",
                    size: "89 KB",
                    uploadedAt: "2024-01-24",
                    isCurrentlyEditing: true,
                    editedBy: "John Smith",
                    lastEditTime: "5 minutes ago",
                  },
                  {
                    id: 7,
                    title: "Activation Functions Guide",
                    type: "doc",
                    uploadedBy: "Maria R.",
                    size: "1.2 MB",
                    uploadedAt: "2024-01-25",
                  },
                ]
              : [
                  {
                    id: 8,
                    title: "Optimization Algorithms",
                    type: "pdf",
                    uploadedBy: "Dr. Johnson",
                    size: "1.9 MB",
                    uploadedAt: "2024-01-27",
                  },
                ],
        links:
          moduleId === "1"
            ? [
                {
                  id: 1,
                  title: "Khan Academy - Linear Algebra",
                  url: "https://khanacademy.org",
                  addedBy: "Maria R.",
                  addedAt: "2024-01-16",
                  description: "Comprehensive linear algebra course with interactive exercises",
                },
                {
                  id: 2,
                  title: "3Blue1Brown - Essence of Linear Algebra",
                  url: "https://youtube.com",
                  addedBy: "Dr. Johnson",
                  addedAt: "2024-01-17",
                  description: "Visual introduction to linear algebra concepts",
                },
                {
                  id: 3,
                  title: "MIT Linear Algebra Course",
                  url: "https://ocw.mit.edu",
                  addedBy: "Alex Chen",
                  addedAt: "2024-01-18",
                  description: "Complete MIT course on linear algebra",
                },
              ]
            : moduleId === "2"
              ? [
                  {
                    id: 4,
                    title: "Neural Networks and Deep Learning",
                    url: "https://neuralnetworksanddeeplearning.com",
                    addedBy: "Dr. Johnson",
                    addedAt: "2024-01-23",
                    description: "Free online book about neural networks and deep learning",
                  },
                  {
                    id: 5,
                    title: "TensorFlow Neural Network Tutorial",
                    url: "https://tensorflow.org",
                    addedBy: "Alex Chen",
                    addedAt: "2024-01-24",
                    description: "Hands-on tutorial for building neural networks",
                  },
                ]
              : [
                  {
                    id: 6,
                    title: "Gradient Descent Visualization",
                    url: "https://example.com",
                    addedBy: "Alex Chen",
                    addedAt: "2024-01-28",
                    description: "Interactive visualization of gradient descent algorithm",
                  },
                ],
        videos:
          moduleId === "1"
            ? [
                {
                  id: 1,
                  title: "Matrix Multiplication Explained",
                  duration: "15:30",
                  addedBy: "Dr. Johnson",
                  addedAt: "2024-01-19",
                  thumbnail: "/placeholder.svg?height=120&width=200&text=Video",
                  views: 234,
                },
                {
                  id: 2,
                  title: "Eigenvalues and Eigenvectors",
                  duration: "22:45",
                  addedBy: "Alex Chen",
                  addedAt: "2024-01-21",
                  thumbnail: "/placeholder.svg?height=120&width=200&text=Video",
                  views: 189,
                },
                {
                  id: 3,
                  title: "Vector Spaces Introduction",
                  duration: "18:20",
                  addedBy: "Maria R.",
                  addedAt: "2024-01-23",
                  thumbnail: "/placeholder.svg?height=120&width=200&text=Video",
                  views: 156,
                },
              ]
            : moduleId === "2"
              ? [
                  {
                    id: 4,
                    title: "How Neural Networks Work",
                    duration: "18:20",
                    addedBy: "Dr. Johnson",
                    addedAt: "2024-01-25",
                    thumbnail: "/placeholder.svg?height=120&width=200&text=Video",
                    views: 312,
                  },
                  {
                    id: 5,
                    title: "Backpropagation Step by Step",
                    duration: "25:15",
                    addedBy: "Maria R.",
                    addedAt: "2024-01-26",
                    thumbnail: "/placeholder.svg?height=120&width=200&text=Video",
                    views: 278,
                  },
                ]
              : [
                  {
                    id: 6,
                    title: "Gradient Descent Intuition",
                    duration: "12:30",
                    addedBy: "Dr. Johnson",
                    addedAt: "2024-01-29",
                    thumbnail: "/placeholder.svg?height=120&width=200&text=Video",
                    views: 145,
                  },
                ],
      },
      quizzes:
        moduleId === "1"
          ? [
              {
                id: 1,
                title: "Vector Operations",
                description:
                  "Test your understanding of basic vector operations including addition, scalar multiplication, and dot products.",
                questions: 10,
                timeLimit: 20,
                attempts: 2,
                bestScore: 90,
                status: "completed",
                difficulty: "Easy",
                createdBy: "Dr. Johnson",
                createdAt: "2024-01-10",
              },
              {
                id: 2,
                title: "Matrix Basics",
                description: "Comprehensive quiz covering matrix operations, determinants, and basic properties.",
                questions: 15,
                timeLimit: 30,
                attempts: 1,
                bestScore: 85,
                status: "completed",
                difficulty: "Medium",
                createdBy: "Dr. Johnson",
                createdAt: "2024-01-12",
              },
              {
                id: 3,
                title: "Eigenvalues Quiz",
                description: "Advanced concepts in eigenvalues and eigenvectors with practical applications.",
                questions: 8,
                timeLimit: 25,
                attempts: 1,
                bestScore: 88,
                status: "completed",
                difficulty: "Hard",
                createdBy: "Alex Chen",
                createdAt: "2024-01-15",
              },
              {
                id: 4,
                title: "Final Assessment",
                description: "Comprehensive assessment covering all linear algebra topics in this module.",
                questions: 20,
                timeLimit: 45,
                attempts: 0,
                bestScore: null,
                status: "not_started",
                difficulty: "Hard",
                createdBy: "Dr. Johnson",
                createdAt: "2024-01-18",
              },
            ]
          : moduleId === "2"
            ? [
                {
                  id: 5,
                  title: "Perceptron Basics",
                  description: "Understanding the fundamental building block of neural networks.",
                  questions: 12,
                  timeLimit: 25,
                  attempts: 1,
                  bestScore: 82,
                  status: "completed",
                  difficulty: "Easy",
                  createdBy: "Dr. Johnson",
                  createdAt: "2024-01-20",
                },
                {
                  id: 6,
                  title: "Activation Functions",
                  description: "Quiz on different activation functions and their properties.",
                  questions: 8,
                  timeLimit: 15,
                  attempts: 1,
                  bestScore: 76,
                  status: "completed",
                  difficulty: "Medium",
                  createdBy: "Maria R.",
                  createdAt: "2024-01-22",
                },
                {
                  id: 7,
                  title: "Backpropagation",
                  description: "Deep dive into the backpropagation algorithm and gradient computation.",
                  questions: 15,
                  timeLimit: 35,
                  attempts: 0,
                  bestScore: null,
                  status: "not_started",
                  difficulty: "Hard",
                  createdBy: "Dr. Johnson",
                  createdAt: "2024-01-24",
                },
                {
                  id: 8,
                  title: "Loss Functions",
                  description: "Understanding different loss functions and when to use them.",
                  questions: 10,
                  timeLimit: 20,
                  attempts: 0,
                  bestScore: null,
                  status: "not_started",
                  difficulty: "Medium",
                  createdBy: "Alex Chen",
                  createdAt: "2024-01-26",
                },
                {
                  id: 9,
                  title: "Neural Network Design",
                  description: "Practical quiz on designing neural network architectures.",
                  questions: 18,
                  timeLimit: 40,
                  attempts: 0,
                  bestScore: null,
                  status: "not_started",
                  difficulty: "Hard",
                  createdBy: "Dr. Johnson",
                  createdAt: "2024-01-28",
                },
              ]
            : [
                {
                  id: 10,
                  title: "Gradient Descent Basics",
                  description: "Fundamental concepts of gradient descent optimization.",
                  questions: 10,
                  timeLimit: 20,
                  attempts: 0,
                  bestScore: null,
                  status: "not_started",
                  difficulty: "Easy",
                  createdBy: "Dr. Johnson",
                  createdAt: "2024-01-25",
                },
                {
                  id: 11,
                  title: "Optimization Algorithms",
                  description: "Comparison of different optimization algorithms like Adam, RMSprop, etc.",
                  questions: 12,
                  timeLimit: 25,
                  attempts: 0,
                  bestScore: null,
                  status: "not_started",
                  difficulty: "Medium",
                  createdBy: "Alex Chen",
                  createdAt: "2024-01-27",
                },
                {
                  id: 12,
                  title: "Learning Rate Schedules",
                  description: "Understanding learning rate scheduling and its impact on training.",
                  questions: 8,
                  timeLimit: 15,
                  attempts: 0,
                  bestScore: null,
                  status: "not_started",
                  difficulty: "Medium",
                  createdBy: "Maria R.",
                  createdAt: "2024-01-29",
                },
              ],
      currentlyEditing:
        moduleId === "1"
          ? [
              {
                id: 2,
                title: "Matrix Operations Guide",
                type: "doc",
                uploadedBy: "Alex Chen",
                size: "1.8 MB",
                uploadedAt: "2024-01-18",
                isCurrentlyEditing: true,
                editedBy: "Maria Rodriguez",
                lastEditTime: "2 minutes ago",
              },
            ]
          : moduleId === "2"
            ? [
                {
                  id: 6,
                  title: "Backpropagation Algorithm",
                  type: "txt",
                  uploadedBy: "Alex Chen",
                  size: "89 KB",
                  uploadedAt: "2024-01-24",
                  isCurrentlyEditing: true,
                  editedBy: "John Smith",
                  lastEditTime: "5 minutes ago",
                },
              ]
            : [
               {
            id: 8,
            title: "Optimization Algorithms",
            type: "pdf",
            uploadedBy: "Dr. Johnson",
            size: "1.9 MB",
            uploadedAt: "2024-01-27",
            isCurrentlyEditing: true,
            editedBy: "Alex Chen",
            lastEditTime: "10 minutes ago",
          },
          {
            id: 9,
            title: "Gradient Descent Notes",
            type: "doc",
            uploadedBy: "Maria R.",
            size: "1.2 MB",
            uploadedAt: "2024-01-28",
            isCurrentlyEditing: true,
            editedBy: "Dr. Johnson",
            lastEditTime: "15 minutes ago",
          },
            ],
    }),
    [moduleId, groupId],
  )

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
    navigate(`/dashboard/groups/${groupId}/modules/${moduleId}/documents/${documentId}`)
  }

  const navigateToDocuments = () => {
    navigate(`/doc`)
  }

  const navigateToLinks = () => {
    navigate(`/dashboard/groups/${groupId}/modules/${moduleId}/links`)
  }

  const navigateToVideos = () => {
    navigate(`/dashboard/groups/${groupId}/modules/${moduleId}/videos`)
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

      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(`/dashboard/groups/${groupId}`)} sx={{ bgcolor: "action.hover" }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {moduleData.title}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {moduleData.description}
          </Typography>
        </Box>
      </Box>
    

      {/* Performance Analytics */}
      {moduleData.enrolled && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                📊 Your Performance Analytics
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="primary.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {moduleData.performance.lastScore || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Score
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {moduleData.performance.averageScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Score
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                            {moduleData.performance.completedQuizzes}/{moduleData.performance.totalQuizzes}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quizzes Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {moduleData.performance.studyTime}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Study Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Resorce added
                      </Typography>
                    </Box>
                  </Grid>
                   <Grid item xs={6}>
                    <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Documents to Edit
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

<Box mb={6}>
  <Typography 
    variant="h5" 
    fontWeight="bold" 
    gutterBottom
    sx={{
      color: "text.primary",
      mb: 4,
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
  
  <Grid container spacing={4} alignItems="stretch">
    {[
      {
        title: "Documents",
        icon: <Description fontSize="large" />,
        count: moduleData.resources.documents.length,
        onClick: navigateToDocuments,
        color: "primary",
        description: "PDFs, Word docs, and text files"
      },
      {
        title: "External Links",
        icon: <LinkIcon fontSize="large" />,
        count: moduleData.resources.links.length,
        onClick: navigateToLinks,
        color: "secondary",
        description: "Courses, tutorials, and references"
      },
      {
        title: "Video Content",
        icon: <PlayCircle fontSize="large" />,
        count: moduleData.resources.videos.length,
        onClick: navigateToVideos,
        color: "info",
        description: "Lectures and demonstrations"
      },
    ].map((card, index) => (
      <Grid item xs={12} md={4} display="flex" key={index}>
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
      </Grid>
    ))}
  </Grid>
</Box>


      {/* Quizzes Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <EditIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Quizzes ({moduleData.quizzes.length})
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
          <Grid container spacing={2}>
            {moduleData.quizzes.map((quiz) => (
              <Grid item xs={12} md={6} key={quiz.id}>
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
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

            {/* Currently Editing Documents - Always visible but with different styling when empty */}
<Card sx={{ 
  mb: 3, 
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
        <EditIcon color={moduleData.currentlyEditing.length > 0 ? "primary" : "disabled"} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {moduleData.currentlyEditing.length > 0 ? "Currently Being Edited" : "No Documents Being Edited"}
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
    {moduleData.currentlyEditing.length > 0 ? (
      <Stack spacing={2} sx={{ p: 2 }}>
        {moduleData.currentlyEditing.map((doc) => (
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