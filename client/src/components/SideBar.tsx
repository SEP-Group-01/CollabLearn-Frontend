
import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate, useParams } from "react-router-dom";

import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import type { To } from "react-router-dom";

// Icons
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { logout } from "../api/authApi";

interface SidebarMenuItemProps {
  title: string;
  to: To;
  icon: ReactNode;
  selected: string;
  setSelected: (title: string) => void;
  collapsed: boolean;
}

interface SidebarComponentProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    position?: "fixed" | "static";

}

const SidebarMenuItem = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  collapsed,
}: SidebarMenuItemProps) => {
  return (
    <MenuItem
      icon={icon}
      active={selected === title}
      onClick={() => setSelected(title)}
      component={<Link to={to} />}
      style={{
        color: "white",
        fontWeight: selected === title ? "bold" : "normal",
      }}
    >
      {!collapsed && title}
    </MenuItem>
  );
};

const SidebarComponent = ({ collapsed, setCollapsed }: SidebarComponentProps) => {
  const [selected, setSelected] = useState<string>("Home");
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const handleToggle = () => setCollapsed((prev) => !prev);

  const sidebarWidth = collapsed ? 80 : 250;

  const sidebarStyles: React.CSSProperties = {
    position:window.innerWidth < 900 ? "static" : "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: sidebarWidth,
    backgroundColor: "#1a237e",
    color: "white",
    overflowY: "auto",
    transition: "width 0.3s ease",
    zIndex: 1300,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar collapsed={collapsed} style={sidebarStyles}>
        <Menu>

          {/* Toggle */}
          {collapsed ? (
            <Box
              onClick={handleToggle}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                color: "white",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }
              }}
            >
              <img src="/favicon.svg" alt="CollabLearn" width="32" height="32" />
              <MenuOutlinedIcon sx={{ color: "white", fontSize: "1rem" }} />
            </Box>
          ) : (
            <MenuItem
              icon={null}
              onClick={handleToggle}
              style={{ 
                color: "white", 
                marginBottom: 12, 
                padding: "12px 16px"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img src="/favicon.svg" alt="CollabLearn logo" width="32" height="32" />
                  <Box
                    component="span"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "white",
                      letterSpacing: "0.5px"
                    }}
                  >
                    CollabLearn
                  </Box>
                </Box>
                <ChevronLeftIcon sx={{ color: "white" }} />
              </Box>
            </MenuItem>
          )}

          {/* Profile */}
          <SidebarMenuItem
            title="profile"
            to="/profile"
            icon={<AccountCircleOutlinedIcon sx={{ color: "white" }} />}
            selected={selected}
            setSelected={setSelected}
            collapsed={collapsed}
          />

          {/* Menu Items */}
          <SidebarMenuItem
            title="Home"
            to="/"
            icon={<HomeOutlinedIcon sx={{ color: "white" }} />}
            selected={selected}
            setSelected={setSelected}
            collapsed={collapsed}
          />

          {/* Workspaces submenu */}
          <SubMenu
            label={!collapsed ? "Workspaces" : ""}
            icon={<GroupsOutlinedIcon sx={{ color: "white" }} />}
            style={{ color: "white" }}
            defaultOpen={collapsed}
          >
            <SidebarMenuItem
              title="Registered Workspaces"
              to="/Workspaces-list"
              icon={null}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
          </SubMenu>

          <SidebarMenuItem
            title="Generate Study Plan"
            to="/study-plan"
            icon={<FormatListBulletedOutlinedIcon sx={{ color: "white" }} />}
            selected={selected}
            setSelected={setSelected}
            collapsed={collapsed}
          />

          {workspaceId && (
            <SidebarMenuItem
              title="Forum"
              to={`/workspace/${workspaceId}/forum`}
              icon={<ForumOutlinedIcon sx={{ color: "white" }} />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
          )}


          {/* <SidebarMenuItem
            title="Sign Out"
            to="/login"
            icon={<LogoutOutlinedIcon sx={{ color: "white" }} />}
            selected={selected}
            setSelected={setSelected}
            collapsed={collapsed}
          /> */}
          <MenuItem
  icon={<LogoutOutlinedIcon sx={{ color: "white" }} />}
  onClick={async () => {
    try {
      logout(); // Call the logout function to clear auth data
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  }}
  style={{
    color: "white",
    fontWeight: selected === "Sign Out" ? "bold" : "normal",
  }}
>
  {!collapsed && "Sign Out"}
</MenuItem>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarComponent;
