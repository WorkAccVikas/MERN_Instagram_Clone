import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import fallBackImage from "../../assets/No_Image_Available.jpg";
import { useParams } from "react-router-dom";
import { ACTION } from "../../reducers/userReducer";
import { API_BASE_URL } from "../../config/apiConfig";

function UserProfile() {
  // console.count("UserProfile");
  const { state, dispatch } = useContext(UserContext);
  // console.log("state = ", state);

  const [mypics, setMyPics] = useState([]);
  const [userProfile, setProfile] = useState(null);
  const { userid } = useParams();
  /** PROBLEM : When page reload manually state is null so showfollow is always true
   * if i follow User A it will show unfollow button when we back page using back button
   * it still show unfollow button but when page it always show follow button only.
   */
  // const [showfollow, setShowFollow] = useState(
  //   state ? !state?.following?.includes(userid) : true
  // );

  /** SOLUTION : Using localStorage */
  const [showfollow, setShowFollow] = useState(() => {
    const storedState = localStorage.getItem("user");
    const parsedData = JSON.parse(storedState);
    const present = parsedData.following.includes(userid);
    return storedState ? !present : true;
  });

  // const [showfollow, setShowFollow] = useState(true);

  // console.log("Ahe ka ? => ", state?.following?.includes(userid));
  // console.log(userid, typeof userid);
  // console.log("Vikas = ", showfollow);
  // console.log("ram = ", state !== null);

  useEffect(() => {
    // console.count("UserProfile useEffect run");
    fetch(`${API_BASE_URL}/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setProfile(data);
      });
  }, []);

  useEffect(() => {
    if (!!userProfile) {
      document.title = `Instagram - ${userProfile.user.name}`;
    } else {
      document.title = "Instagram";
    }
  }, [userProfile]);

  const handleImageError = (event) => {
    event.target.src = fallBackImage;
    // https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930
  };

  const followUser = () => {
    fetch(`${API_BASE_URL}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: ACTION.UPDATE,
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => {
        console.log("Error while follow user");
      });
  };

  const unfollowUser = () => {
    fetch(`${API_BASE_URL}/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: ACTION.UPDATE,
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => {
        console.log("Error while unfollow user");
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0",
              borderBottom: "1px solid grey",
              paddingBottom: "20px",
            }}
          >
            <div>
              <img
                src={userProfile.user.profile_pic}
                alt="Random_Image"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h5>
                  {userProfile.posts.length}{" "}
                  {userProfile.posts.length > 1 ? "posts" : "post"}
                </h5>
                <h5>{userProfile.user.followers.length} followers</h5>
                <h5>{userProfile.user.following.length} following</h5>
              </div>
              {/* {showfollow && state !== null
                ? console.count("Yes")
                : console.count("No")} */}

              {showfollow && state !== null ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts?.map((item) => (
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
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
}

export default UserProfile;
