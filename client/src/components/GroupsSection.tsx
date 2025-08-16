import type React from "react"
import { Box, Grid, Typography, Button, Card, CardMedia, CardContent } from "@mui/material"
import course_2 from "../assets/course_2.png"
import course_1 from "../assets/course_1.png"
import course_3 from "../assets/course_3.png"
import course_4 from "../assets/course_4.png"

const GroupsSection: React.FC = () => {
  const groups = [
    {
      title: "Web Design",
      level: "Basic to advance",
      image: course_1,
      lightColor: "#E0F2FE", // Light blue
      darkColor: "#0369A1", // Dark blue
    },
    {
      title: "Web Development",
      level: "Basic to advance",
      image: course_2,
      lightColor: "#F0F9FF", // Very light blue
      darkColor: "#0284C7", // Medium blue
    },
    {
      title: "Digital Marketing",
      level: "Basic to advance",
      image: course_3,
      lightColor: "#EFF6FF", // Light blue tint
      darkColor: "#1D4ED8", // Blue
    },
    {
      title: "App Design",
      level: "Basic to advance",
      image: course_4,
      lightColor: "#DBEAFE", // Light blue
      darkColor: "#1E40AF", // Dark blue
    },
    {
      title: "Mobile Design",
      level: "Basic to advance",
      image: "/placeholder.svg?height=200&width=350&text=Mobile+Design",
      lightColor: "#E0F2FE", // Light cyan-blue
      darkColor: "#0F172A", // Very dark blue/navy
    },
    {
      title: "Graphics Design",
      level: "Basic to advance",
      image: "/placeholder.svg?height=200&width=350&text=Graphics+Design",
      lightColor: "#F1F5F9", // Light slate
      darkColor: "#334155", // Dark slate
    },
  ]

  return (
    <Box
      component="section"
      id="groups"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#ffffff", // Pure white background
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(148, 163, 184, 0.03) 100%)",
          zIndex: 0,
        }}
      />

      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#0f172a" // Very dark blue/navy
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              mb: 2,
            }}
          >
            Groups
          </Typography>
          <Typography
            variant="subtitle1"
            color="#475569" // Medium gray-blue
            sx={{
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            Start using the best collaborative learning today!
          </Typography>
        </Box>

        {/* Groups Grid */}
        <Grid container spacing={4} mb={8}>
          {groups.map((group, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  bgcolor: "#ffffff",
                  border: "1px solid #f1f5f9", // Light border
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderColor: "#e2e8f0",
                    "& .card-image": {
                      transform: "scale(1.1)",
                    },
                    "& .card-overlay": {
                      opacity: 1,
                    },
                    "& .join-button": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px -8px ${group.darkColor}40`,
                      bgcolor: group.darkColor,
                      color: "#ffffff",
                    },
                  },
                }}
              >
                {/* Image Container */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={group.image}
                    alt={group.title}
                    className="card-image"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />

                  {/* Gradient Overlay */}
                  <Box
                    className="card-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${group.lightColor}80 0%, ${group.darkColor}20 100%)`,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />

                  {/* Level Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      border: `1px solid ${group.lightColor}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: group.darkColor,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      {group.level}
                    </Typography>
                  </Box>
                </Box>

                {/* Content */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    "&:last-child": { pb: 3 },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="#0f172a" // Very dark blue/navy
                    gutterBottom
                    sx={{
                      fontSize: "1.25rem",
                      lineHeight: 1.3,
                      mb: 2,
                    }}
                  >
                    {group.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#64748b" // Medium gray
                    sx={{
                      mb: 4,
                      lineHeight: 1.5,
                      flexGrow: 1,
                    }}
                  >
                    Comprehensive course covering everything from basics to advanced concepts
                  </Typography>

                  {/* Join Button - Light colored by default */}
                  <Button
                    variant="contained"
                    fullWidth
                    className="join-button"
                    sx={{
                      bgcolor: group.lightColor, // Light color by default
                      color: group.darkColor, // Dark text
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1,
                      fontSize: "1rem",
                      border: `1px solid ${group.lightColor}`,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: group.darkColor, // Dark on hover
                        color: "#ffffff", // White text on hover
                        borderColor: group.darkColor,
                      },
                    }}
                  >
                    Join Group
                  </Button>
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
              borderColor: "#e2e8f0", // Light border
              color: "#475569", // Medium gray text
              bgcolor: "#f8fafc", // Very light background
              px: 6,
              py: 2,
              borderRadius: 3,
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "none",
              borderWidth: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "#0f172a", // Dark navy on hover
                borderColor: "#0f172a",
                color: "#ffffff", // White text on hover
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3)",
              },
            }}
          >
            See More Groups
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default GroupsSection
