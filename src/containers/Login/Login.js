import React, { useState } from "react";
/* No longer needed now that Authenticated/Unaauthenticated routes are defined
import { useHistory } from "react-router-dom";
*/
import Form from "react-bootstrap/Form";

//Reusable Button component
import LoaderButton from "../../components/LoaderButton/LoaderButton";

//Functions for login and authentication
import { login } from "../../services/Auth/Authservice";

//To acces user session
import { useAppContext } from "../../libs/contextLib";

//Error handler
import { onError } from "../../libs/errorLib";

//Forms Hook
import { useFormFields } from "../../libs/hooksLib";

import "./Login.css";

export default function Login() {
  /* No longer needed now that Authenticated/Unaauthenticated routes are defined
  //Initializing for pushing to Home component after successful login
  const history = useHistory();
  */
  //Getting the user session
  const { userHasAuthenticated } = useAppContext();

  //To provide user feedback while logging in
  const [isLoading, setIsLoading] = useState(false);

  //Initializing state with help of our custom form hook
  const [fields, handleFieldChange] = useFormFields({
    userName: "",
    password: ""
  });

  //Our validation function
  const validateForm = () => {
    return fields.userName.length > 0 && fields.password.length > 0;
  };

  //Submit Login Data to our API which will verify the data from form and server
  const handleSubmit = async event => {
    event.preventDefault();

    //To provide feedback to user (in case there is delay from backend API)
    setIsLoading(true);

    try {
      //check if login credentials are valid
      await login(fields.userName, fields.password);

      //if valid update context and push user to /home
      userHasAuthenticated(true);
      /* No longer needed now that Authenticated/Unaauthenticated routes are defined
      history.push("/");
      */
    } catch (e) {
      //console.log("e", e);
      //if unsuccessful login, pushed to our error handler
      onError(e);
      //ensure component no longer in loading state
      setIsLoading(false);
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
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
