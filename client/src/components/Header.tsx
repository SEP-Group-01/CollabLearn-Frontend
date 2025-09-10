import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import {assets} from "../assets/assets";
import {getUserData, isAuthenticated, logout} from "../api/authApi"

type HeaderProps = {};

function Header({}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get authentication status and user data
  const authenticated = isAuthenticated();
  const userData = getUserData();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isHome = location.pathname === "/";

  // Only show nav items relevant to the current page
  const navItems = [
    ...(isHome
      ? [
          { name: "Home", href: "/" },
          { name: "groups", href: "#groups" },
          { name: "features", href: "#features" },
          { name: "About", href: "#about" },
        ]
      : [])
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
          pl: { xs: 0, md: 0 },
          pr: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          minHeight: 72,
        }}
      >
        {/* Left: Logo */}
        <Box sx={{ flex: "0 0 auto", ml: { xs: 1, md: 2 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
            }}
          >
            <img
              src={assets.favicon}
              alt="Collab-Learn"
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#2563eb",
                letterSpacing: 1,
              }}
            >
              Collab-Learn
            </Typography>
          </Box>
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
          {authenticated && userData ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                {`${userData.first_name} ${userData.last_name}`}
              </Typography>
              <IconButton component={Link} to="/profile">
                <Avatar
                  alt={`${userData.first_name} ${userData.last_name}`}
                  sx={{ width: 40, height: 40, bgcolor: "#2563eb" }}
                >
                  {`${userData.first_name[0]}${userData.last_name[0]}`}
                </Avatar>
              </IconButton>
              <IconButton 
                onClick={handleLogout}
                sx={{ 
                  color: "#6b7280",
                  "&:hover": { bgcolor: "rgba(107, 114, 128, 0.04)" },
                }}
                title="Logout"
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: "#2563eb",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(37, 99, 235, 0.04)" },
                }}
              >
                Login
              </Button>
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
                Sign Up
              </Button>
            </Box>
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
          {!authenticated && (
            <>
              <ListItem>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "#2563eb",
                    color: "#2563eb",
                    borderRadius: "999px",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(37, 99, 235, 0.04)" },
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
              </ListItem>
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
                    "&:hover": { bgcolor: "#1e40af" },
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </ListItem>
            </>
          )}
          {authenticated && userData && (
            <>
              <ListItem>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", px: 2 }}>
                  <Avatar
                    alt={`${userData.first_name} ${userData.last_name}`}
                    sx={{ width: 40, height: 40, bgcolor: "#2563eb" }}
                  >
                    {`${userData.first_name[0]}${userData.last_name[0]}`}
                  </Avatar>
                  <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {`${userData.first_name} ${userData.last_name}`}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "#6b7280",
                    color: "#6b7280",
                    borderRadius: "999px",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(107, 114, 128, 0.04)" },
                  }}
                >
                  Logout
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Header;