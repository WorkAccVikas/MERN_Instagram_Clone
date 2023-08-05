import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import fallBackImage from "../../assets/No_Image_Available.jpg";

function Profile() {
  console.count("Profile");

  const { state, dispatch } = useContext(UserContext);
  console.log("state = ", state);
  const [mypics, setMyPics] = useState([]);
  const [image, setImage] = useState("");

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

  const handleImageError = (event) => {
    event.target.src = fallBackImage;
    // https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            src="https://images.unsplash.com/photo-1516908205727-40afad9449a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80"
            alt="Random_Image"
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
          />
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
            <h5>{mypics.length} posts</h5>
            <h5>{state?.followers?.length}followers</h5>
            <h5>{state?.following?.length} following</h5>
            {/* <h5>40 followers</h5>
            <h5>40 following</h5> */}
          </div>
        </div>
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
