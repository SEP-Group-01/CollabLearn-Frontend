import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Rating,
  Chip,
  Button,
  Stack,
  Divider,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import { Description, PictureAsPdf, TextSnippet, Tag, ChatBubbleOutline, ArrowBack } from "@mui/icons-material";
import { mockDocuments } from "../mocks/Documents";

export default function DocumentDetailsPage() {
  const { docId, workspaceId, threadId } = useParams();
  const navigate = useNavigate();

  // Find the document by id
  const document = mockDocuments.find((doc) => doc.id === Number(docId));

  // Always use sample.pdf for all document views
  const fileUrl = "/sample.pdf";

  const [rating, setRating] = useState(document?.rating || 0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [comments, setComments] = useState<string[]>(document?.mockComments || []);
  const [commentInput, setCommentInput] = useState("");

  // Redirect to editor if currently editing
  useEffect(() => {
    if (document?.isEditing) {
      navigate("/editor");
    }
  }, [document, navigate]);

  if (!document) {
    return <Typography variant="h6" color="error">Document not found.</Typography>;
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      setComments([...comments, commentInput.trim()]);
      setCommentInput("");
    }
  };

  const handleBack = () => {
    // Go back to documents section (thread documents)
    if (workspaceId && threadId) {
      navigate(`/workspace/${workspaceId}/threads/${threadId}/documents`);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, md: 4 }, display: "flex", gap: 4 }}>
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            {document.title}
          </Typography>
        </Box>
        <Card sx={{ mb: 2 }}>
          <CardContent>
           
            {/* Tag Section */}
           
            {/* Document Preview */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Preview:</Typography>
              <iframe
                src={fileUrl}
                title="Document Preview"
                width="100%"
                height="500px"
                style={{ border: "1px solid #e0e0e0", borderRadius: 8 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Comments Section on the right */}
      <Box sx={{ width: { xs: "100%", md: 350 }, flexShrink: 0 }}>


         <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tag Related Resources
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} icon={<Tag fontSize="small" />} />
                ))}
              </Stack>
              <Box display="flex" gap={1}>
                <TextField
                  size="small"
                  label="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button variant="contained" onClick={handleAddTag}>
                  Add
                </Button>
              </Box>
            </Box>
         <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Rate This Document
              </Typography>
              <Rating
                name="doc-rating"
                value={rating}
                precision={0.5}
                size="large"
                onChange={(_, value) => setRating(value || 0)}
              />
            </Box>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <ChatBubbleOutline sx={{ mr: 1 }} />
            Comments
          </Typography>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {comments.length === 0 && (
              <Typography color="text.secondary">No comments yet.</Typography>
            )}
            {comments.map((comment, idx) => (
              <Paper key={idx} sx={{ p: 2, bgcolor: "#f1f5f9" }}>
                <Typography variant="body2">{comment}</Typography>
              </Paper>
            ))}
          </Stack>
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              label="Add a comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleAddComment}>
              Add
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}