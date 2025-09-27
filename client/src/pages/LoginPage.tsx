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
  Divider,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useSignIn } from "@clerk/clerk-react"
import ClerkWrapper from "../components/ClerkWrapper"
import loginImage from "../assets/login.jpeg"
import { login, forgotPassword } from "../api/authApi"
import { motion } from "framer-motion"

function LoginPageContent() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { signIn } = useSignIn()
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
      const res = await login(formData.email, formData.password)
      if (res.access_token) {
        localStorage.setItem("authToken", res.access_token)
        localStorage.setItem("user", JSON.stringify(res.user))
        if (rememberMe && res.refresh_token) {
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

  const handleGoogleLogin = async () => {
    if (!signIn) {
      setError("Google sign in not available")
      return
    }
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred with Google login")
    }
  }

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Background image with dark overlay */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: `url(${loginImage}) center/cover no-repeat fixed`,
          zIndex: 0,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.18)",
            zIndex: 1,
          },
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 340,
              p: 2.5,
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
              background: "rgba(255,255,255,0.18)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              transition: "box-shadow 0.3s",
            }}
          >
            <Box textAlign="center" mb={1}>
              <Typography variant="h4" fontWeight="bold" color="#0f172a">
                Login
              </Typography>
            </Box>

            {success && (
              <Box
                sx={{
                  bgcolor: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  borderRadius: 2,
                  p: 1,
                  mb: 2,
                }}
              >
                <Typography sx={{ color: "#166534", fontWeight: 600, fontSize: 14 }}>
                  Login successful. Welcome back!
                </Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                InputProps={{
                  sx: {
                    background: "rgba(255,255,255,0.18)",
                    color: "#0f172a",
                    boxShadow: "none",
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(30,41,59,0.18)' },
                    '&:hover': { background: 'rgba(255,255,255,0.18)' },
                    '&.Mui-focused': { background: 'rgba(255,255,255,0.18)' },
                    '&:hover fieldset': { borderColor: '#2563eb' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(v => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    background: "rgba(255,255,255,0.18)",
                    color: "#0f172a",
                    boxShadow: "none",
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(30,41,59,0.18)' },
                    '&:hover': { background: 'rgba(255,255,255,0.18)' },
                    '&.Mui-focused': { background: 'rgba(255,255,255,0.18)' },
                    '&:hover fieldset': { borderColor: '#2563eb' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                  label={<Typography fontSize={14} color="#64748b">Remember me</Typography>}
                />
                <Button
                  variant="text"
                  onClick={handleForgotPassword}
                  sx={{ color: "#2563eb", fontSize: 14, textTransform: "none" }}
                >
                  Forgot password?
                </Button>
              </Box>

              {error && (
                <Box sx={{ color: "#dc2626", bgcolor: "#fef2f2", borderRadius: 2, p: 1, mt: 1.5 }}>
                  {error}
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.25,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1e40af" },
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

              <Box textAlign="center" mt={1.5}>
                <Typography fontSize={14} color="#64748b">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }}>or</Divider>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outlined"
                fullWidth
                sx={{
                  py: 1.1,
                  borderColor: "#cbd5e1",
                  textTransform: "none",
                  fontWeight: 600,
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
                Login with Google
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>
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
