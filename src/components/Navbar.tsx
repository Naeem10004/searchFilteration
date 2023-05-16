import {
  Avatar,
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import React from "react";

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "whitesmoke" }}>
      <AppBar position="static" sx={{ bgcolor: "#d4e3e6", height: "100px" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="div"
              fontWeight={700}
              sx={{ color: "orange" }}
            >
              SAF
            </Typography>
          </Box>

          <Box display={"flex"}>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <Button sx={{ color: "Black" }}>
              Adam
              <KeyboardArrowDown />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
