import type React from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Button, Card, CardMedia, CardContent, Container } from "@mui/material"
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
      lightColor: "#E0F2FE",
      darkColor: "#0369A1",
    },
    {
      title: "Web Development",
      level: "Basic to advance",
      image: course_2,
      lightColor: "#F0F9FF",
      darkColor: "#0284C7",
    },
    {
      title: "Digital Marketing",
      level: "Basic to advance",
      image: course_3,
      lightColor: "#EFF6FF",
      darkColor: "#1D4ED8",
    },
    {
      title: "App Design",
      level: "Basic to advance",
      image: course_4,
      lightColor: "#DBEAFE",
      darkColor: "#1E40AF",
    },
  ]

  const navigate = useNavigate()

  return (
    <Box
      component="section"
      id="groups"
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

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
            }}
          >
            Study Groups
          </Typography>
          <Typography
            variant="subtitle1"
            color="#475569"
            sx={{
              maxWidth: 500,
              mx: "auto",
              fontSize: "1rem",
              lineHeight: 1.5,
            }}
          >
            Join collaborative learning groups to enhance your skills
          </Typography>
        </Box>

        {/* Groups Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 3,
            mb: 6,
          }}
        >
          {groups.map((group, index) => (
            <Box key={index}>
              <Card onClick={() => navigate(`/workspace`)}  //methana thawa hadann onee
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  bgcolor: "#ffffff",
                  border: "1px solid #f1f5f9",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)",
                    borderColor: "#e2e8f0",
                    "& .card-image": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                {/* Image Container */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 160,
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
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />

                  {/* Level Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      border: `1px solid ${group.lightColor}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: group.darkColor,
                        fontWeight: 600,
                        fontSize: "0.7rem",
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
                    p: 2.5,
                    "&:last-child": { pb: 2.5 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#0f172a"
                    gutterBottom
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                      mb: 1.5,
                    }}
                  >
                    {group.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#64748b"
                    sx={{
                      mb: 3,
                      lineHeight: 1.4,
                      flexGrow: 1,
                      fontSize: "0.875rem",
                    }}
                  >
                    Learn from basics to advanced concepts
                  </Typography>

                  {/* Join Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: group.lightColor,
                      color: group.darkColor,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      py: 0.75,
                      fontSize: "0.9rem",
                      border: `1px solid ${group.lightColor}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: group.darkColor,
                        color: "#ffffff",
                        borderColor: group.darkColor,
                      },
                    }}
                  >
                    Join
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* See More Button */}
        <Box textAlign="center">
          <Button
            variant="outlined"
            sx={{
              borderColor: "#e2e8f0",
              color: "#475569",
              bgcolor: "#f8fafc",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderWidth: 1.5,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#0f172a",
                borderColor: "#0f172a",
                color: "#ffffff",
              },
            }}
          >
            View All Groups
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default GroupsSection