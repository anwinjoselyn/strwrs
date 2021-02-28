import React, { useState, useEffect, useCallback } from "react";

import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";

import API from "../../services/api/api";

import LoaderButton from "../../components/LoaderButton/LoaderButton";

import Lander from "./Components/Lander";
import ShowPlanets from "./Components/ShowPlanets";
import PlanetsChart from "./Components/PlanetsChart";

import "./Home.css";

const Home = () => {
  //to get user authenticated state
  const { isAuthenticated, isSuperUser } = useAppContext();

  //to store retrieved planets in state
  const [planets, setPlanets] = useState([]);
  const [chartsData, setChartsData] = useState([]);

  //to store the search term from search form
  const [searchTerm, setSearchTerm] = useState("");
  const [countdown, setCountdown] = useState({
    seconds: 60,
    hasLimit: !isSuperUser,
    started: false,
    attempts: 0,
    nonSuperUserLimit: 15
  });
  const [start, setStart] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [promptLimit, setPromptLimit] = useState(false);

  const limit = isSuperUser ? 99 : 15;

  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState("bar");

  //to ensure components do not load before planets are retrieved
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
        calculateCharts(planets.data.results);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  const loadPlanets = () => {
    return API.get(`/planets`);
  };

  const searchPlanets = value => {
    return API.get(`/planets/?search=${value}`);
  };

  const calculateCharts = planets => {
    let data = {};
    let labels = [];
    let datasets = [
      {
        label: `Diameter`,
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 206, 86, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ];

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function(value, index, values) {
                return value;
              }
            }
          }
        ]
      }
    };

    planets.forEach(p => {
      labels.push(p.name);
      datasets[0].data.push(
        !isNaN(parseInt(p.diameter)) ? parseInt(p.diameter) : 0
      );
    });

    data = {
      labels: labels,
      datasets: datasets
    };
    setChartsData({ data, options });
  };

  //Handle search, get results, populate
  const handleSearch = async event => {
    let value = event.target.value;
    console.log("value", value);
    try {
      setSearchTerm(value);

      if (value && value.length > 2) {
        if (!start) setStart(true);

        if (attempts >= limit) {
          setPromptLimit(true);
        }
        //Call search API
        console.log("if happened & value: ", value);
        /*
        if (
          !countdown.started &&
          countdown.attempts === 0 &&
          countdown.seconds === 60
        ) {
          setCountdown({
            ...countdown,
            started: true
          });
        }
        */
        const results = await searchPlanets(value);

        console.log("results.data.results", results.data.results);

        setPlanets(results.data.results);
        setAttempts(attempts + 1);
        console.log("countdown", countdown);
      } else if (!value) {
        console.log("else if happened");
        //setStart(false);
        //setSeconds(60);
        setCountdown({
          ...countdown,
          seconds: 60
        });
        //Call search API
        const results = await loadPlanets();

        console.log("results.data.results", results.data.results);

        setPlanets(results.data.results);
        //setAttempts(0);
      }
    } catch (e) {
      onError(e);
    }
  };

  const timer = useCallback(async () => {
    try {
      if (seconds > 0) {
        setTimeout(() => {
          /*
          setCountdown({
            ...countdown,
            seconds: countdown.seconds - 1
          });
          */
          setSeconds(seconds - 1);
        }, 1000);
      }

      if (seconds === 0) {
        console.log("done");
        setStart(false);
        setSeconds(60);
        setAttempts(0);
        setPromptLimit(false);
        /*
        setCountdown({
          ...countdown,
          seconds: 60,
          started: false,
          attempts: 0
        });
        */
      }
      /*
      if (!start) {
        setCountdown({
          ...countdown,
          seconds: 60,
          attempts: 0
        });
      }
      */
    } catch (e) {
      //call our error handler
      onError(e);
    }
  }, [seconds]);

  useEffect(() => {
    //console.log("countdown.started", countdown.started);
    if (start) timer();

    //if (!start) clearTimeout(timer);
    if (!start) setSeconds(60);
  }, [start, timer]);

  return (
    <div className="Home">
      <div className="ToggleButton">
        <LoaderButton
          size="sm"
          variant="outline-warning"
          style={{ textAlign: "center" }}
          onClick={() => setShowChart(!showChart)}
        >
          Toggle for {showChart ? "List View" : "Chart View"}
        </LoaderButton>
      </div>
      {/*Rendering Lander or Planets based on isAuthenticated flag*/}
      {isAuthenticated && !isLoading ? (
        !showChart ? (
          <ShowPlanets
            planets={planets}
            setPlanets={setPlanets}
            API={API}
            loadPlanets={loadPlanets}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            countdown={countdown}
            seconds={seconds}
            attempts={attempts}
            promptLimit={promptLimit}
            limit={limit}
          />
        ) : (
          <PlanetsChart
            chartsData={chartsData}
            chartType={chartType}
            setChartType={setChartType}
          />
        )
      ) : (
        <Lander />
      )}
    </div>
  );
};

export default Home;
