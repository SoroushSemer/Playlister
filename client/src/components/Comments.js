import { useContext, useState } from "react";
import SplashScreen from "./SplashScreen";
import GlobalStoreContext from "../store";
import { List, TextField } from "@mui/material";
import Comment from "./Comment";
import AuthContext from "../auth";

export default function Comments() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");

  const handleChange = (event) => {
    setCommentText(event.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.code === "Enter") {
      console.log("Commenting: " + commentText);
      setCommentText("");
      store.comment(commentText);
    }
  };

  return (
    <div
      sx={{
        height: "100%",
      }}
    >
      {store &&
      store.playingList &&
      store.playingList.comments &&
      store.playingList.published ? (
        <div
          sx={{
            height: "100%",
          }}
        >
          {store.playingList.comments.length > 0 ? (
            <List
              sx={{
                overflowY: "scroll",
                height: "52vh",
              }}
            >
              {store.playingList.comments.map((comment, index) => {
                return (
                  <Comment
                    key={index}
                    owner={comment.owner}
                    comment={comment.text}
                  />
                );
              })}
            </List>
          ) : (
            <h1 style={{ paddingLeft: "1vw" }}>
              No comments yet. Be the first.
            </h1>
          )}
          <TextField
            sx={{
              backgroundColor: "white",
              width: "96%",
              mx: "2%",
              display: "flex",
              justifySelf: "flex-end",
            }}
            placeholder="Add Comment"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            value={commentText}
            disabled={auth.user == null}
          />
        </div>
      ) : (
        <h1 style={{ paddingLeft: "1vw" }}>
          Please publish the playlist to comment.
        </h1>
      )}
    </div>
  );
}
