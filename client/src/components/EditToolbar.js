import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/HighlightOff";

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
  const { store } = useContext(GlobalStoreContext);

  function handlePublish() {
    store.publishList();
  }
  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
  }
  function handleDuplicate() {
    store.duplicateList();
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    let _id = event.target.id;
    _id = ("" + _id).substring("delete-list-".length);
    store.markListForDeletion(id);
  }

  return (
    <div
      id="edit-toolbar"
      style={{
        width: "90%",
        padding: "0 5%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {store.currentList.published != true ? (
        <div>
          <Button
            disabled={!store.canUndo()}
            id="undo-button"
            onClick={handleUndo}
            variant="contained"
            style={{ marginRight: "5px" }}
            size="large"
          >
            Undo
          </Button>
          <Button
            disabled={!store.canRedo()}
            id="redo-button"
            onClick={handleRedo}
            variant="contained"
            size="large"
          >
            Redo
          </Button>
        </div>
      ) : (
        <div></div>
      )}
      <div>
        {store.currentList.published != true ? (
          <Button
            id="publish-button"
            onClick={handlePublish}
            variant="contained"
            style={{ marginRight: "5px" }}
            size="large"
          >
            Publish
          </Button>
        ) : (
          <></>
        )}
        <Button
          id="delete-button"
          onClick={(event) => {
            handleDeleteList(event, store.currentList._id);
          }}
          variant="contained"
          style={{ marginRight: "5px" }}
          size="large"
        >
          Delete
        </Button>
        <Button
          id="duplicate-button"
          onClick={handleDuplicate}
          variant="contained"
          size="large"
        >
          Duplicate
        </Button>
      </div>
    </div>
  );
}

export default EditToolbar;
