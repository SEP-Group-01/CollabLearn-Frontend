import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SettingsIcon from "@mui/icons-material/Settings";

function BenefitsSection() {
  const benefits = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 40, color: "#fff" }} />,
      title: "Study Plan Generator",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting",
      color: "#1976d2",
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: "#fff" }} />,
      title: "Collaborative Document Editing",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting",
      color: "#388e3c",
    },
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 40, color: "#fff" }} />,
      title: "Document Querying",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting",
      color: "#fbc02d",
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40, color: "#fff" }} />,
      title: "Manage Study Groups",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting",
      color: "#d32f2f",
    },
  ];

  return (
    <Box component="section" id="features" sx={{ py: { xs: 6, md: 10 }, bgcolor: "#fafafa" }}>
      <Box sx={{ maxWidth: 900, mx: "auto", px: 2 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Benefits from us
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" maxWidth={600} mx="auto">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking
          </Typography>
        </Box>

        {/* Benefits Grid */}
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: benefit.color,
                      borderRadius: "50%",
                      width: 56,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default BenefitsSection;

