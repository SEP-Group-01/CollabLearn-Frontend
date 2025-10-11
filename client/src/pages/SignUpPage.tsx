"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Container,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useSignUp } from "@clerk/clerk-react"
import ClerkWrapper from "../components/ClerkWrapper"
import AnimatedBackground from "../components/AnimatedBackground"
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator"
import { signup } from "../api/authApi"
import { motion } from "framer-motion"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

function SignUpPageContent() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { signUp } = useSignUp()

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")
    try {
      const res = await signup(formData.email, formData.password, formData.firstName, formData.lastName)
      if (res.user.id) {
        setSuccess(true)
        // navigate("/login")  // optionally push forward
      } else {
        setError(res.message || "Sign up failed")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!signUp) {
      setError("Google sign up not available")
      return
    }
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred with Google signup")
    }
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <Container maxWidth={false} sx={{ height: '100vh', p: 0, position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Side - Welcome Content */}
          <Box sx={{ 
            flex: { xs: '1', md: '7' },
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: { xs: 2, md: 4 }
          }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ maxWidth: 600, textAlign: { xs: 'center', md: 'left' } }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      lineHeight: 1.2
                    }}
                  >
                    Join CollabLearn
                  </Typography>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#64748b',
                      fontWeight: 400,
                      mb: 4,
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                  >
                    Start your collaborative learning journey today
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    {['Create', 'Connect', 'Learn', 'Achieve'].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      >
                        <Box
                          sx={{
                            px: 3,
                            py: 1,
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 25,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: '#4f46e5',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                        >
                          {item}
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Box>

          {/* Right Side - Signup Form */}
          <Box sx={{ 
            flex: { xs: '1', md: '5' },
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: { xs: 2, md: 3 },
            py: { xs: 3, md: 4 }
          }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ width: '100%', maxWidth: 480 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 1,
                      textAlign: 'center'
                    }}
                  >
                    Create Account
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      textAlign: 'center',
                      mb: 2
                    }}
                  >
                    Join thousands of learners worldwide
                  </Typography>
                </motion.div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography sx={{ color: '#166534', fontWeight: 600, fontSize: 14 }}>
                        ✓ Account created successfully! Welcome aboard!
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      style={{ flex: 1 }}
                    >
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '& fieldset': {
                              borderColor: 'rgba(148, 163, 184, 0.3)',
                              borderWidth: 1,
                            },
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.6)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                              },
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255, 255, 255, 0.7)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              },
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.65 }}
                      style={{ flex: 1 }}
                    >
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '& fieldset': {
                              borderColor: 'rgba(148, 163, 184, 0.3)',
                              borderWidth: 1,
                            },
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.6)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                              },
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255, 255, 255, 0.7)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              },
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </motion.div>
                  </Box>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="dense"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.5)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '& fieldset': {
                            borderColor: 'rgba(148, 163, 184, 0.3)',
                            borderWidth: 1,
                          },
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.6)',
                            '& fieldset': {
                              borderColor: '#6366f1',
                            },
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.7)',
                            '& fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          fontWeight: 500,
                        },
                      }}
                    />
                  </motion.div>

                  {/* Password Strength Indicator - spans full width */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.75 }}
                  >
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <PasswordStrengthIndicator password={formData.password} showCriteria={false} />
                    </Box>
                  </motion.div>

                  {/* Password Fields Row */}
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      style={{ flex: 1 }}
                    >
                      <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(v => !v)}
                                edge="end"
                                sx={{ color: '#64748b' }}
                                size="small"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            paddingRight: '8px',
                            '& fieldset': {
                              borderColor: 'rgba(148, 163, 184, 0.3)',
                              borderWidth: 1,
                            },
                            '& input': {
                              paddingRight: '8px',
                            },
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.6)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                              },
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255, 255, 255, 0.7)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              },
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.85 }}
                      style={{ flex: 1 }}
                    >
                      <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(v => !v)}
                                edge="end"
                                sx={{ color: '#64748b' }}
                                size="small"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            paddingRight: '8px',
                            '& fieldset': {
                              borderColor: 'rgba(148, 163, 184, 0.3)',
                              borderWidth: 1,
                            },
                            '& input': {
                              paddingRight: '8px',
                            },
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.6)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                              },
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255, 255, 255, 0.7)',
                              '& fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              },
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </motion.div>
                  </Box>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box 
                        sx={{ 
                          color: "#dc2626", 
                          bgcolor: "rgba(239, 68, 68, 0.1)", 
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: 2, 
                          p: 1.5, 
                          mt: 1.5,
                          textAlign: 'center',
                          fontSize: '0.875rem'
                        }}
                      >
                        {error}
                      </Box>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
                          boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: '#94a3b8',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.95 }}
                  >
                    <Box textAlign="center" mt={2}>
                      <Typography fontSize={14} color="#64748b">
                        Already have an account?{" "}
                        <Link 
                          to="/login" 
                          style={{ 
                            color: "#6366f1", 
                            fontWeight: 600, 
                            textDecoration: "none",
                            transition: 'color 0.3s ease'
                          }}
                        >
                          Sign in
                        </Link>
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <Divider sx={{ my: 2, color: '#cbd5e1' }}>or</Divider>

                    <Button
                      type="button"
                      onClick={handleGoogleSignUp}
                      variant="outlined"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderColor: "rgba(203, 213, 225, 0.5)",
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        textTransform: "none",
                        fontWeight: 600,
                        color: '#374151',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderColor: '#6366f1',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                      startIcon={
                        <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      }
                    >
                      Continue with Google
                    </Button>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

function SignUpPage() {
  return (
    <ClerkWrapper>
      <SignUpPageContent />
    </ClerkWrapper>
  )
}

export default SignUpPage
