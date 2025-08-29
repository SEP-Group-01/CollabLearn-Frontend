import { useState } from "react";
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

// Mock Data
const mockUserData = {
  id: "1",
  fullName: "John Doe",
  email: "john.doe@university.edu",
  userType: "student",
  bio: "Computer Science student passionate about machine learning and web development. Always eager to learn new technologies and collaborate on interesting projects.",
  location: "San Francisco, CA",
  university: "Stanford University",
  major: "Computer Science",
  year: "Junior",
  joinedDate: "2024-01-15",
  languages: ["English", "Spanish", "Python", "JavaScript"],
  interests: ["Machine Learning", "Web Development", "Data Science", "AI"],
  stats: {
    studyGroups: 5,
    studyHours: 127,
    completedCourses: 8,
    achievements: 12,
  },
  enrolledGroups: [
    { id: "g1", name: "Machine Learning Fundamentals" },
    { id: "g2", name: "React.js Study Group" },
    { id: "g3", name: "Data Science Enthusiasts" },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(mockUserData);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 250;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData(mockUserData);
    }
  };

  const handleSave = () => {
    console.log("Saving profile data:", editData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box sx={{ ml: `${sidebarWidth}px`, flexGrow: 1, p: 3 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box position="relative">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: "3rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {mockUserData.fullName.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
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

              <Box flexGrow={1}>
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={editData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      value={editData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {mockUserData.fullName}
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      {mockUserData.bio}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {mockUserData.interests.map((interest, index) => (
                        <Chip key={index} label={interest} size="small" />
                      ))}
                    </Box>
                  </>
                )}
              </Box>

              <Box>
                {isEditing ? (
                  <Box display="flex" gap={1}>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="outlined" startIcon={<Cancel />} onClick={handleEditToggle}>
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button variant="outlined" startIcon={<Edit />} onClick={handleEditToggle}>
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Info + Groups */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              {/* Personal Info */}
              <Box
                sx={{
                  flexBasis: { xs: '100%', md: '50%' },
                  minWidth: 0,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Personal Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={
                        isEditing ? (
                          <TextField
                            size="small"
                            value={editData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            fullWidth
                          />
                        ) : (
                          mockUserData.email
                        )
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <School />
                    </ListItemIcon>
                    <ListItemText
                      primary="University"
                      secondary={
                        isEditing ? (
                          <TextField
                            size="small"
                            value={editData.university}
                            onChange={(e) => handleInputChange("university", e.target.value)}
                            fullWidth
                          />
                        ) : (
                          mockUserData.university
                        )
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={
                        isEditing ? (
                          <TextField
                            size="small"
                            value={editData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            fullWidth
                          />
                        ) : (
                          mockUserData.location
                        )
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Joined"
                      secondary={new Date(mockUserData.joinedDate).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </Box>

              {/* Enrolled Groups */}
              <Box
                sx={{
                  flexBasis: { xs: '100%', md: '50%' },
                  minWidth: 0,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Enrolled Groups
                </Typography>
                <List dense>
                  {mockUserData.enrolledGroups.map((group) => (
                    <ListItem key={group.id} divider>
                      <ListItemText primary={group.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mt: 4,
              }}
            >
            <Box
              sx={{
                flexBasis: { xs: '50%', md: '25%' },
                minWidth: 0,
              }}
            >
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Groups color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {mockUserData.stats.studyGroups}
                </Typography>
                <Typography color="text.secondary">Study Groups</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box
            sx={{
              flexBasis: { xs: '50%', md: '25%' },
              minWidth: 0,
            }}
          >
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <School color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {mockUserData.stats.studyHours}
                </Typography>
                <Typography color="text.secondary">Study Hours</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box
            sx={{
              flexBasis: { xs: '50%', md: '25%' },
              minWidth: 0,
            }}
          >
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <BookmarkBorder color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {mockUserData.stats.completedCourses}
                </Typography>
                <Typography color="text.secondary">Completed</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box
            sx={{
              flexBasis: { xs: '50%', md: '25%' },
              minWidth: 0,
            }}
          >
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <EmojiEvents color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {mockUserData.stats.achievements}
                </Typography>
                <Typography color="text.secondary">Achievements</Typography>
              </CardContent>
            </Card>
          </Box>
          </Box>
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
            <Button variant="outlined" component="label" fullWidth>
              Choose File
              <input type="file" hidden accept="image/*" />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
            <Button variant="contained">Upload</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
