import jwt from "jsonwebtoken";
//import axios from "axios";
import API from "../api/api";
const secretKey = require("../../libs/config").default.secretOrKey;

/*
export default class Auth {
  // Initializing important variables
  constructor(domain) {
    this.domain = domain || "https://swapi.dev/api/"; // API server domain
    // React binding stuff
    this.login = this.login.bind(this);

    this.getProfile = this.getProfile.bind(this);
  }
*/
export async function login(userName, password) {
  try {
    //fetchc user data
    const result = await API.get(`/people/?${userName}`);
    /*
      axios({
        method: "GET",
        url: `${baseUrl}/${userName}`
      });
*/
    //console.log("result.data", result.data.results);

    let actualUser = "";

    if (result.data.results && result.data.results.length > 0) {
      //get the user first
      actualUser = result.data.results.filter(r => r.name === userName)[0];
      console.log("actualUser", actualUser);

      // Check if userName & passwords match
      if (actualUser && actualUser.birth_year === password) {
        //console.log("if happened");
        const token = await generateToken(actualUser, false);
        //console.log("token", token);

        return token;
      } else return null;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

export async function loggedIn() {
  // Checks if there is a saved token and it's still valid
  try {
    // Getting token from localstorage
    const token = await getToken();
    //console.log("token", token);
    let isExpired = true;
    //if first time user, there will be no token in local storage
    if (token) isExpired = await isTokenExpired(token);
    return !!token && !isExpired; // handwaiving here
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

export async function checkSuperUser() {
  // Checks if there is a saved token and it's still valid
  try {
    // Getting token from localstorage
    const token = await getToken();
    //decoding token
    let decoded = await jwt.verify(token, secretKey);

    //In a real world app we will not hard code the super user name. This is for this example only.
    //Return true or false on checking user's name = Luke Skywalker
    if (decoded && decoded.name && decoded.name === "Luke Skywalker")
      return true;
    else return false;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

const isTokenExpired = async token => {
  try {
    if (token) {
      let decoded = await jwt.verify(token, secretKey);
      //console.log("decoded", decoded);
      if (decoded) return false;
      else return true;
    } else return true;
  } catch (err) {
    // err
    console.log("error", err);
    return true;
  }
};

const setToken = async strwr_token => {
  // Saves user token to localStorage
  try {
    //console.log("strwr_token", strwr_token);
    await localStorage.removeItem("strwr_token");
    await localStorage.setItem("strwr_token", strwr_token);
  } catch (err) {
    // err
    console.log("error", err);
    return null;
  }
};

const getToken = async () => {
  // Retrieves the user token from localStorage

  try {
    let token = await localStorage.getItem("strwr_token");
    //console.log("token", token);
    if (token) return token;
    else return null;
  } catch (err) {
    // err
    console.log("error", err);
    return null;
  }
};

export const logout = async () => {
  // Clear user token and profile data from localStorage
  await localStorage.removeItem("strwr_token");
};

export async function getProfile() {
  // Using jwt-decode npm package to decode the token

  try {
    let token = await getToken();
    let decoded = await jwt.verify(token, secretKey);
    console.log("decoded", decoded);
    if (decoded) return { data: decoded };
    else return null;
  } catch (err) {
    // err
    console.log("error", err);
    return null;
  }
}

const generateToken = async (userData, isSuperUser) => {
  try {
    let payload = {
      datuserDataa: userData,
      name: userData.name,
      isSuperUser: isSuperUser
    };

    let token = await jwt.sign(payload, secretKey, {
      expiresIn: "21 days"
    });

    //store the token in local storage
    await setToken(token);

    return token;
  } catch (err) {
    // err
    console.log("error", err);
    return null;
  }
};
/*
}
*/
