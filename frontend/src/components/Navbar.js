import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { ACTION } from "../reducers/userReducer";
import M from "materialize-css";
import { API_BASE_URL } from "../config/apiConfig";

// const set = new Set();
// const set1 = new Set();

function Navbar() {
  console.count("Navbar");

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const searchModalRef = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    M.Modal.init(searchModalRef.current);
    // LEARN : How to clear set when modal is closed when user click outside of modal
    function handleClickOutside(event) {
      // DESC : Return True if Parent contains child othewise false
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setSearch("");
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    try {
      if (!search) {
        // ACTION : If search field is empty then set data to empty array
        setUserDetails([]);
      } else {
        console.log("Fetching...............");
        fetch(`${API_BASE_URL}/searchUsers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: search,
          }),
        })
          .then((res) => res.json())
          .then((results) => {
            console.log({ results });
            setUserDetails(results.user);
          });
      }
    } catch (error) {
      console.log("Error while fetching data = ", error);
    }
  };

  // ACTION : Debounce on search
  useEffect(() => {
    console.log("useEffect runs...");
    let debounce = setTimeout(() => {
      fetchData();
    }, 1000);
    return () => {
      console.log("cleanup.....");
      clearTimeout(debounce);
    };
  }, [search]);

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

  const renderList = useMemo(() => {
    console.count("renderList");
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,

        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My following Posts</Link>
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

  // set.add(renderList);
  // console.log({ set });

  // set1.add(state);
  // console.log({ set1 });

  console.log("search = ", search);

  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to={"/"} className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right">
            {/* {renderList()} */}
            {renderList}
          </ul>
        </div>
        <div
          id="modal1"
          className="modal"
          ref={searchModalRef}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="search users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="collection">
              {userDetails.length === 0 && search.length > 0 && (
                <li className="collection-item">User not found</li>
              )}

              {userDetails?.map((item) => (
                <Link
                  key={item._id}
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModalRef.current).close();
                    setSearch("");
                  }}
                >
                  <li
                    className="collection-item"
                    style={{ marginBottom: ".5rem" }}
                  >
                    <p>Name : {item.name}</p>
                    <p>Email : {item.email}</p>
                  </li>
                </Link>
              ))}

              {/* <li className="collection-item">Alvin</li> */}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => setSearch("")}
            >
              close
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
