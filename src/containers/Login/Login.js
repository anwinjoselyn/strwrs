import React, { useState } from "react";

//Related to forms
import Form from "react-bootstrap/Form"; //Bootstrap Form component
import * as yup from "yup"; // For form validation
import { useFormFields } from "../../libs/hooksLib"; //Forms Hook

import LoaderButton from "../../components/LoaderButton/LoaderButton"; //Reusable Button component

import {
  login,
  checkSuperUser,
  getProfile
} from "../../services/Auth/Authservice"; //Function for login and authentication

import { useAppContext } from "../../libs/contextLib"; //To acces user session

import { onError } from "../../libs/errorLib"; //Error handler hook

import "./Login.css"; //A little bit of styling

export default function Login() {
  const { userHasAuthenticated, setProfile, setSuperUser } = useAppContext(); //Getting the user session

  const [isLoading, setIsLoading] = useState(false); //To provide user feedback while logging in

  const [fields, handleFieldChange] = useFormFields({
    userName: "",
    password: ""
  }); //Initializing state with help of our custom form hook

  const [isValid, setIsValid] = useState(false); //To check for form input errors

  //Validation (minimal) schema using YUP
  let schema = yup.object().shape({
    userName: yup
      .string()
      .required()
      .min(3, "User Name must be at least 3 characters"),
    password: yup
      .string()
      .required()
      .min(5, "Password must be at least 5 characters")
  });

  //Our actual validation function
  const validateForm = async () => {
    let valid = false;
    try {
      valid = await schema.isValid(
        {
          userName: fields.userName,
          password: fields.password
        },
        { abortEarly: false }
      );
      setIsValid(valid);
    } catch (error) {
      onError(error);
    }
  };

  //Submit Login Data to our API which will verify the data from form and server
  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true); //To provide feedback to user (in case there is delay from backend API)

    try {
      await login(fields.userName, fields.password); //check if login credentials are valid

      /*****To ensure we update state when a person logs out from one user and logs back in as a different user****/
      const profile = await getProfile(); //Get profile of user
      if (profile && profile.data) setProfile(profile.data);
      let superUserFlag = await checkSuperUser();
      if (superUserFlag) setSuperUser(superUserFlag);

      userHasAuthenticated(true); //if valid update context and push user to /home
    } catch (e) {
      onError(e); //if unsuccessful login, pushed to our error handler
      setIsLoading(false); //ensure component no longer in loading state
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="userName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={fields.userName}
            onChange={handleFieldChange}
            autoComplete="name"
            placeholder="e.g. Full Name of Star Wars Character"
            onBlur={validateForm}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
            autoComplete="current-password"
            placeholder="e.g. Year of birth of above Star Wars Character"
            onBlur={validateForm}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!isValid}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
