import React from "react";
import { Box, Typography, Button } from "@mui/material";

function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        background: "linear-gradient(135deg, #eff6ff 0%, #fff 100%)",
        py: { xs: 8, lg: 12 },
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
        <Box textAlign="center">
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: 1,
              bgcolor: "#dbeafe",
              color: "#2563eb",
              borderRadius: "999px",
              fontSize: 15,
              fontWeight: 500,
              mb: 4,
            }}
          >
            find a group
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h2"
            fontWeight="bold"
            color="#1e293b"
            gutterBottom
            sx={{
              fontSize: { xs: "2.25rem", md: "3rem", lg: "3.75rem" },
              mb: 3,
              lineHeight: 1.15,
            }}
          >
            Getting Quality Education
            <br />
            <Box component="span" sx={{ color: "#2563eb" }}>
              is now more Easy
            </Box>
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h6"
            color="#64748b"
            sx={{
              mb: 4,
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              lineHeight: 1.7,
            }}
          >
            It is a long established fact that a reader will be distracted by the readable content of a page when looking
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#2563eb",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                fontSize: "1.125rem",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#1e40af" },
              }}
            >
              Create a Group
            </Button>
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
              Join for a Group
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;