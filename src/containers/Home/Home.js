import React, { useState, useEffect, useCallback } from "react";

import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";

import API from "../../services/api/api";

import { calculateCharts } from "../../libs/chartCalculator";

import LoaderButton from "../../components/LoaderButton/LoaderButton";

import Lander from "./Components/Lander";
import ShowPlanets from "./Components/ShowPlanets";
import PlanetsChart from "./Components/PlanetsChart";

import "./Home.css";

const Home = () => {
  const { isAuthenticated, isSuperUser } = useAppContext(); //to get user authenticated state

  //to store retrieved planets in state
  const [planets, setPlanets] = useState([]);
  const [chartsData, setChartsData] = useState([]);

  //to store the search term from search form
  const [searchTerm, setSearchTerm] = useState("");

  /***** Counter states *****/
  const [start, setStart] = useState(false); //to know when to start and stop timer
  const [seconds, setSeconds] = useState(60); //the actual timer
  const [attempts, setAttempts] = useState(0); //hold state related to no: of searches per minute
  const [promptLimit, setPromptLimit] = useState(false); //if not a super user - used to prompt user about limits to searches per minute

  const limit = isSuperUser ? 999 : 15; //limiting no: of searches if not a super user. Assigning a very large number for unlimited searches

  const [showChart, setShowChart] = useState(false); //toggle for chart view or list view of planets
  const [chartType, setChartType] = useState("bar"); //initialize chart type to bar as default

  const [isLoading, setIsLoading] = useState(true); //to ensure components do not load before planets are retrieved

  //On first component mount get planets and calculate data for charts
  useEffect(() => {
    async function onLoad() {
      //Just a regular auth check
      if (!isAuthenticated) {
        return;
      }

      try {
        const planets = await loadPlanets(); //get planets data
        setPlanets(planets.data.results);

        const chartData = await calculateCharts(planets.data.results); //calculate chart data
        setChartsData(chartData);
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

  //Handle search, get results, populate
  const handleSearch = async event => {
    let value = event.target.value;

    try {
      setSearchTerm(value);

      //Use search API only if search term is at least 3 characters in length
      if (value && value.length > 2) {
        if (!start) setStart(true); //if timer not started start now

        //check if limit reached
        if (attempts >= limit) {
          setPromptLimit(true);
        }

        const results = await searchPlanets(value); //Call search API

        setPlanets(results.data.results); //store search results for display
        setAttempts(attempts + 1); //increase search attempt by 1
      } else if (!value) {
        //Call get API to load ALL planets
        //In real world I dislike calling APIs so many times if there is reasonable assurance that data has not mutated in the mean time.
        const results = await loadPlanets();
        setPlanets(results.data.results);
      }
    } catch (e) {
      onError(e); //Our error handler function
    }
  };

  //Our timer/counter function
  const timer = useCallback(async () => {
    try {
      //Start timer only if seconds > 0 (start and stop of timer handled in useEffect)
      if (seconds > 0) {
        //setTimeout seems to work better for this piece of code compared to setInterval
        setTimeout(() => {
          setSeconds(seconds - 1);
        }, 1000);
      }

      //When countdown ends in 60 seconds reset all timer related state data
      if (seconds === 0) {
        setStart(false);
        setSeconds(60);
        setAttempts(0);
        setPromptLimit(false);
      }
    } catch (e) {
      onError(e); //call our error handler
    }
  }, [seconds]);

  //call timer function when start = true
  useEffect(() => {
    if (start) timer();

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
      {/*Rendering Lander or Planets/Charts based on isAuthenticated flag*/}
      {isAuthenticated && !isLoading ? (
        !showChart ? (
          <ShowPlanets
            planets={planets}
            setPlanets={setPlanets}
            API={API}
            loadPlanets={loadPlanets}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
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
