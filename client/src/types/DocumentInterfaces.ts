export interface Document {
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
  mockComments?: string[]; // Added for mock comments
}