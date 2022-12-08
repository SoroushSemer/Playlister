import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
  const { store } = useContext(GlobalStoreContext);
  let text = "";
  if (store.currentList) text = store.currentList.name;
  function handleCreateNewList() {
    store.createNewList();
  }
  return (
    <div id="top5-statusbar">
      {store.currentView == "HOME" ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            id="add-list-button"
            onClick={handleCreateNewList}
          >
            <AddIcon />
          </Fab>
          <Typography variant="h2">Your Lists</Typography>
        </div>
      ) : store.currentView == "ALL" || (store.searchText &&store.searchText.length == 0) ? (
        <Typography variant="h2">
          {store.searchText && store.searchText.length > 0 ? store.searchText : "All"} Lists
        </Typography>
      ) : (
        <Typography variant="h2">Lists by {store.searchText}</Typography>
      )}

      {/* <Typography variant="h4">{text}</Typography> */}
    </div>
  );
}

export default Statusbar;
