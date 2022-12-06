import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import SongCard from "./SongCard.js";
import MUIEditSongModal from "./MUIEditSongModal";
import MUIRemoveSongModal from "./MUIRemoveSongModal";
import AppBanner from "./AppBanner.js";
import Statusbar from "./Statusbar.js";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { GlobalStoreContext } from "../store/index.js";
import HomeNavBar from "./HomeNavBar.js";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen(props) {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();
  // const [currentList, setCurrentList] = useState(props.list);
  let modalJSX = "";

  // if (currentList == null) {
  //   currentList = { songs: [] };
  // } else {
  //   console.log(currentList);
  // }
  let currentList = store.currentList;
  function handleAddNewSong() {
    store.addNewSong();
  }
  return (
    <div style={{ width: "100%" }}>
      {currentList != null ? (
        <Box id="playlister-cards" style={{ maxHeight: "40vh" }}>
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
            <div
              id="add-song-card"
              className="list-card unselected-list-card"
              onClick={handleAddNewSong}
              style={{
                textAlign: "center",
                fontWeight: "bolder",
                fontSize: "25pt",
              }}
            >
              +
            </div>
          </List>
          {store.isEditSongModalOpen() ? (
            <MUIEditSongModal />
          ) : store.isRemoveSongModalOpen() ? (
            <MUIRemoveSongModal />
          ) : (
            modalJSX
          )}
        </Box>
      ) : (
        <></>
      )}

      {/* <Statusbar /> */}
    </div>
  );
}

export default WorkspaceScreen;
