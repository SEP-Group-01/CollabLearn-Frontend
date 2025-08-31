import type { MessageType } from "../types/ForumInterfaces"

export const mockMessages: MessageType[] = [
  {
    id: 1,
    content: "Welcome to the forum! Feel free to ask questions.",
    author: {
      id: 2,
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=AJ",
      role: "member",
    },
    timestamp: "2025-08-08T09:00:00Z",
    isPinned: false,
    likes: 2,
    replies: [],
    isLiked: false,
  },
  {
    id: 2,
    content: "Hi Alice! Can you explain how to join a study group?",
    author: {
      id: 999,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40&text=Y",
      role: "member",
    },
    timestamp: "2025-08-08T09:05:00Z",
    isPinned: false,
    likes: 1,
    replies: [],
    isLiked: false,
  },
];

export const mockGroup = {
  id: 1,
  name: "Machine Learning Fundamentals",
};