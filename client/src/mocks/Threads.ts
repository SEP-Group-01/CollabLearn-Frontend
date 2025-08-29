
import { useMemo } from "react"
import type { ModuleData, } from "../types/ThreadInterfaces"

export const useModuleData = (moduleId: string, groupId: string): ModuleData => {
  return useMemo(
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
}