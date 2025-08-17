// import React from "react";
// import { Box, Grid, Typography, Button, Paper } from "@mui/material";

// function AboutSection() {
//   return (
//     <Box
//       component="section"
//       id="about"
//       sx={{
//         py: { xs: 8, md: 12 },
//         //bgcolor: "linear-gradient(to right, #2563eb, #1e40af)",
//         background: "linear-gradient(to right, #2563eb, #1e40af)",
//       }}
//     >
//       <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
//         <Grid container spacing={6} alignItems="center">
//           {/* Content */}
//           <Grid item xs={12} md={6}>
//             <Typography
//               variant="h3"
//               fontWeight="bold"
//               color="common.white"
//               gutterBottom
//               sx={{ mb: 3, lineHeight: 1.2 }}
//             >
//               We are Always Ensure Best ways for your learning
//             </Typography>
//             <Typography
//               variant="body1"
//               color="#c7d2fe"
//               sx={{ mb: 4, fontSize: "1.125rem", lineHeight: 1.7 }}
//             >
//               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
//               industry's standard dummy text ever since the 1500s.
//             </Typography>
//             <Button
//               variant="contained"
//               sx={{
//                 bgcolor: "#fff",
//                 color: "#2563eb",
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: "999px",
//                 fontSize: "1.125rem",
//                 fontWeight: 500,
//                 boxShadow: "none",
//                 "&:hover": {
//                   bgcolor: "#f3f4f6",
//                   color: "#1e40af",
//                 },
//               }}
//             >
//               Join Us Free
//             </Button>
//           </Grid>

//           {/* Image */}
//           <Grid item xs={12} md={6} sx={{ position: "relative" }}>
//             <Paper
//               elevation={4}
//               sx={{
//                 borderRadius: 4,
//                 overflow: "hidden",
//                 aspectRatio: "1 / 1",
//                 width: "100%",
//                 maxWidth: 400,
//                 mx: "auto",
//                 position: "relative",
//               }}
//             >
//               <img
//                 src="https://via.placeholder.com/400x400/FBBF24/FFFFFF?text=Learning+Together"
//                 alt="Students learning together"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             </Paper>
//             {/* Decorative elements */}
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: -32,
//                 right: -32,
//                 width: 96,
//                 height: 96,
//                 bgcolor: "#fbbf24",
//                 borderRadius: "50%",
//                 opacity: 0.8,
//                 zIndex: 1,
//               }}
//             />
//             <Box
//               sx={{
//                 position: "absolute",
//                 bottom: -16,
//                 left: -16,
//                 width: 64,
//                 height: 64,
//                 bgcolor: "#fff",
//                 borderRadius: "50%",
//                 opacity: 0.2,
//                 zIndex: 1,
//               }}
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

// export default AboutSection;

import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const AboutSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 8, lg: 12 },
        background: "linear-gradient(to right, #ffffff, #e3f2fd)", // white to light blue
        color: "#0d47a1", // dark blue text
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Content */}
          <Grid item xs={12} lg={6}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 3,
                lineHeight: "tight",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              We Always Ensure the Best Ways for Your Learning
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#37474f", // blue-grey-800
                mb: 4,
                lineHeight: "relaxed",
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1976d2", // blue-600
                color: "white",
                "&:hover": { bgcolor: "#1565c0" }, // blue-700
                px: 4,
                py: 1.5,
                borderRadius: 9999,
                fontSize: "1.125rem",
                fontWeight: "medium",
              }}
            >
              Join Us Free
            </Button>
          </Grid>

          {/* Image */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  borderRadius: 4,
                }}
              >
                <img
                  src="https://via.placeholder.com/400x400/FBBF24/FFFFFF?text=Learning+Together"
                  alt="Students learning together"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              {/* Decorative elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  width: 96,
                  height: 96,
                  bgcolor: "#bbdefb", // light blue circle
                  borderRadius: "50%",
                  opacity: 0.7,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -16,
                  left: -16,
                  width: 64,
                  height: 64,
                  bgcolor: "#e3f2fd", // lightest blue
                  borderRadius: "50%",
                  opacity: 0.3,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AboutSection;
