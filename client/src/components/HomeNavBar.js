import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";

import EditToolbar from "./EditToolbar";
import { TextField } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function HomeNavBar() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const SortByMenu = (
    <Menu
      anchorEl={anchorEl}
      // anchorOrigin={
      //   {
      //     // vertical: "top",
      //     // horizontal: "right",
      //   }
      // }
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>Name (A-Z)</MenuItem>
      <MenuItem>Publish Date (Newest)</MenuItem>
      <MenuItem>Listens (High - Low)</MenuItem>
      <MenuItem>Likes (High - Low)</MenuItem>
      <MenuItem>Dislikes (High - Low)</MenuItem>
    </Menu>
  );

  let editToolbar = "";
  let menu = SortByMenu;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ background: "#ddd" }}>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Button>
              <HomeIcon style={{ fontSize: "6vh" }} />
            </Button>
            <Button>
              <GroupsIcon style={{ fontSize: "6vh" }} />
            </Button>
            <Button>
              <PersonIcon style={{ fontSize: "6vh" }} />
            </Button>
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              style={{
                marginLeft: "10%",
                width: "50%",
                backgroundColor: "white",
                fontSize: "5vh",
              }}
              placeholder="Search"
            />
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="xl"
              edge="end"
              aria-label="sort by menu"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              Sort
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menu}
    </Box>
  );
}
