import { useContext, useState } from "react";
import SplashScreen from "./SplashScreen";
import AuthContext from "../auth";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Player from "./Player";
import Comments from "./Comments";
import GlobalStoreContext from "../store";
export default function SideBar() {
  const [value, setValue] = useState(false);
  const { store } = useContext(GlobalStoreContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div sx={{ width: "100%", height: "100%" }}>
      {store && store.playingList ? (
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={false} label="Player" />
          {store.playingList.published ? (
            <Tab value={true} label="Comments" />
          ) : (
            <></>
          )}
        </Tabs>
      ) : (
        <h1 style={{ paddingLeft: "1vw" }}>No Selected List Currently</h1>
      )}
      <div
        style={
          value ? { display: "block", height: "100%" } : { display: "none" }
        }
      >
        <Comments />
      </div>
      <div style={value ? { display: "none" } : { display: "inline" }}>
        <Player />
      </div>
    </div>
  );
}
