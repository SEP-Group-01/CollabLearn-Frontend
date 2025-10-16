import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  PersonAdd,
  DeleteOutlined,
  Email,
  Close,
  Add,
  CheckCircle,
} from '@mui/icons-material';
import { validateEmail, sendBulkInvites, getWorkspaceInvites, deleteInvite } from '../api/workspacesApi';
import type { Invite, EmailWithStatus, InviteMembersModalProps, EmailValidationResult } from '../types/WorkspaceInterfaces';

export default function InviteMembersModal({ 
  open, 
  onClose, 
  workspaceId, 
  workspaceTitle 
}: InviteMembersModalProps) {
  const [email, setEmail] = useState('');
  const [emailsWithValidation, setEmailsWithValidation] = useState<EmailWithStatus[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing invites when modal opens
  useEffect(() => {
    if (open && workspaceId) {
      fetchInvites();
    }
  }, [open, workspaceId]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorkspaceInvites(workspaceId);
      
      // Ensure we're working with an array
      // The API might return an object with an 'invites' property or directly an array
      let invitesArray: Invite[] = [];
      if (Array.isArray(response)) {
        invitesArray = response;
      } else if (response && Array.isArray(response.invites)) {
        invitesArray = response.invites;
      } else if (response && Array.isArray(response.data)) {
        invitesArray = response.data;
      } else {
        console.warn('Unexpected invites response format:', response);
        invitesArray = [];
      }
      
      setInvites(invitesArray);
    } catch (err) {
      console.error('Error fetching invites:', err);
      setError('Failed to load invites');
      setInvites([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getValidationWarnings = () => {
    // Since we now only allow organization members who aren't workspace members,
    // we don't need to show warnings anymore as all added emails are valid
    return [];
  };

  const handleSendInvite = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const emailToAdd = email.trim();
    
    // Check if email is already in the list
    if (emailsWithValidation.some(item => item.email === emailToAdd)) {
      setError('Email is already in the list');
      return;
    }

    try {
      setValidating(true);
      setError(null);
      
      // Validate the single email
      const validationResponse = await validateEmail(workspaceId, emailToAdd);
      
      // Extract validation result for the single email
      let validation: EmailValidationResult | undefined;
      if (validationResponse?.results) {
        validation = validationResponse.results;
      } else if (validationResponse?.data) {
        validation = validationResponse.data;
      } else {
        // Handle case where response is the validation object directly
        validation = validationResponse;
      }
      
      // Check validation results and provide strict feedback
      if (!validation?.existsInOrganization) {
        setError(`Cannot add ${emailToAdd}: User is not in the organization`);
        return;
      }
      
      if (validation?.isWorkspaceMember) {
        setError(`Cannot add ${emailToAdd}: Already a member of this workspace`);
        return;
      }
      
      // Only allow users who are in organization but not workspace members
      if (validation?.existsInOrganization && !validation?.isWorkspaceMember) {
        // Create email with validation
        const emailWithValidation: EmailWithStatus = {
          email: emailToAdd,
          validation: validation
        };
        
        // Add to list
        setEmailsWithValidation([...emailsWithValidation, emailWithValidation]);
        setSuccess(`${emailToAdd} added to invite list`);
      } else {
        setError(`Cannot add ${emailToAdd}: Invalid user status`);
        return;
      }
      
    } catch (err) {
      console.error('Error validating email:', err);
      setError('Could not validate email. Please check the email address and try again.');
      return;
    } finally {
      setValidating(false);
      setEmail('');
    }
  };

  const handleSendBulkInvites = async () => {
    if (emailsWithValidation.length === 0) {
      setError('Please add at least one email address');
      return;
    }

    // Since we only allow valid organization members who aren't workspace members,
    // all emails in the list are valid to invite
    const validEmails = emailsWithValidation.map(item => item.email);

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      await sendBulkInvites(workspaceId, validEmails);
      
      setSuccess(`Invites sent to ${validEmails.length} email${validEmails.length > 1 ? 's' : ''}`);
      setEmailsWithValidation([]);
      
      // Refresh invites list
      await fetchInvites();
    } catch (err) {
      console.error('Error sending invites:', err);
      setError('Failed to send invites. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailsWithValidation(emailsWithValidation.filter(item => item.email !== emailToRemove));
    setSuccess(null); // Clear success message when removing emails
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear messages when user starts typing
    if (error || success) {
      setError(null);
      setSuccess(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendInvite();
    }
  };

  const handleDeleteInvite = async (inviteId: string, email: string) => {
    try {
      await deleteInvite(inviteId);
      setSuccess(`Invite to ${email} deleted`);
      
      // Refresh invites list
      await fetchInvites();
    } catch (err) {
      console.error('Error deleting invite:', err);
      setError('Failed to delete invite');
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailsWithValidation([]);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Accepted':
        return 'success';
      case 'Declined':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(33,150,243,0.15)',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(120deg, #e3f2fd 0%, #fff 100%)',
          borderBottom: '1px solid #e3f2fd',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
        }}
      >
        <PersonAdd sx={{ color: '#1976d2' }} />
        <Box flex={1}>
          <Typography variant="h6" fontWeight={700} color="#1976d2">
            Invite Members
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {workspaceTitle}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Send New Invite Section */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={2} color="#1976d2">
            Send New Invites
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontWeight: 500 }}>
            You can only invite users who are in your organization but not yet members of this workspace.
          </Typography>
          
          {/* Email Input and Add Button */}
          <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
            <TextField
              fullWidth
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              disabled={validating}
              placeholder="Enter email address and press Enter or click Add"
              variant="outlined"
              size="medium"
              helperText={validating ? "Validating email..." : ""}
              InputProps={{
                startAdornment: <Email sx={{ color: '#1976d2', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#1976d2',
                  fontWeight: 500,
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleSendInvite}
              disabled={validating || !email.trim()}
              startIcon={validating ? <CircularProgress size={16} /> : <Add />}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                minWidth: 120,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': { borderColor: '#1565c0', bgcolor: 'rgba(25, 118, 210, 0.04)' },
                '&:disabled': { borderColor: '#ccc', color: '#ccc' },
              }}
            >
              {validating ? 'Validating...' : 'Add'}
            </Button>
          </Box>

          {/* Email Chips Display */}
          {emailsWithValidation.length > 0 && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
                Emails to invite ({emailsWithValidation.length}):
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {emailsWithValidation.map((emailItem, index) => {
                  // Since we only allow organization members who aren't workspace members,
                  // all chips should be green and ready to invite
                  let chipColor = '#e8f5e8';
                  let textColor = '#2e7d32';
                  let icon = <CheckCircle fontSize="small" />;
                  let tooltip = 'Ready to invite (organization member)';
                  
                  return (
                    <Chip
                      key={index}
                      label={emailItem.email}
                      title={tooltip}
                      icon={icon}
                      onDelete={() => handleRemoveEmail(emailItem.email)}
                      deleteIcon={<Close />}
                      size="medium"
                      sx={{
                        bgcolor: chipColor,
                        color: textColor,
                        fontWeight: 500,
                        cursor: 'help',
                        '& .MuiChip-deleteIcon': {
                          color: textColor,
                          '&:hover': {
                            color: '#d32f2f',
                          },
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Validation Warnings */}
          {emailsWithValidation.length > 0 && getValidationWarnings().length > 0 && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Email Validation Warnings:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {getValidationWarnings().map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Send Bulk Invites Button */}
          {emailsWithValidation.length > 0 && (
            <Button
              variant="contained"
              onClick={handleSendBulkInvites}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <PersonAdd />}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              {submitting 
                ? 'Sending...' 
                : `Send ${emailsWithValidation.length} Invite${emailsWithValidation.length > 1 ? 's' : ''}`
              }
            </Button>
          )}
        </Box>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Existing Invites Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={2} color="#1976d2">
            Pending Invites
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={40} />
            </Box>
          ) : (!Array.isArray(invites) || invites.length === 0) ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={4}
              sx={{
                backgroundColor: '#f8fafe',
                borderRadius: 2,
                border: '1px dashed #bbdefb',
              }}
            >
              <Email sx={{ fontSize: 48, color: '#bbdefb', mb: 1 }} />
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                No invites sent yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send your first invite using the form above
              </Typography>
            </Box>
          ) : (
            <List sx={{ bgcolor: '#f8fafe', borderRadius: 2, p: 0 }}>
              {Array.isArray(invites) && invites.map((invite, index) => {
                console.log('Invite data:', invite); // Debug log to see invite structure
                return (
                <React.Fragment key={invite.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {invite.email}
                          </Typography>
                          <Chip
                            label={invite.status}
                            size="small"
                            color={getStatusColor(invite.status) as any}
                            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Sent on {new Date(invite.created_at).toLocaleDateString()}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      {invite.status === 'Pending' && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteInvite(invite.id, invite.email)}
                          sx={{
                            color: '#f44336',
                            mr: 1,
                            '&:hover': {
                              bgcolor: 'rgba(244, 67, 54, 0.04)',
                            },
                          }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                      {/* Debug: Always show delete button to test */}
                      {invite.status !== 'Pending' && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                          Status: {invite.status}
                        </Typography>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < invites.length - 1 && <Divider />}
                </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1565c0',
              bgcolor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}