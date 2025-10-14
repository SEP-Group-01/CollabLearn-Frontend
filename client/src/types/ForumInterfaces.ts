export type Role = "admin" | "member";

export interface Author {
  id: number | string;
  name: string;
  avatar: string;
  role: Role;
}

export interface ReplyType {
  id: number | string;
  content: string;
  author: Author;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface MessageType {
  id: number | string;
  content: string;
  author: Author;
  timestamp: string;
  isPinned: boolean;
  likes: number;
  replies: ReplyType[];
  isLiked: boolean;
  image?: string;
}