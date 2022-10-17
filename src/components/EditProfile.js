import { useState, useEffect } from "react";
import "../stylesheets/EditProfile.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const EditProfile = (props) => {
  const { password, setPassword } = props;
  const [profile, setProfile] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const updateMyProfile = async (
    firstname,
    lastname,
    newPassword,
    confirmPassword,
    email,
    address
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/customers/${username}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname,
          lastname,
          password: newPassword,
          confirmPassword,
          email,
          address,
        }),
      });
      const result = await response.json();
      setError(result.error);
      setErrorMessage(result.message);
      setSuccess(result.success);
      console.log("UPDATE PROFILE RESULTS", result);
    } catch (err) {
      console.error(err);
    }
  };

  const getMyProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/customers/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setProfile(result);
      console.log("PROFILE RESULT", result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyProfile();
    console.log("PASSWORD", password);
  }, []);

  const passwordChange = async () => {
    await updateMyProfile(
      firstname,
      lastname,
      newPassword,
      confirmPassword,
      email,
      address
    );
    await setPassword(newPassword);
  };
  const showErrors = () => {
    setError("true");
    setErrorMessage("Incorrect Password");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    {
      newPassword
        ? oldPassword === password
          ? passwordChange()
          : showErrors()
        : await updateMyProfile(
            firstname,
            lastname,
            newPassword,
            confirmPassword,
            email,
            address
          );
    }
    await getMyProfile();
    setFirstname("");
    setLastname("");
    setEmail("");
    setAddress("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  return (
    <div>
      <div id="profile-wrapper">
        <form
          id="update-form"
          className="form admin-form"
          onSubmit={handleSubmit}
        >
          <fieldset className="input-wrapper">
            <legend id="form-legend">
              <h2 id="profile-header">{username}'s Trainer Profile</h2>
            </legend>
            <div id="profile-inputs">
              <div className="profile-input-wrap">
                <p className="profile-info" id="profile-firstname">
                  First Name: {profile.firstname}
                </p>
                <input
                  type="text"
                  className="update-profile-input"
                  value={firstname}
                  placeholder="First Name"
                  onChange={(event) => {
                    setFirstname(event.target.value);
                  }}
                ></input>
              </div>
              <div className="profile-input-wrap">
                <p className="profile-info" id="profile-lastname">
                  Last Name: {profile.lastname}
                </p>
                <input
                  type="text"
                  className="update-profile-input"
                  value={lastname}
                  placeholder="Last Name"
                  onChange={(event) => {
                    setLastname(event.target.value);
                  }}
                ></input>
              </div>
              <div className="profile-input-wrap">
                <p className="profile-info" id="profile-old-password">
                  Password: *******{password.slice(-3)}
                </p>
                <input
                  type="password"
                  className="update-profile-input"
                  value={oldPassword}
                  placeholder="Password"
                  onChange={(event) => {
                    setOldPassword(event.target.value);
                  }}
                ></input>
              </div>
              <div id="new-pw-input" className="right-side">
                <input
                  type="text"
                  className="update-profile-input"
                  value={newPassword}
                  placeholder="New Password"
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                  }}
                ></input>
              </div>
              <br />
              <div id="confirm-pw-input" className="right-side">
                <input
                  type="text"
                  className="update-profile-input"
                  value={confirmPassword}
                  placeholder="Confirm New Password"
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                ></input>
              </div>
              <div className="profile-input-wrap">
                <p className="profile-info" id="profile-email">
                  Email: {profile.email}
                </p>
                <input
                  type="text"
                  className="update-profile-input"
                  value={email}
                  placeholder="Email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                ></input>
              </div>
              <div className="profile-input-wrap">
                <p className="profile-info" id="profile-address">
                  Address: {profile.address}
                </p>
                <input
                  type="text"
                  className="update-profile-input"
                  value={address}
                  placeholder="Address"
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                ></input>
              </div>
              <br />
              <button
                disabled={
                  (!firstname &&
                    !lastname &&
                    !email &&
                    !address &&
                    !newPassword) ||
                  newPassword !== confirmPassword
                }
                className="form-btn"
                type="submit"
              >
                Update Profile!
              </button>
              <div className="error-message">
                {error ? `${errorMessage}` : `${success}`}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
