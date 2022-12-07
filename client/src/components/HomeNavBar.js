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
  const [text, setText] = useState("");
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleKeyPress = (event) => {
    if (event.code === "Enter") {
      console.log("Searching: " + text);
      store.setSearchText(text);
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
    console.log(text);
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
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => store.setSort("NAME")}
        style={store.currentSort == "NAME" ? { backgroundColor: "gray" } : {}}
      >
        Name (A-Z)
      </MenuItem>
      <MenuItem
        onClick={() => store.setSort("DATE")}
        style={store.currentSort == "DATE" ? { backgroundColor: "gray" } : {}}
      >
        Publish Date (Newest)
      </MenuItem>
      <MenuItem
        onClick={() => store.setSort("LISTENS")}
        style={
          store.currentSort == "LISTENS" ? { backgroundColor: "gray" } : {}
        }
      >
        Listens (High - Low)
      </MenuItem>
      <MenuItem
        onClick={() => store.setSort("LIKES")}
        style={store.currentSort == "LIKES" ? { backgroundColor: "gray" } : {}}
      >
        Likes (High - Low)
      </MenuItem>
      <MenuItem
        onClick={() => store.setSort("DISLIKES")}
        style={
          store.currentSort == "DISLIKES" ? { backgroundColor: "gray" } : {}
        }
      >
        Dislikes (High - Low)
      </MenuItem>
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
            <Button
              style={
                store.currentView == "HOME"
                  ? { borderBottom: "5px solid blue" }
                  : {}
              }
            >
              <HomeIcon
                onClick={() => store.setView("HOME")}
                style={{ fontSize: "6vh" }}
              />
            </Button>
            <Button
              style={
                store.currentView == "ALL"
                  ? { borderBottom: "5px solid blue" }
                  : {}
              }
            >
              <GroupsIcon
                onClick={() => store.setView("ALL")}
                style={{ fontSize: "6vh" }}
              />
            </Button>
            <Button
              style={
                store.currentView == "USER"
                  ? { borderBottom: "5px solid blue" }
                  : {}
              }
            >
              <PersonIcon
                onClick={() => store.setView("USER")}
                style={{ fontSize: "6vh" }}
              />
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
              onKeyPress={handleKeyPress}
              onChange={handleChange}
              value={text}
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
