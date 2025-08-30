import type { Document } from "../types/DocumentInterfaces"

export type Document = {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "doc" | "txt";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  downloads: number;
  rating: number;
  totalRatings: number;
  comments: number;
  tags: string[];
  isEditing: boolean;
  editor?: string;
  editingSince?: string;
  likes: number;
  mockComments?: string[]; // Add this field for mock comments
};

export const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Linear Algebra Fundamentals",
    description:
      "Comprehensive guide covering vectors, matrices, eigenvalues, and linear transformations with practical examples and exercises.",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Dr. Johnson",
    uploadedAt: "2024-01-15",
    views: 156,
    downloads: 89,
    rating: 4.5,
    totalRatings: 23,
    comments: 12,
    tags: ["fundamentals", "vectors", "matrices", "eigenvalues"],
    isEditing: true,
    editor: "Alex Chen",
    editingSince: "2 minutes ago",
    likes: 34,
    mockComments: [
      "Great summary of the basics!",
      "Very helpful for my exam prep.",
      "Could use more examples on eigenvalues.",
    ],
  },
  {
    id: 2,
    title: "Matrix Operations Step-by-Step",
    description:
      "Detailed walkthrough of matrix operations including addition, multiplication, inverse, and determinant calculations with solved examples.",
    type: "doc",
    size: "1.8 MB",
    uploadedBy: "Alex Chen",
    uploadedAt: "2024-01-18",
    views: 98,
    downloads: 45,
    rating: 4.2,
    totalRatings: 18,
    comments: 8,
    tags: ["operations", "multiplication", "inverse", "examples"],
    isEditing: true,
    editor: "Maria Rodriguez",
    editingSince: "15 minutes ago",
    likes: 28,
    mockComments: [
      "Step-by-step explanations are clear.",
      "Loved the solved examples.",
      "Can you add more on determinants?",
    ],
  },
  {
    id: 3,
    title: "Practice Problems Collection",
    description:
      "Curated collection of linear algebra practice problems with detailed solutions and explanations for self-study.",
    type: "txt",
    size: "156 KB",
    uploadedBy: "Maria Rodriguez",
    uploadedAt: "2024-01-20",
    views: 67,
    downloads: 34,
    rating: 4.0,
    totalRatings: 15,
    comments: 5,
    tags: ["practice", "problems", "solutions", "self-study"],
    isEditing: false,
    likes: 19,
    mockComments: [
      "Perfect for self-study.",
      "Solutions are well explained.",
      "Would like more advanced problems.",
    ],
  },
  {
    id: 4,
    title: "Eigenvalues and Eigenvectors Tutorial",
    description:
      "In-depth tutorial explaining eigenvalues and eigenvectors with geometric interpretations and real-world applications.",
    type: "pdf",
    size: "3.2 MB",
    uploadedBy: "Dr. Johnson",
    uploadedAt: "2024-01-22",
    views: 134,
    downloads: 78,
    rating: 4.7,
    totalRatings: 31,
    comments: 16,
    tags: ["eigenvalues", "eigenvectors", "tutorial", "applications"],
    isEditing: false,
    likes: 42,
     mockComments: [
    "Great summary of the basics!",
    "Very helpful for my exam prep.",
    "Could use more examples on eigenvalues."
  ]
  },
  {
    id: 5,
    title: "Vector Spaces and Linear Independence",
    description:
      "Comprehensive notes on vector spaces, subspaces, linear independence, and basis with proofs and examples.",
    type: "doc",
    size: "2.1 MB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "2024-01-25",
    views: 89,
    downloads: 56,
    rating: 4.3,
    totalRatings: 20,
    comments: 9,
    tags: ["vector-spaces", "independence", "basis", "proofs"],
    isEditing: false,
    likes: 25,
  },
  {
    id: 6,
    title: "Linear Transformations Visualized",
    description:
      "Visual guide to understanding linear transformations with interactive examples and geometric interpretations.",
    type: "pdf",
    size: "4.1 MB",
    uploadedBy: "Mike Chen",
    uploadedAt: "2024-01-28",
    views: 112,
    downloads: 67,
    rating: 4.6,
    totalRatings: 25,
    comments: 14,
    tags: ["transformations", "visual", "geometry", "interactive"],
    isEditing: false,
    likes: 38,
  },
]