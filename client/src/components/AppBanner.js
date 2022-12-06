import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";

import EditToolbar from "./EditToolbar";

import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    auth.logoutUser();
  };

  const menuId = "primary-search-account-menu";
  const loggedOutMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/login/">
        <MenuItem onClick={handleMenuClose}>Login</MenuItem>
      </Link>

      <Link to="/register/">
        {" "}
        <MenuItem onClick={handleMenuClose}>Create New Account</MenuItem>
      </Link>
    </Menu>
  );
  const loggedInMenu = (
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
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  let menu = loggedOutMenu;
  if (auth.loggedIn) {
    menu = loggedInMenu;
  }

  function getAccountMenu(loggedIn) {
    let userInitials = auth.getUserInitials();
    console.log("userInitials: " + userInitials);
    if (loggedIn)
      return (
        <div
          style={{
            border: "5px solid black",
            borderRadius: "50%",
            width: "7vh",
            height: "7vh",
            verticalAlign: "center",
            fontSize: "4vh",
            backgroundColor: "#f00",
          }}
        >
          {userInitials}
        </div>
      );
    else return <AccountCircle style={{ fontSize: "6vh" }} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ background: "#aaa" }}>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Link to="/">
              <img
                src="/logo.png"
                style={{ height: "auto", maxHeight: "9vh" }}
              ></img>
            </Link>
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="xl"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {getAccountMenu(auth.loggedIn)}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menu}
    </Box>
  );
}
