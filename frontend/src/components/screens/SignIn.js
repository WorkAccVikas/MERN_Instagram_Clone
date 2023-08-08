import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
import { API_BASE_URL } from "../../config/apiConfig";

function SignIn() {
  // console.count("SignIn");
  const { state, dispatch } = useContext(UserContext);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Instagram - SignIn";
  }, []);

  const PostData = () => {
    if (!email || !password) {
      M.toast({
        html: "Please enter all field",
        classes: "#c62828 red darken-3",
      });
      return;
    }
    // ACTION : Check email pattern
    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailPattern.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
      return;
    }

    fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: `Welcome ${data.user.name}`,
            classes: "#43a047 green darken-1",
          });
          navigate("/");
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
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={PostData}
          >
            Login
          </button>
          <h5>
            <Link to="/signup">Don't have an account ?</Link>
          </h5>
          <h6>
            <Link to="/reset">Forgot password ?</Link>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
