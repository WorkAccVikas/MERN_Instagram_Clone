import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

function SignUp() {
  console.count("SignUp");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [image, setImage] = useState("");
  const navigate = useNavigate();

  const PostData = () => {
    // ACTION : Check email pattern
    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailPattern.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
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
    if (!passwordPattern.test(password)) {
      M.toast({
        html: "Please enter password containing at least one uppercase & lowercase letters, at least one special character and digit and password length at least 5",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: "Register Successfully",
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
            placeholder="name"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              const capitalizedValue =
                value.charAt(0).toUpperCase() + value.slice(1);
              setName(capitalizedValue);
            }}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={PostData}
          >
            SignUP
          </button>
          <h5>
            <Link to="/signin">Already have an account ?</Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
