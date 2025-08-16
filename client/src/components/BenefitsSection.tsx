// import React, { useState } from "react";
// import { Grid, Box, Typography } from "@mui/material";
// import DescriptionIcon from "@mui/icons-material/Description";
// import GroupIcon from "@mui/icons-material/Group";
// import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
// import SettingsIcon from "@mui/icons-material/Settings";

// function BenefitsSection() {
//   const benefits = [
//     {
//       icon: <DescriptionIcon sx={{ fontSize: 40, color: "#fff" }} />,
//       title: "Study Plan Generator",
//       description:
//         "Automatically create personalized study schedules based on your goals, subjects, and available time.",
//       color: "#1976d2",
//     },
//     {
//       icon: <GroupIcon sx={{ fontSize: 40, color: "#fff" }} />,
//       title: "Collaborative Document Editing",
//       description:
//         "Work on the same notes or assignments with your peers in real-time, just like Google Docs.",
//       color: "#388e3c",
//     },
//     {
//       icon: <QuestionAnswerIcon sx={{ fontSize: 40, color: "#fff" }} />,
//       title: "Document Querying",
//       description:
//         "Ask questions directly from your uploaded notes and get instant AI-powered answers.",
//       color: "#fbc02d",
//     },
//     {
//       icon: <SettingsIcon sx={{ fontSize: 40, color: "#fff" }} />,
//       title: "Manage Study Groups",
//       description:
//         "Easily create and manage study groups, schedule sessions, and track progress together.",
//       color: "#d32f2f",
//     },
//   ];

//   // Track which card is flipped (for tap support on mobile)
//   const [flipped, setFlipped] = useState<number | null>(null);

//   const handleFlip = (index: number) => {
//     setFlipped(flipped === index ? null : index);
//   };

//   return (
//     <Box component="section" id="features" sx={{ py: { xs: 6, md: 10 }, bgcolor: "#fafafa" }}>
//       <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
//         {/* Section Header */}
//         <Box textAlign="center" mb={6}>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             Benefits from Us
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary" maxWidth={600} mx="auto">
//             Explore how our platform helps you learn smarter, collaborate better, and achieve your academic goals.
//           </Typography>
//         </Box>

//         {/* Benefits Grid */}
//         <Grid container spacing={4} justifyContent="center">
//           {benefits.map((benefit, index) => (
//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={3}
//               key={index}
//               sx={{ display: "flex", justifyContent: "center" }}
//             >
//               <Box
//                 onClick={() => handleFlip(index)}
//                 sx={{
//                   perspective: "1000px",
//                   width: 260,
//                   height: 260,
//                   cursor: "pointer",
//                   "&:hover": {
//                     filter: "brightness(1.05)",
//                   },
//                   "&:active": {
//                     filter: "brightness(1.15)",
//                     transform: "scale(1.03)",
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     position: "relative",
//                     width: "100%",
//                     height: "100%",
//                     transition: "transform 0.8s",
//                     transformStyle: "preserve-3d",
//                     transform:
//                       flipped === index ? "rotateY(180deg)" : "rotateY(0deg)",
//                   }}
//                 >
//                   {/* Front Side */}
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       width: "100%",
//                       height: "100%",
//                       backfaceVisibility: "hidden",
//                       bgcolor: "#fff",
//                       borderRadius: 3,
//                       boxShadow: 4,
//                       p: 3,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       transition: "all 0.3s ease-in-out",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         bgcolor: benefit.color,
//                         borderRadius: "50%",
//                         width: 64,
//                         height: 64,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         mb: 2,
//                         transition: "transform 0.3s ease",
//                         "&:hover": {
//                           transform: "scale(1.1)",
//                         },
//                       }}
//                     >
//                       {benefit.icon}
//                     </Box>
//                     <Typography variant="h6" fontWeight="bold">
//                       {benefit.title}
//                     </Typography>
//                   </Box>

//                   {/* Back Side */}
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       width: "100%",
//                       height: "100%",
//                       backfaceVisibility: "hidden",
//                       bgcolor: "#f5f5f5",
//                       borderRadius: 3,
//                       boxShadow: 4,
//                       p: 3,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       transform: "rotateY(180deg)",
//                       transition: "all 0.3s ease-in-out",
//                     }}
//                   >
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       textAlign="center"
//                     >
//                       {benefit.description}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

// export default BenefitsSection;


"use client"

import { useState } from "react"
import { Grid, Box, Typography } from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import GroupIcon from "@mui/icons-material/Group"
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer"
import SettingsIcon from "@mui/icons-material/Settings"

function BenefitsSection() {
  const benefits = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 40, color: "#0369A1" }} />,
      title: "Study Plan Generator",
      description:
        "Automatically create personalized study schedules based on your goals, subjects, and available time.",
      lightColor: "#E0F2FE", // Light blue
      darkColor: "#0369A1", // Dark blue
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: "#0284C7" }} />,
      title: "Collaborative Document Editing",
      description: "Work on the same notes or assignments with your peers in real-time, just like Google Docs.",
      lightColor: "#F0F9FF", // Very light blue
      darkColor: "#0284C7", // Medium blue
    },
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 40, color: "#1D4ED8" }} />,
      title: "Document Querying",
      description: "Ask questions directly from your uploaded notes and get instant AI-powered answers.",
      lightColor: "#EFF6FF", // Light blue tint
      darkColor: "#1D4ED8", // Blue
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40, color: "#1E40AF" }} />,
      title: "Manage Study Groups",
      description: "Easily create and manage study groups, schedule sessions, and track progress together.",
      lightColor: "#DBEAFE", // Light blue
      darkColor: "#1E40AF", // Dark blue
    },
  ]

  // Track which card is flipped (for tap support on mobile)
  const [flipped, setFlipped] = useState<number | null>(null)

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index)
  }

  return (
    <Box
      component="section"
      id="features"
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

      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, position: "relative", zIndex: 1 }}>
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
            Benefits from Us
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
            Explore how our platform helps you learn smarter, collaborate better, and achieve your academic goals.
          </Typography>
        </Box>

        {/* Benefits Grid */}
        <Grid container spacing={4} justifyContent="center">
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                onClick={() => handleFlip(index)}
                sx={{
                  perspective: "1000px",
                  width: 260,
                  height: 260,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    filter: "brightness(1.05)",
                    transform: "translateY(-4px)",
                  },
                  "&:active": {
                    filter: "brightness(1.15)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.8s",
                    transformStyle: "preserve-3d",
                    transform: flipped === index ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front Side */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      bgcolor: "#ffffff",
                      borderRadius: 4,
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      border: "1px solid #f1f5f9", // Light border
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        borderColor: "#e2e8f0",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: benefit.lightColor, // Light color background
                        borderRadius: "50%",
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        border: `2px solid ${benefit.darkColor}20`, // Subtle border
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="#0f172a" // Very dark blue/navy
                      textAlign="center"
                      sx={{
                        fontSize: "1.125rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {benefit.title}
                    </Typography>
                  </Box>

                  {/* Back Side */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      bgcolor: benefit.lightColor, // Light themed background
                      borderRadius: 4,
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      border: `2px solid ${benefit.darkColor}30`, // Themed border
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "rotateY(180deg)",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={benefit.darkColor} // Dark themed text
                      textAlign="center"
                      sx={{
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default BenefitsSection
