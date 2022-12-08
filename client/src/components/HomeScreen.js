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
  console.log("HomeScreen");
  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  //   if (store && !store.idNamePairs) {
  //     store.loadIdNamePairs();
  //   }
  let listCard = "";

  console.log("SEARCHING " + store.currentView + ": " + store.searchText);
  if (store && store.idNamePairs) {
    let filteredList = store.idNamePairs;
    if (store.searchText != null) {
      console.log("SEARCHING" + store.searchText);
      filteredList = store.idNamePairs.filter((idNamePair) =>
        store.currentView == "HOME" || store.currentView == "ALL"
          ? idNamePair.name
              .toUpperCase()
              .includes(store.searchText.toUpperCase())
          : idNamePair.owner.username
              .toUpperCase()
              .includes(store.searchText.toUpperCase())
      );
    } else {
      filteredList = [];
    }
    console.log(filteredList);
    // if(store.searchText==null){
    //     filteredList = []
    // }
    listCard = (
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {filteredList.map((pair, index) => (
          <ListCard
            key={index}
            filteredIds={filteredList}
            idNamePair={pair}
            selected={false}
          />
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
