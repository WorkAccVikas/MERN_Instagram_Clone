import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import fallBackImage from "../../assets/No_Image_Available.jpg";
import { ACTION } from "../../reducers/userReducer";

function Profile() {
  console.count("Profile");

  const { state, dispatch } = useContext(UserContext);
  console.log("state = ", state);
  const [mypics, setMyPics] = useState([]);
  const [image, setImage] = useState("");
  const fileInputRef = useRef(null);

  console.log("state = ", state);

  useEffect(() => {
    fetch("http://localhost:5000/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPics(data.myPost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram_clone");
      data.append("cloud_name", "dbxgos2wd");

      fetch("https://api.cloudinary.com/v1_1/dbxgos2wd/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch("http://localhost:5000/updatepic", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, profile_pic: result.profile_pic })
              );
              dispatch({
                type: ACTION.UPDATE_PIC,
                payload: result.profile_pic,
              });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log("Error while uploading image at cloudinary= ", err);
        });
    }
  }, [image]);

  const handleImageError = (event) => {
    event.target.src = fallBackImage;
    // https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930
  };

  const updatePhoto = (file) => {
    setImage(file);
  };

  const handleGetFileClick = () => {
    console.log("vikas");
    fileInputRef.current.click();
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0 auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
          paddingBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {/* LEARN : How to file modal open on click on image/div and and default text of file input is not shown */}
          {/* ACTION : Here, onclick on image input file open but text is not displayed we will hide it */}
          <div style={{ cursor: "pointer" }} className="custom-div">
            <input
              type="file"
              id="my_file"
              ref={fileInputRef}
              style={{ display: "none" }} // You can also move the CSS styles to an external CSS file
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
            <img
              src={state?.profile_pic}
              alt="Random_Image"
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              onClick={handleGetFileClick}
            />
            <span className="hidden-span">UPDATE</span>
          </div>
          <div>
            <h4>{state ? state.name : "loading"}</h4>
            <h5>{state ? state.email : "loading"}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h5>
                {mypics.length} {mypics.length > 1 ? "posts" : "post"}
              </h5>
              <h5>{state?.followers?.length} followers</h5>
              <h5>{state?.following?.length} following</h5>
              {/* <h5>40 followers</h5>
            <h5>40 following</h5> */}
            </div>
          </div>
        </div>
        {/* NOTE : This code is also working */}
        {/* <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input
              type="file"
              id="upload_updated_pic"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
            />
          </div>
        </div> */}
      </div>

      <div className="gallery">
        {mypics?.map((item) => (
          <img
            key={item._id}
            className="item"
            src={item.photo}
            alt={item.title}
            onError={handleImageError}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
