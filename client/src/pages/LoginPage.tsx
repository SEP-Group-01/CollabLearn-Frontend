// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Paper,
//   InputAdornment,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import loginImage from '../assets/login.jpeg';


// function LoginPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const navigate = useNavigate();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       setError("Please fill in all fields");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Mock success for demo
//       setSuccess(true);
//       setTimeout(() => {
//         // TODO: Navigate to dashboard when authentication is implemented
//         // navigate('/dashboard')
//         alert("Login successful! (Demo mode - no backend connected)");
//       }, 1000);

//       /*
//       // BACKEND IMPLEMENTATION NEEDED:
//       const response = await authService.login({
//         email: formData.email,
//         password: formData.password,
//         rememberMe: rememberMe
//       });
//       if (response.success) {
//         localStorage.setItem('authToken', response.token);
//         if (rememberMe) {
//           localStorage.setItem('refreshToken', response.refreshToken);
//         }
//         navigate('/dashboard');
//       } else {
//         setError(response.message);
//       }
//       */
//     } catch (err: any) {
//       setError(err.message || "An error occurred during login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     // TODO: Implement Google OAuth when backend is ready
//     alert("Google Login - Backend implementation needed");

//     /*
//     // BACKEND IMPLEMENTATION NEEDED:
//     try {
//       window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
//       // Or use Google OAuth library
//       const response = await authService.googleLogin();
//       if (response.success) {
//         localStorage.setItem('authToken', response.token);
//         navigate('/dashboard');
//       }
//     } catch (err: any) {
//       setError(err.message || 'An error occurred with Google login');
//     }
//     */
//   };

//   const handleForgotPassword = async () => {
//     if (!formData.email) {
//       setError("Please enter your email address first");
//       return;
//     }
//     // TODO: Implement password reset when backend is ready
//     alert(`Password reset email would be sent to: ${formData.email} (Demo mode - no backend connected)`);

//     /*
//     // BACKEND IMPLEMENTATION NEEDED:
//     try {
//       const response = await authService.forgotPassword(formData.email);
//       if (response.success) {
//         alert('Password reset email sent! Check your inbox.');
//       } else {
//         setError(response.message);
//       }
//     } catch (err: any) {
//       setError(err.message || 'An error occurred sending reset email');
//     }
//     */
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", display: "flex" }}>
//       {/* Left side - Illustration */}
//       <Box
//         sx={{
//           display: { xs: "none", lg: "flex" },
//           width: "50%",
//           bgcolor: "linear-gradient(135deg, #bbf7d0 0%, #eff6ff 100%)",
//           alignItems: "center",
//           justifyContent: "center",
//           p: 6,
//         }}
//       >
//         <Box sx={{ maxWidth: 400 * 6 }}>
//           <img
//             src={loginImage}
//             alt="Login illustration"
//             width={400 * 2}   // scale width by 6
//             height={300 * 2}  // scale height proportionally
//             style={{ width: "100%", borderRadius: 12, boxShadow: "0 4px 24px rgba(16,185,129,0.08)" }}
//           />
//         </Box>
//       </Box>

//       {/* Right side - Form */}
//       <Box
//         sx={{
//           width: { xs: "100%", lg: "50%" },
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           p: 4,
//         }}
//       >
//         <Paper elevation={3} sx={{ width: "100%", maxWidth: 400, p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
//           <Box textAlign="center" mb={3}>
//             <Typography variant="h4" fontWeight="bold" color="#1e293b" mb={1}>
//               Login
//             </Typography>
//           </Box>

//           {/* Success Message */}
//           {success && (
//             <Box sx={{ bgcolor: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 2, p: 2, mb: 3 }}>
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Typography sx={{ color: "#22c55e", fontSize: 28, mr: 2 }}>✓</Typography>
//                 <Box>
//                   <Typography fontWeight={600} color="#166534" fontSize={15}>
//                     Login Successful!
//                   </Typography>
//                   <Typography color="#166534" fontSize={13}>
//                     Welcome back to our platform.
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           )}

//           <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//             {/* Email */}
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               required
//               fullWidth
//               margin="normal"
//               value={formData.email}
//               onChange={handleInputChange}
//               autoComplete="email"
//               InputLabelProps={{ sx: { fontWeight: 500 } }}
//             />

//             {/* Password */}
//             <TextField
//               label="Password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               required
//               fullWidth
//               margin="normal"
//               value={formData.password}
//               onChange={handleInputChange}
//               autoComplete="current-password"
//               InputLabelProps={{ sx: { fontWeight: 500 } }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                       onClick={() => setShowPassword((v) => !v)}
//                       edge="end"
//                       size="small"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Remember Me & Forgot Password */}
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={rememberMe}
//                     onChange={e => setRememberMe(e.target.checked)}
//                     color="primary"
//                   />
//                 }
//                 label={<Typography fontSize={14} color="#64748b">Remember me</Typography>}
//               />
//               <Button
//                 variant="text"
//                 onClick={handleForgotPassword}
//                 sx={{ color: "#2563eb", fontSize: 14, textTransform: "none", minWidth: 0, p: 0 }}
//               >
//                 Forgot password?
//               </Button>
//             </Box>

//             {/* Error Message */}
//             {error && (
//               <Box sx={{ color: "#dc2626", bgcolor: "#fef2f2", textAlign: "center", borderRadius: 2, p: 1.5, mt: 2, mb: 1 }}>
//                 {error}
//               </Box>
//             )}

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={loading}
//               sx={{
//                 bgcolor: "#2563eb",
//                 color: "#fff",
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontWeight: 500,
//                 fontSize: 16,
//                 mt: 2,
//                 mb: 1,
//                 textTransform: "none",
//                 "&:hover": { bgcolor: "#1e40af" },
//                 opacity: loading ? 0.7 : 1,
//               }}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </Button>

//             {/* Sign Up Link */}
//             <Box textAlign="center" mt={2}>
//               <Typography color="#64748b" fontSize={14}>
//                 Don't have an account?{" "}
//                 <Link to="/signup" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
//                   Sign up
//                 </Link>
//               </Typography>
//             </Box>

//             {/* Divider */}
//             <Divider sx={{ my: 3 }}>or</Divider>

//             {/* Google Login */}
//             <Button
//               type="button"
//               onClick={handleGoogleLogin}
//               variant="outlined"
//               fullWidth
//               sx={{
//                 borderColor: "#cbd5e1",
//                 color: "#334155",
//                 bgcolor: "#fff",
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontWeight: 500,
//                 fontSize: 16,
//                 textTransform: "none",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.5,
//                 "&:hover": { bgcolor: "#f1f5f9" },
//               }}
//               startIcon={
//                 <svg width={22} height={22} viewBox="0 0 24 24">
//                   <path
//                     fill="#4285F4"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="#34A853"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="#FBBC05"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="#EA4335"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//               }
//             >
//               Login with Google
//             </Button>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   );}

//   export default LoginPage;



"use client"

import type React from "react"
import { useState } from "react"
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
import {login, forgotPassword, resetPassword} from "../api/authApi" // Import auth API functions if needed

function LoginPageContent() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { signIn } = useSignIn()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
      // Call the login API
      const response = await login(
        formData.email,
        formData.password
      );

      console.log("Login response:", response.access_token);


      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (rememberMe && response.refresh_token) {
          localStorage.setItem('refreshToken', response.refresh_token);
        }
        setSuccess(true);
        navigate('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  // ONLY CLERK IMPLEMENTATION - Google OAuth
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

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first")
      return
    }
    // TODO: Implement password reset when backend is ready
    try {
      await forgotPassword(formData.email)
      alert(`Password reset email sent to: ${formData.email}`)
    } catch (err: any) {
      setError(err.message || "An error occurred sending reset email")
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left side - Illustration */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "50%",
          background: "linear-gradient(135deg, #bbf7d0 0%, #eff6ff 100%)",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <img
            src={loginImage || "/placeholder.svg"}
            alt="Login illustration"
            width={400 * 2} // scale width by 6
            height={300 * 2} // scale height proportionally
            style={{
              width: "100%",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(16,185,129,0.08)",
            }}
          />
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 400, p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="#1e293b" mb={1}>
              Login
            </Typography>
          </Box>

          {/* Success Message */}
          {success && (
            <Box sx={{ bgcolor: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 2, p: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ color: "#22c55e", fontSize: 28, mr: 2 }}>✓</Typography>
                <Box>
                  <Typography fontWeight={600} color="#166534" fontSize={15}>
                    Login Successful!
                  </Typography>
                  <Typography color="#166534" fontSize={13}>
                    Welcome back to our platform.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              InputLabelProps={{ sx: { fontWeight: 500 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />
                }
                label={
                  <Typography fontSize={14} color="#64748b">
                    Remember me
                  </Typography>
                }
              />
              <Button
                variant="text"
                onClick={handleForgotPassword}
                sx={{ color: "#2563eb", fontSize: 14, textTransform: "none", minWidth: 0, p: 0 }}
              >
                Forgot password?
              </Button>
            </Box>

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  color: "#dc2626",
                  bgcolor: "#fef2f2",
                  textAlign: "center",
                  borderRadius: 2,
                  p: 1.5,
                  mt: 2,
                  mb: 1,
                }}
              >
                {error}
              </Box>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: "#2563eb",
                color: "#fff",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                fontSize: 16,
                mt: 2,
                mb: 1,
                textTransform: "none",
                "&:hover": { bgcolor: "#1e40af" },
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            {/* Sign Up Link */}
            <Box textAlign="center" mt={2}>
              <Typography color="#64748b" fontSize={14}>
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                  Sign up
                </Link>
              </Typography>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>or</Divider>

            {/* Google Login - ONLY CLERK IMPLEMENTATION */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#cbd5e1",
                color: "#334155",
                bgcolor: "#fff",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                fontSize: 16,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
              startIcon={
                <svg width={22} height={22} viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Login with Google
            </Button>
          </Box>
        </Paper>
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
