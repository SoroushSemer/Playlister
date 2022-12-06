import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import YouTube from "react-youtube";
import { Button, ButtonGroup } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";

export default function Player() {
  const { store } = useContext(GlobalStoreContext);
  const [currentSong, setCurrentSong] = useState(0);
  const [prevList, setPrevList] = useState(null);
  const [player, setPlayer] = useState(null);
  const [play, setPlay] = useState(false);
  let playlist = [];
  let currentList = null;
  const getPlaylist = () => {
    if (store.currentList != null) {
      playlist = store.currentList.songs.map((song) => song.youTubeId);

      currentList = store.currentList;
      if (currentSong != 0 && prevList != store.currentList) {
        setCurrentSong(0);
      }
      if (currentSong == 0 && prevList != store.currentList)
        setPrevList(store.currentList);
      if (currentList.songs[currentSong] == undefined) {
        setCurrentSong(0);
      }
    }
    console.log(playlist);
  };
  // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
  // let currentSong = 0;
  const playerOptions = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  // THIS FUNCTION LOADS THE CURRENT SONG INTO
  // THE PLAYER AND PLAYS IT
  function loadAndPlayCurrentSong(player) {
    let song = playlist[currentSong];
    player.loadVideoById(song);
    player.playVideo();
  }

  // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
  function incSong() {
    // currentSong = currentSong + 1;
    // currentSong = currentSong % playlist.length;
    if (currentSong + 1 >= playlist.length) {
    } else setCurrentSong((currentSong + 1) % playlist.length);
  }
  function decSong() {
    if (currentSong - 1 < 0) {
    } else setCurrentSong((currentSong - 1) % playlist.length);
  }

  function handlePlay() {
    player.playVideo();
  }

  function handlePause() {
    player.pauseVideo();
  }
  function onPlayerReady(event) {
    loadAndPlayCurrentSong(event.target);
    event.target.playVideo();
  }

  // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
  // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
  // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
  // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
  function onPlayerStateChange(event) {
    let playerStatus = event.data;
    setPlayer(event.target);
    // console.log(player.getPlayerState());
    if (playerStatus === -1) {
      // VIDEO UNSTARTED
      console.log("-1 Video unstarted");
    } else if (playerStatus === 0) {
      // THE VIDEO HAS COMPLETED PLAYING
      console.log("0 Video ended");
      incSong();
      // player.playVideo();
      loadAndPlayCurrentSong(player);
    } else if (playerStatus === 1) {
      // THE VIDEO IS PLAYED
      console.log("1 Video played");
      setPlay(false);
    } else if (playerStatus === 2) {
      // THE VIDEO IS PAUSED
      console.log("2 Video paused");
      setPlay(true);
    } else if (playerStatus === 3) {
      // THE VIDEO IS BUFFERING
      console.log("3 Video buffering");
    } else if (playerStatus === 5) {
      // THE VIDEO HAS BEEN CUED
      console.log("5 Video cued");
      player.playVideo();
    }
  }

  getPlaylist();
  return (
    <div>
      {currentList != null &&
      currentList.songs.length > 0 &&
      currentList.songs[currentSong] != undefined ? (
        <div style={{ fontSize: "24pt" }}>
          <YouTube
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
          />
          <div>Playlist: {currentList.name}</div>
          <div>Song # {currentSong + 1} </div>
          <div>Title: {currentList.songs[currentSong].title}</div>
          <div>Artist: {currentList.songs[currentSong].artist} </div>
          <ButtonGroup
            variant="contained"
            size="large"
            aria-label="outlined primary button group"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button onClick={decSong} disabled={currentSong - 1 < 0}>
              <FastRewindIcon />
            </Button>
            <Button onClick={handlePlay} disabled={!play}>
              <PlayArrowIcon />
            </Button>
            <Button onClick={handlePause} disabled={play}>
              <PauseIcon />
            </Button>
            <Button
              onClick={incSong}
              disabled={currentSong + 1 >= playlist.length}
            >
              <FastForwardIcon />
            </Button>
          </ButtonGroup>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
