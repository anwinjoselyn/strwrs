import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom"; //to read the "id" of planet from URL

//Bootstrap components
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import LoaderButton from "../../components/LoaderButton/LoaderButton"; //Button component

import API from "../../services/api/api"; //Our API handler

import { onError } from "../../libs/errorLib"; //Our error handler

import "./Home.css"; //A little bit of styling

const Planets = () => {
  const [isLoading, setIsLoading] = useState(true); //to ensure component loads after data has been populated
  const { id } = useParams(); //getting the ID of planet

  const [planet, setPlanet] = useState(null);

  //Called on first mount
  useEffect(() => {
    function loadPlanet() {
      return API.get(`/planets/${id}`);
    }

    async function onLoad() {
      try {
        //Get and store data in state
        const planet = await loadPlanet();
        const { data } = planet;
        setPlanet(data);

        setIsLoading(false); //now we can render data
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  return (
    <div className="Planets">
      {!isLoading && (
        <Card>
          <Card.Body>
            <Card.Title>{planet.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Population:{" "}
              {!isNaN(parseInt(planet.population))
                ? parseInt(planet.population).toLocaleString()
                : planet.population}
            </Card.Subtitle>
            <Row>
              <Col className="leftCol text-muted">Climate </Col>
              <Col className="text-capitalize">{planet.climate}</Col>
            </Row>
            <Row>
              <Col className="leftCol text-muted">Gravity </Col>
              <Col className="text-capitalize"> {planet.gravity}</Col>
            </Row>
            <Row>
              <Col className="leftCol text-muted">Terrain </Col>
              <Col className="text-capitalize"> {planet.terrain}</Col>
            </Row>
            <Row>
              <Col className="leftCol text-muted">Surface Water </Col>
              <Col className="text-capitalize"> {planet.surface_water}</Col>
            </Row>
            <Row>
              <Col className="leftCol text-muted">Orbital Period </Col>
              <Col className="text-capitalize"> {planet.orbital_period}</Col>
            </Row>
          </Card.Body>
          <div className="topButtonDiv">
            <LoaderButton
              variant="info"
              style={{ textAlign: "center" }}
              href="/"
            >
              Back to planets
            </LoaderButton>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Planets;
