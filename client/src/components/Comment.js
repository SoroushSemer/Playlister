import { useContext, useState } from "react";
import SplashScreen from "./SplashScreen";
import GlobalStoreContext from "../store";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Player from "./Player";

export default function Comment(props) {
  const { store } = useContext(GlobalStoreContext);
  return (
    <div
      className="list-card"
      style={{
        backgroundColor: "white",
        wordWrap: "break-word",
      }}
    >
      <span
        style={{
          cursor: "pointer",
          color: "blue",
          textDecoration: "underline",
        }}
        onClick={(event) => {
          event.stopPropagation();
          store.searchUser(props.owner);
        }}
      >
        {props.owner}
      </span>
      <div>{props.comment}</div>
    </div>
  );
}
