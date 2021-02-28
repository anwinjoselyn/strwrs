import React from "react";
import { Route, Switch } from "react-router-dom";

/****For simple code splitting - Since our current APP is simple not using loadable (or other) library for advanced code splitting*****/
import asyncComponent from "./components/AsyncComponent";

//Different route types
import AppliedRoute from "./components/Routes/AppliedRoute";
import AuthenticatedRoute from "./components/Routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/Routes/UnauthenticatedRoute";

//Load required components dynamically as and when required
const AsyncHome = asyncComponent(() => import("./containers/Home/Home"));
const AsyncLogin = asyncComponent(() => import("./containers/Login/Login"));
const AsyncPlanets = asyncComponent(() => import("./containers/Home/Planets"));
const AsyncNotFound = asyncComponent(() =>
  import("./containers/NotFound/NotFound")
);

const Routes = ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/planets/:id"
      exact
      component={AsyncPlanets}
      props={childProps}
    />

    {/* Catch all unmatched routes */}
    <Route component={AsyncNotFound} />
  </Switch>
);

export default Routes;
