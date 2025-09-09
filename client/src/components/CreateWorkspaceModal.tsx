import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  MailOutline as MailIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import DragDropImageUpload from './DragDropImageUpload';

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (workspaceData: WorkspaceFormData) => void;
}

interface WorkspaceFormData {
  title: string;
  description: string;
  tags: string[];
  image: File | null;
  joinPolicy: 'anyone' | 'requests' | 'invites';
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    title: '',
    description: '',
    tags: [],
    image: null,
    joinPolicy: 'anyone',
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: keyof WorkspaceFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      tags: [],
      image: null,
      joinPolicy: 'anyone',
    });
    setCurrentTag('');
    setIsDragOver(false);
    onClose();
  };

  const joinPolicyOptions = [
    {
      value: 'anyone',
      label: 'Anyone can join',
      description: 'Public workspace - anyone can join immediately',
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
    },
    {
      value: 'requests',
      label: 'Join by request',
      description: 'Users must request to join and be approved',
      icon: <MailIcon sx={{ fontSize: 20 }} />,
    },
    {
      value: 'invites',
      label: 'Invite only',
      description: 'Only invited users can join',
      icon: <LockIcon sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: { duration: 0.3, ease: 'easeOut' },
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              py: 3,
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Create New Workspace
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Set up your collaborative learning environment
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Title */}
              <Box>
                <TextField
                  fullWidth
                  label="Workspace Title"
                  placeholder="Enter workspace title..."
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Description */}
              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Describe your workspace purpose and goals..."
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Tags Section */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Tags
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Add tags to help others find your workspace..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddTag}
                            disabled={!currentTag.trim()}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' },
                              '&:disabled': { bgcolor: 'grey.300' },
                            }}
                            size="small"
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <AnimatePresence>
                    {formData.tags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Chip
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          color="primary"
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            '& .MuiChip-deleteIcon': {
                              '&:hover': { color: 'error.main' },
                            },
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Box>

              {/* Workspace Image */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Workspace Image
                </Typography>
                <DragDropImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={formData.image}
                  label="Upload workspace image"
                  fullWidth
                  height="180px"
                  dragOverId="workspace-image"
                  isDragOver={isDragOver}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </Box>

              {/* Join Policy */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Join Policy
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={formData.joinPolicy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        joinPolicy: e.target.value as 'anyone' | 'requests' | 'invites',
                      }))
                    }
                    sx={{ gap: 1 }}
                  >
                    {joinPolicyOptions.map((option) => (
                      <Box
                        key={option.value}
                        sx={{
                          border: '1px solid',
                          borderColor:
                            formData.joinPolicy === option.value
                              ? 'primary.main'
                              : 'divider',
                          borderRadius: 2,
                          p: 2,
                          transition: 'all 0.2s ease-in-out',
                          bgcolor:
                            formData.joinPolicy === option.value
                              ? 'primary.light'
                              : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <FormControlLabel
                          value={option.value}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {option.icon}
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {option.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Box>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 'medium',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.title.trim()}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 'medium',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Create Workspace
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateWorkspaceModal;
