import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "../stylesheets/Register.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Register = ({ loggedIn, setLoggedIn, setToken }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  // const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const registerNewCustomer = async (
    username,
    password,
    confirmPassword,
    firstname,
    lastname,
    email,
    address
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/customers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          firstname,
          lastname,
          email,
          address,
        }),
      });
      const result = await response.json();
      console.log("result", result);
      setError(result.error);
      setErrorMessage(result.message);
      result.token ? localStorage.setItem("token", result.token) : null;
      result.customer.username
        ? localStorage.setItem("username", result.customer.username)
        : null;
      setLoggedIn(true);
      setToken(result.token);
      console.log("resulterror", result.error);
      console.log("resultmessage", result.message);
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registerNewCustomer(
      newUsername,
      newPassword,
      confirmPassword,
      firstname,
      lastname,
      email,
      address
    );
  };

  const Error = () => {
    if (errorMessage) {
      return <h2>{errorMessage}</h2>;
    }
    return;
  };

  return (
    <div>
      <form id="register" className="form" onSubmit={handleSubmit}>
        {loggedIn ? (
          <Navigate to="/" />
        ) : (
          <>
            <h2 className="form-header">Register</h2>
            <hr className="form-divider"></hr>
            <div className="input-wrapper">
              <input
                className="form-inputs"
                type="text"
                placeholder="Username"
                required
                minLength={5}
                onChange={(event) => {
                  setNewUsername(event.target.value);
                }}
              ></input>
              <input
                className="form-inputs"
                placeholder="Password"
                required
                type="password"
                minLength={8}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
              ></input>
              <input
                className="form-inputs"
                placeholder="Confirm Password"
                required
                type="password"
                minLength={8}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              ></input>
              <input
                className="form-inputs"
                type="text"
                placeholder="Your First Name"
                required
                onChange={(event) => {
                  setFirstname(event.target.value);
                }}
              ></input>
              <input
                className="form-inputs"
                type="text"
                placeholder="Your Last Name"
                required
                onChange={(event) => {
                  setLastname(event.target.value);
                }}
              ></input>
              <textarea
                id="address-input"
                className="form-inputs"
                type="text"
                placeholder="Address&#10;City&#10;State&#10;Zip Code"
                required
                onChange={(event) => {
                  setAddress(event.target.value);
                }}
              ></textarea>
              <input
                className="form-inputs"
                type="text"
                placeholder="Email"
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              ></input>
            </div>
            <div className="error">
              <h4>{error ? `${errorMessage}` : null}</h4>
              {/* <PasswordError />
              <UsernameError /> */}
            </div>
            <div>
              <button className="form-btn" type="submit">
                Submit!
              </button>
              <div className="form-redirect-text">
                Already a member?{" "}
                <Link className="form-redirect-link" to="/login">
                  Login!
                </Link>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
