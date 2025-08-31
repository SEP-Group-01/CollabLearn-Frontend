import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { resetPassword } from "../api/authApi";
import loginImage from '../assets/login.jpeg';

function ResetPasswordPage() {
  const [formData, setFormData] = useState({ 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validatePasswords = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid reset token. Please request a new password reset.");
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(token, formData.newPassword);
      setSuccess(true);
      
      // Redirect to home after showing success message
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An error occurred while resetting password");
    } finally {
      setLoading(false);
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 400, p: 5, borderRadius: 4, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" color="error" mb={2}>
            Invalid Reset Link
          </Typography>
          <Typography color="#64748b" mb={3}>
            This password reset link is invalid or has expired. Please request a new password reset.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: "#2563eb",
              color: "#fff",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { bgcolor: "#1e40af" },
            }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left side - Illustration */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "50%",
          bgcolor: "linear-gradient(135deg, #bbf7d0 0%, #eff6ff 100%)",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        <Box sx={{ maxWidth: 400 * 6 }}>
          <img
            src={loginImage}
            alt="Reset password illustration"
            width={400 * 2}
            height={300 * 2}
            style={{ width: "100%", borderRadius: 12, boxShadow: "0 4px 24px rgba(16,185,129,0.08)" }}
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
              Reset Password
            </Typography>
            <Typography color="#64748b" fontSize={14}>
              Enter your new password below
            </Typography>
          </Box>

          {/* Success Message */}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography fontWeight={600} fontSize={15}>
                Password Reset Successful!
              </Typography>
              <Typography fontSize={13}>
                Your password has been updated. Redirecting to home page...
              </Typography>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* New Password */}
            <TextField
              label="New Password"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              margin="normal"
              value={formData.newPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
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

            {/* Confirm Password */}
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
              InputLabelProps={{ sx: { fontWeight: 500 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || success}
              sx={{
                bgcolor: "#2563eb",
                color: "#fff",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                fontSize: 16,
                mt: 3,
                mb: 2,
                textTransform: "none",
                "&:hover": { bgcolor: "#1e40af" },
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Changing Password..." : success ? "Password Changed!" : "Change Password"}
            </Button>

            {/* Back to Login */}
            <Box textAlign="center" mt={2}>
              <Typography color="#64748b" fontSize={14}>
                Remember your password?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: "#2563eb", 
                    fontSize: 14, 
                    textTransform: "none", 
                    minWidth: 0, 
                    p: 0,
                    fontWeight: 500
                  }}
                >
                  Back to Login
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default ResetPasswordPage;
