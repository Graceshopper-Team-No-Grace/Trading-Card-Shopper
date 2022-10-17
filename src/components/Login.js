import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "../stylesheets/Login.css";

// require("dotenv").config();
// const path = process.env.REACT_APP_BASE_URL;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Login = ({
  setToken,
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  password,
  setPassword,
  setIsadmin,
}) => {
  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //   const [loggedIn, setLoggedIn] = useState(false);

  // const store = () => {
  //   result.token ? localStorage.setItem("token", result.token) : null
  //   result.customer.admin ? localStorage.setItem("admin", result.customer.admin) : null
  //       result.customer.username
  //       ? localStorage.setItem("username", result.customer.username)
  //       : null
  // }

  const loginUser = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/customers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json();
      console.log("RESULT", result);
      // {
      //   result.customer
      //     ? localStorage.setItem(
      //         "token",
      //         result.token
      //       )(
      //         result.customer.admin &&
      //           localStorage.setItem("admin", result.customer.admin)
      //       )(
      //         result.customer.username &&
      //           localStorage.setItem("username", result.customer.username)
      //       )
      //     : null;
      // }

      setLoggedIn(true);
      setError(result.error);
      console.log("RESULT ERROR", result.error);
      setErrorMessage(result.message);
      setToken(result.token);
      setIsadmin(result.customer.admin);
      localStorage.setItem("token", result.token);
      localStorage.setItem("admin", result.customer.admin);
      localStorage.setItem("username", result.customer.username);
      return result.token;
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(username, password);
  };

  return (
    <div>
      <form id="login" className="form" onSubmit={handleSubmit}>
        {loggedIn ? (
          <Navigate to="/" />
        ) : (
          <>
            <h2 className="form-header">Login</h2>
            <hr className="form-divider"></hr>
            <div className="input-wrapper">
              <input
                type="text"
                id="login-username"
                className="form-inputs"
                placeholder="Username"
                required
                minLength={5}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              ></input>
              <input
                id="login-password"
                className="form-inputs"
                placeholder="Password"
                required
                type="password"
                minLength={8}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              ></input>
            </div>
            <div className="error">
              <h4>{error && `${errorMessage}`}</h4>
            </div>
            <div>
              <button className="form-btn" type="submit">
                Login
              </button>
              <div className="form-redirect-text">
                Not a member?{" "}
                <Link className="form-redirect-link" to="/register">
                  Sign Up!
                </Link>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
