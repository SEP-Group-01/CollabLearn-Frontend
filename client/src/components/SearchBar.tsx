import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, InputBase, IconButton, Button, Paper } from "@mui/material";
import { assets } from "../assets/assets";

interface SearchBarProps {
  data?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data || "");

  const onSearchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      navigate("/workspaces-list/" + input);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={onSearchHandler}
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: 600,
        width: "100%",
        height: { xs: 54, md: 62 },
        border: "none",
        borderRadius: "999px",
        boxShadow: "0 4px 24px rgba(59,130,246,0.13)",
        px: { xs: 1.5, md: 3 },
        background: "linear-gradient(90deg, #e0f2fe 0%, #f8fafc 100%)",
        transition: "box-shadow 0.2s, background 0.2s",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(59,130,246,0.18)",
          background: "linear-gradient(90deg, #bae6fd 0%, #e0f2fe 100%)",
        },
      }}
    >
      <IconButton sx={{ p: 1, ml: 1, bgcolor: "#fff", borderRadius: "50%", boxShadow: "0 2px 8px #bae6fd" }}>
        <img src={assets.search_icon} alt="Search Icon" style={{ height: 26 }} />
      </IconButton>

      <InputBase
        sx={{
          ml: 2,
          flex: 1,
          color: "#2563eb",
          fontSize: 18,
          fontWeight: 500,
          border: "none",
          background: "transparent",
          "&::placeholder": {
            color: "#60a5fa",
            opacity: 1,
            fontWeight: 400,
            fontSize: 17,
          },
        }}
        placeholder="Search for courses or groups"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          textTransform: "none",
          px: { xs: 2, md: 3 },
          py: { xs: 1, md: 1.2 },
          borderRadius: "999px",
          fontWeight: 600,
          fontSize: 15,
          boxShadow: "0 2px 8px #bae6fd",
          ml: 2,
          minWidth: 70,
          background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
          "&:hover": {
            background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
          },
        }}
      >
        Search
      </Button>
    </Paper>
  );
};

export default SearchBar;
