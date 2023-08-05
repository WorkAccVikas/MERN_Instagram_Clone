import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

function SignUp() {
  console.count("SignUp");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram_clone");
    data.append("cloud_name", "dbxgos2wd");

    fetch("https://api.cloudinary.com/v1_1/dbxgos2wd/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.status === 400) {
          M.toast({
            html: "Please Upload Image",
            classes: "#c62828 red darken-3",
          });
        }
        return res.json();
      })
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log("Error while uploading image = ", err);
      });
  };

  const uploadFields = () => {
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
        pic: url,
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

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
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
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span>Upload Pic</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input type="text" className="file-path validate" />
            </div>
          </div>
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
