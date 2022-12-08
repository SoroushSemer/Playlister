const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
  const body = req.body;
  console.log("createPlaylist body: " + JSON.stringify(body));

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Playlist",
    });
  }

  const playlist = new Playlist(body);
  console.log("playlist: " + playlist.toString());
  if (!playlist) {
    return res.status(400).json({ success: false, error: err });
  }

  User.findOne({ _id: req.userId }, (err, user) => {
    console.log("user found: " + JSON.stringify(user));
    user.playlists.push(playlist._id);
    user.save().then(() => {
      playlist
        .save()
        .then(() => {
          return res.status(201).json({
            playlist: playlist,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            errorMessage: "Playlist Not Created!",
          });
        });
    });
  });
};
deletePlaylist = async (req, res) => {
  console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
  console.log("delete " + req.params.id);
  Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        errorMessage: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          Playlist.findOneAndDelete({ _id: req.params.id }, () => {
            async function asyncUpdateUserPlaylist() {
              console.log(req.params.id);
              console.log(user.playlists[1]);
              user.playlists = user.playlists.filter(
                (playlist) => playlist != req.params.id
              );
              User.findOneAndUpdate({ email: list.ownerEmail }, user, () => {
                return res.status(200).json({ success: true });
              }).catch((err) => console.log(err));
            }
            asyncUpdateUserPlaylist();
          }).catch((err) => console.log(err));
        } else {
          console.log("incorrect user!");
          return res.status(400).json({
            errorMessage: "authentication error",
          });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
getPlaylistById = async (req, res) => {
  console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

  await Playlist.findById({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    console.log("Found list: " + JSON.stringify(list));
    if (list.published != true) {
      // DOES THIS LIST BELONG TO THIS USER?
      async function asyncFindUser(list) {
        await User.findOne({ email: list.ownerEmail }, (err, user) => {
          console.log("user._id: " + user._id);
          console.log("req.userId: " + req.userId);
          if (user._id == req.userId) {
            console.log("correct user!");

            return res.status(200).json({ success: true, playlist: list });
          } else {
            console.log("incorrect user!");
            return res
              .status(400)
              .json({ success: false, description: "authentication error" });
          }
        });
      }
      asyncFindUser(list);
    } else {
      return res.status(200).json({ success: true, playlist: list });
    }
  }).catch((err) => console.log(err));
};
getPlaylistPairs = async (req, res) => {
  console.log("getPlaylistPairs");
  console.log(req.params);
  if (req.params.view == "HOME") {
    await User.findOne({ _id: req.userId }, (err, user) => {
      console.log("find user with id " + req.userId);
      async function asyncFindList(email) {
        console.log("find all Playlists owned by " + email);
        await Playlist.find({ ownerEmail: email }, (err, playlists) => {
          console.log("found Playlists: " + JSON.stringify(playlists));
          if (err) {
            return res.status(400).json({ success: false, error: err });
          }
          if (!playlists) {
            console.log("!playlists.length");
            return res
              .status(404)
              .json({ success: false, error: "Playlists not found" });
          } else {
            console.log("Send the Playlist pairs");
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
              let list = playlists[key];
              let liked = 0;
              if (list.likeUsers.includes(user._id)) liked = 1;
              else if (list.dislikeUsers.includes(user._id)) liked = -1;
              let pair = {
                _id: list._id,
                name: list.name,
                ownerEmail: list.ownerEmail,
                owner: list.owner,
                published: list.published,
                likes: list.likes,
                dislikes: list.dislikes,
                publishDate: list.publishDate,
                listens: list.listens,
                liked: liked,
                updatedAt: list.updatedAt,
                createdAt: list.createdAt,
              };
              pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs });
          }
        }).catch((err) => console.log(err));
      }
      asyncFindList(user.email);
    }).catch((err) => console.log(err));
  } else {
    await Playlist.find({ published: true }, (err, playlists) => {
      console.log("found Playlists: " + JSON.stringify(playlists));
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!playlists) {
        console.log("!playlists.length");
        return res
          .status(404)
          .json({ success: false, error: "Playlists not found" });
      } else {
        console.log("Send the Playlist pairs");
        // PUT ALL THE LISTS INTO ID, NAME PAIRS
        let pairs = [];
        for (let key in playlists) {
          let list = playlists[key];
          let liked = 0;
          if (list.likeUsers.includes(req.userId)) liked = 1;
          else if (list.dislikeUsers.includes(req.userId)) liked = -1;
          let pair = {
            _id: list._id,
            name: list.name,
            ownerEmail: list.ownerEmail,
            owner: list.owner,
            published: list.published,
            likes: list.likes,
            dislikes: list.dislikes,
            publishDate: list.publishDate,
            listens: list.listens,
            liked: liked,
            updatedAt: list.updatedAt,
            createdAt: list.createdAt,
          };
          pairs.push(pair);
        }
        return res.status(200).json({ success: true, idNamePairs: pairs });
      }
    }).catch((err) => console.log(err));
  }
};
getPlaylists = async (req, res) => {
  await Playlist.find({}, (err, playlists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!playlists.length) {
      return res
        .status(404)
        .json({ success: false, error: `Playlists not found` });
    }
    return res.status(200).json({ success: true, data: playlists });
  }).catch((err) => console.log(err));
};
updatePlaylist = async (req, res) => {
  const body = req.body;
  console.log("updatePlaylist: " + JSON.stringify(body));
  console.log("req.body.name: " + req.body.name);
  console.log("playlist._id: " + req.params.id);
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        err,
        message: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          console.log("req.body.name: " + req.body.name);
          if (
            body.playlist.like ||
            body.playlist.dislike ||
            body.playlist.newComment
          ) {
            console.log("got like/dislike/comment");
            if (body.playlist.like) {
              if (list.likeUsers.includes(user._id)) {
                list.likes -= 1;
                list.likeUsers = list.likeUsers.filter((x) => x == user._id);
              } else {
                if (list.dislikeUsers.includes(user._id)) {
                  list.dislikes -= 1;
                  list.dislikeUsers = list.dislikeUsers.filter(
                    (x) => x == user._id
                  );
                }
                list.likes += 1;
                list.likeUsers.push(user._id);
              }
              console.log(list);
            }
            if (body.playlist.dislike) {
              if (list.dislikeUsers.includes(user._id)) {
                list.dislikes -= 1;
                list.dislikeUsers = list.dislikeUsers.filter(
                  (x) => x == user._id
                );
              } else {
                if (list.likeUsers.includes(user._id)) {
                  list.likes -= 1;
                  list.likeUsers = list.likeUsers.filter((x) => x == user._id);
                }
                list.dislikes += 1;
                list.dislikeUsers.push(user._id);
              }
            }
            if (body.playlist.newComment) {
              console.log(
                "\n\n\n\ncommenting: " +
                  JSON.stringify(body.playlist.newComment)
              );
              list.comments.push(body.playlist.newComment);
            }
          } else {
            list.name = body.playlist.name;
            list.songs = body.playlist.songs;

            if (body.playlist.published) {
              list.published = body.playlist.published;
              list.publishDate = body.playlist.publishDate;
              // list.comments = [];
            }

            if (body.playlist.listens) {
              list.listens = body.playlist.listens;
            }
          }
          list
            .save()
            .then(() => {
              console.log("SUCCESS!!!");
              return res.status(200).json({
                success: true,
                id: list._id,
                message: "Playlist updated!",
              });
            })
            .catch((error) => {
              console.log("FAILURE: " + JSON.stringify(error));
              return res.status(404).json({
                error,
                message: "Playlist not updated!",
              });
            });
        } else if (req.userId != "") {
          console.log("not owner!");

          async function asyncUser() {
            await User.findOne({ _id: req.userId }, (err, currentuser) => {
              if (body.playlist.like) {
                console.log("got like");
                if (list.likeUsers.includes(currentuser._id)) {
                  list.likes -= 1;
                  list.likeUsers = list.likeUsers.filter(
                    (x) => x == currentuser._id
                  );
                } else {
                  if (list.dislikeUsers.includes(currentuser._id)) {
                    list.dislikes -= 1;
                    list.dislikeUsers = list.dislikeUsers.filter(
                      (x) => x == currentuser._id
                    );
                  }
                  list.likes += 1;
                  list.likeUsers.push(currentuser._id);
                }
                console.log(list);
              }
              if (body.playlist.dislike) {
                console.log("got dislike");
                if (list.dislikeUsers.includes(currentuser._id)) {
                  list.dislikes -= 1;
                  list.dislikeUsers = list.dislikeUsers.filter(
                    (x) => x == currentuser._id
                  );
                } else {
                  if (list.likeUsers.includes(currentuser._id)) {
                    list.likes -= 1;
                    list.likeUsers = list.likeUsers.filter(
                      (x) => x == currentuser._id
                    );
                  }
                  list.dislikes += 1;
                  list.dislikeUsers.push(currentuser._id);
                }
              }
              if (body.playlist.newComment) {
                console.log(
                  "\n\n\n\ngot comment: ",
                  JSON.stringify(body.playlist.newComment)
                );
                list.comments.push(body.playlist.newComment);
              }
              if (body.playlist.listens) {
                list.listens = body.playlist.listens;
              }
              list
                .save()
                .then(() => {
                  console.log("SUCCESS!!!");
                  return res.status(200).json({
                    success: true,
                    id: list._id,
                    message: "Playlist updated!",
                  });
                })
                .catch((error) => {
                  console.log("FAILURE: " + JSON.stringify(error));
                  return res.status(404).json({
                    error,
                    message: "Playlist not updated!",
                  });
                });
            });
          }
          asyncUser();

          // return res
          //   .status(400)
          //   .json({ success: false, description: "authentication error" });
        } else {
          if (body.playlist.listens) {
            list.listens = body.playlist.listens;
          }
          list
            .save()
            .then(() => {
              console.log("SUCCESS!!!");
              return res.status(200).json({
                success: true,
                id: list._id,
                message: "Playlist updated!",
              });
            })
            .catch((error) => {
              console.log("FAILURE: " + JSON.stringify(error));
              return res.status(404).json({
                error,
                message: "Playlist not updated!",
              });
            });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylistPairs,
  getPlaylists,
  updatePlaylist,
};
