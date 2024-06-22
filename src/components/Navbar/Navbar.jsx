import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";

const Navbar = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#343a40",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            padding: '1rem'
          }}
        >
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            <div>Quiz system</div>
          </Link>
          <Link
            to="/topics"
            style={{
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Topics
          </Link>
        </div>
      </AppBar>
    </Box>
  );
};

export default Navbar;
