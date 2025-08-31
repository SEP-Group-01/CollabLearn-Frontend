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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
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

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
  availableDays: ["Monday", "Wednesday", "Friday"], // Example default
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
    // Save logic here
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvailableDayChange = (day: string) => {
    setEditData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

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
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: "3rem",
                      bgcolor: "primary.main",
                      boxShadow: 2,
                    }}
                  >
                    {mockUserData.fullName.charAt(0)}
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
                    </>
                  )}
                </Box>
              </Box>
              {/* Top Right: Edit Profile Button */}
              <Box sx={{ mt: { xs: 2, md: 0 } }}>
                {isEditing ? (
                  <Box display="flex" gap={1}>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSave} sx={{ borderRadius: 2 }}>
                      Save
                    </Button>
                    <Button variant="outlined" startIcon={<Cancel />} onClick={handleEditToggle} sx={{ borderRadius: 2 }}>
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
              {mockUserData.stats.studyGroups}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Study Groups</Typography>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 1, minWidth: 140, textAlign: "center", px: 1.5, py: 1.5 }}>
            <School color="success" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {mockUserData.stats.studyHours}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Study Hours</Typography>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 1, minWidth: 140, textAlign: "center", px: 1.5, py: 1.5 }}>
            <BookmarkBorder color="info" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {mockUserData.stats.completedCourses}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Completed</Typography>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 1, minWidth: 140, textAlign: "center", px: 1.5, py: 1.5 }}>
            <EmojiEvents color="warning" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {mockUserData.stats.achievements}
            </Typography>
            <Typography color="text.secondary" fontSize={13}>Achievements</Typography>
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

              {/* Right: Enrolled Groups & Available Times */}
              <Box sx={{ flexBasis: { xs: '100%', md: '45%' }, minWidth: 0 }}>
                {/* Enrolled Groups */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Enrolled Groups
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <List dense>
                  {mockUserData.enrolledGroups.length > 0 ? (
                    mockUserData.enrolledGroups.map((group) => (
                      <ListItem
                        key={group.id}
                        divider
                        sx={{
                          borderRadius: 2,
                          transition: "background 0.2s",
                          "&:hover": { bgcolor: "#e0f2fe" },
                        }}
                      >
                        <ListItemText primary={group.name} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography color="text.secondary" fontSize={14}>
                            No enrolled groups.
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
                {/* Available Study Times */}
                <Typography variant="h6" fontWeight="bold" mt={3} gutterBottom>
                  Available Study Times
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ bgcolor: "#e0f7fa", borderRadius: 2, p: 1, mb: 2 }}>
                  {isEditing ? (
                    <FormGroup row>
                      {daysOfWeek.map((day) => (
                        <FormControlLabel
                          key={day}
                          control={
                            <Checkbox
                              checked={editData.availableDays.includes(day)}
                              onChange={() => handleAvailableDayChange(day)}
                              color="primary"
                            />
                          }
                          label={day}
                        />
                      ))}
                    </FormGroup>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      {mockUserData.availableDays.length > 0 ? (
                        <Typography fontSize={14}>
                          {mockUserData.availableDays.join(", ")}
                        </Typography>
                      ) : (
                        <Typography color="text.secondary" fontSize={14}>
                          No study times selected.
                        </Typography>
                      )}
                    </Box>
                  )}
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
