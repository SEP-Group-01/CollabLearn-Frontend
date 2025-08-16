// // // // // // import React from "react";
// // // // // // import { Box, Grid, Typography, Button, Paper } from "@mui/material";

// // // // // // function AboutSection() {
// // // // // //   return (
// // // // // //     <Box
// // // // // //       component="section"
// // // // // //       id="about"
// // // // // //       sx={{
// // // // // //         py: { xs: 8, md: 12 },
// // // // // //         //bgcolor: "linear-gradient(to right, #2563eb, #1e40af)",
// // // // // //         background: "linear-gradient(to right, #2563eb, #1e40af)",
// // // // // //       }}
// // // // // //     >
// // // // // //       <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
// // // // // //         <Grid container spacing={6} alignItems="center">
// // // // // //           {/* Content */}
// // // // // //           <Grid item xs={12} md={6}>
// // // // // //             <Typography
// // // // // //               variant="h3"
// // // // // //               fontWeight="bold"
// // // // // //               color="common.white"
// // // // // //               gutterBottom
// // // // // //               sx={{ mb: 3, lineHeight: 1.2 }}
// // // // // //             >
// // // // // //               We are Always Ensure Best ways for your learning
// // // // // //             </Typography>
// // // // // //             <Typography
// // // // // //               variant="body1"
// // // // // //               color="#c7d2fe"
// // // // // //               sx={{ mb: 4, fontSize: "1.125rem", lineHeight: 1.7 }}
// // // // // //             >
// // // // // //               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
// // // // // //               industry's standard dummy text ever since the 1500s.
// // // // // //             </Typography>
// // // // // //             <Button
// // // // // //               variant="contained"
// // // // // //               sx={{
// // // // // //                 bgcolor: "#fff",
// // // // // //                 color: "#2563eb",
// // // // // //                 px: 4,
// // // // // //                 py: 1.5,
// // // // // //                 borderRadius: "999px",
// // // // // //                 fontSize: "1.125rem",
// // // // // //                 fontWeight: 500,
// // // // // //                 boxShadow: "none",
// // // // // //                 "&:hover": {
// // // // // //                   bgcolor: "#f3f4f6",
// // // // // //                   color: "#1e40af",
// // // // // //                 },
// // // // // //               }}
// // // // // //             >
// // // // // //               Join Us Free
// // // // // //             </Button>
// // // // // //           </Grid>

// // // // // //           {/* Image */}
// // // // // //           <Grid item xs={12} md={6} sx={{ position: "relative" }}>
// // // // // //             <Paper
// // // // // //               elevation={4}
// // // // // //               sx={{
// // // // // //                 borderRadius: 4,
// // // // // //                 overflow: "hidden",
// // // // // //                 aspectRatio: "1 / 1",
// // // // // //                 width: "100%",
// // // // // //                 maxWidth: 400,
// // // // // //                 mx: "auto",
// // // // // //                 position: "relative",
// // // // // //               }}
// // // // // //             >
// // // // // //               <img
// // // // // //                 src="https://via.placeholder.com/400x400/FBBF24/FFFFFF?text=Learning+Together"
// // // // // //                 alt="Students learning together"
// // // // // //                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
// // // // // //               />
// // // // // //             </Paper>
// // // // // //             {/* Decorative elements */}
// // // // // //             <Box
// // // // // //               sx={{
// // // // // //                 position: "absolute",
// // // // // //                 top: -32,
// // // // // //                 right: -32,
// // // // // //                 width: 96,
// // // // // //                 height: 96,
// // // // // //                 bgcolor: "#fbbf24",
// // // // // //                 borderRadius: "50%",
// // // // // //                 opacity: 0.8,
// // // // // //                 zIndex: 1,
// // // // // //               }}
// // // // // //             />
// // // // // //             <Box
// // // // // //               sx={{
// // // // // //                 position: "absolute",
// // // // // //                 bottom: -16,
// // // // // //                 left: -16,
// // // // // //                 width: 64,
// // // // // //                 height: 64,
// // // // // //                 bgcolor: "#fff",
// // // // // //                 borderRadius: "50%",
// // // // // //                 opacity: 0.2,
// // // // // //                 zIndex: 1,
// // // // // //               }}
// // // // // //             />
// // // // // //           </Grid>
// // // // // //         </Grid>
// // // // // //       </Box>
// // // // // //     </Box>
// // // // // //   );
// // // // // // }

// // // // // // export default AboutSection;

// // // // // import React from "react";
// // // // // import { Box, Typography, Button, Grid } from "@mui/material";

// // // // // const AboutSection: React.FC = () => {
// // // // //   return (
// // // // //     <Box
// // // // //       component="section"
// // // // //       id="about"
// // // // //       sx={{
// // // // //         py: { xs: 8, lg: 12 },
// // // // //         background: "linear-gradient(to right, #ffffff, #e3f2fd)", // white to light blue
// // // // //         color: "#0d47a1", // dark blue text
// // // // //       }}
// // // // //     >
// // // // //       <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 } }}>
// // // // //         <Grid container spacing={6} alignItems="center">
// // // // //           {/* Content */}
// // // // //           <Grid item xs={12} lg={6}>
// // // // //             <Typography
// // // // //               variant="h4"
// // // // //               fontWeight="bold"
// // // // //               sx={{
// // // // //                 mb: 3,
// // // // //                 lineHeight: "tight",
// // // // //                 fontSize: { xs: "2rem", md: "2.5rem" },
// // // // //               }}
// // // // //             >
// // // // //               We Always Ensure the Best Ways for Your Learning
// // // // //             </Typography>
// // // // //             <Typography
// // // // //               variant="body1"
// // // // //               sx={{
// // // // //                 color: "#37474f", // blue-grey-800
// // // // //                 mb: 4,
// // // // //                 lineHeight: "relaxed",
// // // // //                 fontSize: { xs: "1rem", md: "1.125rem" },
// // // // //               }}
// // // // //             >
// // // // //               Lorem Ipsum is simply dummy text of the printing and typesetting
// // // // //               industry. Lorem Ipsum has been the industry's standard dummy text
// // // // //               ever since the 1500s.
// // // // //             </Typography>
// // // // //             <Button
// // // // //               variant="contained"
// // // // //               sx={{
// // // // //                 bgcolor: "#1976d2", // blue-600
// // // // //                 color: "white",
// // // // //                 "&:hover": { bgcolor: "#1565c0" }, // blue-700
// // // // //                 px: 4,
// // // // //                 py: 1.5,
// // // // //                 borderRadius: 9999,
// // // // //                 fontSize: "1.125rem",
// // // // //                 fontWeight: "medium",
// // // // //               }}
// // // // //             >
// // // // //               Join Us Free
// // // // //             </Button>
// // // // //           </Grid>

// // // // //           {/* Image */}
// // // // //           <Grid item xs={12} lg={6}>
// // // // //             <Box sx={{ position: "relative" }}>
// // // // //               <Box
// // // // //                 sx={{
// // // // //                   aspectRatio: "1 / 1",
// // // // //                   overflow: "hidden",
// // // // //                   borderRadius: 4,
// // // // //                 }}
// // // // //               >
// // // // //                 <img
// // // // //                   src="https://via.placeholder.com/400x400/FBBF24/FFFFFF?text=Learning+Together"
// // // // //                   alt="Students learning together"
// // // // //                   style={{
// // // // //                     width: "100%",
// // // // //                     height: "100%",
// // // // //                     objectFit: "cover",
// // // // //                   }}
// // // // //                 />
// // // // //               </Box>
// // // // //               {/* Decorative elements */}
// // // // //               <Box
// // // // //                 sx={{
// // // // //                   position: "absolute",
// // // // //                   top: -16,
// // // // //                   right: -16,
// // // // //                   width: 96,
// // // // //                   height: 96,
// // // // //                   bgcolor: "#bbdefb", // light blue circle
// // // // //                   borderRadius: "50%",
// // // // //                   opacity: 0.7,
// // // // //                 }}
// // // // //               />
// // // // //               <Box
// // // // //                 sx={{
// // // // //                   position: "absolute",
// // // // //                   bottom: -16,
// // // // //                   left: -16,
// // // // //                   width: 64,
// // // // //                   height: 64,
// // // // //                   bgcolor: "#e3f2fd", // lightest blue
// // // // //                   borderRadius: "50%",
// // // // //                   opacity: 0.3,
// // // // //                 }}
// // // // //               />
// // // // //             </Box>
// // // // //           </Grid>
// // // // //         </Grid>
// // // // //       </Box>
// // // // //     </Box>
// // // // //   );
// // // // // };

// // // // // export default AboutSection;


// // // // "use client"

// // // // import type React from "react"

// // // // import { Box, Typography, Button, Grid, Card } from "@mui/material"
// // // // import { Users, BookOpen, Target, Zap } from "lucide-react"

// // // // const AboutSection: React.FC = () => {
// // // //   const features = [
// // // //     {
// // // //       icon: <Users size={24} />,
// // // //       title: "Collaborative Learning",
// // // //       description: "Connect with peers worldwide",
// // // //     },
// // // //     {
// // // //       icon: <BookOpen size={24} />,
// // // //       title: "Smart Study Plans",
// // // //       description: "AI-powered personalized schedules",
// // // //     },
// // // //     {
// // // //       icon: <Target size={24} />,
// // // //       title: "Goal Tracking",
// // // //       description: "Monitor your learning progress",
// // // //     },
// // // //     {
// // // //       icon: <Zap size={24} />,
// // // //       title: "Real-time Editing",
// // // //       description: "Collaborate on documents instantly",
// // // //     },
// // // //   ]

// // // //   return (
// // // //     <Box
// // // //       component="section"
// // // //       id="about"
// // // //       sx={{
// // // //         py: { xs: 8, lg: 12 },
// // // //         bgcolor: "#ffffff", // Pure white background
// // // //         position: "relative",
// // // //         overflow: "hidden",
// // // //       }}
// // // //     >
// // // //       {/* Background decoration */}
// // // //       <Box
// // // //         sx={{
// // // //           position: "absolute",
// // // //           top: 0,
// // // //           left: 0,
// // // //           right: 0,
// // // //           bottom: 0,
// // // //           background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(148, 163, 184, 0.03) 100%)",
// // // //           zIndex: 0,
// // // //         }}
// // // //       />
// // // //       <h1>About Us</h1>
// // // //       <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, position: "relative", zIndex: 1 }}>
// // // //         <Grid container spacing={8} alignItems="center">
// // // //           {/* Content */}
// // // //           <Grid item xs={12} lg={6}>
// // // //             <Typography
// // // //               variant="h4"
// // // //               fontWeight="bold"
// // // //               color="#0f172a" // Very dark blue/navy
// // // //               sx={{
// // // //                 mb: 3,
// // // //                 lineHeight: 1.2,
// // // //                 fontSize: { xs: "2rem", md: "2.5rem" },
// // // //               }}
// // // //             >
// // // //               Revolutionizing Education Through{" "}
// // // //               <Box component="span" sx={{ color: "#2563eb" }}>
// // // //                 Collaborative Learning
// // // //               </Box>
// // // //             </Typography>

// // // //             <Typography
// // // //               variant="body1"
// // // //               color="#475569" // Medium gray-blue
// // // //               sx={{
// // // //                 mb: 4,
// // // //                 lineHeight: 1.7,
// // // //                 fontSize: { xs: "1rem", md: "1.125rem" },
// // // //               }}
// // // //             >
// // // //               Our platform transforms the way students learn by fostering collaboration, enabling real-time document
// // // //               editing, and providing AI-powered study plans. Join thousands of learners who are already experiencing the
// // // //               future of education.
// // // //             </Typography>

// // // //             {/* Feature highlights */}
// // // //             <Grid container spacing={2} sx={{ mb: 4 }}>
// // // //               {features.map((feature, index) => (
// // // //                 <Grid item xs={6} key={index}>
// // // //                   <Box
// // // //                     sx={{
// // // //                       display: "flex",
// // // //                       alignItems: "center",
// // // //                       gap: 1.5,
// // // //                       p: 2,
// // // //                       borderRadius: 3,
// // // //                       bgcolor: "#f8fafc", // Very light background
// // // //                       border: "1px solid #e2e8f0",
// // // //                       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// // // //                       cursor: "pointer",
// // // //                       "&:hover": {
// // // //                         bgcolor: "#e0f2fe", // Light blue on hover
// // // //                         borderColor: "#0369a1",
// // // //                         transform: "translateY(-2px)",
// // // //                         boxShadow: "0 4px 12px rgba(3, 105, 161, 0.15)",
// // // //                       },
// // // //                     }}
// // // //                   >
// // // //                     <Box
// // // //                       sx={{
// // // //                         color: "#0369a1", // Dark blue
// // // //                         display: "flex",
// // // //                         alignItems: "center",
// // // //                         justifyContent: "center",
// // // //                       }}
// // // //                     >
// // // //                       {feature.icon}
// // // //                     </Box>
// // // //                     <Box>
// // // //                       <Typography
// // // //                         variant="body2"
// // // //                         fontWeight="600"
// // // //                         color="#0f172a"
// // // //                         sx={{ fontSize: "0.875rem", lineHeight: 1.2 }}
// // // //                       >
// // // //                         {feature.title}
// // // //                       </Typography>
// // // //                       <Typography variant="caption" color="#64748b" sx={{ fontSize: "0.75rem" }}>
// // // //                         {feature.description}
// // // //                       </Typography>
// // // //                     </Box>
// // // //                   </Box>
// // // //                 </Grid>
// // // //               ))}
// // // //             </Grid>

// // // //             <Button
// // // //               variant="contained"
// // // //               sx={{
// // // //                 bgcolor: "#e0f2fe", // Light blue background
// // // //                 color: "#0369a1", // Dark blue text
// // // //                 px: 6,
// // // //                 py: 2,
// // // //                 borderRadius: 3,
// // // //                 fontSize: "1.125rem",
// // // //                 fontWeight: 600,
// // // //                 textTransform: "none",
// // // //                 border: "2px solid #e0f2fe",
// // // //                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// // // //                 "&:hover": {
// // // //                   bgcolor: "#0369a1", // Dark blue on hover
// // // //                   color: "#ffffff", // White text on hover
// // // //                   borderColor: "#0369a1",
// // // //                   transform: "translateY(-2px)",
// // // //                   boxShadow: "0 8px 25px -8px rgba(3, 105, 161, 0.4)",
// // // //                 },
// // // //               }}
// // // //             >
// // // //               Start Learning Together
// // // //             </Button>
// // // //           </Grid>

// // // //           {/* Image with enhanced effects */}
// // // //           <Grid item xs={12} lg={6}>
// // // //             <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
// // // //               <Card
// // // //                 sx={{
// // // //                   borderRadius: 4,
// // // //                   overflow: "hidden",
// // // //                   aspectRatio: "1 / 1",
// // // //                   width: "100%",
// // // //                   maxWidth: 400,
// // // //                   position: "relative",
// // // //                   boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
// // // //                   transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// // // //                   "&:hover": {
// // // //                     transform: "translateY(-8px) scale(1.02)",
// // // //                     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
// // // //                   },
// // // //                 }}
// // // //               >
// // // //                 <img
// // // //                   src="/placeholder.svg?height=400&width=400&text=Collaborative+Learning+Platform"
// // // //                   alt="Students collaborating on learning platform"
// // // //                   style={{
// // // //                     width: "100%",
// // // //                     height: "100%",
// // // //                     objectFit: "cover",
// // // //                     transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// // // //                   }}
// // // //                 />
// // // //               </Card>

// // // //               {/* Decorative floating elements */}
// // // //               <Box
// // // //                 sx={{
// // // //                   position: "absolute",
// // // //                   top: -20,
// // // //                   right: -20,
// // // //                   width: 80,
// // // //                   height: 80,
// // // //                   bgcolor: "#dbeafe", // Light blue
// // // //                   borderRadius: "50%",
// // // //                   opacity: 0.8,
// // // //                   zIndex: 1,
// // // //                   animation: "float 3s ease-in-out infinite",
// // // //                   "@keyframes float": {
// // // //                     "0%, 100%": { transform: "translateY(0px)" },
// // // //                     "50%": { transform: "translateY(-10px)" },
// // // //                   },
// // // //                 }}
// // // //               />

// // // //               <Box
// // // //                 sx={{
// // // //                   position: "absolute",
// // // //                   bottom: -15,
// // // //                   left: -15,
// // // //                   width: 60,
// // // //                   height: 60,
// // // //                   bgcolor: "#f1f5f9", // Light slate
// // // //                   borderRadius: "50%",
// // // //                   opacity: 0.6,
// // // //                   zIndex: 1,
// // // //                   animation: "float 3s ease-in-out infinite 1.5s",
// // // //                 }}
// // // //               />

// // // //               <Box
// // // //                 sx={{
// // // //                   position: "absolute",
// // // //                   top: "50%",
// // // //                   right: -30,
// // // //                   width: 40,
// // // //                   height: 40,
// // // //                   bgcolor: "#e0f2fe", // Very light blue
// // // //                   borderRadius: "50%",
// // // //                   opacity: 0.7,
// // // //                   zIndex: 1,
// // // //                   animation: "float 3s ease-in-out infinite 0.75s",
// // // //                 }}
// // // //               />

// // // //               {/* Stats overlay */}
// // // //               <Box
// // // //                 sx={{
// // // //                   position: "absolute",
// // // //                   bottom: 20,
// // // //                   left: 20,
// // // //                   right: 20,
// // // //                   bgcolor: "rgba(255, 255, 255, 0.95)",
// // // //                   backdropFilter: "blur(10px)",
// // // //                   borderRadius: 3,
// // // //                   p: 2,
// // // //                   border: "1px solid rgba(255, 255, 255, 0.2)",
// // // //                   transition: "all 0.3s ease",
// // // //                   "&:hover": {
// // // //                     transform: "translateY(-2px)",
// // // //                     boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)",
// // // //                   },
// // // //                 }}
// // // //               >
// // // //                 <Grid container spacing={2} textAlign="center">
// // // //                   <Grid item xs={4}>
// // // //                     <Typography variant="h6" fontWeight="bold" color="#0369a1">
// // // //                       10K+
// // // //                     </Typography>
// // // //                     <Typography variant="caption" color="#64748b">
// // // //                       Students
// // // //                     </Typography>
// // // //                   </Grid>
// // // //                   <Grid item xs={4}>
// // // //                     <Typography variant="h6" fontWeight="bold" color="#0369a1">
// // // //                       500+
// // // //                     </Typography>
// // // //                     <Typography variant="caption" color="#64748b">
// // // //                       Groups
// // // //                     </Typography>
// // // //                   </Grid>
// // // //                   <Grid item xs={4}>
// // // //                     <Typography variant="h6" fontWeight="bold" color="#0369a1">
// // // //                       95%
// // // //                     </Typography>
// // // //                     <Typography variant="caption" color="#64748b">
// // // //                       Success
// // // //                     </Typography>
// // // //                   </Grid>
// // // //                 </Grid>
// // // //               </Box>
// // // //             </Box>
// // // //           </Grid>
// // // //         </Grid>
// // // //       </Box>
// // // //     </Box>
// // // //   )
// // // // }

// // // // export default AboutSection


// // // "use client"

// // // import type React from "react"
// // // import { useState, useEffect } from "react"
// // // import { Box, Typography, Button, Grid, Card, Container } from "@mui/material"
// // // import { Users, BookOpen, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react"

// // // const AboutSection: React.FC = () => {
// // //   const [currentImageIndex, setCurrentImageIndex] = useState(0)

// // //   // Image carousel data
// // //   const carouselImages = [
// // //     {
// // //       src: "/placeholder.svg?height=500&width=600&text=Students+Collaborating",
// // //       alt: "Students collaborating in study groups",
// // //       title: "Collaborative Learning",
// // //     },
// // //     {
// // //       src: "/placeholder.svg?height=500&width=600&text=Study+Groups+Meeting",
// // //       alt: "Study groups meeting online",
// // //       title: "Study Groups",
// // //     },
// // //     {
// // //       src: "/placeholder.svg?height=500&width=600&text=Academic+Success",
// // //       alt: "Students achieving academic success",
// // //       title: "Academic Success",
// // //     },
// // //   ]

// // //   // Auto-advance carousel
// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
// // //     }, 4000) // Change image every 4 seconds

// // //     return () => clearInterval(interval)
// // //   }, [carouselImages.length])

// // //   const nextImage = () => {
// // //     setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
// // //   }

// // //   const prevImage = () => {
// // //     setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
// // //   }

// // //   const features = [
// // //     {
// // //       icon: <Users size={28} />,
// // //       title: "Collaborative Learning",
// // //       description: "Connect with peers worldwide and learn together",
// // //     },
// // //     {
// // //       icon: <BookOpen size={28} />,
// // //       title: "Smart Study Plans",
// // //       description: "AI-powered personalized learning schedules",
// // //     },
// // //     {
// // //       icon: <Target size={28} />,
// // //       title: "Goal Tracking",
// // //       description: "Monitor and achieve your learning objectives",
// // //     },
// // //     {
// // //       icon: <Zap size={28} />,
// // //       title: "Real-time Editing",
// // //       description: "Collaborate on documents instantly with peers",
// // //     },
// // //   ]

// // //   const stats = [
// // //     {
// // //       number: "15,000+",
// // //       label: "Active Students",
// // //       description: "Learning together daily",
// // //     },
// // //     {
// // //       number: "850+",
// // //       label: "Study Groups",
// // //       description: "Across all subjects",
// // //     },
// // //     {
// // //       number: "98%",
// // //       label: "Success Rate",
// // //       description: "Students achieving goals",
// // //     },
// // //   ]

// // //   return (
// // //     <Box
// // //       component="section"
// // //       id="about"
// // //       sx={{
// // //         py: { xs: 8, lg: 12 },
// // //         bgcolor: "#ffffff",
// // //         position: "relative",
// // //         overflow: "hidden",
// // //       }}
// // //     >
// // //       {/* Background decoration */}
// // //       <Box
// // //         sx={{
// // //           position: "absolute",
// // //           top: 0,
// // //           left: 0,
// // //           right: 0,
// // //           bottom: 0,
// // //           background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(148, 163, 184, 0.03) 100%)",
// // //           zIndex: 0,
// // //         }}
// // //       />

// // //       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
// // //         {/* Centered Big Title */}
// // //         <Box textAlign="center" sx={{ mb: 8 }}>
// // //           <Typography
// // //             variant="h2"
// // //             fontWeight="bold"
// // //             sx={{
// // //               color: "#0f172a",
// // //               fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
// // //               mb: 3,
// // //               lineHeight: 1.1,
// // //               background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
// // //               backgroundClip: "text",
// // //               WebkitBackgroundClip: "text",
// // //               WebkitTextFillColor: "transparent",
// // //               textAlign: "center",
// // //             }}
// // //           >
// // //             About Us
// // //           </Typography>

// // //           <Typography
// // //             variant="h5"
// // //             sx={{
// // //               color: "#475569",
// // //               fontSize: { xs: "1.25rem", md: "1.5rem" },
// // //               fontWeight: 400,
// // //               maxWidth: 800,
// // //               mx: "auto",
// // //               lineHeight: 1.4,
// // //             }}
// // //           >
// // //             Revolutionizing Education Through{" "}
// // //             <Box component="span" sx={{ color: "#2563eb", fontWeight: 600 }}>
// // //               Collaborative Learning
// // //             </Box>
// // //           </Typography>
// // //         </Box>

// // //         {/* Main Content */}
// // //         <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
// // //           {/* Left Content */}
// // //           <Grid item xs={12} lg={6}>
// // //             <Typography
// // //               variant="body1"
// // //               sx={{
// // //                 color: "#475569",
// // //                 mb: 4,
// // //                 lineHeight: 1.7,
// // //                 fontSize: { xs: "1.1rem", md: "1.25rem" },
// // //               }}
// // //             >
// // //               Our platform transforms the way students learn by fostering collaboration, enabling real-time document
// // //               editing, and providing AI-powered study plans. Join thousands of learners who are already experiencing the
// // //               future of education.
// // //             </Typography>

// // //             {/* Feature highlights */}
// // //             <Grid container spacing={3} sx={{ mb: 4 }}>
// // //               {features.map((feature, index) => (
// // //                 <Grid item xs={12} sm={6} key={index}>
// // //                   <Box
// // //                     sx={{
// // //                       display: "flex",
// // //                       alignItems: "flex-start",
// // //                       gap: 2,
// // //                       p: 3,
// // //                       borderRadius: 4,
// // //                       bgcolor: "#f8fafc",
// // //                       border: "1px solid #e2e8f0",
// // //                       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// // //                       cursor: "pointer",
// // //                       height: "100%",
// // //                       "&:hover": {
// // //                         bgcolor: "#e0f2fe",
// // //                         borderColor: "#0369a1",
// // //                         transform: "translateY(-4px)",
// // //                         boxShadow: "0 8px 25px rgba(3, 105, 161, 0.15)",
// // //                       },
// // //                     }}
// // //                   >
// // //                     <Box
// // //                       sx={{
// // //                         color: "#0369a1",
// // //                         bgcolor: "#dbeafe",
// // //                         p: 1.5,
// // //                         borderRadius: 3,
// // //                         display: "flex",
// // //                         alignItems: "center",
// // //                         justifyContent: "center",
// // //                         flexShrink: 0,
// // //                       }}
// // //                     >
// // //                       {feature.icon}
// // //                     </Box>
// // //                     <Box>
// // //                       <Typography
// // //                         variant="h6"
// // //                         fontWeight="600"
// // //                         color="#0f172a"
// // //                         sx={{ fontSize: "1rem", lineHeight: 1.3, mb: 1 }}
// // //                       >
// // //                         {feature.title}
// // //                       </Typography>
// // //                       <Typography variant="body2" color="#64748b" sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
// // //                         {feature.description}
// // //                       </Typography>
// // //                     </Box>
// // //                   </Box>
// // //                 </Grid>
// // //               ))}
// // //             </Grid>

// // //             <Button
// // //               variant="contained"
// // //               sx={{
// // //                 bgcolor: "#e0f2fe",
// // //                 color: "#0369a1",
// // //                 px: 6,
// // //                 py: 2.5,
// // //                 borderRadius: 4,
// // //                 fontSize: "1.125rem",
// // //                 fontWeight: 600,
// // //                 textTransform: "none",
// // //                 border: "2px solid #e0f2fe",
// // //                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// // //                 "&:hover": {
// // //                   bgcolor: "#0369a1",
// // //                   color: "#ffffff",
// // //                   borderColor: "#0369a1",
// // //                   transform: "translateY(-2px)",
// // //                   boxShadow: "0 8px 25px -8px rgba(3, 105, 161, 0.4)",
// // //                 },
// // //               }}
// // //             >
// // //               Start Learning Together
// // //             </Button>
// // //           </Grid>

// // //           {/* Right - Image Carousel */}
// // //           <Grid item xs={12} lg={6}>
// // //             <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
// // //               <Card
// // //                 sx={{
// // //                   borderRadius: 4,
// // //                   overflow: "hidden",
// // //                   width: "100%",
// // //                   maxWidth: 500,
// // //                   aspectRatio: "4/3",
// // //                   position: "relative",
// // //                   boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
// // //                   transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// // //                   "&:hover": {
// // //                     transform: "translateY(-8px) scale(1.02)",
// // //                     boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)",
// // //                   },
// // //                 }}
// // //               >
// // //                 {/* Image Container */}
// // //                 <Box
// // //                   sx={{
// // //                     position: "relative",
// // //                     width: "100%",
// // //                     height: "100%",
// // //                     overflow: "hidden",
// // //                   }}
// // //                 >
// // //                   {carouselImages.map((image, index) => (
// // //                     <Box
// // //                       key={index}
// // //                       sx={{
// // //                         position: "absolute",
// // //                         top: 0,
// // //                         left: 0,
// // //                         width: "100%",
// // //                         height: "100%",
// // //                         opacity: index === currentImageIndex ? 1 : 0,
// // //                         transform: `translateX(${(index - currentImageIndex) * 100}%)`,
// // //                         transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
// // //                       }}
// // //                     >
// // //                       <img
// // //                         src={image.src || "/placeholder.svg"}
// // //                         alt={image.alt}
// // //                         style={{
// // //                           width: "100%",
// // //                           height: "100%",
// // //                           objectFit: "cover",
// // //                         }}
// // //                       />
// // //                       {/* Image overlay with title */}
// // //                       <Box
// // //                         sx={{
// // //                           position: "absolute",
// // //                           bottom: 0,
// // //                           left: 0,
// // //                           right: 0,
// // //                           background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
// // //                           p: 3,
// // //                         }}
// // //                       >
// // //                         <Typography
// // //                           variant="h6"
// // //                           sx={{
// // //                             color: "#ffffff",
// // //                             fontWeight: 600,
// // //                             textAlign: "center",
// // //                           }}
// // //                         >
// // //                           {image.title}
// // //                         </Typography>
// // //                       </Box>
// // //                     </Box>
// // //                   ))}
// // //                 </Box>

// // //                 {/* Navigation Arrows */}
// // //                 <Box
// // //                   sx={{
// // //                     position: "absolute",
// // //                     top: "50%",
// // //                     left: 16,
// // //                     transform: "translateY(-50%)",
// // //                     zIndex: 2,
// // //                   }}
// // //                 >
// // //                   <Button
// // //                     onClick={prevImage}
// // //                     sx={{
// // //                       minWidth: 40,
// // //                       width: 40,
// // //                       height: 40,
// // //                       borderRadius: "50%",
// // //                       bgcolor: "rgba(255, 255, 255, 0.9)",
// // //                       color: "#0369a1",
// // //                       "&:hover": {
// // //                         bgcolor: "#ffffff",
// // //                         transform: "scale(1.1)",
// // //                       },
// // //                     }}
// // //                   >
// // //                     <ChevronLeft size={20} />
// // //                   </Button>
// // //                 </Box>

// // //                 <Box
// // //                   sx={{
// // //                     position: "absolute",
// // //                     top: "50%",
// // //                     right: 16,
// // //                     transform: "translateY(-50%)",
// // //                     zIndex: 2,
// // //                   }}
// // //                 >
// // //                   <Button
// // //                     onClick={nextImage}
// // //                     sx={{
// // //                       minWidth: 40,
// // //                       width: 40,
// // //                       height: 40,
// // //                       borderRadius: "50%",
// // //                       bgcolor: "rgba(255, 255, 255, 0.9)",
// // //                       color: "#0369a1",
// // //                       "&:hover": {
// // //                         bgcolor: "#ffffff",
// // //                         transform: "scale(1.1)",
// // //                       },
// // //                     }}
// // //                   >
// // //                     <ChevronRight size={20} />
// // //                   </Button>
// // //                 </Box>

// // //                 {/* Dots Indicator */}
// // //                 <Box
// // //                   sx={{
// // //                     position: "absolute",
// // //                     bottom: 16,
// // //                     left: "50%",
// // //                     transform: "translateX(-50%)",
// // //                     display: "flex",
// // //                     gap: 1,
// // //                     zIndex: 2,
// // //                   }}
// // //                 >
// // //                   {carouselImages.map((_, index) => (
// // //                     <Box
// // //                       key={index}
// // //                       onClick={() => setCurrentImageIndex(index)}
// // //                       sx={{
// // //                         width: 8,
// // //                         height: 8,
// // //                         borderRadius: "50%",
// // //                         bgcolor: index === currentImageIndex ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
// // //                         cursor: "pointer",
// // //                         transition: "all 0.3s ease",
// // //                         "&:hover": {
// // //                           bgcolor: "#ffffff",
// // //                           transform: "scale(1.2)",
// // //                         },
// // //                       }}
// // //                     />
// // //                   ))}
// // //                 </Box>
// // //               </Card>

// // //               {/* Floating decorative elements */}
// // //               <Box
// // //                 sx={{
// // //                   position: "absolute",
// // //                   top: -20,
// // //                   right: -20,
// // //                   width: 80,
// // //                   height: 80,
// // //                   bgcolor: "#dbeafe",
// // //                   borderRadius: "50%",
// // //                   opacity: 0.8,
// // //                   zIndex: 1,
// // //                   animation: "float 3s ease-in-out infinite",
// // //                   "@keyframes float": {
// // //                     "0%, 100%": { transform: "translateY(0px)" },
// // //                     "50%": { transform: "translateY(-10px)" },
// // //                   },
// // //                 }}
// // //               />

// // //               <Box
// // //                 sx={{
// // //                   position: "absolute",
// // //                   bottom: -15,
// // //                   left: -15,
// // //                   width: 60,
// // //                   height: 60,
// // //                   bgcolor: "#f1f5f9",
// // //                   borderRadius: "50%",
// // //                   opacity: 0.6,
// // //                   zIndex: 1,
// // //                   animation: "float 3s ease-in-out infinite 1.5s",
// // //                 }}
// // //               />
// // //             </Box>
// // //           </Grid>
// // //         </Grid>

// // //         {/* Centered Stats Section */}
// // //         <Box
// // //           sx={{
// // //             textAlign: "center",
// // //             py: 6,
// // //             px: 4,
// // //             bgcolor: "#f8fafc",
// // //             borderRadius: 6,
// // //             border: "1px solid #e2e8f0",
// // //             position: "relative",
// // //             overflow: "hidden",
// // //           }}
// // //         >
// // //           {/* Background decoration for stats */}
// // //           <Box
// // //             sx={{
// // //               position: "absolute",
// // //               top: 0,
// // //               left: 0,
// // //               right: 0,
// // //               bottom: 0,
// // //               background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
// // //               zIndex: 0,
// // //             }}
// // //           />

// // //           <Typography
// // //             variant="h4"
// // //             fontWeight="bold"
// // //             sx={{
// // //               color: "#0f172a",
// // //               mb: 2,
// // //               fontSize: { xs: "1.75rem", md: "2.25rem" },
// // //               position: "relative",
// // //               zIndex: 1,
// // //             }}
// // //           >
// // //             Our Impact in Numbers
// // //           </Typography>

// // //           <Typography
// // //             variant="body1"
// // //             sx={{
// // //               color: "#64748b",
// // //               mb: 6,
// // //               fontSize: { xs: "1rem", md: "1.125rem" },
// // //               maxWidth: 600,
// // //               mx: "auto",
// // //               position: "relative",
// // //               zIndex: 1,
// // //             }}
// // //           >
// // //             Join a thriving community of learners achieving their academic goals together
// // //           </Typography>

// // //           <Grid container spacing={4} justifyContent="center" sx={{ position: "relative", zIndex: 1 }}>
// // //             {stats.map((stat, index) => (
// // //               <Grid item xs={12} sm={4} key={index}>
// // //                 <Box
// // //                   sx={{
// // //                     p: 4,
// // //                     borderRadius: 4,
// // //                     bgcolor: "#ffffff",
// // //                     border: "2px solid #e0f2fe",
// // //                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// // //                     cursor: "pointer",
// // //                     "&:hover": {
// // //                       borderColor: "#0369a1",
// // //                       transform: "translateY(-4px)",
// // //                       boxShadow: "0 12px 30px rgba(3, 105, 161, 0.15)",
// // //                     },
// // //                   }}
// // //                 >
// // //                   <Typography
// // //                     variant="h3"
// // //                     fontWeight="bold"
// // //                     sx={{
// // //                       color: "#0369a1",
// // //                       fontSize: { xs: "2.5rem", md: "3rem" },
// // //                       mb: 1,
// // //                       lineHeight: 1,
// // //                     }}
// // //                   >
// // //                     {stat.number}
// // //                   </Typography>
// // //                   <Typography
// // //                     variant="h6"
// // //                     fontWeight="600"
// // //                     sx={{
// // //                       color: "#0f172a",
// // //                       mb: 1,
// // //                       fontSize: { xs: "1.125rem", md: "1.25rem" },
// // //                     }}
// // //                   >
// // //                     {stat.label}
// // //                   </Typography>
// // //                   <Typography
// // //                     variant="body2"
// // //                     sx={{
// // //                       color: "#64748b",
// // //                       fontSize: "0.95rem",
// // //                     }}
// // //                   >
// // //                     {stat.description}
// // //                   </Typography>
// // //                 </Box>
// // //               </Grid>
// // //             ))}
// // //           </Grid>
// // //         </Box>
// // //       </Container>
// // //     </Box>
// // //   )
// // // }

// // // export default AboutSection


// // "use client"

// // import type React from "react"
// // import { useState, useEffect } from "react"
// // import { Box, Typography, Button, Grid, Card, Container } from "@mui/material"
// // import { Users, BookOpen, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react"

// // const AboutSection: React.FC = () => {
// //   const [currentImageIndex, setCurrentImageIndex] = useState(0)

// //   // Image carousel data
// //   const carouselImages = [
// //     {
// //       src: "/placeholder.svg?height=500&width=600&text=Students+Collaborating",
// //       alt: "Students collaborating in study groups",
// //       title: "Collaborative Learning",
// //     },
// //     {
// //       src: "/placeholder.svg?height=500&width=600&text=Study+Groups+Meeting",
// //       alt: "Study groups meeting online",
// //       title: "Study Groups",
// //     },
// //     {
// //       src: "/placeholder.svg?height=500&width=600&text=Academic+Success",
// //       alt: "Students achieving academic success",
// //       title: "Academic Success",
// //     },
// //   ]

// //   // Auto-advance carousel
// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
// //     }, 4000) // Change image every 4 seconds

// //     return () => clearInterval(interval)
// //   }, [carouselImages.length])

// //   const nextImage = () => {
// //     setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
// //   }

// //   const prevImage = () => {
// //     setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
// //   }

// //   const features = [
// //     {
// //       icon: <Users size={28} />,
// //       title: "Collaborative Learning",
// //       description: "Connect with peers worldwide and learn together",
// //     },
// //     {
// //       icon: <BookOpen size={28} />,
// //       title: "Smart Study Plans",
// //       description: "AI-powered personalized learning schedules",
// //     },
// //     {
// //       icon: <Target size={28} />,
// //       title: "Goal Tracking",
// //       description: "Monitor and achieve your learning objectives",
// //     },
// //     {
// //       icon: <Zap size={28} />,
// //       title: "Real-time Editing",
// //       description: "Collaborate on documents instantly with peers",
// //     },
// //   ]

// //   const stats = [
// //     {
// //       number: "15,000+",
// //       label: "Active Students",
// //       description: "Learning together daily",
// //     },
// //     {
// //       number: "850+",
// //       label: "Study Groups",
// //       description: "Across all subjects",
// //     },
// //     {
// //       number: "98%",
// //       label: "Success Rate",
// //       description: "Students achieving goals",
// //     },
// //   ]

// //   return (
// //     <Box
// //       component="section"
// //       id="about"
// //       sx={{
// //         py: { xs: 8, lg: 12 },
// //         bgcolor: "#ffffff",
// //         position: "relative",
// //         overflow: "hidden",
// //       }}
// //     >
// //       {/* Background decoration */}
// //       <Box
// //         sx={{
// //           position: "absolute",
// //           top: 0,
// //           left: 0,
// //           right: 0,
// //           bottom: 0,
// //           background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(148, 163, 184, 0.03) 100%)",
// //           zIndex: 0,
// //         }}
// //       />

// //       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
// //         {/* Centered Big Title */}
// //         <Box textAlign="center" sx={{ mb: 8 }}>
// //           <Typography
// //             variant="h2"
// //             fontWeight="bold"
// //             sx={{
// //               color: "#0f172a",
// //               fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
// //               mb: 3,
// //               lineHeight: 1.1,
// //               background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
// //               backgroundClip: "text",
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //               textAlign: "center",
// //             }}
// //           >
// //             About Us
// //           </Typography>

// //           <Typography
// //             variant="h5"
// //             sx={{
// //               color: "#475569",
// //               fontSize: { xs: "1.25rem", md: "1.5rem" },
// //               fontWeight: 400,
// //               maxWidth: 800,
// //               mx: "auto",
// //               lineHeight: 1.4,
// //             }}
// //           >
// //             Revolutionizing Education Through{" "}
// //             <Box component="span" sx={{ color: "#2563eb", fontWeight: 600 }}>
// //               Collaborative Learning
// //             </Box>
// //           </Typography>
// //         </Box>

// //         {/* Main Content */}
// //         <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
// //           {/* Left Content */}
// //           <Grid item xs={12} lg={6}>
// //             <Typography
// //               variant="body1"
// //               sx={{
// //                 color: "#475569",
// //                 mb: 4,
// //                 lineHeight: 1.7,
// //                 fontSize: { xs: "1.1rem", md: "1.25rem" },
// //               }}
// //             >
// //               Our platform transforms the way students learn by fostering collaboration, enabling real-time document
// //               editing, and providing AI-powered study plans. Join thousands of learners who are already experiencing the
// //               future of education.
// //             </Typography>

// //             {/* Feature highlights */}
// //             <Grid container spacing={3} sx={{ mb: 4 }}>
// //               {features.map((feature, index) => (
// //                 <Grid item xs={12} sm={6} key={index}>
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "flex-start",
// //                       gap: 2,
// //                       p: 3,
// //                       borderRadius: 4,
// //                       bgcolor: "#f8fafc",
// //                       border: "1px solid #e2e8f0",
// //                       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// //                       cursor: "pointer",
// //                       height: "100%",
// //                       "&:hover": {
// //                         bgcolor: "#e0f2fe",
// //                         borderColor: "#0369a1",
// //                         transform: "translateY(-4px)",
// //                         boxShadow: "0 8px 25px rgba(3, 105, 161, 0.15)",
// //                       },
// //                     }}
// //                   >
// //                     <Box
// //                       sx={{
// //                         color: "#0369a1",
// //                         bgcolor: "#dbeafe",
// //                         p: 1.5,
// //                         borderRadius: 3,
// //                         display: "flex",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                         flexShrink: 0,
// //                       }}
// //                     >
// //                       {feature.icon}
// //                     </Box>
// //                     <Box>
// //                       <Typography
// //                         variant="h6"
// //                         fontWeight="600"
// //                         color="#0f172a"
// //                         sx={{ fontSize: "1rem", lineHeight: 1.3, mb: 1 }}
// //                       >
// //                         {feature.title}
// //                       </Typography>
// //                       <Typography variant="body2" color="#64748b" sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
// //                         {feature.description}
// //                       </Typography>
// //                     </Box>
// //                   </Box>
// //                 </Grid>
// //               ))}
// //             </Grid>

// //             <Button
// //               variant="contained"
// //               sx={{
// //                 bgcolor: "#e0f2fe",
// //                 color: "#0369a1",
// //                 px: 6,
// //                 py: 2.5,
// //                 borderRadius: 4,
// //                 fontSize: "1.125rem",
// //                 fontWeight: 600,
// //                 textTransform: "none",
// //                 border: "2px solid #e0f2fe",
// //                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// //                 "&:hover": {
// //                   bgcolor: "#0369a1",
// //                   color: "#ffffff",
// //                   borderColor: "#0369a1",
// //                   transform: "translateY(-2px)",
// //                   boxShadow: "0 8px 25px -8px rgba(3, 105, 161, 0.4)",
// //                 },
// //               }}
// //             >
// //               Start Learning Together
// //             </Button>
// //           </Grid>

// //           {/* Right - Image Carousel */}
// //           <Grid item xs={12} lg={6}>
// //             <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mx: 4 }}>
// //               <Card
// //                 sx={{
// //                   borderRadius: 4,
// //                   overflow: "hidden",
// //                   width: "100%",
// //                   maxWidth: 500,
// //                   aspectRatio: "4/3",
// //                   position: "relative",
// //                   boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
// //                   transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// //                   "&:hover": {
// //                     transform: "translateY(-8px) scale(1.02)",
// //                     boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)",
// //                   },
// //                 }}
// //               >
// //                 {/* Image Container */}
// //                 <Box
// //                   sx={{
// //                     position: "relative",
// //                     width: "100%",
// //                     height: "100%",
// //                     overflow: "hidden",
// //                   }}
// //                 >
// //                   {carouselImages.map((image, index) => (
// //                     <Box
// //                       key={index}
// //                       sx={{
// //                         position: "absolute",
// //                         top: 0,
// //                         left: 0,
// //                         width: "100%",
// //                         height: "100%",
// //                         opacity: index === currentImageIndex ? 1 : 0,
// //                         transform: `translateX(${(index - currentImageIndex) * 100}%)`,
// //                         transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
// //                       }}
// //                     >
// //                       <img
// //                         src={image.src || "/placeholder.svg"}
// //                         alt={image.alt}
// //                         style={{
// //                           width: "100%",
// //                           height: "100%",
// //                           objectFit: "cover",
// //                         }}
// //                       />
// //                       {/* Image overlay with title */}
// //                       <Box
// //                         sx={{
// //                           position: "absolute",
// //                           bottom: 0,
// //                           left: 0,
// //                           right: 0,
// //                           background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
// //                           p: 3,
// //                         }}
// //                       >
// //                         <Typography
// //                           variant="h6"
// //                           sx={{
// //                             color: "#ffffff",
// //                             fontWeight: 600,
// //                             textAlign: "center",
// //                           }}
// //                         >
// //                           {image.title}
// //                         </Typography>
// //                       </Box>
// //                     </Box>
// //                   ))}
// //                 </Box>

// //                 {/* Navigation Arrows */}
// //                 <Box
// //                   sx={{
// //                     position: "absolute",
// //                     top: "50%",
// //                     left: 16,
// //                     transform: "translateY(-50%)",
// //                     zIndex: 2,
// //                   }}
// //                 >
// //                   <Button
// //                     onClick={prevImage}
// //                     sx={{
// //                       minWidth: 40,
// //                       width: 40,
// //                       height: 40,
// //                       borderRadius: "50%",
// //                       bgcolor: "rgba(255, 255, 255, 0.9)",
// //                       color: "#0369a1",
// //                       "&:hover": {
// //                         bgcolor: "#ffffff",
// //                         transform: "scale(1.1)",
// //                       },
// //                     }}
// //                   >
// //                     <ChevronLeft size={20} />
// //                   </Button>
// //                 </Box>

// //                 <Box
// //                   sx={{
// //                     position: "absolute",
// //                     top: "50%",
// //                     right: 16,
// //                     transform: "translateY(-50%)",
// //                     zIndex: 2,
// //                   }}
// //                 >
// //                   <Button
// //                     onClick={nextImage}
// //                     sx={{
// //                       minWidth: 40,
// //                       width: 40,
// //                       height: 40,
// //                       borderRadius: "50%",
// //                       bgcolor: "rgba(255, 255, 255, 0.9)",
// //                       color: "#0369a1",
// //                       "&:hover": {
// //                         bgcolor: "#ffffff",
// //                         transform: "scale(1.1)",
// //                       },
// //                     }}
// //                   >
// //                     <ChevronRight size={20} />
// //                   </Button>
// //                 </Box>

// //                 {/* Dots Indicator */}
// //                 <Box
// //                   sx={{
// //                     position: "absolute",
// //                     bottom: 16,
// //                     left: "50%",
// //                     transform: "translateX(-50%)",
// //                     display: "flex",
// //                     gap: 1,
// //                     zIndex: 2,
// //                   }}
// //                 >
// //                   {carouselImages.map((_, index) => (
// //                     <Box
// //                       key={index}
// //                       onClick={() => setCurrentImageIndex(index)}
// //                       sx={{
// //                         width: 8,
// //                         height: 8,
// //                         borderRadius: "50%",
// //                         bgcolor: index === currentImageIndex ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
// //                         cursor: "pointer",
// //                         transition: "all 0.3s ease",
// //                         "&:hover": {
// //                           bgcolor: "#ffffff",
// //                           transform: "scale(1.2)",
// //                         },
// //                       }}
// //                     />
// //                   ))}
// //                 </Box>
// //               </Card>

// //               {/* Additional Shaped Image */}
// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   top: -40,
// //                   right: -60,
// //                   zIndex: 3,
// //                 }}
// //               >
// //                 <Box
// //                   sx={{
// //                     width: 180,
// //                     height: 180,
// //                     position: "relative",
// //                     clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // Hexagon shape
// //                     bgcolor: "#ffffff",
// //                     p: 0.5,
// //                     boxShadow: "0 8px 32px rgba(3, 105, 161, 0.2)",
// //                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// //                     cursor: "pointer",
// //                     animation: "hexagonFloat 4s ease-in-out infinite",
// //                     "@keyframes hexagonFloat": {
// //                       "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
// //                       "50%": { transform: "translateY(-15px) rotate(5deg)" },
// //                     },
// //                     "&:hover": {
// //                       transform: "scale(1.1) rotate(10deg)",
// //                       boxShadow: "0 12px 40px rgba(3, 105, 161, 0.3)",
// //                     },
// //                   }}
// //                 >
// //                   <Box
// //                     sx={{
// //                       width: "100%",
// //                       height: "100%",
// //                       clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
// //                       overflow: "hidden",
// //                       position: "relative",
// //                     }}
// //                   >
// //                     <img
// //                       src="/placeholder.svg?height=180&width=180&text=Learning+Community"
// //                       alt="Learning community"
// //                       style={{
// //                         width: "100%",
// //                         height: "100%",
// //                         objectFit: "cover",
// //                       }}
// //                     />
// //                     {/* Gradient overlay */}
// //                     <Box
// //                       sx={{
// //                         position: "absolute",
// //                         top: 0,
// //                         left: 0,
// //                         right: 0,
// //                         bottom: 0,
// //                         background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
// //                       }}
// //                     />
// //                   </Box>
// //                 </Box>
// //               </Box>

// //               {/* Circular Shaped Image */}
// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   bottom: -30,
// //                   left: -50,
// //                   zIndex: 2,
// //                 }}
// //               >
// //                 <Box
// //                   sx={{
// //                     width: 140,
// //                     height: 140,
// //                     borderRadius: "50%",
// //                     overflow: "hidden",
// //                     border: "4px solid #ffffff",
// //                     boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
// //                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// //                     animation: "circleFloat 3.5s ease-in-out infinite 1s",
// //                     "@keyframes circleFloat": {
// //                       "0%, 100%": { transform: "translateY(0px)" },
// //                       "50%": { transform: "translateY(-12px)" },
// //                     },
// //                     "&:hover": {
// //                       transform: "scale(1.15)",
// //                       boxShadow: "0 12px 35px rgba(0, 0, 0, 0.2)",
// //                       borderColor: "#2563eb",
// //                     },
// //                   }}
// //                 >
// //                   <img
// //                     src="/placeholder.svg?height=140&width=140&text=Study+Success"
// //                     alt="Study success"
// //                     style={{
// //                       width: "100%",
// //                       height: "100%",
// //                       objectFit: "cover",
// //                     }}
// //                   />
// //                 </Box>
// //               </Box>

// //               {/* Diamond Shaped Image */}
// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   top: "50%",
// //                   right: -80,
// //                   transform: "translateY(-50%)",
// //                   zIndex: 1,
// //                 }}
// //               >
// //                 <Box
// //                   sx={{
// //                     width: 100,
// //                     height: 100,
// //                     transform: "rotate(45deg)",
// //                     overflow: "hidden",
// //                     border: "3px solid #e0f2fe",
// //                     boxShadow: "0 6px 20px rgba(3, 105, 161, 0.15)",
// //                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// //                     animation: "diamondSpin 6s linear infinite",
// //                     "@keyframes diamondSpin": {
// //                       "0%": { transform: "rotate(45deg)" },
// //                       "100%": { transform: "rotate(405deg)" },
// //                     },
// //                     "&:hover": {
// //                       borderColor: "#0369a1",
// //                       boxShadow: "0 8px 30px rgba(3, 105, 161, 0.25)",
// //                       animationPlayState: "paused",
// //                     },
// //                   }}
// //                 >
// //                   <Box
// //                     sx={{
// //                       width: "100%",
// //                       height: "100%",
// //                       transform: "rotate(-45deg) scale(1.4)",
// //                       transformOrigin: "center",
// //                     }}
// //                   >
// //                     <img
// //                       src="/placeholder.svg?height=100&width=100&text=Innovation"
// //                       alt="Innovation in learning"
// //                       style={{
// //                         width: "100%",
// //                         height: "100%",
// //                         objectFit: "cover",
// //                       }}
// //                     />
// //                   </Box>
// //                 </Box>
// //               </Box>

// //               {/* Floating decorative elements */}
// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   top: -20,
// //                   right: -20,
// //                   width: 80,
// //                   height: 80,
// //                   bgcolor: "#dbeafe",
// //                   borderRadius: "50%",
// //                   opacity: 0.8,
// //                   zIndex: 1,
// //                   animation: "float 3s ease-in-out infinite",
// //                   "@keyframes float": {
// //                     "0%, 100%": { transform: "translateY(0px)" },
// //                     "50%": { transform: "translateY(-10px)" },
// //                   },
// //                 }}
// //               />

// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   bottom: -15,
// //                   left: -15,
// //                   width: 60,
// //                   height: 60,
// //                   bgcolor: "#f1f5f9",
// //                   borderRadius: "50%",
// //                   opacity: 0.6,
// //                   zIndex: 1,
// //                   animation: "float 3s ease-in-out infinite 1.5s",
// //                 }}
// //               />
// //             </Box>
// //           </Grid>
// //         </Grid>

// //         {/* Centered Stats Section */}
// //         <Box
// //           sx={{
// //             textAlign: "center",
// //             py: 6,
// //             px: 4,
// //             bgcolor: "#f8fafc",
// //             borderRadius: 6,
// //             border: "1px solid #e2e8f0",
// //             position: "relative",
// //             overflow: "hidden",
// //           }}
// //         >
// //           {/* Background decoration for stats */}
// //           <Box
// //             sx={{
// //               position: "absolute",
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               bottom: 0,
// //               background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
// //               zIndex: 0,
// //             }}
// //           />

// //           <Typography
// //             variant="h4"
// //             fontWeight="bold"
// //             sx={{
// //               color: "#0f172a",
// //               mb: 2,
// //               fontSize: { xs: "1.75rem", md: "2.25rem" },
// //               position: "relative",
// //               zIndex: 1,
// //             }}
// //           >
// //             Our Impact in Numbers
// //           </Typography>

// //           <Typography
// //             variant="body1"
// //             sx={{
// //               color: "#64748b",
// //               mb: 6,
// //               fontSize: { xs: "1rem", md: "1.125rem" },
// //               maxWidth: 600,
// //               mx: "auto",
// //               position: "relative",
// //               zIndex: 1,
// //             }}
// //           >
// //             Join a thriving community of learners achieving their academic goals together
// //           </Typography>

// //           <Grid container spacing={4} justifyContent="center" sx={{ position: "relative", zIndex: 1 }}>
// //             {stats.map((stat, index) => (
// //               <Grid item xs={12} sm={4} key={index}>
// //                 <Box
// //                   sx={{
// //                     p: 4,
// //                     borderRadius: 4,
// //                     bgcolor: "#ffffff",
// //                     border: "2px solid #e0f2fe",
// //                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// //                     cursor: "pointer",
// //                     "&:hover": {
// //                       borderColor: "#0369a1",
// //                       transform: "translateY(-4px)",
// //                       boxShadow: "0 12px 30px rgba(3, 105, 161, 0.15)",
// //                     },
// //                   }}
// //                 >
// //                   <Typography
// //                     variant="h3"
// //                     fontWeight="bold"
// //                     sx={{
// //                       color: "#0369a1",
// //                       fontSize: { xs: "2.5rem", md: "3rem" },
// //                       mb: 1,
// //                       lineHeight: 1,
// //                     }}
// //                   >
// //                     {stat.number}
// //                   </Typography>
// //                   <Typography
// //                     variant="h6"
// //                     fontWeight="600"
// //                     sx={{
// //                       color: "#0f172a",
// //                       mb: 1,
// //                       fontSize: { xs: "1.125rem", md: "1.25rem" },
// //                     }}
// //                   >
// //                     {stat.label}
// //                   </Typography>
// //                   <Typography
// //                     variant="body2"
// //                     sx={{
// //                       color: "#64748b",
// //                       fontSize: "0.95rem",
// //                     }}
// //                   >
// //                     {stat.description}
// //                   </Typography>
// //                 </Box>
// //               </Grid>
// //             ))}
// //           </Grid>
// //         </Box>
// //       </Container>
// //     </Box>
// //   )
// // }

// // export default AboutSection


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Box, Typography, Button, Grid, Card, Container } from "@mui/material"
// import { Users, BookOpen, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react"

// const AboutSection: React.FC = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)

//   // Image carousel data
//   const carouselImages = [
//     {
//       src: "/placeholder.svg?height=500&width=600&text=Students+Collaborating",
//       alt: "Students collaborating in study groups",
//       title: "Collaborative Learning",
//     },
//     {
//       src: "/placeholder.svg?height=500&width=600&text=Study+Groups+Meeting",
//       alt: "Study groups meeting online",
//       title: "Study Groups",
//     },
//     {
//       src: "/placeholder.svg?height=500&width=600&text=Academic+Success",
//       alt: "Students achieving academic success",
//       title: "Academic Success",
//     },
//   ]

//   // Auto-advance carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
//     }, 4000) // Change image every 4 seconds

//     return () => clearInterval(interval)
//   }, [carouselImages.length])

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
//   }

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
//   }

//   const features = [
//     {
//       icon: <Users size={28} />,
//       title: "Collaborative Learning",
//       description: "Connect with peers worldwide and learn together",
//     },
//     {
//       icon: <BookOpen size={28} />,
//       title: "Smart Study Plans",
//       description: "AI-powered personalized learning schedules",
//     },
//     {
//       icon: <Target size={28} />,
//       title: "Goal Tracking",
//       description: "Monitor and achieve your learning objectives",
//     },
//     {
//       icon: <Zap size={28} />,
//       title: "Real-time Editing",
//       description: "Collaborate on documents instantly with peers",
//     },
//   ]

//   const stats = [
//     {
//       number: "15,000+",
//       label: "Active Students",
//       description: "Learning together daily",
//     },
//     {
//       number: "850+",
//       label: "Study Groups",
//       description: "Across all subjects",
//     },
//     {
//       number: "98%",
//       label: "Success Rate",
//       description: "Students achieving goals",
//     },
//   ]

//   return (
//     <Box
//       component="section"
//       id="about"
//       sx={{
//         py: { xs: 8, lg: 12 },
//         bgcolor: "#ffffff",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Background decoration */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(148, 163, 184, 0.03) 100%)",
//           zIndex: 0,
//         }}
//       />

//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
//         {/* Centered Big Title */}
//         <Box textAlign="center" sx={{ mb: 8 }}>
//           <Typography
//             variant="h2"
//             fontWeight="bold"
//             sx={{
//               color: "#0f172a",
//               fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
//               mb: 3,
//               lineHeight: 1.1,
//               background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               textAlign: "center",
//             }}
//           >
//             About Us
//           </Typography>

//           <Typography
//             variant="h5"
//             sx={{
//               color: "#475569",
//               fontSize: { xs: "1.25rem", md: "1.5rem" },
//               fontWeight: 400,
//               maxWidth: 800,
//               mx: "auto",
//               lineHeight: 1.4,
//             }}
//           >
//             Revolutionizing Education Through{" "}
//             <Box component="span" sx={{ color: "#2563eb", fontWeight: 600 }}>
//               Collaborative Learning
//             </Box>
//           </Typography>
//         </Box>

//         {/* Main Content */}
//         <Grid container spacing={6} alignItems="flex-start" sx={{ mb: 10 }}>
//           {/* Left Content */}
//           <Grid item xs={12} lg={5}>
//             <Typography
//               variant="body1"
//               sx={{
//                 color: "#475569",
//                 mb: 4,
//                 lineHeight: 1.7,
//                 fontSize: { xs: "1.1rem", md: "1.25rem" },
//               }}
//             >
//               Our platform transforms the way students learn by fostering collaboration, enabling real-time document
//               editing, and providing AI-powered study plans. Join thousands of learners who are already experiencing the
//               future of education.
//             </Typography>

//             {/* Feature highlights */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               {features.map((feature, index) => (
//                 <Grid item xs={12} sm={6} key={index}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "flex-start",
//                       gap: 2,
//                       p: 3,
//                       borderRadius: 4,
//                       bgcolor: "#f8fafc",
//                       border: "1px solid #e2e8f0",
//                       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                       cursor: "pointer",
//                       height: "100%",
//                       "&:hover": {
//                         bgcolor: "#e0f2fe",
//                         borderColor: "#0369a1",
//                         transform: "translateY(-4px)",
//                         boxShadow: "0 8px 25px rgba(3, 105, 161, 0.15)",
//                       },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         color: "#0369a1",
//                         bgcolor: "#dbeafe",
//                         p: 1.5,
//                         borderRadius: 3,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexShrink: 0,
//                       }}
//                     >
//                       {feature.icon}
//                     </Box>
//                     <Box>
//                       <Typography
//                         variant="h6"
//                         fontWeight="600"
//                         color="#0f172a"
//                         sx={{ fontSize: "1rem", lineHeight: 1.3, mb: 1 }}
//                       >
//                         {feature.title}
//                       </Typography>
//                       <Typography variant="body2" color="#64748b" sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
//                         {feature.description}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>

//             <Button
//               variant="contained"
//               sx={{
//                 bgcolor: "#e0f2fe",
//                 color: "#0369a1",
//                 px: 6,
//                 py: 2.5,
//                 borderRadius: 4,
//                 fontSize: "1.125rem",
//                 fontWeight: 600,
//                 textTransform: "none",
//                 border: "2px solid #e0f2fe",
//                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                 "&:hover": {
//                   bgcolor: "#0369a1",
//                   color: "#ffffff",
//                   borderColor: "#0369a1",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 8px 25px -8px rgba(3, 105, 161, 0.4)",
//                 },
//               }}
//             >
//               Start Learning Together
//             </Button>
//           </Grid>

//           {/* Right Side - Carousel and Shaped Images */}
//           <Grid item xs={12} lg={7}>
//             <Box sx={{ position: "relative", height: "100%", minHeight: 600 }}>
//               {/* Main Carousel - Center */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 2,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     borderRadius: 4,
//                     overflow: "hidden",
//                     width: 350,
//                     aspectRatio: "4/3",
//                     position: "relative",
//                     boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     "&:hover": {
//                       transform: "translate(-50%, -50%) translateY(-8px) scale(1.02)",
//                       boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)",
//                     },
//                   }}
//                 >
//                   {/* Image Container */}
//                   <Box
//                     sx={{
//                       position: "relative",
//                       width: "100%",
//                       height: "100%",
//                       overflow: "hidden",
//                     }}
//                   >
//                     {carouselImages.map((image, index) => (
//                       <Box
//                         key={index}
//                         sx={{
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           width: "100%",
//                           height: "100%",
//                           opacity: index === currentImageIndex ? 1 : 0,
//                           transform: `translateX(${(index - currentImageIndex) * 100}%)`,
//                           transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
//                         }}
//                       >
//                         <img
//                           src={image.src || "/placeholder.svg"}
//                           alt={image.alt}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                         {/* Image overlay with title */}
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
//                             p: 3,
//                           }}
//                         >
//                           <Typography
//                             variant="h6"
//                             sx={{
//                               color: "#ffffff",
//                               fontWeight: 600,
//                               textAlign: "center",
//                             }}
//                           >
//                             {image.title}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     ))}
//                   </Box>

//                   {/* Navigation Arrows */}
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "50%",
//                       left: 16,
//                       transform: "translateY(-50%)",
//                       zIndex: 2,
//                     }}
//                   >
//                     <Button
//                       onClick={prevImage}
//                       sx={{
//                         minWidth: 40,
//                         width: 40,
//                         height: 40,
//                         borderRadius: "50%",
//                         bgcolor: "rgba(255, 255, 255, 0.9)",
//                         color: "#0369a1",
//                         "&:hover": {
//                           bgcolor: "#ffffff",
//                           transform: "scale(1.1)",
//                         },
//                       }}
//                     >
//                       <ChevronLeft size={20} />
//                     </Button>
//                   </Box>

//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "50%",
//                       right: 16,
//                       transform: "translateY(-50%)",
//                       zIndex: 2,
//                     }}
//                   >
//                     <Button
//                       onClick={nextImage}
//                       sx={{
//                         minWidth: 40,
//                         width: 40,
//                         height: 40,
//                         borderRadius: "50%",
//                         bgcolor: "rgba(255, 255, 255, 0.9)",
//                         color: "#0369a1",
//                         "&:hover": {
//                           bgcolor: "#ffffff",
//                           transform: "scale(1.1)",
//                         },
//                       }}
//                     >
//                       <ChevronRight size={20} />
//                     </Button>
//                   </Box>

//                   {/* Dots Indicator */}
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       bottom: 16,
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       display: "flex",
//                       gap: 1,
//                       zIndex: 2,
//                     }}
//                   >
//                     {carouselImages.map((_, index) => (
//                       <Box
//                         key={index}
//                         onClick={() => setCurrentImageIndex(index)}
//                         sx={{
//                           width: 8,
//                           height: 8,
//                           borderRadius: "50%",
//                           bgcolor: index === currentImageIndex ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
//                           cursor: "pointer",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             bgcolor: "#ffffff",
//                             transform: "scale(1.2)",
//                           },
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 </Card>
//               </Box>

//               {/* Hexagon Shape - Top Right */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 20,
//                   right: 20,
//                   zIndex: 3,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 160,
//                     height: 160,
//                     position: "relative",
//                     clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//                     bgcolor: "#ffffff",
//                     p: 0.5,
//                     boxShadow: "0 8px 32px rgba(3, 105, 161, 0.2)",
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     cursor: "pointer",
//                     animation: "hexagonFloat 4s ease-in-out infinite",
//                     "@keyframes hexagonFloat": {
//                       "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
//                       "50%": { transform: "translateY(-15px) rotate(5deg)" },
//                     },
//                     "&:hover": {
//                       transform: "scale(1.1) rotate(10deg)",
//                       boxShadow: "0 12px 40px rgba(3, 105, 161, 0.3)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: "100%",
//                       clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//                       overflow: "hidden",
//                       position: "relative",
//                     }}
//                   >
//                     <img
//                       src="/placeholder.svg?height=160&width=160&text=Learning+Community"
//                       alt="Learning community"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Circle Shape - Bottom Right */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   bottom: 40,
//                   right: 40,
//                   zIndex: 2,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 140,
//                     height: 140,
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     border: "4px solid #ffffff",
//                     boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
//                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                     animation: "circleFloat 3.5s ease-in-out infinite 1s",
//                     "@keyframes circleFloat": {
//                       "0%, 100%": { transform: "translateY(0px)" },
//                       "50%": { transform: "translateY(-12px)" },
//                     },
//                     "&:hover": {
//                       transform: "scale(1.15)",
//                       boxShadow: "0 12px 35px rgba(0, 0, 0, 0.2)",
//                       borderColor: "#2563eb",
//                     },
//                   }}
//                 >
//                   <img
//                     src="/placeholder.svg?height=140&width=140&text=Study+Success"
//                     alt="Study success"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </Box>
//               </Box>

//               {/* Diamond Shape - Top Left */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 80,
//                   left: 20,
//                   zIndex: 1,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 100,
//                     height: 100,
//                     transform: "rotate(45deg)",
//                     overflow: "hidden",
//                     border: "3px solid #e0f2fe",
//                     boxShadow: "0 6px 20px rgba(3, 105, 161, 0.15)",
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     animation: "diamondSpin 6s linear infinite",
//                     "@keyframes diamondSpin": {
//                       "0%": { transform: "rotate(45deg)" },
//                       "100%": { transform: "rotate(405deg)" },
//                     },
//                     "&:hover": {
//                       borderColor: "#0369a1",
//                       boxShadow: "0 8px 30px rgba(3, 105, 161, 0.25)",
//                       animationPlayState: "paused",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: "100%",
//                       transform: "rotate(-45deg) scale(1.4)",
//                       transformOrigin: "center",
//                     }}
//                   >
//                     <img
//                       src="/placeholder.svg?height=100&width=100&text=Innovation"
//                       alt="Innovation in learning"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Triangle Shape - Bottom Left */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   bottom: 20,
//                   left: 60,
//                   zIndex: 1,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 120,
//                     height: 120,
//                     clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
//                     bgcolor: "#ffffff",
//                     p: 0.5,
//                     boxShadow: "0 6px 20px rgba(3, 105, 161, 0.15)",
//                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                     animation: "triangleBounce 3s ease-in-out infinite 2s",
//                     "@keyframes triangleBounce": {
//                       "0%, 100%": { transform: "translateY(0px)" },
//                       "50%": { transform: "translateY(-10px)" },
//                     },
//                     "&:hover": {
//                       transform: "scale(1.1)",
//                       boxShadow: "0 10px 30px rgba(3, 105, 161, 0.25)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: "100%",
//                       clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
//                       overflow: "hidden",
//                       position: "relative",
//                     }}
//                   >
//                     <img
//                       src="/placeholder.svg?height=120&width=120&text=Growth"
//                       alt="Academic growth"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Floating decorative elements */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 200,
//                   right: 0,
//                   width: 60,
//                   height: 60,
//                   bgcolor: "#dbeafe",
//                   borderRadius: "50%",
//                   opacity: 0.8,
//                   zIndex: 1,
//                   animation: "float 3s ease-in-out infinite",
//                   "@keyframes float": {
//                     "0%, 100%": { transform: "translateY(0px)" },
//                     "50%": { transform: "translateY(-10px)" },
//                   },
//                 }}
//               />

//               <Box
//                 sx={{
//                   position: "absolute",
//                   bottom: 150,
//                   left: 0,
//                   width: 40,
//                   height: 40,
//                   bgcolor: "#f1f5f9",
//                   borderRadius: "50%",
//                   opacity: 0.6,
//                   zIndex: 1,
//                   animation: "float 3s ease-in-out infinite 1.5s",
//                 }}
//               />
//             </Box>
//           </Grid>
//         </Grid>

//         {/* Centered Stats Section */}
//         <Box
//           sx={{
//             textAlign: "center",
//             py: 6,
//             px: 4,
//             bgcolor: "#f8fafc",
//             borderRadius: 6,
//             border: "1px solid #e2e8f0",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           {/* Background decoration for stats */}
//           <Box
//             sx={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
//               zIndex: 0,
//             }}
//           />

//           <Typography
//             variant="h4"
//             fontWeight="bold"
//             sx={{
//               color: "#0f172a",
//               mb: 2,
//               fontSize: { xs: "1.75rem", md: "2.25rem" },
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             Our Impact in Numbers
//           </Typography>

//           <Typography
//             variant="body1"
//             sx={{
//               color: "#64748b",
//               mb: 6,
//               fontSize: { xs: "1rem", md: "1.125rem" },
//               maxWidth: 600,
//               mx: "auto",
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             Join a thriving community of learners achieving their academic goals together
//           </Typography>

//           <Grid container spacing={4} justifyContent="center" sx={{ position: "relative", zIndex: 1 }}>
//             {stats.map((stat, index) => (
//               <Grid item xs={12} sm={4} key={index}>
//                 <Box
//                   sx={{
//                     p: 4,
//                     borderRadius: 4,
//                     bgcolor: "#ffffff",
//                     border: "2px solid #e0f2fe",
//                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                     cursor: "pointer",
//                     "&:hover": {
//                       borderColor: "#0369a1",
//                       transform: "translateY(-4px)",
//                       boxShadow: "0 12px 30px rgba(3, 105, 161, 0.15)",
//                     },
//                   }}
//                 >
//                   <Typography
//                     variant="h3"
//                     fontWeight="bold"
//                     sx={{
//                       color: "#0369a1",
//                       fontSize: { xs: "2.5rem", md: "3rem" },
//                       mb: 1,
//                       lineHeight: 1,
//                     }}
//                   >
//                     {stat.number}
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     fontWeight="600"
//                     sx={{
//                       color: "#0f172a",
//                       mb: 1,
//                       fontSize: { xs: "1.125rem", md: "1.25rem" },
//                     }}
//                   >
//                     {stat.label}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: "#64748b",
//                       fontSize: "0.95rem",
//                     }}
//                   >
//                     {stat.description}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Container>
//     </Box>
//   )
// }

// export default AboutSection


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography, Button, Grid, Card, Container } from "@mui/material"
import { Users, BookOpen, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react"

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
        {/* Centered Big Title */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "#0f172a",
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
              mb: 3,
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            About Us
          </Typography>

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
            <Box component="span" sx={{ color: "#2563eb", fontWeight: 600 }}>
              Collaborative Learning
            </Box>
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={6} alignItems="flex-start" sx={{ mb: 10 }}>
          {/* Left Content */}
          <Grid item xs={12} lg={5}>
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
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#e0f2fe",
                color: "#0369a1",
                px: 6,
                py: 2.5,
                borderRadius: 4,
                fontSize: "1.125rem",
                fontWeight: 600,
                textTransform: "none",
                border: "2px solid #e0f2fe",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "#0369a1",
                  color: "#ffffff",
                  borderColor: "#0369a1",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px -8px rgba(3, 105, 161, 0.4)",
                },
              }}
            >
              Start Learning Together
            </Button>
          </Grid>

          {/* Right Side - Carousel and Shaped Images */}
          <Grid item xs={12} lg={7}>
            <Box sx={{ position: "relative", height: "100%", minHeight: 650 }}>
              {/* Main Carousel - Center */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    width: 380,
                    aspectRatio: "4/3",
                    position: "relative",
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                    transition: "box-shadow 0.3s ease", // Only animate shadow, not transform
                    "&:hover": {
                      boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)",
                    },
                  }}
                >
                  {/* Image Container */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: index === currentImageIndex ? 1 : 0,
                          transition: "opacity 0.6s ease", // Simplified transition
                        }}
                      >
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {/* Image overlay with title */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                            p: 3,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#ffffff",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            {image.title}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Navigation Arrows */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 16,
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <Button
                      onClick={prevImage}
                      sx={{
                        minWidth: 40,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        color: "#0369a1",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#ffffff",
                          transform: "translateY(-50%) scale(1.1)",
                        },
                      }}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 16,
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <Button
                      onClick={nextImage}
                      sx={{
                        minWidth: 40,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        color: "#0369a1",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#ffffff",
                          transform: "translateY(-50%) scale(1.1)",
                        },
                      }}
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </Box>

                  {/* Dots Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 1,
                      zIndex: 2,
                    }}
                  >
                    {carouselImages.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: index === currentImageIndex ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "#ffffff",
                            transform: "scale(1.2)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Card>
              </Box>

              {/* Hexagon Shape - Top Center */}
              <Box
                sx={{
                  position: "absolute",
                  top: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 3,
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    position: "relative",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    bgcolor: "#ffffff",
                    p: 0.5,
                    boxShadow: "0 8px 32px rgba(3, 105, 161, 0.2)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    animation: "hexagonFloat 4s ease-in-out infinite",
                    "@keyframes hexagonFloat": {
                      "0%, 100%": { transform: "translateX(-50%) translateY(0px) rotate(0deg)" },
                      "50%": { transform: "translateX(-50%) translateY(-15px) rotate(5deg)" },
                    },
                    "&:hover": {
                      transform: "translateX(-50%) scale(1.1) rotate(10deg)",
                      boxShadow: "0 12px 40px rgba(3, 105, 161, 0.3)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src="/placeholder.svg?height=200&width=200&text=Learning+Community"
                      alt="Learning community"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Circle Shape - Bottom Center */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 3,
                }}
              >
                <Box
                  sx={{
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "4px solid #ffffff",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: "circleFloat 3.5s ease-in-out infinite 1s",
                    "@keyframes circleFloat": {
                      "0%, 100%": { transform: "translateX(-50%) translateY(0px)" },
                      "50%": { transform: "translateX(-50%) translateY(-12px)" },
                    },
                    "&:hover": {
                      transform: "translateX(-50%) scale(1.15)",
                      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.2)",
                      borderColor: "#2563eb",
                    },
                  }}
                >
                  <img
                    src="/placeholder.svg?height=180&width=180&text=Study+Success"
                    alt="Study success"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>

              {/* Diamond Shape - Left Center */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 40,
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    width: 130,
                    height: 130,
                    transform: "rotate(45deg)",
                    overflow: "hidden",
                    border: "3px solid #e0f2fe",
                    boxShadow: "0 6px 20px rgba(3, 105, 161, 0.15)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: "diamondSpin 6s linear infinite",
                    "@keyframes diamondSpin": {
                      "0%": { transform: "translateY(-50%) rotate(45deg)" },
                      "100%": { transform: "translateY(-50%) rotate(405deg)" },
                    },
                    "&:hover": {
                      borderColor: "#0369a1",
                      boxShadow: "0 8px 30px rgba(3, 105, 161, 0.25)",
                      animationPlayState: "paused",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      transform: "rotate(-45deg) scale(1.4)",
                      transformOrigin: "center",
                    }}
                  >
                    <img
                      src="/placeholder.svg?height=130&width=130&text=Innovation"
                      alt="Innovation in learning"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Triangle Shape - Right Center */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 40,
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    bgcolor: "#ffffff",
                    p: 0.5,
                    boxShadow: "0 6px 20px rgba(3, 105, 161, 0.15)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: "triangleBounce 3s ease-in-out infinite 2s",
                    "@keyframes triangleBounce": {
                      "0%, 100%": { transform: "translateY(-50%) translateX(0px)" },
                      "50%": { transform: "translateY(-50%) translateX(-10px)" },
                    },
                    "&:hover": {
                      transform: "translateY(-50%) scale(1.1)",
                      boxShadow: "0 10px 30px rgba(3, 105, 161, 0.25)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src="/placeholder.svg?height=150&width=150&text=Growth"
                      alt="Academic growth"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Floating decorative elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: 150,
                  right: 10,
                  width: 50,
                  height: 50,
                  bgcolor: "#dbeafe",
                  borderRadius: "50%",
                  opacity: 0.8,
                  zIndex: 1,
                  animation: "float 3s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                  },
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 200,
                  left: 10,
                  width: 35,
                  height: 35,
                  bgcolor: "#f1f5f9",
                  borderRadius: "50%",
                  opacity: 0.6,
                  zIndex: 1,
                  animation: "float 3s ease-in-out infinite 1.5s",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Centered Stats Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 4,
            bgcolor: "#f8fafc",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration for stats */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
              zIndex: 0,
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#0f172a",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              position: "relative",
              zIndex: 1,
            }}
          >
            Our Impact in Numbers
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              mb: 6,
              fontSize: { xs: "1rem", md: "1.125rem" },
              maxWidth: 600,
              mx: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            Join a thriving community of learners achieving their academic goals together
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ position: "relative", zIndex: 1 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                    border: "2px solid #e0f2fe",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#0369a1",
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 30px rgba(3, 105, 161, 0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      color: "#0369a1",
                      fontSize: { xs: "2.5rem", md: "3rem" },
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                      color: "#0f172a",
                      mb: 1,
                      fontSize: { xs: "1.125rem", md: "1.25rem" },
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.95rem",
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default AboutSection
