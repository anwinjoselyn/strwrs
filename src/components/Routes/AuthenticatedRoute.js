import React from "react";

import { Route, Redirect, useLocation } from "react-router-dom";

import { useAppContext } from "../../libs/contextLib";

const AuthenticatedRoute = ({ children, ...rest }) => {
  //For redirections and to get current path
  const { pathname, search } = useLocation();

  //To access user authenticated state
  const { isAuthenticated } = useAppContext();

  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
};

export default AuthenticatedRoute;
