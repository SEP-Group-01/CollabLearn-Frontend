import { useState } from "react"
import { Grid, Box, Typography } from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import GroupIcon from "@mui/icons-material/Group"
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer"
import SettingsIcon from "@mui/icons-material/Settings"

function BenefitsSection() {
  const benefits = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 32, color: "#0369A1" }} />,
      title: "Study Plan Generator",
      description:
        "Create study schedules based on your goals",
      lightColor: "#E0F2FE",
      darkColor: "#0369A1",
    },
    {
      icon: <GroupIcon sx={{ fontSize: 32, color: "#0284C7" }} />,
      title: "Collaborative Editing",
      description: "Work on notes with peers in real-time.",
      lightColor: "#F0F9FF",
      darkColor: "#0284C7",
    },
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 32, color: "#1D4ED8" }} />,
      title: "Document Querying",
      description: "Ask questions get AI-powered answers.",
      lightColor: "#EFF6FF",
      darkColor: "#1D4ED8",
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 32, color: "#1E40AF" }} />,
      title: "Study Groups",
      description: "Create and manage study groups with ease.",
      lightColor: "#DBEAFE",
      darkColor: "#1E40AF",
    },
  ]

  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <Box
      component="section"
      id="features"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#ffffff",
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

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#0f172a"
            gutterBottom
            sx={{
              fontSize: { xs: "1.75rem", md: "2rem" },
              mb: 1,
              background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Key Features
          </Typography>
          <Typography
            variant="body1"
            color="#64748b"
            sx={{
              maxWidth: 600,
              mx: "auto",
              fontSize: "1rem",
              lineHeight: 1.5,
            }}
          >
            Everything you need for effective collaborative learning
          </Typography>
        </Box>

        {/* Benefits Grid - All cards with fixed size */}
        <Grid container spacing={3} justifyContent="center">
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
              <Box
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: 3,
                  p: 3,
                  width: "100%", // Ensure all cards take full width of grid cell
                  height: 240, // Fixed height for all cards
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #f1f5f9",
                  transition: "all 0.3s ease",
                  transform: hovered === index ? "translateY(-6px)" : "translateY(0)",
                  "&:hover": {
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)",
                    borderColor: "#e2e8f0",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: benefit.lightColor,
                    borderRadius: "50%",
                    width: 70,
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                    border: `2px solid ${benefit.darkColor}20`,
                    transition: "all 0.3s ease",
                    transform: hovered === index ? "scale(1.1) rotate(5deg)" : "scale(1)",
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#0f172a"
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.3,
                    mb: 1.5,
                    minHeight: 56, // Fixed height for title to ensure alignment
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="#64748b"
                  sx={{
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default BenefitsSection