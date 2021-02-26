import React, { useState, useEffect } from "react";

import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";

import API from "../../services/api/api";

import "./Home.css";

const Home = () => {
  const [planets, setPlanets] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const planets = await loadPlanets();
        console.log("planets", planets.data.results);
        setPlanets(planets.data.results);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadPlanets() {
    return API.get(`/planets`);
  }

  function renderPlanetsList(planets) {
    return (
      <>
        {planets.map(({ name, population, url }) => (
          <LinkContainer key={name} to={`/planets/${url.split("/")[5]}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">{name}</span>
              <br />
              <span className="text-muted">
                Population:{" "}
                {population && !isNaN(parseInt(population))
                  ? parseInt(population).toLocaleString()
                  : population}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>StrWrs</h1>
        <p className="text-muted">A simple Starwars App</p>
      </div>
    );
  }

  function renderPlanets() {
    return (
      <div className="planets">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Planets</h2>
        <ListGroup>{!isLoading && renderPlanetsList(planets)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {/*Rendering Lander or Planets based on isAuthenticated flag*/}
      {isAuthenticated ? renderPlanets() : renderLander()}
    </div>
  );
};

export default Home;
