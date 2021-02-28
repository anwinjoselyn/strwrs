import axios from "axios";

const baseUrl = "https://swapi.dev/api";

const API = axios.create({ baseUrl });
/*
API.interceptors.request.use(function(config) {
  console.log("Request sent");
  return config;
});
*/
// Add a request interceptor
API.interceptors.request.use(
  config => {
    console.log("Request sent");
    console.log("config.baseUrl", config.baseUrl);
    console.log("config", config);

    config.url = config.baseUrl + config.url;
    console.log("config.url", config.url);
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

//Add a response interceptor

API.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;
    console.log("originalRequest", originalRequest);
    console.log("error.response.status", error.response.status);
    if (error.response.status === 401) {
      //router.push('/login');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default API;
