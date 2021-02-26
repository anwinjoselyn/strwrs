import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

//Wrapper to route your our to the required link without refreshing the browser.
import { LinkContainer } from "react-router-bootstrap";

// Import Bootstrap components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

//Routes wrapper
import Routes from "./Routes";

//Functions for login and authentication
import { loggedIn, logout } from "./services/Auth/Authservice";

//To ensure logged user session is maintained throughout the app
import { AppContext } from "./libs/contextLib";

//Common error function
import { onError } from "./libs/errorLib";
//CSS files
import "./App.css";

const App = () => {
  //Enable history to push to /login (if not logged in) or /home (if logged in)
  const history = useHistory();

  //initialize state to handle loading and logged in states
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  const onLoad = useCallback(async () => {
    try {
      //find if user is already logged in (or) has a stored token which has not expired
      let isLoggedIn = await loggedIn();
      //console.log("isLoggedIn", isLoggedIn);

      if (isLoggedIn === true) {
        //update context that user is logged in
        userHasAuthenticated(true);
      } else {
        //update context that user NOT logged in and push to /login page
        userHasAuthenticated(false);
        history.push("/login");
      }
    } catch (e) {
      if (e !== "No current user") {
        //alert error
        onError(e);
      }
    }
    //ensure state is not in loading mode anymore
    setIsAuthenticating(false);
  }, [history]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const handleLogout = async () => {
    await logout();
    userHasAuthenticated(false);
    history.push("/login");
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
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
};

export default App;
