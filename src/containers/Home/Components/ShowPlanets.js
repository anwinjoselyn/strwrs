import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { BsInfoCircle } from "react-icons/bs";
import { BsQuestionCircle } from "react-icons/bs";

import "../Home.css";

const ShowPlanets = ({
  planets,
  setPlanets,
  API,
  loadPlanets,
  searchTerm,
  handleSearch,
  //countdown,
  seconds,
  attempts,
  limit,
  promptLimit
}) => {
  const renderPlanetsList = planets => {
    return (
      <>
        {planets
          .sort((a, b) => parseInt(b.population) - parseInt(a.population))
          .map(({ name, population, url, terrain, climate }) => {
            let itemStyle = parseInt(population)
              ? parseInt(population) <= 200000
                ? { padding: "5px", variant: null }
                : parseInt(population) <= 6000000
                ? { padding: "10px 5px", variant: "light" }
                : parseInt(population) <= 30000000
                ? { padding: "15px 5px", variant: "secondary" }
                : parseInt(population) <= 1000000000
                ? { padding: "15px 5px", variant: "primary" }
                : parseInt(population) <= 2000000000
                ? { padding: "20px 5px", variant: "info" }
                : parseInt(population) <= 4500000000
                ? { padding: "25px 5px", variant: "warning" }
                : { padding: "30px 5px", variant: "success" }
              : { padding: "5px 5px", variant: "danger" };

            return (
              <LinkContainer
                key={name}
                to={`/planets/${url.split("/")[5]}`}
                style={{
                  padding: itemStyle.padding,
                  margin: "1em 0"
                }}
              >
                <ListGroup.Item action variant={itemStyle.variant}>
                  <span className="font-weight-bold">{name}</span>
                  <br />
                  <span className="text-muted">
                    Population:{" "}
                    {population && !isNaN(parseInt(population))
                      ? parseInt(population).toLocaleString()
                      : population}
                  </span>
                  <br />
                  <span>Terrain: {terrain ? terrain : "Unknown"}</span>
                  <br />
                  <span>Climate: {climate ? climate : "Unknown"}</span>
                </ListGroup.Item>
              </LinkContainer>
            );
          })}
      </>
    );
  };

  return (
    <div className="planets">
      <div className="planets-header border-bottom pb-3 mt-4 mb-3">
        <h2>
          Planets{" "}
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                <p>Planets are arranged by their population size.</p>
                <p>Planets are also color coded by their population size</p>
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <BsInfoCircle />
            </span>
          </OverlayTrigger>
          <small style={{ fontSize: "12px" }}>
            <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="tooltip-disabled">
                  <p>
                    {limit === 15
                      ? `You can use search ${limit} times per minute`
                      : "As a super user, you have no limits on using the search function. You can treat this as a feedback for how many times you have used the search."}
                  </p>
                </Tooltip>
              }
            >
              <BsQuestionCircle />
            </OverlayTrigger>{" "}
            Seconds: {seconds} | Attempts: {attempts}{" "}
            {promptLimit
              ? `Sorry searches per minute is restricted to ${limit}`
              : null}
          </small>
        </h2>
        <Form>
          <Form.Group size="lg" controlId="searchTerm">
            <Form.Control
              autoFocus
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Type a planet name to search"
              disabled={promptLimit}
            />
          </Form.Group>
        </Form>
      </div>
      <ListGroup>{renderPlanetsList(planets)}</ListGroup>
    </div>
  );
};

export default ShowPlanets;
