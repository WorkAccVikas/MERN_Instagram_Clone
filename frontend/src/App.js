import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Home from "./components/screens/Home";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import { createContext, useContext, useEffect, useReducer } from "react";
import { ACTION, initialState, reducer } from "./reducers/userReducer";
import SubscribesUserPosts from "./components/screens/SubscribesUserPosts";

// POINT : Create Context
export const UserContext = createContext();

const Routing = () => {
  console.count("Routing");
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route path="/create" element={<CreatePost />} />
      <Route
        path="/profile/:userid"
        element={
          <Layout>
            <UserProfile />
          </Layout>
        }
      />
      <Route
        path="/myfollowingpost"
        element={
          <Layout>
            <SubscribesUserPosts />
          </Layout>
        }
      />
    </Routes>
  );
};

const Layout = ({ children }) => {
  console.count("Layout");

  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    console.count("useEffect mounting Layout");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("user = ", user);

    if (user) {
      dispatch({ type: ACTION.USER, payload: user });
    } else {
      navigate("/signin");
    }
  }, []);

  return <>{children}</>;
};

function App() {
  console.count("App");
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
