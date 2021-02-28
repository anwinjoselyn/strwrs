import jwt from "jsonwebtoken";
import API from "../api/api";

const secretKey = require("../../libs/config").default.secretOrKey; //normally this will be added to .env variables - forgoing that for this example project

export async function login(userName, password) {
  try {
    const result = await API.get(`/people/?${userName}`); //fetch user data

    let actualUser = "";

    if (result.data.results && result.data.results.length > 0) {
      actualUser = result.data.results.filter(r => r.name === userName)[0]; //get the user first

      // Check if userName & passwords match
      if (actualUser && actualUser.birth_year === password) {
        const token = await generateToken(actualUser, false);
        return token;
      } else return null;
    } else {
      return null;
    }
  } catch (error) {
    return error; //Our login component will handle reporting error through our common error handler
  }
}

export async function loggedIn() {
  // Checks if there is a saved token and it's still valid
  try {
    const token = await getToken(); // Getting token from localstorage

    let isExpired = true;

    //if first time user, there will be no token in local storage
    if (token) isExpired = await isTokenExpired(token);

    return !!token && !isExpired; // handwaiving here
  } catch (error) {
    return error; //Our App (main) component will handle reporting error through our common error handler
  }
}

// Checks if there is a user is a Super User
export async function checkSuperUser() {
  try {
    const token = await getToken(); // Getting token from localstorage

    let decoded = await jwt.verify(token, secretKey); //decoding token

    /****In a real world app we will not hard code the super user name. This is for this example only.*****/
    //Return true or false on checking user's name = Luke Skywalker
    if (decoded && decoded.name && decoded.name === "Luke Skywalker")
      return true;
    else return false;
  } catch (error) {
    return error; //The component calling this function will handle reporting error through our common error handler
  }
}

//to check if token is expired
const isTokenExpired = async token => {
  try {
    if (token) {
      let decoded = await jwt.verify(token, secretKey);
      if (decoded) return false;
      else return true;
    } else return true;
  } catch (err) {
    return true;
  }
};

// Saves user token to localStorage
const setToken = async strwr_token => {
  try {
    await localStorage.removeItem("strwr_token");
    await localStorage.setItem("strwr_token", strwr_token);
  } catch (err) {
    return null;
  }
};

// Retrieves the user token from localStorage
const getToken = async () => {
  try {
    let token = await localStorage.getItem("strwr_token");

    if (token) return token;
    else return null;
  } catch (err) {
    return null;
  }
};

// Clear user token and profile data from localStorage
export const logout = async () => {
  await localStorage.removeItem("strwr_token");
};

// Using jwt-decode npm package to decode the token and return profile
export async function getProfile() {
  try {
    let token = await getToken();
    let decoded = await jwt.verify(token, secretKey);

    if (decoded) return { data: decoded };
    else return null;
  } catch (err) {
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

    //generate token with payload and signing with jwt
    let token = await jwt.sign(payload, secretKey, {
      expiresIn: "21 days"
    });

    await setToken(token); //store the token in local storage

    return token;
  } catch (err) {
    return null;
  }
};
