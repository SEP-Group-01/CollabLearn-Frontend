import { useState } from "react"
import { Box, Typography, Container } from "@mui/material"
import { motion } from "framer-motion"
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

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
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
        </motion.div>

        {/* Benefits Grid - All cards with fixed size */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 3,
            justifyContent: "center",
          }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{ display: "flex" }}
            >
              <motion.div
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.2 }
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 24,
                  padding: 24,
                  width: "100%",
                  height: 240,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #f1f5f9",
                  cursor: "pointer",
                }}
              >
                <motion.div
                  animate={{
                    scale: hovered === index ? 1.1 : 1,
                    rotate: hovered === index ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: benefit.lightColor,
                    borderRadius: "50%",
                    width: 70,
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    border: `2px solid ${benefit.darkColor}20`,
                  }}
                >
                  {benefit.icon}
                </motion.div>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#0f172a"
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.3,
                    mb: 1.5,
                    minHeight: 56,
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
              </motion.div>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default BenefitsSection