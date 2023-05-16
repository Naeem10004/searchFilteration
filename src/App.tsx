import React from "react";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";

import Table from "./components/Table";

function App() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Table />
      </Box>
    </Box>
  );
}

export default App;
