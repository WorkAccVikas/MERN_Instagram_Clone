const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/User");
const requireLogin = require("../middlewares/requireLogin");
const { JWT_SECRET } = require("../config/config");

router.get("/", (req, res) => {
  //   console.log("1");
  res.status(200).json({
    msg: "Hello World",
  });
});

// POINT : PROTECTED Route
router.get("/protected", requireLogin, (req, res) => {
  res.status(200).json({ message: "Protected Route" });
});

// POINT : SIGNUP Route
router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    // ACTION : If empty name, email, password
    if (!name || !email || !password) {
      return res.status(422).json({ error: "All fields are required" });
    }
    userModel
      .findOne({ email: email })
      .then((savedUser) => {
        // ACTION : If record found means user already existed while registering
        if (!!savedUser) {
          return res
            .status(409)
            .json({ error: "User already exists with that email" });
        }

        // NOTE : Create hash password
        // ACTION : Create hash password
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new userModel({
            name,
            email,
            password: hashedPassword,
          });

          // ACTION : Data save in collection
          user
            .save()
            .then((user) =>
              res.status(201).json({ message: "Saved Successfully" })
            )
            .catch((err) => {
              console.log("Error while inserting data = ", err);
            });
        });
      })
      .catch((err) => {
        console.log("Error while main then = ", err);
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : SIGNIN Route
router.post("/signin", (req, res) => {
  try {
    const { email, password } = req.body;
    // ACTION : If empty email or password
    if (!email || !password) {
      return res.status(422).json({ error: "Please enter email or password" });
    }
    userModel
      .findOne({ email: email })
      .then((savedUser) => {
        // ACTION : If email is not found in db
        if (!savedUser) {
          // return res.status(409).json({ error: "Invalid email" });
          // TIP : For good practice, If hacker doesn't know proper details
          return res.status(401).json({ error: "Invalid email or password" });
        }

        // ACTION : Compare password from user and password found in db
        bcrypt
          .compare(password, savedUser.password)
          .then((doMatch) => {
            // NOTE : bcrypt.compare return T/F
            // ACTION : If email and password match
            if (doMatch) {
              // return res.status(200).json({ message: "Successfully Sign In" });
              // NOTE : Create jwt token
              // ACTION : Create jwt token
              const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, {
                expiresIn: "1d",
              });
              return res.status(200).json({ token });
            }
            // ACTION : If email and password doesn't match
            // return res.status(401).json({ error: "Invalid password" });
            // TIP : For good practice, If hacker doesn't know proper details
            return res.status(401).json({ error: "Invalid email or password" });
          })
          .catch((err) => {
            return res.status(500).json({ error: "Internal Error" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Internal Error" });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
