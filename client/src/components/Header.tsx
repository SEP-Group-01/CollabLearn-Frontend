import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  // Only show nav items relevant to the current page
  const navItems = [
    ...(isHome
      ? [
          { name: "Home", href: "/" },
          { name: "groups", href: "#groups" },
          { name: "features", href: "#features" },
          { name: "About", href: "#about" },
          { name: "Login", href: "/login" },
          { name: "Sign Up", href: "/signup" },
        ]
      : []),
    ...(!user ? [{ name: "login", href: "/login" }] : []),
  ];

  return (
    <AppBar
      position={isHome ? "sticky" : "static"} // Sticky only on home page
      elevation={1}
      sx={{
        bgcolor: "#fff",
        color: "#1e293b",
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          minHeight: 72,
        }}
      >
        {/* Left: Logo */}
        <Box sx={{ flex: "0 0 auto" }}>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#2563eb",
              textDecoration: "none",
              letterSpacing: 1,
            }}
          >
            Learn.
          </Typography>
        </Box>

        {/* Center: Nav */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.name}
              href={item.href}
              sx={{
                color: "#1e293b",
                fontWeight: 500,
                fontSize: 15,
                textTransform: "none",
                "&:hover": { color: "#2563eb", bgcolor: "transparent" },
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        {/* Right: Profile or Join button */}
        <Box sx={{ flex: "0 0 auto", display: { xs: "none", md: "block" } }}>
          {user ? (
            <IconButton component={Link} to="/profile">
              <Avatar
                alt={user.name}
                src={user.avatarUrl}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          ) : (
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{
                bgcolor: "#2563eb",
                color: "#fff",
                px: 3,
                py: 1,
                borderRadius: "999px",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#1e40af" },
              }}
            >
              Join
            </Button>
          )}
        </Box>

        {/* Mobile menu button */}
        <Box sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: { width: 260, bgcolor: "#fff" },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={() => setIsMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#1e293b",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {!user && (
            <ListItem>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#2563eb",
                  color: "#fff",
                  borderRadius: "999px",
                  fontWeight: 500,
                  textTransform: "none",
                  mt: 1,
                  "&:hover": { bgcolor: "#1e40af" },
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Join
              </Button>
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Header;