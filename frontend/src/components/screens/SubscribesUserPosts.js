import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import fallBackImage from "../../assets/No_Image_Available.jpg";
import M from "materialize-css";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault("America/New_York");
// NOTE ; Here, data and time as per America/New_York


function SubscribesUserPosts() {
  console.count("Home");
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5000/allsubpost", {
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

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error while like post = ", err);
      });
  };

  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error while unlike post = ", err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("http://localhost:5000/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId, text }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error while comment = ", err);
      });
  };

  const deletePost = (postId) => {
    fetch(`http://localhost:5000/deletepost/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
        M.toast({
          html: "Post deleted successfully",
          classes: "#c62828 red darken-3",
        });
      });
  };

  return (
    <div className="home">
      {data?.map((post) => (
        <div key={post._id} className="card home-card">
          <h5 style={{ padding: "10px", cursor: "pointer" }}>
            {/* ACTION : If user A login and when he click on other username on post 
                        then it will redirect to /profile/userid and if click on his how
                        post then it will redirect to /profile  */}
            <strong style={{ fontWeight: "800", letterSpacing: "10px" }}>
              <Link
                to={
                  post.postedBy._id !== state._id
                    ? `/profile/${post.postedBy._id}`
                    : "/profile"
                }
              >
                {post.postedBy.name}
              </Link>
              <span
                style={{
                  all: "initial",
                  position: "relative",
                  bottom: "-0.5em",
                  color: "gray",
                }}
              >
                {dayjs(post?.createdAt).tz().format("MMM D, YYYY") +
                  " at " +
                  dayjs(post?.createdAt).tz().format("hh:mm:ss A")}
              </span>
            </strong>

            {post.postedBy._id === state._id && (
              <i
                className="material-icons"
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => deletePost(post._id)}
              >
                delete
              </i>
            )}
          </h5>
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
            {/* ACTION : If user already like it then it show thumb down otherwise thumb up */}
            {post.likes.includes(state._id) ? (
              <i
                className="material-icons"
                onClick={() => unlikePost(post._id)}
              >
                thumb_down
              </i>
            ) : (
              <i className="material-icons" onClick={() => likePost(post._id)}>
                thumb_up
              </i>
            )}

            <h6>
              {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
            </h6>
            <h6>{post.title}</h6>
            <p>{post.body}</p>
            {post?.comments.map((eachComment) => (
              <h6 key={eachComment._id}>
                <span style={{ fontWeight: "600" }}>
                  {eachComment.postedBy.name}
                </span>{" "}
                : {eachComment.text}{" "}
                {/* <small style={{ color: "grey" }}>{eachComment.createdAt}</small> */}
                {/* TOPIC : Change format of date */}
                {/* <small style={{ color: "grey", fontSize: "60%" }}>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  }).format(new Date(eachComment.createdAt))}
                </small> */}
              </h6>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                makeComment(e.target[0].value, post._id);
                e.target[0].value = "";
              }}
            >
              <input type="text" placeholder="add a comment" />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscribesUserPosts;
