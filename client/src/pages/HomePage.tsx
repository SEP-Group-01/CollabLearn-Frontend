import React from "react";
import Header from "../components/Header";
import BenefitsSection from "../components/BenefitsSection";
import GroupsSection from "../components/GroupsSection";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import Hero from "../components/Hero";

function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Header />
      <main>
        <Hero />
        <BenefitsSection />
        <GroupsSection />
        <AboutSection />
      </main>
      <Footer />
    </Box>
  );
}

export default HomePage;