import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import SongCard from "./SongCard.js";
import MUIEditSongModal from "./MUIEditSongModal";
import MUIRemoveSongModal from "./MUIRemoveSongModal";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { GlobalStoreContext } from "../store/index.js";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen(props) {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  let modalJSX = "";

  let currentList = { songs: [] };
  if (store.currentList !== null) {
    currentList = store.currentList;
  }
  return (
    <Box id="playlister-cards">
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
        }}
      >
        {currentList.songs.map((song, index) => (
          <SongCard
            id={"playlist-song-" + index}
            key={"playlist-song-" + index}
            index={index}
            song={song}
          />
        ))}
      </List>
      {store.isEditSongModalOpen() ? (
        <MUIEditSongModal />
      ) : store.isRemoveSongModalOpen() ? (
        <MUIRemoveSongModal />
      ) : (
        modalJSX
      )}
    </Box>
  );
}

export default WorkspaceScreen;
