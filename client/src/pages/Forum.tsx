import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Pin,
  Heart,
  MessageCircle,
  MoreVertical,
  Reply,
} from "lucide-react";

// --- Local UI Components ---

const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={
      "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

const Card = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={
      "rounded-xl border border-gray-300 bg-white text-black shadow " +
      className
    }
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={"p-6 pt-0 " + className} {...props}>
    {children}
  </div>
);

const Textarea = ({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={
      "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 " +
      className
    }
    {...props}
  />
);

// --- Mock Data ---

const mockMessages = [
  {
    id: 1,
    content:
      "Welcome to the Machine Learning Fundamentals forum! 🎉 This is where we'll discuss concepts, share resources, and help each other learn. Feel free to ask questions and share your insights!",
    author: {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      role: "admin",
    },
    timestamp: "2024-01-15T10:00:00Z",
    isPinned: true,
    likes: 15,
    replies: [],
    isLiked: false,
  },
  {
    id: 2,
    content:
      "I'm having trouble understanding the concept of gradient descent. Can someone explain it in simple terms? I've read the textbook but it's still not clicking for me.",
    author: {
      id: 3,
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=MR",
      role: "member",
    },
    timestamp: "2024-01-20T14:30:00Z",
    isPinned: false,
    likes: 8,
    replies: [
      {
        id: 21,
        content:
          "Think of gradient descent like walking down a hill in the fog. You can't see the bottom, but you can feel the slope under your feet. You take steps in the direction that goes downhill the steepest until you reach the bottom. In ML, the 'hill' is your error function, and you're trying to find the minimum error.",
        author: {
          id: 2,
          name: "Alex Chen",
          avatar: "/placeholder.svg?height=32&width=32&text=AC",
          role: "member",
        },
        timestamp: "2024-01-20T15:15:00Z",
        likes: 12,
        isLiked: true,
      },
    ],
    isLiked: true,
  },
];

const mockGroup = {
  id: 1,
  name: "Machine Learning Fundamentals",
};

// --- Main Component ---

export default function GroupForumPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [shownReplies, setShownReplies] = useState<number[]>([]);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      content: newMessage,
      author: {
        id: 999,
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40&text=Y",
        role: "member" as const,
      },
      timestamp: new Date().toISOString(),
      isPinned: false,
      likes: 0,
      replies: [],
      isLiked: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleSendReply = (messageId: number) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now(),
      content: replyContent,
      author: {
        id: 999,
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32&text=Y",
        role: "member" as const,
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, replies: [...msg.replies, reply] }
          : msg
      )
    );
    setReplyContent("");
    setReplyingTo(null);
  };

  const toggleLike = (messageId: number, isReply = false, replyId?: number) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          if (isReply && replyId) {
            return {
              ...msg,
              replies: msg.replies.map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      isLiked: !reply.isLiked,
                    }
                  : reply
              ),
            };
          } else {
            return {
              ...msg,
              likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
              isLiked: !msg.isLiked,
            };
          }
        }
        return msg;
      })
    );
  };

  const toggleReplies = (messageId: number) => {
    setShownReplies((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex  flex-col items-center text-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl text-blue-600 font-bold ">{mockGroup.name} Forum</h1>
          <p className="text-gray-500">
            Discuss topics and share knowledge with group members
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={message.isPinned ? "border-blue-800 bg-yellow-50" : ""}
          >
            <CardContent>
              {/* Message Header */}
              <div className="flex items-start justify-between mb-2 mt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={message.author.avatar || "/placeholder.svg"}
                    alt={message.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 ">
                        {message.author.name}
                      </span>
                      <span
                        className={`text-xs font-medium ${getRoleColor(
                          message.author.role
                        )} border rounded px-1`}
                      >
                        {message.author.role}
                      </span>
                      {message.isPinned && (
                        <Pin className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <p className="mb-4 whitespace-pre-wrap text-gray-900">
                {message.content}
              </p>

              {/* Message Actions */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => toggleLike(message.id)}
                  className={`inline-flex items-center gap-1 text-sm ${
                    message.isLiked ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      message.isLiked ? "fill-current" : ""
                    }`}
                  />
                  {message.likes}
                </button>
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === message.id ? null : message.id)
                  }
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </button>
                <button
                  onClick={() => toggleReplies(message.id)}
                  className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  {message.replies.length} replies
                </button>
              </div>

              {/* Replies */}
              {shownReplies.includes(message.id) &&
                message.replies.length > 0 && (
                  <div className="ml-6 space-y-3 border-l border-gray-200 pl-4">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={reply.author.avatar || "/placeholder.svg"}
                            alt={reply.author.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="font-medium text-sm">
                            {reply.author.name}
                          </span>
                          <span
                            className={`text-xs font-medium ${getRoleColor(
                              reply.author.role
                            )} border rounded px-1`}
                          >
                            {reply.author.role}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">
                          {reply.content}
                        </p>
                        <button
                          onClick={() => toggleLike(message.id, true, reply.id)}
                          className={`inline-flex items-center gap-1 text-xs ${
                            reply.isLiked ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          <Heart
                            className={`h-3 w-3 ${
                              reply.isLiked ? "fill-current" : ""
                            }`}
                          />
                          {reply.likes}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              {/* Reply Input */}
              {replyingTo === message.id && (
                <div className="mt-4 ml-6">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleSendReply(message.id)}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        className="bg-transparent text-gray-600 hover:bg-gray-100"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* New Message Input */}
      <Card className="sticky bottom-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 flex gap-2 mt-5">
              <Textarea
                placeholder="Share your thoughts with the group..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[40px] resize-none flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="h-fit self-end"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
