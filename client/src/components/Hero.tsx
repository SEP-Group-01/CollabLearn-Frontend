import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
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
    </Box>
  );
};

export default Hero;
