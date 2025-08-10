import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// TODO: Uncomment when backend is ready
// import { authService } from '../services/authService'

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeToTerms) {
      setError("Please agree to the terms and privacy policy");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success for demo
      setSuccess(true);
      setTimeout(() => {
        alert("Sign up successful! (Demo mode - no backend connected)");
      }, 1000);

      /*
      // BACKEND IMPLEMENTATION:
      const signUpData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.signUp(signUpData);

      if (response.success && response.token) {
        authService.setToken(response.token);
        if (response.refreshToken) {
          authService.setRefreshToken(response.refreshToken);
        }
        navigate('/dashboard');
      } else {
        setError(response.message || 'Sign up failed');
      }
      */
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    alert("Google Sign Up - Backend implementation needed");

    /*
    // BACKEND IMPLEMENTATION:
    try {
      await authService.googleAuth();
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google signup');
    }
    */
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left side - Illustration */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "50%",
          bgcolor: "linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <img
            src="https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Sign+Up+Illustration"
            alt="Sign up illustration"
            style={{ width: "100%", borderRadius: 12, boxShadow: "0 4px 24px rgba(139,92,246,0.08)" }}
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
              Sign up
            </Typography>
          </Box>

          {/* Success Message */}
          {success && (
            <Box sx={{ bgcolor: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 2, p: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ color: "#22c55e", fontSize: 28, mr: 2 }}>✓</Typography>
                <Box>
                  <Typography fontWeight={600} color="#166534" fontSize={15}>
                    Account Created Successfully!
                  </Typography>
                  <Typography color="#166534" fontSize={13}>
                    Welcome to our learning platform.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* First Name */}
            <TextField
              label="First Name"
              name="firstName"
              type="text"
              required
              fullWidth
              margin="normal"
              value={formData.firstName}
              onChange={handleInputChange}
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />

            {/* Last Name */}
            <TextField
              label="Last Name"
              name="lastName"
              type="text"
              required
              fullWidth
              margin="normal"
              value={formData.lastName}
              onChange={handleInputChange}
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />

            {/* Email */}
            <TextField
              label="Email Address"
              name="email"
              type="email"
              required
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleInputChange}
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

            {/* Terms Agreement */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeToTerms}
                  onChange={e => setAgreeToTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography fontSize={14} color="#64748b">
                  I agree to the{" "}
                  <Link to="/terms" style={{ color: "#2563eb", textDecoration: "underline" }}>
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" style={{ color: "#2563eb", textDecoration: "underline" }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 1, mb: 1 }}
            />

            {/* Error Message */}
            {error && (
              <Box sx={{ color: "#dc2626", bgcolor: "#fef2f2", textAlign: "center", borderRadius: 2, p: 1.5, mt: 2, mb: 1 }}>
                {error}
              </Box>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !agreeToTerms}
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
              {loading ? "Creating account..." : "Create account"}
            </Button>

            {/* Login Link */}
            <Box textAlign="center" mt={2}>
              <Typography color="#64748b" fontSize={14}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                  Login
                </Link>
              </Typography>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>or</Divider>

            {/* Google Sign Up */}
            <Button
              type="button"
              onClick={handleGoogleSignUp}
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
              Continue with Google
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default SignUpPage;