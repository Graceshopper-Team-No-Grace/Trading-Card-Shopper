import { useState } from "react";
import { Navigate } from "react-router-dom";
// import { BASE_URL} from

const path = process.env.REACT_APP_BASE_URL;
const BASE_URL = "http://localhost:4000/api";
const Register = (props) => {
  const { isadmin } = props;
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [registered, setRegistered] = useState(false);
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
    // console.log("PATH", path);
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
      console.log("resulterror", result.error);
      console.log("resultmessage", result.message);
      setRegistered(result.token);
    } catch (err) {
      console.error(err);
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
      <form id="registration" onSubmit={handleSubmit}>
        {registered ? (
          <Navigate to="/customers/login" />
        ) : (
          <>
            <h2>New Customer Registration Form</h2>
            <div>
              <input
                value={newUsername}
                placeholder="Please enter a username"
                required
                minLength={5}
                onChange={(event) => {
                  setNewUsername(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <input
                value={newPassword}
                placeholder="Please enter password"
                required
                type="password"
                minLength={8}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <input
                value={confirmPassword}
                placeholder="Please confirm password"
                required
                type="password"
                minLength={8}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <input
                value={firstname}
                placeholder="Please enter your first name"
                required
                onChange={(event) => {
                  setFirstname(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <input
                value={lastname}
                placeholder="Please enter your last name"
                required
                onChange={(event) => {
                  setLastname(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <input
                value={address}
                placeholder="Please enter shipping address"
                required
                onChange={(event) => {
                  setAddress(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <input
                value={email}
                placeholder="Please enter your email"
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              ></input>
            </div>
            <div id="error">
              <h2>{error ? `${errorMessage}` : null}</h2>
              {/* <PasswordError />
              <UsernameError /> */}
            </div>
            <div>
              <button type="submit">Submit!</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
