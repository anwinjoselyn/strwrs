import React from "react";
import { shallow } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
//import Account from "./Account";
import App from "./App";
//import toJson from "enzyme-to-json";

it("renders without crashing", () => {
  shallow(<App />);
});
/*
test("renders app", () => {
  render(
    <Router>
      <App />
    </Router>
  );
});


describe("App", () => {
  test("renders App component", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    //screen.getByRole("");
  });
});
*/
