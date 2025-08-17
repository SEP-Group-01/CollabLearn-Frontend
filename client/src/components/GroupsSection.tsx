import React from "react";
import { assets } from "../assets/assets";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

function GroupsSection() {
  const groups = [
    {
      title: "Web Design",
      level: "Basic to advance",
      image: assets.course_1_thumbnail,
    },
    {
      title: "Web development",
      level: "Basic to advance",
      image: assets.course_2_thumbnail,
    },
    {
      title: "Digital marketing",
      level: "Basic to advance",
      image: assets.course_3_thumbnail,
    },
    {
      title: "App Design",
      level: "Basic to advance",
      image: assets.course_4_thumbnail,
    },
    {
      title: "Mobile design",
      level: "Basic to advance",
      image: assets.course_5_thumbnail,
    },
    {
      title: "Graphics Design",
      level: "Basic to advance",
      image: assets.course_6_thumbnail,
    },
  ];

  return (
    <Box
      component="section"
      id="groups"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#f8fafc",
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h4" fontWeight="bold" color="#1e293b" gutterBottom>
            Groups
          </Typography>
          <Typography
            variant="subtitle1"
            color="#64748b"
            maxWidth={600}
            mx="auto"
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been th
          </Typography>
        </Box>

        {/* Groups Grid */}
        <Grid container spacing={4} mb={8}>
          {groups.map((group, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "40%", // Consistent width
                  display: "raw",
                  flexDirection: "flex",
                  justifyContent: "space-between",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px) scale(1.02)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={group.image}
                    alt={group.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                    {group.title}
                  </Typography>
                  <Typography variant="body2" color="#64748b" mb={2}>
                    {group.level}
                  </Typography>
                  <Box mt="auto">
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "#2563eb",
                        color: "#fff",
                        borderRadius: "999px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#1e40af" },
                      }}
                    >
                      Join
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* See More Button */}
        <Box textAlign="center">
          <Button
            variant="outlined"
            sx={{
              borderColor: "#2563eb",
              color: "#2563eb",
              px: 4,
              py: 1.5,
              borderRadius: "999px",
              fontSize: "1.125rem",
              fontWeight: 500,
              textTransform: "none",
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "#e0e7ff",
                borderColor: "#1e40af",
                color: "#1e40af",
              },
            }}
          >
            See More
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default GroupsSection;




