import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarComponent from "../components/SideBar";
import { AttachFile, Send, Close } from "@mui/icons-material";
import {Pin, Heart, MessageCircle, Reply } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";

import type { Role, MessageType } from "../types/ForumInterfaces";
import { 
  getForumMessages, 
  createForumMessage, 
  createReply, 
  likeMessage, 
  likeReply, 
  getGroupInfo 
} from "../api/forumApi";


export default function GroupForumPage() {
  const params = useParams<{ id: string }>();
  const groupId = params.id ?? ""; // fallback to empty string if undefined
  const isMobile = useMediaQuery("(max-width:900px)");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [shownReplies, setShownReplies] = useState<number[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(isMobile);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupInfo, setGroupInfo] = useState<{ id: number; name: string } | null>(null);
  const [sending, setSending] = useState(false);

  // Load forum data on component mount
  useEffect(() => {
    const loadForumData = async () => {
      if (!groupId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load group info and messages in parallel
        const [groupData, messagesData] = await Promise.all([
          getGroupInfo(groupId),
          getForumMessages(groupId)
        ]);
        
        setGroupInfo(groupData);
        setMessages(messagesData);
      } catch (err) {
        console.error('Error loading forum data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load forum data');
      } finally {
        setLoading(false);
      }
    };

    loadForumData();
  }, [groupId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !image) return;
    if (!groupId) return;

    try {
      setSending(true);
      const newMessageData = await createForumMessage(groupId, newMessage, image || undefined);
      setMessages([...messages, newMessageData]);
      setNewMessage("");
      setImage(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async (messageId: number) => {
    if (!replyContent.trim()) return;

    try {
      const newReply = await createReply(messageId, replyContent);
      setMessages(
        messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, replies: [...msg.replies, newReply] }
            : msg
        )
      );
      setReplyContent("");
      setReplyingTo(null);
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    }
  };

  const toggleLike = async (messageId: number, isReply = false, replyId?: number) => {
    try {
      if (isReply && replyId) {
        const likeData = await likeReply(replyId);
        setMessages(
          messages.map((msg) => 
            msg.id === messageId
              ? {
                  ...msg,
                  replies: msg.replies.map((reply) =>
                    reply.id === replyId
                      ? { ...reply, likes: likeData.likes, isLiked: likeData.isLiked }
                      : reply
                  ),
                }
              : msg
          )
        );
      } else {
        const likeData = await likeMessage(messageId);
        setMessages(
          messages.map((msg) =>
            msg.id === messageId
              ? { ...msg, likes: likeData.likes, isLiked: likeData.isLiked }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(err instanceof Error ? err.message : 'Failed to update like');
    }
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

  const getRoleColor = (role: Role) =>
    role === "admin" ? "warning" : "default";

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: collapsed ? 72 : 240 },
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {groupInfo?.name || 'Loading...'} Forum
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discuss topics and share knowledge with group members
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 2 }}>
          <Stack spacing={2}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading messages...</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="text.secondary">No messages yet. Start the conversation!</Typography>
              </Box>
            ) : (
              messages.map((message) => {
              const isOwnMessage = message.author.name === "You";
              return (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: "70%",
                      backgroundColor: message.isPinned ? "#fff9c4" : "white",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: isOwnMessage ? 16 : 4,
                      borderBottomRightRadius: isOwnMessage ? 4 : 16,
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                        sx={{
                          flexDirection: isOwnMessage ? "row-reverse" : "row",
                        }}
                      >
                        <Avatar src={message.author.avatar} />
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              justifyContent: isOwnMessage
                                ? "flex-end"
                                : "flex-start",
                            }}
                          >
                            <Typography
                              color="primary"
                              fontWeight="bold"
                              sx={{
                                textAlign: isOwnMessage ? "right" : "left",
                              }}
                            >
                              {message.author.name}
                            </Typography>
                            <Chip
                              label={message.author.role}
                              size="small"
                              color={getRoleColor(message.author.role)}
                            />
                            {message.isPinned && <Pin size={16} />}
                          </Stack>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: isOwnMessage ? "right" : "left" }}
                          >
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>
                      </Stack>
                      <Box mt={2}>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                          {message.content}
                        </Typography>
                        {message.image && (
                          <Box mt={1}>
                            <img
                              src={message.image}
                              alt="chat-img"
                              style={{ maxWidth: "100%", borderRadius: 8 }}
                            />
                          </Box>
                        )}
                      </Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        mt={2}
                        sx={{
                          justifyContent: isOwnMessage
                            ? "flex-end"
                            : "flex-start",
                        }}
                      >
                        <IconButton
                          onClick={() => toggleLike(message.id)}
                          color={message.isLiked ? "error" : "default"}
                          size="small"
                        >
                          <Heart size={16} />
                          <Typography variant="body2" ml={0.5}>
                            {message.likes}
                          </Typography>
                        </IconButton>
                        <Button
                          size="small"
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === message.id ? null : message.id
                            )
                          }
                        >
                          <Reply fontSize="small" /> Reply
                        </Button>
                        <Button
                          size="small"
                          onClick={() => toggleReplies(message.id)}
                        >
                          <MessageCircle fontSize="small" />{" "}
                          {message.replies.length} replies
                        </Button>
                      </Stack>

                      {shownReplies.includes(message.id) &&
                        message.replies.length > 0 && (
                          <Stack
                            spacing={2}
                            mt={2}
                            pl={4}
                            borderLeft={1}
                            borderColor="divider"
                          >
                            {message.replies.map((reply) => (
                              <Paper key={reply.id} sx={{ p: 2 }}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Avatar
                                    src={reply.author.avatar}
                                    sx={{ width: 24, height: 24 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {reply.author.name}
                                  </Typography>
                                  <Chip
                                    label={reply.author.role}
                                    size="small"
                                    color={getRoleColor(reply.author.role)}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatTimestamp(reply.timestamp)}
                                  </Typography>
                                </Stack>
                                <Typography variant="body2" mt={1}>
                                  {reply.content}
                                </Typography>
                                <IconButton
                                  onClick={() =>
                                    toggleLike(message.id, true, reply.id)
                                  }
                                  color={reply.isLiked ? "error" : "default"}
                                  size="small"
                                >
                                  <Heart size={14} />
                                  <Typography variant="caption" ml={0.5}>
                                    {reply.likes}
                                  </Typography>
                                </IconButton>
                              </Paper>
                            ))}
                          </Stack>
                        )}

                      {replyingTo === message.id && (
                        <Stack spacing={1} mt={2}>
                          <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          />
                          <Stack direction="row" spacing={1}>
                            <Button
                              onClick={() => handleSendReply(message.id)}
                              disabled={!replyContent.trim()}
                              variant="contained"
                              endIcon={<Send fontSize="small" />}
                            >
                              Send
                            </Button>
                            <Button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              );
              })
            )}
            <div ref={messagesEndRef} />
          </Stack>
        </Box>

        {/* New Message Input */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="column" spacing={2}>
            {/* Message Input and Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="flex-end"
            >
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Write your message..."
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleSendMessage();
                  }
                }}
                sx={{ flex: 1 }}
              />

              {/* Image Upload Button */}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <IconButton
                  component="span"
                  color="primary"
                  sx={{ mb: { xs: 0, sm: "4px" } }}
                >
                  <AttachFile />
                </IconButton>
              </label>

              {/* Send Button */}
              <Button
                variant="contained"
                endIcon={<Send />}
                disabled={(!newMessage.trim() && !image) || sending}
                onClick={handleSendMessage}
                sx={{ mb: { xs: 0, sm: "4px" }, whiteSpace: "nowrap" }}
              >
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </Stack>

            {/* Image Preview */}
            {image && (
              <Card
                sx={{
                  maxWidth: 220,
                  borderRadius: 2,
                  boxShadow: 3,
                  position: "relative",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setImage(null)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                <CardMedia
                  component="img"
                  height="140"
                  image={URL.createObjectURL(image)}
                  alt="preview"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Image ready to send
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
