export type Role = "admin" | "member";

export interface Author {
  id: number;
  name: string;
  avatar: string;
  role: Role;
}

export interface ReplyType {
  id: number;
  content: string;
  author: Author;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface MessageType {
  id: number;
  content: string;
  author: Author;
  timestamp: string;
  isPinned: boolean;
  likes: number;
  replies: ReplyType[];
  isLiked: boolean;
  image?: string;
}