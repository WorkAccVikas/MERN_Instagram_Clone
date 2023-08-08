import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
import { API_BASE_URL } from "../../config/apiConfig";

function NewPassword() {
  // console.count("NewPassword");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  // console.log(token);

  useEffect(() => {
    document.title = "Instagram - New Password";
  }, []);

  const PostData = () => {
    if (!password || !confirmPassword) {
      M.toast({
        html: "Please enter all field",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    /* ACTION : Check password : 
        Condition : 
          - minimum length = 5
          - at least one uppercase letter and lowercase letters
          - at least one special character and digit
    */
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`[\]{}|:;"'<>,.?/\\]).{5,}$/;

    if (
      !passwordPattern.test(password) ||
      !passwordPattern.test(confirmPassword)
    ) {
      M.toast({
        html: "Please enter password containing at least one uppercase & lowercase letters, at least one special character and digit and password length at least 5",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    // ACTION : Show Toast message when both password doesn't match
    if (password !== confirmPassword) {
      M.toast({
        html: "New password and Confirm password do not match",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    fetch(`${API_BASE_URL}/newPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: `Password Update Successfully`,
            classes: "#43a047 green darken-1",
          });
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(`Error ${err}`);
      });
  };

  return (
    <div>
      <div className="myCard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>

          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={PostData}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
