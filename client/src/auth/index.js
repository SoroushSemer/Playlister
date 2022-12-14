import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "./auth-request-api";

const AuthContext = createContext();
// console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER",
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    error: null,
  });
  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          error: null,
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          error: null,
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          error: null,
        });
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          error: null,
        });
      }

      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.SET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };

  auth.guestLogin = async function () {
    console.log("guest");
    authReducer({
      type: AuthActionType.LOGIN_USER,
      payload: {
        user: null,
      },
    });
  };

  auth.registerUser = function (
    firstName,
    lastName,
    email,
    username,
    password,
    passwordVerify
  ) {
    async function asyncRegister() {
      let response = await api
        .registerUser(firstName, lastName, email, username, password, passwordVerify)
        .then((response) => {
          if (response.data.success) {
            // authReducer({
            //   type: AuthActionType.REGISTER_USER,
            //   payload: {
            //     user: response.data.user,
            //   },
            // });
            history.push("/login");
          }
        })
        .catch((error) => {
          console.log("failed");
          setAuth({ ...auth, error: error.response.data.errorMessage });
        });
    }
    asyncRegister();
  };

  auth.loginUser = async function (email, password) {
    let response = await api
      .loginUser(email, password)
      .then((response) => {
        if (response.status === 200) {
          authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: {
              user: response.data.user,
            },
          });
          history.push("/");
        }
      })
      .catch((error) => {
        setAuth({ ...auth, error: error.response.data.errorMessage });
      });
  };

  auth.logoutUser = async function () {
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null,
      });
      history.push("/");
    }
  };

  auth.getUserInitials = function () {
    let initials = "";
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    // console.log("user initials: " + initials);
    return initials;
  };

  auth.closeModal = function () {
    setAuth({ ...auth, error: null });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
