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
      navigate("/group-list/" + input);
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
        height: { xs: 48, md: 56 },
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        boxShadow: "none",
        px: 1,
        backgroundColor: "#fff",
      }}
    >
      <IconButton sx={{ p: 1 }}>
        <img src={assets.search_icon} alt="Search Icon" style={{ height: 24 }} />
      </IconButton>

      <InputBase
        sx={{ ml: 1, flex: 1, color: "text.secondary" }}
        placeholder="Search for courses"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          textTransform: "none",
          px: { xs: 3, md: 5 },
          py: { xs: 1, md: 1.5 },
          borderRadius: 1,
          ml: 1,
        }}
      >
        Search
      </Button>
    </Paper>
  );
};

export default SearchBar;
