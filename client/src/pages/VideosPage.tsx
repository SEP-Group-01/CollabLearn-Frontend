import React from "react";
import { Box, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import { ArrowBack, PlayCircle, ArrowForward } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useThreadData } from "../mocks/Threads";

export default function VideosPage() {
  const { workspaceId, threadId } = useParams();
  const navigate = useNavigate();
  const threadData = useThreadData(threadId, workspaceId);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, md: 4 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Video Content
      </Typography>
      <Stack spacing={3}>
        {threadData.resources.videos.length === 0 && (
          <Typography color="text.secondary">No videos available.</Typography>
        )}
        {threadData.resources.videos.map((video, idx) => (
          <Card key={idx} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PlayCircle color="info" />
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.description}
                  </Typography>
                </Box>
                <Button href={video.url} target="_blank" endIcon={<ArrowForward />} variant="contained" color="info">
                  Watch
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
