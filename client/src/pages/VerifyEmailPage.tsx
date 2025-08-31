import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { verifyEmail } from '../api/authApi';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setError('No verification token provided');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Email verification failed');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    handleVerification();
  }, [token]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <Stack spacing={3} alignItems="center">
            {loading && (
              <>
                <CircularProgress size={60} color="primary" />
                <Typography variant="h5" component="h1" color="text.primary">
                  Verifying your email...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please wait while we verify your email address.
                </Typography>
              </>
            )}

            {!loading && success && (
              <>
                <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
                <Typography variant="h4" component="h1" color="success.main" fontWeight="bold">
                  Email Verified!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your email has been successfully verified. You can now access all features of your account.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoHome}
                  sx={{
                    mt: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Go to Home
                </Button>
              </>
            )}

            {!loading && error && (
              <>
                <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
                <Typography variant="h4" component="h1" color="error.main" fontWeight="bold">
                  Verification Failed
                </Typography>
                <Alert severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
                <Typography variant="body2" color="text.secondary">
                  The verification link may be invalid or expired. Please try requesting a new verification email.
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGoHome}
                  sx={{
                    mt: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Go to Home
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyEmailPage;
