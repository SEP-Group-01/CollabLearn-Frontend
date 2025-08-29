import { Box, Typography, Button } from "@mui/material";
import { motion, easeOut } from "framer-motion";
import { useState } from "react";
import SearchBar from "./SearchBar";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import { assets } from "../assets/assets";

interface WorkspaceFormData {
  title: string;
  description: string;
  tags: string[];
  image: File | null;
  joinPolicy: 'anyone' | 'requests' | 'invites';
}

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateWorkspace = (workspaceData: WorkspaceFormData) => {
    console.log('Creating workspace:', workspaceData);
    // Here you would typically send the data to your backend
    // For now, we'll just log it
  };
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  const sketchVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as "spring",
        stiffness: 100,
        delay: 0.5
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95
    }
  };

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
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(148, 163, 184, 0.03) 100%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", zIndex: 1 }}
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="text.primary"
            sx={{ 
              mb: 2, 
              fontSize: { xs: "2rem", md: "3rem" },
              background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to CollabLearn!
          </Typography>
        </motion.div>

        <motion.div variants={sketchVariants}>
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
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: { xs: "90%", md: "700px" },
              mx: "auto",
              mb: 2,
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            Your personalized dashboard helps you track your progress, access course
            materials, join discussions, and manage your study plans, all in one place.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box mt={3} display="flex" justifyContent="center">
            <SearchBar />
          </Box>
        </motion.div>

        <motion.div
          variants={containerVariants}
          style={{ 
            display: "flex", 
            gap: "16px", 
            marginTop: "24px", 
            justifyContent: "center",
            flexWrap: "wrap" 
          }}
        >
          <motion.div variants={buttonVariants}>
            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                fontSize: "1.125rem",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                "&:hover": { 
                  bgcolor: "primary.dark",
                  boxShadow: "0 6px 20px rgba(59, 130, 246, 0.5)",
                },
              }}
              component={motion.button}
              whileHover="hover"
              whileTap="tap"
            >
              Create new Workspace
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                fontSize: "1.125rem",
                fontWeight: 500,
                textTransform: "none",
                bgcolor: "transparent",
                borderWidth: 2,
                "&:hover": {
                  bgcolor: "primary.light",
                  borderColor: "primary.main",
                  color: "primary.main",
                  borderWidth: 2,
                },
              }}
              component={motion.button}
              whileHover="hover"
              whileTap="tap"
            >
              Join a Workspace
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkspace}
      />
    </Box>
  );
};

export default Hero;