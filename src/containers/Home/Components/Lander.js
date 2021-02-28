/*** A simple landing page when not authenticated ***/
import React from "react";

import "../Home.css";

const Lander = () => {
  return (
    <div data-testid="mainDiv" className="lander">
      <h1 data-testid="mainHeader">StrWrs</h1>
      <p data-testid="para" className="text-muted">
        A simple Starwars App
      </p>
    </div>
  );
};

export default Lander;
