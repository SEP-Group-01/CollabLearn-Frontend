import type React from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Button, Card, CardMedia, CardContent, Container } from "@mui/material"
import { motion, type Variants } from "framer-motion"
import { mockWorkspaces } from "../mocks/Workspace"

const GroupsSection: React.FC = () => {
  const navigate = useNavigate()

  // Use mockWorkspaces instead of hardcoded groups
  const workspaces = mockWorkspaces

  // Color schemes for different categories
  const getColorScheme = (tags: string[]) => {
    const primaryTag = tags[0]?.toLowerCase() || 'default'
    
    const colorSchemes: Record<string, { light: string; dark: string }> = {
      design: { light: "#e0f2fe", dark: "#0277bd" },
      development: { light: "#e8f5e8", dark: "#2e7d32" },
      marketing: { light: "#fff3e0", dark: "#ef6c00" },
      programming: { light: "#f3e5f5", dark: "#7b1fa2" },
      web: { light: "#e1f5fe", dark: "#0288d1" },
      digital: { light: "#fff9c4", dark: "#f57f17" },
      strategy: { light: "#fce4ec", dark: "#c2185b" },
      default: { light: "#f5f5f5", dark: "#616161" }
    }
    
    return colorSchemes[primaryTag] || colorSchemes.default
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <Box
      component="section"
      id="workspaces"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Enhanced Background with animated elements */}
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

      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.03) 100%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 2.5, delay: 1 }}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "3%",
          width: "150px",
          height: "150px",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(196, 181, 253, 0.03) 100%)",
          filter: "blur(30px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
              }}
            >
              Study Workspaces
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: { xs: "1rem", md: "1.1rem" },
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Join collaborative learning communities, share knowledge, and work together on projects that matter.
            </Typography>
          </Box>
        </motion.div>

        {/* Workspaces Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            {workspaces.slice(0, 6).map((workspace) => {
              const colorScheme = getColorScheme(workspace.tags)
              return (
                <motion.div
                  key={workspace.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      cursor: "pointer",
                      position: "relative",
                      "&:hover": {
                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                        "& .card-image": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                    onClick={() => navigate(`/workspace/${workspace.id}`)}
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
                        image={workspace.image_url}
                        alt={workspace.title}
                        className="card-image"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />

                      {/* Category Badge */}
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
                          border: `1px solid ${colorScheme.light}`,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: colorScheme.dark,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        >
                          {workspace.tags[0] || "General"}
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
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          fontSize: "1.1rem",
                          color: "#0f172a",
                          lineHeight: 1.3,
                        }}
                      >
                        {workspace.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          mb: 2,
                          lineHeight: 1.5,
                          flexGrow: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {workspace.description}
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {workspace.tags.slice(0, 3).map((tag, index) => (
                            <Box
                              key={index}
                              sx={{
                                px: 1,
                                py: 0.3,
                                bgcolor: colorScheme.light,
                                color: colorScheme.dark,
                                borderRadius: 1,
                                fontSize: "0.7rem",
                                fontWeight: 500,
                              }}
                            >
                              {tag}
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* Stats */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pt: 1,
                          borderTop: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {workspace.members_count} members
                        </Typography>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: colorScheme.light,
                            color: colorScheme.dark,
                            borderRadius: 1,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            border: `1px solid ${colorScheme.light}`,
                            "&:hover": {
                              bgcolor: colorScheme.dark,
                              color: "#ffffff",
                              borderColor: colorScheme.dark,
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {workspace.join_policy}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/workspaces")}
                sx={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                  },
                }}
              >
                Explore All Workspaces
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default GroupsSection