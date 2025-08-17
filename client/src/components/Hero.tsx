import React from "react";
import { Box, Typography, useTheme,Button } from "@mui/material";
import SearchBar from "./SearchBar";
import { assets } from "../assets/assets";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        px: { xs: 3, md: 0 },
        pt: { xs: 10, md: 18 },
        pb: 5,
        background: "linear-gradient(to bottom, rgba(207, 250, 254, 0.7), #fff)",
        position: "relative",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        color="text.primary"
        sx={{ mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
      >
        Welcome Back Student!
        <Box
          component="img"
          src={assets.sketch}
          alt="sketch"
          sx={{
          display: { xs: "none", md: "block" },
          height: 48,
          my: 2,
          mx: "auto",
        }}
        />
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: { xs: "90%", md: "700px" },
          mx: "auto",
          mb: 2,
        }}
      >
        Your personalized dashboard helps you track your progress, access course
        materials, join discussions, and manage your study plans—all in one place.
      </Typography>

      <Box mt={3}  display="flex" justifyContent="center">
        <SearchBar />
      </Box>

      <Box display="flex" gap={2} mt={3} justifyContent="center">
      <Button
              variant="contained"
              sx={{
                bgcolor: "primary",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                fontSize: "1.125rem",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "primary" },
              }}
            >
              Create a Group
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "primary",
                color: "primary",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                fontSize: "1.125rem",
                fontWeight: 500,
                textTransform: "none",
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "#e0e7ff",
                  borderColor: "primary",
                  color: "primary",
                },
              }}
            >
              Join for a Group
            </Button>
            </Box>
    </Box>
  );
};

export default Hero;
