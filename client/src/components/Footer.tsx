"use client"

import type React from "react"

import { useState } from "react"
import { Box, Typography, Button, TextField, IconButton, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react"

function Footer() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  // const handleNavigation = (path: string) => {
  //   navigate(path)
  //   // Smooth scroll to top
  //   window.scrollTo({ top: 0, behavior: "smooth" })
  // }
  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      const sectionId = path.slice(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const companyLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "#about" },
    { name: "Groups", path: "#workspaces" },
    { name: "Features", path: "#features" },
  ]

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ]

  const socialLinks = [
    { icon: <Facebook size={20} />, name: "Facebook", url: "https://facebook.com" },
    { icon: <Twitter size={20} />, name: "Twitter", url: "https://twitter.com" },
    { icon: <Instagram size={20} />, name: "Instagram", url: "https://instagram.com" },
    { icon: <Linkedin size={20} />, name: "LinkedIn", url: "https://linkedin.com" },
  ]

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0f172a", // Very dark blue/navy
        color: "#ffffff",
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
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(148, 163, 184, 0.05) 100%)",
          zIndex: 0,
        }}
      />

      {/* Scroll to top button */}
      <Box
        sx={{
          position: "absolute",
          top: 25,
          right: { xs: 20, md: 40 },
          zIndex: 2,
        }}
      >
        <IconButton
          onClick={scrollToTop}
          sx={{
            bgcolor: "#2563eb",
            color: "#ffffff",
            width: 50,
            height: 50,
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: "#1e40af",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)",
            },
          }}
        >
          <ArrowUp size={50} />
        </IconButton>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 3, sm: 4, lg: 6 },
          py: { xs: 6, md: 8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 4, md: 6 },
          }}
        >
          {/* Logo and Description */}
          <Box
            sx={{
              flexBasis: { xs: '100%', md: '33.333%' },
              minWidth: 0,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  mb: 3,
                  color: "#ffffff",
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                }}
              >
                Learn
                <Box component="span" sx={{ color: "#2563eb" }}>
                  .
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#94a3b8", // Light gray
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Empowering students worldwide with collaborative learning tools, AI-powered study plans, and real-time
                document editing for academic success.
              </Typography>

              {/* Contact Info */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#1e293b",
                      p: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Mail size={16} color="#64748b" />
                  </Box>
                  <Typography variant="body2" color="#94a3b8">
                    support@learnplatform.com
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#1e293b",
                      p: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Phone size={16} color="#64748b" />
                  </Box>
                  <Typography variant="body2" color="#94a3b8">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Company Links */}
          <Box
            sx={{
              flexBasis: { xs: '100%', sm: '50%', md: '16.666%' },
              minWidth: 0,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 3,
                color: "#ffffff",
                fontSize: { xs: "1.125rem", md: "1.25rem" },
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {companyLinks.map((link, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  onClick={() => handleNavigation(link.path)}
                  sx={{
                    color: "#94a3b8",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#2563eb",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Support Links */}
          <Box
            sx={{
              flexBasis: { xs: '100%', sm: '50%', md: '16.666%' },
              minWidth: 0,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 3,
                color: "#ffffff",
                fontSize: { xs: "1.125rem", md: "1.25rem" },
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {supportLinks.map((link, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  onClick={() => handleNavigation(link.path)}
                  sx={{
                    color: "#94a3b8",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#2563eb",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Newsletter */}
          <Box
            sx={{
              flexBasis: { xs: '100%', md: '33.333%' },
              minWidth: 0,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 3,
                color: "#ffffff",
                fontSize: { xs: "1.125rem", md: "1.25rem" },
              }}
            >
              Stay Updated
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mb: 3,
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              Get the latest updates on new features, study tips, and platform improvements delivered to your inbox.
            </Typography>

            {/* Newsletter Form */}
            <Box component="form" onSubmit={handleSubscribe} sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="small"
                  sx={{
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#1e293b",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#334155",
                      },
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      "&::placeholder": {
                        color: "#64748b",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#2563eb",
                    color: "#ffffff",
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: "auto",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "#1e40af",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>

              {subscribed && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#22c55e",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  ✓ Successfully subscribed!
                </Typography>
              )}
            </Box>

            {/* Social Links */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#94a3b8",
                  mb: 2,
                  fontSize: "0.95rem",
                }}
              >
                Follow us on social media
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    onClick={() => window.open(social.url, "_blank")}
                    sx={{
                      bgcolor: "#1e293b",
                      color: "#64748b",
                      width: 40,
                      height: 40,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: "#2563eb",
                        color: "#ffffff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: "#334155" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontSize: { xs: "0.875rem", md: "0.95rem" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © 2025 Learn Platform. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography
              variant="body2"
              onClick={() => handleNavigation("/privacy")}
              sx={{
                color: "#64748b",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "#2563eb",
                },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleNavigation("/terms")}
              sx={{
                color: "#64748b",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "#2563eb",
                },
              }}
            >
              Terms of Service
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
