import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "./ListCard.js";
import MUIDeleteModal from "./MUIDeleteModal";

import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import HomeNavBar from "./HomeNavBar";
import { Grid } from "@mui/material";
import SideBar from "./SideBar";
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  let listCard = "";
  if (store) {
    listCard = (
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {store.idNamePairs.map((pair) => (
          <ListCard key={pair._id} idNamePair={pair} selected={false} />
        ))}
      </List>
    );
  }
  return (
    <div id="playlist-selector" style={{ height: "100%" }}>
      <HomeNavBar />
      <Grid container style={{ height: "100%" }}>
        <Grid
          item
          xs={7}
          id="list-selector-list"
          style={{
            // width: "60%",
            height: "80%",
            overflowX: "hidden",
            overflowY: "scroll",
          }}
        >
          {listCard}
        </Grid>
        <Grid
          item
          xs={5}
          style={{
            // width: "60%",
            height: "70%",
          }}
        >
          <SideBar />
        </Grid>
      </Grid>

      <MUIDeleteModal />
    </div>
  );
};

export default HomeScreen;
