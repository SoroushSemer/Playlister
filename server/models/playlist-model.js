const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    owner: {
      type: { username: String, email: String },
      required: true,
    },
    published: { type: Boolean },
    publishDate: { type: Date },
    likes: { type: Number },
    dislikes: { type: Number },
    likeUsers: { type: Array },
    dislikeUsers: { type: Array },
    listens: { type: Number },
    comments: { type: [{ text: String, owner: String }] },
    songs: {
      type: [
        {
          title: String,
          artist: String,
          youTubeId: String,
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
