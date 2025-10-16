import { useState, useEffect } from "react";
import SidebarComponent from "../components/SideBar";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit,
  Email,
  School,
  LocationOn,
  CalendarToday,
  EmojiEvents,
  BookmarkBorder,
  Groups,
  Camera,
  Save,
  Cancel,
} from "@mui/icons-material";
import { getUserData, editUser } from "../api/authApi";
import type { User } from "../types/AuthInterfaces";

const daysOfWeek = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [editData, setEditData] = useState<{
    first_name: string;
    last_name: string;
    image_file?: string;
    remove_image?: boolean;
  }>({
    first_name: "",
    last_name: "",
  });
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sidebarWidth = collapsed ? 80 : 250;

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      setUserData(user);
      if (user) {
        setEditData({
          first_name: user.first_name,
          last_name: user.last_name,
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null);
    if (!isEditing && userData) {
      setEditData({
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const updateData: any = {};
      
      if (editData.first_name !== userData.first_name) {
        updateData.first_name = editData.first_name;
      }
      if (editData.last_name !== userData.last_name) {
        updateData.last_name = editData.last_name;
      }
      if (editData.image_file) {
        updateData.image_file = editData.image_file;
      }
      if (editData.remove_image) {
        updateData.remove_image = editData.remove_image;
      }

      const response = await editUser(updateData);
      
      // Update local user data
      setUserData(response.user);
      setIsEditing(false);
      setEditData({
        first_name: response.user.first_name,
        last_name: response.user.last_name,
      });
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditData(prev => ({
          ...prev,
          image_file: result,
          remove_image: false,
        }));
        setAvatarDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEditData(prev => ({
      ...prev,
      image_file: undefined,
      remove_image: true,
    }));
    setAvatarDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "linear-gradient(135deg, #e0f7fa 0%, #f8fafc 100%)" }}>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box sx={{ ml: `${sidebarWidth}px`, flexGrow: 1, p: { xs: 1, md: 2 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "linear-gradient(135deg, #e0f7fa 0%, #f8fafc 100%)" }}>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Box sx={{ ml: `${sidebarWidth}px`, flexGrow: 1, p: { xs: 1, md: 2 } }}>
          <Alert severity="error">Failed to load user data. Please try refreshing the page.</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "linear-gradient(135deg, #e0f7fa 0%, #f8fafc 100%)" }}>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box sx={{ ml: `${sidebarWidth}px`, flexGrow: 1, p: { xs: 1, md: 2 } }}>
        
       
        
        {/* Profile Header */}
        <Card sx={{ mb: 2, borderRadius: 4, boxShadow: "0 4px 24px rgba(59,130,246,0.08)" }}>
          <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap">
              {/* Left: Avatar and Info */}
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Box position="relative">
                  <Avatar
                    src={editData.image_file || userData.image_url}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: "3rem",
                      bgcolor: "primary.main",
                      boxShadow: 2,
                    }}
                  >
                    {`${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      border: "2px solid",
                      borderColor: "divider",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                    size="small"
                    onClick={() => setAvatarDialogOpen(true)}
                  >
                    <Camera fontSize="small" />
                  </IconButton>
                </Box>
                <Box flexGrow={1} minWidth={220}>
                  {isEditing ? (
                    <>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={editData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={editData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {`${userData.first_name} ${userData.last_name}`}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        Email: {userData.email}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              {/* Top Right: Edit Profile Button */}
              <Box sx={{ mt: { xs: 2, md: 0 } }}>
                {isEditing ? (
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="contained" 
                      startIcon={<Save />} 
                      onClick={handleSave} 
                      sx={{ borderRadius: 2 }}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Cancel />} 
                      onClick={handleEditToggle} 
                      sx={{ borderRadius: 2 }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button variant="outlined" startIcon={<Edit />} onClick={handleEditToggle} sx={{ borderRadius: 2 }}>
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
             {/* Status Section */}
        <Box sx={{
          display: "flex",
          gap: 2, // reduced gap
          mb: 2,
          mt:3, // reduced margin-bottom
          flexWrap: "wrap",
          justifyContent: { xs: "center", md: "flex-start" }
        }}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, minWidth: 140, textAlign: "center", px: 1.5, py: 1.5 }}>
            <Groups color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {userData.stats?.workspaceCount || 0}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Workspaces</Typography>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 1, minWidth: 140, textAlign: "center", px: 1.5, py: 1.5 }}>
            <School color="success" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {userData.stats?.studyHours || 0}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Study Hours</Typography>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 1, minWidth: 140, textAlign: "center", px: 1.5, py: 1.5 }}>
            <BookmarkBorder color="info" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {userData.stats?.completedTasks || 0}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Completed Tasks</Typography>
          </Card>
        </Box>

          </CardContent>
        </Card>

        {/* Info + Groups */}
        <Card sx={{ mb: 4, borderRadius: 4, boxShadow: "0 4px 24px rgba(59,130,246,0.06)" }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {/* Left: Personal Info */}
              <Box sx={{ flexBasis: { xs: '100%', md: '55%' }, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={userData.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Joined"
                      secondary={new Date(userData.created_at || new Date()).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </Box>

              {/* 
              Right section with Enrolled Groups & Available Times is hidden as requested
              TODO: Implement these sections later when needed
              */}
            </Box>

          </CardContent>
        </Card>

        {/* Avatar Upload Dialog */}
        <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)}>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" paragraph>
              Upload a new profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
            </Typography>
            <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
              Choose File
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </Button>
            {userData.image_url && (
              <Button 
                variant="outlined" 
                color="error" 
                fullWidth
                onClick={handleRemoveImage}
              >
                Remove Current Image
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
