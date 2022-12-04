import { useContext } from "react";
import AuthContext from "../auth";
import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { AlertTitle } from "@mui/material";

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

export default function MUILoginErrorModal() {
  const { auth } = useContext(AuthContext);
  let error = "";
  if (auth.error) {
    error = auth.error;
  }

  function handleCloseModal(event) {
    auth.closeModal();
  }

  return (
    <Modal open={error !== ""}>
      <Alert
        sx={style}
        severity="error"
        action={
          <Button color="inherit" onClick={handleCloseModal}>
            X
          </Button>
        }
      >
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    </Modal>
  );
}
