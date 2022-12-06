import { useContext } from "react";
import HomeScreen from "./HomeScreen";
import SplashScreen from "./SplashScreen";
import AuthContext from "../auth";
import AppBanner from "./AppBanner";
import Statusbar from "./Statusbar";
export default function HomeWrapper(props) {
  const { auth } = useContext(AuthContext);
  console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
  console.log(props);
  if (auth.loggedIn)
    return (
      <div style={{ height: "90%" }}>
        <AppBanner />
        <HomeScreen />
        <Statusbar />
      </div>
    );
  else return <SplashScreen />;
}
