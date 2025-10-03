import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Backdrop,
} from '@mui/material';
import {
  Warning,
  Info,
  Error as ErrorIcon,
  CheckCircle,
} from '@mui/icons-material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info' | 'success';
  loading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
  loading = false,
}: ConfirmationDialogProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'error':
        return {
          icon: <ErrorIcon sx={{ color: '#d32f2f', fontSize: 32 }} />,
          confirmButtonColor: '#d32f2f',
          confirmButtonHover: '#b71c1c',
        };
      case 'warning':
        return {
          icon: <Warning sx={{ color: '#f57c00', fontSize: 32 }} />,
          confirmButtonColor: '#f57c00',
          confirmButtonHover: '#e65100',
        };
      case 'info':
        return {
          icon: <Info sx={{ color: '#1976d2', fontSize: 32 }} />,
          confirmButtonColor: '#1976d2',
          confirmButtonHover: '#1565c0',
        };
      case 'success':
        return {
          icon: <CheckCircle sx={{ color: '#2e7d32', fontSize: 32 }} />,
          confirmButtonColor: '#2e7d32',
          confirmButtonHover: '#1b5e20',
        };
      default:
        return {
          icon: <Warning sx={{ color: '#f57c00', fontSize: 32 }} />,
          confirmButtonColor: '#f57c00',
          confirmButtonHover: '#e65100',
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {config.icon}
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: 2,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            borderColor: '#e0e0e0',
            color: 'text.secondary',
            '&:hover': {
              borderColor: '#bdbdbd',
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            bgcolor: config.confirmButtonColor,
            '&:hover': {
              bgcolor: config.confirmButtonHover,
            },
            '&:disabled': {
              bgcolor: '#e0e0e0',
              color: '#9e9e9e',
            },
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}