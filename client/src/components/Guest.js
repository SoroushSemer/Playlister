import { useContext } from "react";
import AuthContext from "../auth";
import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { AlertTitle } from "@mui/material";
import GlobalStoreContext from "../store";
import { Link } from "@mui/material";
const style = {
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //   width: 400,
  //   bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
};

export default function GuestLoginModal() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  let error = "";
  if (auth.error) {
    error = auth.error;
  }

  function handleCloseModal(event) {
    store.toggleGuestModal();
  }

  return (
    <Modal open={store.guestModal}>
      <Alert
        sx={style}
        severity="error"
        action={
          <Button color="inherit" onClick={handleCloseModal}>
            X
          </Button>
        }
      >
        <AlertTitle>Please Login/Register to continue.</AlertTitle>
        <Link to="/login/">
          <Button
            variant="outlined"
            id="login-button"
            className="splash-button"
          >
            Login
          </Button>
        </Link>
      </Alert>
    </Modal>
  );
}
