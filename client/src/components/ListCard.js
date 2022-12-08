import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import WorkspaceScreen from "./WorkspaceScreen";
import EditToolbar from "./EditToolbar";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AuthContext from "../auth";

import { Modal, Alert, Button, AlertTitle, Dialog } from "@mui/material";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [editActive, setEditActive] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [text, setText] = useState("");
  //   const [store.error, store.setError] = useState(null);
  //   const [list, setList] = useState({});
  console.log("listcard");
  const { idNamePair, selected } = props;

  async function handleLoadList(event, id) {
    console.log("handleLoadList for " + id);
    if (!event.target.disabled) {
      let _id = event.target.id;
      if (_id.indexOf("list-card-text-") >= 0)
        _id = ("" + _id).substring("list-card-text-".length);

      console.log("load " + event.target.id);

      // CHANGE THE CURRENT LIST
      store.closeCurrentList();
      await store.setCurrentList(id);
      //   setList(store.currentList);
      return true;
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  async function handleOpenList(event) {
    event.stopPropagation();
    console.log("Opening list");
    if (
      store.currentList != null &&
      store.currentList._id != idNamePair._id &&
      idNamePair.published
    )
      idNamePair.listens += 1;
    await handleLoadList(event, idNamePair._id);
    setListOpen(true);
  }
  function handleCloseList(event) {
    event.stopPropagation();
    setListOpen(false);
    // setList({});
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      let allNames = store.idNamePairs.map((a) => a.name);

      console.log(idNamePair.name + " " + text);
      if (idNamePair.name == text || text == "") {
        toggleEdit();
        return;
      } else if (!allNames.includes(text)) {
        async function changeName() {
          store.changeListName(id, text);
        }
        changeName();
        toggleEdit();
        return;
      } else {
        console.log("invalid name");
        store.setError(true);
        // console.log(store.error);
      }
    }
  }

  const handleX = (event) => {
    event.stopPropagation();
    console.log("GOT X");
    store.setError(false);
  };

  function handleUpdateText(event) {
    setText(event.target.value);
  }

  let selectClass = "unselected-list-card";
  if (selected) {
    selectClass = "selected-list-card";
  }
  let cardStatus = false;
  if (store.isListNameEditActive) {
    cardStatus = true;
  }
  let cardColor = "#fff";
  if (idNamePair.published) cardColor = "#aaf";
  if (store.playingList != null && store.playingList._id == idNamePair._id) {
    cardColor = "#dd0";
  }
  let cardElement = (
    <ListItem
      id={idNamePair._id}
      key={idNamePair._id}
      sx={{
        paddingTop: "15px",
        display: "flex",
        // p: 1,
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      style={{
        width: "100%",
        fontSize: "48pt",
        border: "1px solid black",
        backgroundColor: cardColor,
      }}
      onClick={
        store.playingList == null || store.playingList._id != idNamePair._id
          ? (event) => {
              event.stopPropagation();
              if (
                store.playingList != null &&
                store.playingList._id != idNamePair._id &&
                idNamePair.published
              ) {
                idNamePair.listens += 1;
              }
              store.setPlayingList(idNamePair._id);
            }
          : (event) => {
              event.stopPropagation();
            }
      }
      onDoubleClick={
        store.currentList == null ||
        !listOpen ||
        store.currentList._id != idNamePair._id
          ? idNamePair.published
            ? () => {}
            : handleToggleEdit
          : () => {}
      }
    >
      <Dialog open={store.error}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={handleX}>
              X
            </Button>
          }
        >
          <AlertTitle>Invalid Name for Playlist</AlertTitle>
        </Alert>
      </Dialog>

      {/* <Box sx={{ p: 1, flexGrow: 1 }}> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <div style={{ fontSize: "30pt" }}>{idNamePair.name}</div>
          <div style={{ fontSize: "20pt" }}>
            By:{" "}
            <span
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={(event) => {
                event.stopPropagation();
                store.searchUser(idNamePair.owner.username);
              }}
            >
              {idNamePair.owner.username}
            </span>
          </div>
        </div>
        {idNamePair.published ? (
          <div>
            <IconButton
              disabled={auth.user == null}
              onClick={(event) => {
                event.stopPropagation();
                store.likeList(idNamePair._id);
              }}
            >
              <ThumbUpIcon
                style={
                  idNamePair.liked > 0
                    ? { color: "#22f", fontSize: "48pt" }
                    : { fontSize: "48pt", color: "#ddd" }
                }
              />
            </IconButton>
            <span style={{ fontStyle: "normal", fontSize: "30pt" }}>
              {idNamePair.likes}
            </span>
            <IconButton
              disabled={auth.user == null}
              onClick={(event) => {
                event.stopPropagation();
                store.dislikeList(idNamePair._id);
              }}
            >
              <ThumbDownIcon
                style={
                  idNamePair.liked < 0
                    ? { fontSize: "48pt", marginLeft: "2vh", color: "blue" }
                    : { fontSize: "48pt", marginLeft: "2vh", color: "#ddd" }
                }
              />
            </IconButton>
            <span
              style={{
                fontStyle: "normal",
                fontSize: "30pt",
                marginRight: "2vh",
              }}
            >
              {idNamePair.dislikes}
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>

      {store.currentList != null &&
      listOpen &&
      store.currentList._id == idNamePair._id ? (
        <WorkspaceScreen />
      ) : (
        <></>
      )}
      {/* </Box> */}
      {store.currentList != null &&
      listOpen &&
      store.currentList._id == idNamePair._id ? (
        <EditToolbar />
      ) : (
        <></>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          {idNamePair.published ? (
            <span
              style={{
                fontStyle: "normal",
                fontSize: "20pt",
                marginRight: "2vh",
              }}
            >
              Published:{" "}
              <span style={{ color: "green" }}>
                {new Date(idNamePair.publishDate).toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </span>
          ) : (
            <></>
          )}
        </div>
        <div>
          {idNamePair.published ? (
            <span
              style={{
                fontStyle: "normal",
                fontSize: "20pt",
                marginRight: "2vh",
              }}
            >
              Listens:{" "}
              <span style={{ color: "red" }}>{idNamePair.listens}</span>
            </span>
          ) : (
            <></>
          )}

          {store.currentList != null &&
          listOpen &&
          store.currentList._id == idNamePair._id ? (
            <IconButton onClick={handleCloseList} aria-label="edit">
              <KeyboardDoubleArrowUpIcon style={{ fontSize: "48pt" }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={(event) => handleOpenList(event)}
              aria-label="openList"
            >
              <KeyboardDoubleArrowDownIcon style={{ fontSize: "48pt" }} />
            </IconButton>
          )}
        </div>
      </div>
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={"list-" + idNamePair._id}
        label="Playlist Name"
        name="name"
        autoComplete="Playlist Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default ListCard;
