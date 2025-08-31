import BenefitsSection from "../components/BenefitsSection";
import GroupsSection from "../components/GroupsSection";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import Hero from "../components/Hero";

function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Remove <Header /> here */}
      <main>
        <Hero />
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <BenefitsSection />
        </Box>
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <GroupsSection />
        </Box>
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <AboutSection />
        </Box>
      </main>
      <Footer />
    </Box>
  );
}

export default HomePage;