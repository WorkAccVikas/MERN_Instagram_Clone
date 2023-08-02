import React, { useCallback, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { ACTION } from "../reducers/userReducer";

const set = new Set();

function Navbar() {
  console.count("Navbar");

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  // PROBLEM : For every render it create new function
  // const renderList = () => {
  //   if (state) {
  //     return [
  //       <li key="1">
  //         <Link to="/profile">Profile</Link>
  //       </li>,
  //       <li key="2">
  //         <Link to="/create">Create Post</Link>
  //       </li>,
  //       <li key="5">
  //         <button
  //           className="btn #c62828 red darken-3"
  //           onClick={() => {
  //             localStorage.clear();
  //             dispatch({ type: ACTION.CLEAR });
  //             navigate("/signin");
  //           }}
  //         >
  //           Logout
  //         </button>
  //       </li>,
  //     ];
  //   } else {
  //     return [
  //       <li key="6">
  //         <Link to="/signin">Signin</Link>
  //       </li>,
  //       <li key="7">
  //         <Link to="/signup">Signup</Link>
  //       </li>,
  //     ];
  //   }
  // };

  // SOLUTION : Optimize : when state change the function is created otherwise not created

  const renderList = useCallback(() => {
    if (state) {
      return [
        <li key="1">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="2">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="5">
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: ACTION.CLEAR });
              navigate("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  }, [state]);

  set.add(renderList);
  console.log({ set });
  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/signin"} className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
