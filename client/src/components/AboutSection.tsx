"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Box, Typography, Button, Grid, Card, Container, alpha } from "@mui/material"
import { Users, BookOpen, Target, Zap, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react"

const AboutSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Image carousel data
  const carouselImages = [
    {
      src: "/placeholder.svg?height=500&width=600&text=Students+Collaborating",
      alt: "Students collaborating in study groups",
      title: "Collaborative Learning",
    },
    {
      src: "/placeholder.svg?height=500&width=600&text=Study+Groups+Meeting",
      alt: "Study groups meeting online",
      title: "Study Groups",
    },
    {
      src: "/placeholder.svg?height=500&width=600&text=Academic+Success",
      alt: "Students achieving academic success",
      title: "Academic Success",
    },
  ]

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [carouselImages.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const features = [
    {
      icon: <Users size={28} />,
      title: "Collaborative Learning",
      description: "Connect with peers worldwide and learn together",
    },
    {
      icon: <BookOpen size={28} />,
      title: "Smart Study Plans",
      description: "AI-powered personalized learning schedules",
    },
    {
      icon: <Target size={28} />,
      title: "Goal Tracking",
      description: "Monitor and achieve your learning objectives",
    },
    {
      icon: <Zap size={28} />,
      title: "Real-time Editing",
      description: "Collaborate on documents instantly with peers",
    },
  ]

  const stats = [
    {
      number: "15,000+",
      label: "Active Students",
      description: "Learning together daily",
    },
    {
      number: "850+",
      label: "Study Groups",
      description: "Across all subjects",
    },
    {
      number: "98%",
      label: "Success Rate",
      description: "Students achieving goals",
    },
  ]

  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 8, lg: 12 },
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(148, 163, 184, 0.03) 100%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Centered Big Title */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Sparkles size={28} color="#2563eb" />
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  color: "#0f172a",
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  ml: 1,
                  lineHeight: 1.1,
                  background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                About Us
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{
                color: "#475569",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 400,
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.4,
              }}
            >
              Revolutionizing Education Through{" "}
              <Box
                component="span"
                sx={{
                  color: "#2563eb",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Collaborative Learning
              </Box>
            </Typography>
          </motion.div>
        </Box>

        {/* Main Content */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
          {/* Left Content */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#475569",
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Our platform transforms the way students learn by fostering collaboration, enabling real-time document
                editing, and providing AI-powered study plans. Join thousands of learners who are already experiencing the
                future of education.
              </Typography>

              {/* Feature highlights */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          p: 3,
                          borderRadius: 4,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          height: "100%",
                          "&:hover": {
                            bgcolor: "#e0f2fe",
                            borderColor: "#0369a1",
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(3, 105, 161, 0.15)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            color: "#0369a1",
                            bgcolor: "#dbeafe",
                            p: 1.5,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            color="#0f172a"
                            sx={{ fontSize: "1rem", lineHeight: 1.3, mb: 1 }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="#64748b" sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
               
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right Side - Carousel and Stats Section */}
          <Grid item xs={12} lg={7}>
            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {/* Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: "100%", display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    width: "90%",
                    maxWidth: 480,
                    aspectRatio: "4/3",
                    position: "relative",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    transform: "translateY(0)",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 35px 70px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {/* Image carousel */}
                  {carouselImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        opacity: index === currentImageIndex ? 1 : 0,
                        transition: "opacity 0.8s ease",
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {/* Gradient Overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          position: "absolute",
                          bottom: 24,
                          left: "50%",
                          transform: "translateX(-50%)",
                          color: "#fff",
                          fontWeight: 600,
                          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          letterSpacing: 0.5,
                        }}
                      >
                        {image.title}
                      </Typography>
                    </Box>
                  ))}

                  {/* Arrows */}
                  <Button
                    onClick={prevImage}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 16,
                      transform: "translateY(-50%)",
                      minWidth: 0,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "#0369a1",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#fff",
                        transform: "translateY(-50%) scale(1.1)",
                      },
                    }}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    onClick={nextImage}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 16,
                      transform: "translateY(-50%)",
                      minWidth: 0,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "#0369a1",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#fff",
                        transform: "translateY(-50%) scale(1.1)",
                      },
                    }}
                  >
                    <ChevronRight size={20} />
                  </Button>

                  {/* Dots */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {carouselImages.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        sx={{
                          width: index === currentImageIndex ? 12 : 8,
                          height: index === currentImageIndex ? 12 : 8,
                          borderRadius: "50%",
                          bgcolor:
                            index === currentImageIndex
                              ? "#0369a1"
                              : "rgba(255,255,255,0.7)",
                          border: "1px solid #0369a1",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </Box>
                </Card>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                style={{ width: "100%" }}
              >
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: "#0f172a", mb: 2 }}
                  >
                    Our Impact in Numbers
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#64748b",
                      mb: 6,
                      maxWidth: 600,
                      mx: "auto",
                    }}
                  >
                    Join a thriving community of learners achieving their academic goals together
                  </Typography>

                  <Grid container spacing={4} justifyContent="center">
                    {stats.map((stat, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Box
                            sx={{
                              p: 4,
                              borderRadius: 4,
                              background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                                transform: "translateY(-4px)",
                              },
                            }}
                          >
                            <Typography
                              variant="h3"
                              fontWeight="bold"
                              sx={{
                                color: "#0369a1",
                                lineHeight: 1.1,
                                mb: 1,
                              }}
                            >
                              {stat.number}
                            </Typography>
                            <Typography variant="h6" fontWeight="600" sx={{ color: "#0f172a", mb: 1 }}>
                              {stat.label}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                              {stat.description}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AboutSection