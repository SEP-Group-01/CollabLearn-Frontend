// // import type React from "react"

// // const Footer: React.FC = () => {
// //   const footerLinks = {
// //     Links: ["Resource", "Help center", "Carrier", "Support Service", "Legal Notice"],
// //     Contacts: ["192. New york", "+1125156363"],
// //   }

// //   return (
// //     <footer className="bg-blue-600 text-white py-12">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
// //           {/* Logo and Description */}
// //           <div className="md:col-span-2">
// //             <div className="flex items-center mb-4">
// //               <span className="text-2xl font-bold">Learn.</span>
// //             </div>
// //             <p className="text-blue-100 mb-4">
// //               Empowering learners through collaborative education and innovative learning solutions.
// //             </p>
// //           </div>

// //           {/* Links */}
// //           <div>
// //             <h3 className="text-lg font-semibold mb-4">Links</h3>
// //             <ul className="space-y-2">
// //               {footerLinks.Links.map((link, index) => (
// //                 <li key={index}>
// //                   <a href="#" className="text-blue-100 hover:text-white transition-colors">
// //                     {link}
// //                   </a>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           {/* Contacts */}
// //           <div>
// //             <h3 className="text-lg font-semibold mb-4">Contacts</h3>
// //             <ul className="space-y-2">
// //               {footerLinks.Contacts.map((contact, index) => (
// //                 <li key={index} className="text-blue-100">
// //                   {contact}
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>

// //         {/* Copyright */}
// //         <div className="border-t border-blue-500 mt-8 pt-8 text-center">
// //           <p className="text-blue-100">Copyright 2020@ all right reserved.</p>
// //         </div>
// //       </div>
// //     </footer>
// //   )
// // }

// // export default Footer

// import React from "react";
// import { Box, Grid, Typography, Button, TextField, Paper } from "@mui/material";
// import { assets } from "../assets/assets";

// function Footer() {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         bgcolor: "#1e293b", // dark blue-gray
//         color: "#fff",
//         width: "100%",
//         mt: 8,
//         pt: 6,
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: 1200,
//           mx: "auto",
//           px: { xs: 2, md: 6 },
//           pb: 4,
//           borderBottom: "1px solid rgba(255,255,255,0.18)",
//         }}
//       >
//         <Grid
//           container
//           spacing={6}
//           alignItems="flex-start"
//           justifyContent="center"
//         >
//           {/* Logo and Description */}
//           <Grid item xs={12} md={4}>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
//               <img src={assets.logo_dark} alt="logo" style={{ maxWidth: 140 }} />
//               <Typography
//                 variant="body2"
//                 sx={{
//                   mt: 3,
//                   color: "rgba(255,255,255,0.8)",
//                   textAlign: { xs: "center", md: "left" },
//                   maxWidth: 300,
//                 }}
//               >
//                 Empowering students with smart tools to manage learning, track progress, and achieve academic goals.
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Company Links */}
//           <Grid item xs={12} md={4}>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
//               <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
//                 Company
//               </Typography>
//               <Box
//                 component="ul"
//                 sx={{
//                   listStyle: "none",
//                   p: 0,
//                   m: 0,
//                   display: "flex",
//                   flexDirection: { xs: "row", md: "column" },
//                   gap: { xs: 2, md: 1 },
//                   width: "100%",
//                   justifyContent: { xs: "space-between", md: "flex-start" },
//                   color: "rgba(255,255,255,0.8)",
//                   fontSize: 15,
//                 }}
//               >
//                 <li>
//                   <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Home</a>
//                 </li>
//                 <li>
//                   <a href="#" style={{ color: "inherit", textDecoration: "none" }}>About us</a>
//                 </li>
//                 <li>
//                   <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact Us</a>
//                 </li>
//                 <li>
//                   <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy policy</a>
//                 </li>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Newsletter */}
//           <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "flex" } }}>
//             <Box sx={{ flexDirection: "column" }}>
//               <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
//                 Subscribe to our newsletter
//               </Typography>
//               <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}>
//                 The latest news, articles, and resources, sent to your inbox weekly
//               </Typography>
//               <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                 <TextField
//                   type="email"
//                   placeholder="Enter your email"
//                   size="small"
//                   sx={{
//                     bgcolor: "#334155",
//                     input: { color: "#fff" },
//                     "& .MuiOutlinedInput-root": {
//                       "& fieldset": { borderColor: "rgba(255,255,255,0.18)" },
//                       "&:hover fieldset": { borderColor: "#2563eb" },
//                     },
//                     width: 200,
//                   }}
//                   InputProps={{
//                     sx: { borderRadius: 2, fontSize: 14 },
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   sx={{
//                     bgcolor: "#2563eb",
//                     color: "#fff",
//                     height: 40,
//                     width: 100,
//                     borderRadius: 2,
//                     fontWeight: 500,
//                     fontSize: 15,
//                     boxShadow: "none",
//                     "&:hover": { bgcolor: "#1e40af" },
//                   }}
//                 >
//                   Subscribe
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//       <Typography
//         variant="body2"
//         sx={{
//           py: 2,
//           textAlign: "center",
//           color: "rgba(255,255,255,0.6)",
//           fontSize: { xs: 12, md: 14 },
//         }}
//       >
//         Copyright 2025 @ GreateStack. All Right Reserved
//       </Typography>
//     </Box>
//   );
// }

// export default Footer;

"use client"

import type React from "react"

import { useState } from "react"
import { Box, Grid, Typography, Button, TextField, IconButton, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react"

function Footer() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleNavigation = (path: string) => {
    navigate(path)
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
    { name: "Groups", path: "#groups" },
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
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
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
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} md={2}>
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
          </Grid>

          {/* Support Links */}
          <Grid item xs={12} sm={6} md={2}>
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
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
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
          </Grid>
        </Grid>

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
