import { useContext, useState } from "react";
import SplashScreen from "./SplashScreen";
import AuthContext from "../auth";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Player from "./Player";

export default function SideBar() {
  const [value, setValue] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value={false} label="Player" />
        <Tab value={true} label="Comments" />
      </Tabs>
      <div style={value ? { display: "inline" } : { display: "none" }}>
        comments
      </div>
      <div style={value ? { display: "none" } : { display: "inline" }}>
        <Player />
      </div>
    </Box>
  );
}
