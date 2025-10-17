"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import ClerkWrapper from "../components/ClerkWrapper"
import AnimatedBackground from "../components/AnimatedBackground"
import { login, forgotPassword } from "../api/authApi"
import { motion } from "framer-motion"

function LoginPageContent() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await login(formData.email, formData.password, rememberMe)
      if (res.access_token) {
        localStorage.setItem("authToken", res.access_token)
        localStorage.setItem("user", JSON.stringify(res.user))
        if (res.refresh_token) {
          localStorage.setItem("refreshToken", res.refresh_token)
        }
        setSuccess(true)
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first")
      return
    }
    try {
      await forgotPassword(formData.email)
      alert(`Password reset email sent to: ${formData.email}`)
    } catch (err: any) {
      setError(err.message || "An error occurred sending reset email")
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
                    Welcome Back
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
                    Continue your learning journey with CollabLearn
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    {['Collaborate', 'Learn', 'Grow'].map((item, index) => (
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

          {/* Right Side - Login Form */}
          <Box sx={{ 
            flex: { xs: '1', md: '5' },
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: { xs: 2, md: 3 }
          }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ width: '100%', maxWidth: 400 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
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
                    Sign In
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      textAlign: 'center',
                      mb: 3
                    }}
                  >
                    Enter your credentials to access your account
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
                        mb: 3,
                        textAlign: 'center'
                      }}
                    >
                      <Typography sx={{ color: '#166534', fontWeight: 600, fontSize: 14 }}>
                        ✓ Login successful. Welcome back!
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="normal"
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
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(v => !v)}
                              edge="end"
                              sx={{ color: '#64748b' }}
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
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={rememberMe} 
                            onChange={e => setRememberMe(e.target.checked)}
                            sx={{
                              color: '#6366f1',
                              '&.Mui-checked': {
                                color: '#6366f1',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography fontSize={14} color="#64748b" fontWeight={500}>
                            Remember me
                          </Typography>
                        }
                      />
                      <Button
                        variant="text"
                        onClick={handleForgotPassword}
                        sx={{ 
                          color: "#6366f1", 
                          fontSize: 14, 
                          textTransform: "none",
                          fontWeight: 600,
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.1)',
                          }
                        }}
                      >
                        Forgot password?
                      </Button>
                    </Box>
                  </motion.div>

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
                          p: 2, 
                          mt: 2,
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
                        mt: 3,
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
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <Box textAlign="center" mt={3}>
                      <Typography fontSize={14} color="#64748b">
                        Don&apos;t have an account?{" "}
                        <Link 
                          to="/signup" 
                          style={{ 
                            color: "#6366f1", 
                            fontWeight: 600, 
                            textDecoration: "none",
                            transition: 'color 0.3s ease'
                          }}
                        >
                          Create one
                        </Link>
                      </Typography>
                    </Box>
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

function LoginPage() {
  return (
    <ClerkWrapper>
      <LoginPageContent />
    </ClerkWrapper>
  )
}

export default LoginPage
