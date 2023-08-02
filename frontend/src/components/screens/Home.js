import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import fallBackImage from "../../assets/No_Image_Available.jpg";

function Home() {
  console.count("Home");
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5000/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      })
      .catch((err) => {
        console.log("Error while fetching all posts = ", err);
      });
  }, []);

  const handleImageError = (event) => {
    event.target.src = fallBackImage;
    // https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930
  };

  return (
    <div className="home">
      {data?.map((post) => (
        <div key={post._id} className="card home-card">
          <h5>{post.postedBy.name}</h5>
          <div className="card-image">
            {/* LEARN : How to set fallback image when image url in db is invalid  */}
            <img
              src={post.photo}
              alt="card__image"
              onError={handleImageError}
            />
          </div>
          <div className="card-content">
            <i className="material-icons" style={{ color: "red" }}>
              favorite
            </i>
            <h6>{post.title}</h6>
            <p>{post.body}</p>
            <input type="text" placeholder="add a comment" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
