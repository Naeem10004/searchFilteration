import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  Typography,
  Stack,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

const checkboxStyle = {
  color: "ADB6B0",
  "&.Mui-checked": {
    color: "#ffa500",
  },
};
const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#f57c00", // Change the checkbox color here
          },
        },
      },
    },
  },
});

function Table() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleGroupChange = (event) => {
    const groupName = event.target.value;
    if (event.target.checked) {
      setSelectedGroups((prevGroups) => [...prevGroups, groupName]);
    } else {
      setSelectedGroups((prevGroups) =>
        prevGroups.filter((group) => group !== groupName)
      );
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);
  useEffect(() => {
    const filteredRows = data.filter(
      (row) =>
        row.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedGroups.length === 0 || selectedGroups.includes(row.groups))
    );
    setFilteredData(filteredRows);
  }, [data, searchText, selectedGroups]);
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:3001/users/${selectedRow.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setData((prevData) =>
          prevData.filter((row) => row.id !== selectedRow.id)
        );
        setSelectedRow(null);
        setOpenConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "sex", headerName: "Sex", width: 130 },
    {
      field: "dob",
      headerName: "Place and Date of Birth",
      width: 180,
    },
    {
      field: "groups",
      headerName: "Groups",
      width: 180,
    },
    {
      field: "delete",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <DeleteIcon
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleDeleteClick(params.row)}
        />
      ),
    },
    {
      field: "edit",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <EditIcon
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleEditClick(params.row)}
        />
      ),
    },
  ];
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [group, setGroup] = useState("");
  const [editRowId, setEditRowId] = useState(null);

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const newStudent = {
      id: Math.random(),
      name,
      sex,
      dob: dateOfBirth,
      groups: group,
    };
    console.log(newStudent);

    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => [...prevData, data]);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
    handleCloseModal();
    setName("");
    setSex("");
    setDateOfBirth("");
    setGroup("");
  };
  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setName(row.name);
    setSex(row.sex);
    setDateOfBirth(row.dob);
    setGroup(row.groups);
    setOpenEditModal(true);
  };
  const handleEditSubmit = (event) => {
    event.preventDefault();

    const editedStudent = {
      id: editRowId,
      name,
      sex,
      dob: dateOfBirth,
      groups: group,
    };

    fetch(`http://localhost:3001/users/${editedStudent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) =>
          prevData.map((row) => (row.id === editedStudent.id ? data : row))
        );
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error upda ting data:", error);
      });

    handleCloseEditModal();
  };

  return (
    <Box>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "16ch" },
          display: "flex",
          margin: "10px",
        }}
      >
        <TextField
          onChange={handleSearch}
          variant="filled"
          id="input-with-icon-textfield"
          label="Search for Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            marginLeft: "100px",
            width: "60%",
          }}
        >
          <Box
            sx={{
              color: "gray",
              display: "flex",
            }}
          >
            <Person2OutlinedIcon />
            <Typography>{data.length} students</Typography>
          </Box>
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            Delete
          </Button>

          <Button variant="contained" onClick={handleOpenModal}>
            <AddIcon />
            Add New
          </Button>
          <Box>
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  minWidth: 300,
                }}
              >
                <Typography variant="h5" component="h2">
                  Add New Student
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    sx={{ marginBottom: "10px" }}
                    required
                    fullWidth
                    label="Name"
                    type="text"
                    value={name || ""}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <FormControl sx={{ marginBottom: "10px" }} required fullWidth>
                    <InputLabel>Sex</InputLabel>
                    <Select
                      value={sex}
                      onChange={(event) => setSex(event.target.value)}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ marginBottom: "10px" }}
                    required
                    fullWidth
                    // label="Date of Birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                  />
                  <FormControl sx={{ marginBottom: "10px" }} required fullWidth>
                    <InputLabel>Group</InputLabel>
                    <Select
                      value={group}
                      onChange={(event) => setGroup(event.target.value)}
                    >
                      <MenuItem value="Typography">Typography</MenuItem>
                      <MenuItem value="Biologists">Biologists</MenuItem>
                      <MenuItem value="Chemistry Capital">
                        Chemistry Capital{" "}
                      </MenuItem>
                      <MenuItem value="Web designers">Web designers</MenuItem>
                      <MenuItem value="Black magicians">
                        Black magicians
                      </MenuItem>
                      <MenuItem value="Lame gamer boys">
                        Lame gamer boys
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                      Save
                    </Button>
                    <Button onClick={handleCloseModal} variant="outlined">
                      Cancel
                    </Button>
                  </Box>
                </form>
              </Box>
            </Modal>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box sx={{ marginLeft: "29px" }}>
          <Typography sx={{ color: "gray" }}>
            FILTERS FOR STUDY GROUPS
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyle}
                  checked={selectedGroups.includes("Typography")}
                  onChange={handleGroupChange}
                  value="Typography"
                />
              }
              label="Typography"
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyle}
                  checked={selectedGroups.includes("Biologists")}
                  onChange={handleGroupChange}
                  value="Biologists"
                />
              }
              label="Biologists"
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyle}
                  checked={selectedGroups.includes("Chemistry Capital")}
                  onChange={handleGroupChange}
                  value="Chemistry Capital"
                />
              }
              label="Chemistry Capital"
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyle}
                  checked={selectedGroups.includes("Web designers")}
                  onChange={handleGroupChange}
                  value="Web designers"
                />
              }
              label="Web designers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyle}
                  checked={selectedGroups.includes("Black magicians")}
                  onChange={handleGroupChange}
                  value="Black magicians"
                />
              }
              label="Black magicians"
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyle}
                  checked={selectedGroups.includes("Lame gamer boys")}
                  onChange={handleGroupChange}
                  value="Lame gamer boys"
                />
              }
              label="Lame gamer boys"
            />
          </FormGroup>
        </Box>
        <div style={{ height: 400, width: "100%" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              checkboxSelection
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </ThemeProvider>
          <Dialog
            open={openConfirmation}
            onClose={() => setOpenConfirmation(false)}
          >
            <DialogTitle>{"Delete Row?"}</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this row?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmation(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Modal open={openEditModal} onClose={handleCloseEditModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                minWidth: 300,
              }}
            >
              <Typography variant="h5" component="h2">
                Edit Student
              </Typography>
              <form onSubmit={handleEditSubmit}>
                <TextField
                  sx={{ marginBottom: "10px" }}
                  required
                  fullWidth
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <FormControl sx={{ marginBottom: "10px" }} required fullWidth>
                  <InputLabel>Sex</InputLabel>
                  <Select
                    value={sex}
                    onChange={(event) => setSex(event.target.value)}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ marginBottom: "10px" }}
                  required
                  fullWidth
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />
                <FormControl sx={{ marginBottom: "10px" }} required fullWidth>
                  <InputLabel>Group</InputLabel>
                  <Select
                    value={group}
                    onChange={(event) => setGroup(event.target.value)}
                  >
                    <MenuItem value="Typography">Typography</MenuItem>
                    <MenuItem value="Biologists">Biologists</MenuItem>
                    <MenuItem value="Chemistry Capital">
                      Chemistry Capital{" "}
                    </MenuItem>
                    <MenuItem value="Web designers">Web designers</MenuItem>
                    <MenuItem value="Black magicians">Black magicians</MenuItem>
                    <MenuItem value="Lame gamer boys">Lame gamer boys</MenuItem>
                  </Select>
                </FormControl>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={handleOpenEditModal}
                    type="submit"
                    variant="contained"
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button onClick={handleCloseEditModal} variant="outlined">
                    Cancel
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
        </div>
      </Box>
    </Box>
  );
}

export default Table;
