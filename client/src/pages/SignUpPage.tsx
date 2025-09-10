
"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useSignUp } from "@clerk/clerk-react"
import ClerkWrapper from "../components/ClerkWrapper"
import { signup } from "../api/authApi"
import signUpImage from "../assets/sign-up.jpeg"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
}

function SignUpPageContent() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { signUp } = useSignUp()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
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
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        overflow: "hidden",
      }}
    >
      {/* Illustration panel */}
      <Box
        sx={{
          display: { xs: "none", lg: "grid" },
          placeItems: "center",
          width: { lg: "48%", xl: "50%" },
          background: "linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)",
        }}
      >
        <Box
          sx={{
            width: "min(44vw, 720px)",
            maxWidth: "720px",
            aspectRatio: "16 / 11",
            display: "grid",
            placeItems: "center",
            background: "#ffffff",
            borderRadius: 3,
            boxShadow: "0 6px 28px rgba(139,92,246,0.12)",
            overflow: "hidden",
          }}
        >
          <img
            src={signUpImage || "/placeholder.svg"}
            alt="Sign up illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        // sx={{
        //   width: { xs: "100%", lg: "52%", xl: "50%" },
        //   display: "grid",
        //   placeItems: "center",
        //   p: { xs: 2, sm: 3 },
        // }}
        sx={{
    width: { xs: "100%", lg: "52%", xl: "50%" },
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    pt: { xs: 4, sm: 6, md: 8 },
  }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 3,
            borderRadius: 3,
            boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Box textAlign="center" mb={1}>
            <Typography variant="h4" fontWeight="bold" color="#0f172a">
              Sign up
            </Typography>
          </Box>

          {success && (
            <Box
              sx={{
                bgcolor: "#dcfce7",
                border: "1px solid #bbf7d0",
                borderRadius: 2,
                p: 1.5,
                mb: 2,
              }}
            >
              <Typography sx={{ color: "#166534", fontWeight: 600, fontSize: 14 }}>
                Account created successfully. Welcome!
              </Typography>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
              InputLabelProps={{ sx: { fontWeight: 500 } }}
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
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(v => !v)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Box
                sx={{
                  color: "#dc2626",
                  bgcolor: "#fef2f2",
                  textAlign: "center",
                  borderRadius: 2,
                  p: 1,
                  mt: 1.5,
                }}
              >
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
                textTransform: "none",
                fontWeight: 600,
                py: 1.25,
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1e40af" },
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <Box textAlign="center" mt={1.5}>
              <Typography color="#64748b" fontSize={14}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                  Login
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }}>or</Divider>

            <Button
              type="button"
              onClick={handleGoogleSignUp}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#cbd5e1",
                textTransform: "none",
                fontWeight: 600,
                py: 1.1,
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#f1f5f9" },
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
          </Box>
        </Paper>
      </Box>
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
