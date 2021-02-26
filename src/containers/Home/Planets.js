import React, { useRef, useState, useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";

import Card from "react-bootstrap/Card";
//Reusable Button component
import LoaderButton from "../../components/LoaderButton/LoaderButton";

import API from "../../services/api/api";

import { onError } from "../../libs/errorLib";

const Planets = () => {
  const { id } = useParams();
  const history = useHistory();

  const [planet, setPlanet] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    function loadPlanet() {
      return API.get(`/planets/${id}`);
    }

    async function onLoad() {
      try {
        const planet = await loadPlanet();
        console.log("planet", planet);
        const { data } = planet;
        console.log("data", data);
        setContent(data);
        setPlanet(data);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  return (
    <div className="Planets">
      <Card>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <LoaderButton block size="lg" variant="info">
            Go somewhere
          </LoaderButton>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Planets;
