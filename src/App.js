import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap"; //Wrapper to route to the required link without refreshing the browser.

import { FaUserCircle } from "react-icons/fa"; //Icon to display User Name on top navigation bar

// Import Bootstrap components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import Routes from "./Routes"; //Routes wrapper

//Functions for login and authentication
import {
  loggedIn,
  logout,
  checkSuperUser,
  getProfile
} from "./services/Auth/Authservice";

import { AppContext } from "./libs/contextLib"; //To ensure logged user session is maintained throughout the app

import { onError } from "./libs/errorLib"; //Error handler function

import ErrorBoundary from "./components/ErrorBoundary"; //To handle unhandled errors in our containers with a nice error message & while reporting the error to Sentry.

import "./App.css"; //A little bit of styling

const App = () => {
  const history = useHistory(); //Enable history to push to /login (if not logged in) or /home (if logged in)

  //initialize state to handle loading and logged in states
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  const [profile, setProfile] = useState(null); //To store some user information (like name)
  const [isSuperUser, setSuperUser] = useState(false); //To understand if user is a Super User

  const onLoad = useCallback(async () => {
    try {
      let isLoggedIn = await loggedIn(); //find if user is already logged in (or) has a stored token which has not expired

      if (isLoggedIn === true) {
        const profile = await getProfile(); //Get profile of user
        if (profile && profile.data) setProfile(profile.data);

        let superUserFlag = await checkSuperUser(); //Check is is a Super User
        if (superUserFlag) setSuperUser(superUserFlag);

        userHasAuthenticated(true); //update context that user is logged in
      } else {
        //update context that user NOT logged in and push to /login page
        userHasAuthenticated(false);
        history.push("/login");
      }
    } catch (e) {
      if (e !== "No current user") {
        //alert error via our error handler
        onError(e);
      }
    }

    setIsAuthenticating(false); //ensure state is not in loading mode anymore
  }, [history]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const handleLogout = async () => {
    await logout(); //remove token from local storage
    userHasAuthenticated(false); //update session

    history.push("/login"); //push to login page
  };

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              StrWrs
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <NavDropdown
                  title={
                    <>
                      <FaUserCircle /> {profile.name}
                    </>
                  }
                  id="nav-dropdown"
                  drop="down"
                >
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider
            value={{
              isAuthenticated,
              userHasAuthenticated,
              isSuperUser,
              profile,
              setProfile,
              setSuperUser
            }}
          >
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
};

export default App;
