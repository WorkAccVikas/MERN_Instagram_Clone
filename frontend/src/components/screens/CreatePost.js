import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import { API_BASE_URL } from "../../config/apiConfig";

function CreatePost() {
  console.count("CreatePost");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch(`${API_BASE_URL}/createpost`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Post Created Successfully",
              classes: "#43a047 green darken-1",
            });
            navigate("/");
          }
        })
        .catch((err) => {
          console.log("Error while creating post = ", err);
        });
    }
  }, [url]);

  useEffect(() => {
    document.title = "Instagram - Create Post";
  }, []);

  const postDetails = () => {
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

  return (
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input type="text" className="file-path validate" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={postDetails}
      >
        Submit Post
      </button>
    </div>
  );
}

export default CreatePost;
