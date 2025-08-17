import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Paper, Grid, AppBar, Toolbar } from "@mui/material";

function DashboardPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "#fff", color: "#1e293b", boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)" }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%", px: { xs: 2, md: 4 }, justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            Learn.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ color: "#334155" }}>Welcome to Dashboard!</Typography>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              sx={{
                borderColor: "#2563eb",
                color: "#2563eb",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#1e40af", color: "#1e40af", bgcolor: "#e0e7ff" },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 6 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="#1e293b" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="#64748b">Welcome to your learning dashboard</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                My Groups
              </Typography>
              <Typography color="#64748b" mb={2}>
                You haven't joined any groups yet.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#2563eb",
                  color: "#fff",
                  borderRadius: "999px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1e40af" },
                }}
              >
                Browse Groups
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Study Plans
              </Typography>
              <Typography color="#64748b" mb={2}>
                No study plans created yet.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#2563eb",
                  color: "#fff",
                  borderRadius: "999px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1e40af" },
                }}
              >
                Create Study Plan
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Documents
              </Typography>
              <Typography color="#64748b" mb={2}>
                No documents available.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#2563eb",
                  color: "#fff",
                  borderRadius: "999px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1e40af" },
                }}
              >
                Create Document
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default DashboardPage;