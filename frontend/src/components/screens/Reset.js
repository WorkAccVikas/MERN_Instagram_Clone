import M from "materialize-css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Reset() {
  console.count("Reset");

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const PostData = () => {
    // ACTION : Check email pattern
    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailPattern.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
      return;
    }

    fetch("http://localhost:5000/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({
            html: "Email not found in our records",
            classes: "#c62828 red darken-3",
          });
        } else {
          M.toast({
            html: `Check your mail`,
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
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={PostData}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reset;
