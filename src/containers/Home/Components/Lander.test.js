import React from "react";
import { shallow } from "enzyme";
import { render, screen } from "@testing-library/react";
import Lander from "./Lander";
import "@testing-library/jest-dom";

it("renders Lander without crashing", () => {
  shallow(<Lander />);
});

describe("Lander", () => {
  test("renders Lander component", () => {
    render(<Lander />);
    screen.getByText("StrWrs");
    expect(screen.getByText("A simple Starwars App")).toBeInTheDocument();
  });
});
