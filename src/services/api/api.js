import axios from "axios";

const baseUrl = "https://swapi.dev/api";

const API = axios.create({ baseUrl });

//Request interceptor
API.interceptors.request.use(
  config => {
    config.url = config.baseUrl + config.url;

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
    //Normally will use these to write custom returns according to requirement. Showing here as a placeholder for this assignment.
    if (error.response.status === 400) {
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      return Promise.reject(error);
    }
    if (error.response.status === 404) {
      return Promise.reject(error);
    }
    if (error.response.status === 500) {
      return Promise.reject(error);
    }
    if (error.response.status === 502) {
      return Promise.reject(error);
    }
    if (error.response.status === 503) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default API;
