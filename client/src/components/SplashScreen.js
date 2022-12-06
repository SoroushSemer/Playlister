import PlayIcon from "@mui/icons-material/PlayCircleFilled";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function SplashScreen(props) {
  return (
    <div id="splash-screen">
      Welcome to <img src="/logo.png"></img>
      <PlayIcon id="play-icon" />
      <p>Create, Share, and Play your favorite Playlists</p>
      <div id="login-buttons" style={{ marginTop: "5%" }}>
        <Link to="/register/">
          <Button
            variant="contained"
            id="create-account-button"
            className="splash-button"
            style={{ marginBottom: "1%" }}
          >
            Create Account
          </Button>
        </Link>
        <Link to="/login/">
          <Button
            variant="outlined"
            id="login-button"
            className="splash-button"
            style={{ marginBottom: "2%" }}
          >
            Login
          </Button>
        </Link>
        <Button id="guest-link">Continue as Guest</Button>
        <div id="built-by">Built By Soroush</div>
      </div>
    </div>
  );
}
