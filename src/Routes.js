import React from "react";
import { Route, Switch } from "react-router-dom";

import AuthenticatedRoute from "./components/Routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/Routes/UnauthenticatedRoute";

import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import Planets from "./containers/Home/Planets";
import NotFound from "./containers/NotFound/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/planets/:id">
        <Planets />
      </AuthenticatedRoute>

      {/* Catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
