// import type React from "react"

// const Footer: React.FC = () => {
//   const footerLinks = {
//     Links: ["Resource", "Help center", "Carrier", "Support Service", "Legal Notice"],
//     Contacts: ["192. New york", "+1125156363"],
//   }

//   return (
//     <footer className="bg-blue-600 text-white py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Logo and Description */}
//           <div className="md:col-span-2">
//             <div className="flex items-center mb-4">
//               <span className="text-2xl font-bold">Learn.</span>
//             </div>
//             <p className="text-blue-100 mb-4">
//               Empowering learners through collaborative education and innovative learning solutions.
//             </p>
//           </div>

//           {/* Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Links</h3>
//             <ul className="space-y-2">
//               {footerLinks.Links.map((link, index) => (
//                 <li key={index}>
//                   <a href="#" className="text-blue-100 hover:text-white transition-colors">
//                     {link}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contacts */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Contacts</h3>
//             <ul className="space-y-2">
//               {footerLinks.Contacts.map((contact, index) => (
//                 <li key={index} className="text-blue-100">
//                   {contact}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="border-t border-blue-500 mt-8 pt-8 text-center">
//           <p className="text-blue-100">Copyright 2020@ all right reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer

import React from "react";
import { Box, Grid, Typography, Button, TextField, Paper } from "@mui/material";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1e293b", // dark blue-gray
        color: "#fff",
        width: "100%",
        mt: 8,
        pt: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 6 },
          pb: 4,
          borderBottom: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <Grid
          container
          spacing={6}
          alignItems="flex-start"
          justifyContent="center"
        >
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
              <img src={assets.logo_dark} alt="logo" style={{ maxWidth: 140 }} />
              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: { xs: "center", md: "left" },
                  maxWidth: 300,
                }}
              >
                Empowering students with smart tools to manage learning, track progress, and achieve academic goals.
              </Typography>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
                Company
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  p: 0,
                  m: 0,
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  gap: { xs: 2, md: 1 },
                  width: "100%",
                  justifyContent: { xs: "space-between", md: "flex-start" },
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 15,
                }}
              >
                <li>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Home</a>
                </li>
                <li>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>About us</a>
                </li>
                <li>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact Us</a>
                </li>
                <li>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy policy</a>
                </li>
              </Box>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "flex" } }}>
            <Box sx={{ flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
                Subscribe to our newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}>
                The latest news, articles, and resources, sent to your inbox weekly
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  size="small"
                  sx={{
                    bgcolor: "#334155",
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(255,255,255,0.18)" },
                      "&:hover fieldset": { borderColor: "#2563eb" },
                    },
                    width: 200,
                  }}
                  InputProps={{
                    sx: { borderRadius: 2, fontSize: 14 },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#2563eb",
                    color: "#fff",
                    height: 40,
                    width: 100,
                    borderRadius: 2,
                    fontWeight: 500,
                    fontSize: 15,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1e40af" },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Typography
        variant="body2"
        sx={{
          py: 2,
          textAlign: "center",
          color: "rgba(255,255,255,0.6)",
          fontSize: { xs: 12, md: 14 },
        }}
      >
        Copyright 2025 @ GreateStack. All Right Reserved
      </Typography>
    </Box>
  );
}

export default Footer;