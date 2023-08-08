const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../model/User");
const requireLogin = require("../middlewares/requireLogin");
const { JWT_SECRET, HOST } = require("../config/config");
const verifyUser = require("../middlewares/verifyUser");
const { sendMail, nodeMailerDetails } = require("../helper/mailer");

router.get("/", (req, res) => {
  // console.log("Home");
  res.status(200).json({
    msg: "Welcome to Instagram",
  });
});

// POINT : For Sign-Up
router.post("/signup", (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    // ACTION : If empty name, email, password
    if (!name || !email || !password) {
      return res.status(422).json({ error: "All fields are required" });
    }
    /** ACTION : Search by either email or name case-insensitive */
    // LEARN : How to search multiple fields using or and case-insensitive
    userModel
      .findOne({
        $or: [
          { email: { $regex: email, $options: "i" } },
          { name: { $regex: name, $options: "i" } },
        ],
      })
      .then((savedUser) => {
        // ACTION : If record found means user already existed while registering
        // if (!!savedUser) {
        //   return res
        //     .status(400)
        //     .json({ error: "User already exists with that email" });
        // }

        /** ACTION : Show respective error message for certain field match in db */
        // LEARN : How to show custom error message if repsective field match in db
        if (!!savedUser) {
          let errorMessage = "";
          if (savedUser.name.toLowerCase() === name.toLowerCase()) {
            errorMessage = "Name already exists.";
          }
          if (savedUser.email.toLowerCase() === email.toLowerCase()) {
            errorMessage = "Email already exists.";
          }

          return res.status(400).json({ error: errorMessage });
        }

        // NOTE : Create hash password
        // ACTION : Create hash password
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new userModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            profile_pic: pic,
          });

          // ACTION : Data save in collection
          user
            .save()
            .then((user) => {
              // console.log("user = ", user);
              return res.status(201).json({ message: "Saved Successfully" });
            })
            .catch((err) => {
              console.log("Error while inserting data = ", err);
            });
        });
      })
      .catch((err) => {
        // console.log("Error while main then = ", err);
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : For Sign-In
router.post("/signin", (req, res) => {
  try {
    const { email, password } = req.body;
    // ACTION : If empty email or password
    if (!email || !password) {
      return res.status(422).json({ error: "Please enter email or password" });
    }
    userModel
      .findOne({ email: email.toLowerCase() })
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
              // const { _id, name, email } = savedUser;
              const { _id, name, email, following, followers, profile_pic } =
                savedUser;
              return (
                res
                  .status(200)
                  // .json({ token, user: { _id, name, email } });
                  .json({
                    token,
                    user: {
                      _id,
                      name,
                      email,
                      following,
                      followers,
                      profile_pic,
                    },
                  })
              );
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

// POINT : For Reset Password
router.post("/resetPassword", verifyUser, (req, res) => {
  try {
    const { user: userData } = req;

    // LEARN : How to send reset password link on email
    // DESC : Use built-in-module crypto
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log("Error while crypto = ", err);
      }
      // console.log(buffer);
      // ACTION : Hex to String
      const token = buffer.toString("hex");
      // console.log(token);
      // ACTION : expire time = ms * sec * min
      const time = 1000 * 60 * 60; // 1hr
      // const time = 1000 * 5 * 60; // 5min
      userData.resetToken = token;
      userData.expireToken = Date.now() + time;
      // console.log("From md = ", userData);
      // console.log({ userData });
      const text = `
                     <p>You requested for password reset</p>
                     <p>click in this <a href="${HOST}/reset/${token}"><b>link</b></a> to reset password</p>
                     <p>Note : This link is valid for only 1 hour.</p>
                     `;

      userData.save().then((result) => {
        // ACTION : Save data in db and then send mail to user
        const [transporter, message] = nodeMailerDetails(
          userData.name,
          userData.email,
          text,
          "Reset Password"
        );

        transporter
          .sendMail(message)
          .then(() => {
            return res
              .status(200)
              .send({ msg: "You should receive an email from us." });
          })
          .catch((error) => {
            // console.log("Ram = ", error);
            return res.status(500).send({ error });
          });
      });
    });
    // return res.status(200).json({ message: "Reset" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : For New Password
router.post("/newPassword", (req, res) => {
  try {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    // console.log({ newPassword, sentToken });
    if (!newPassword || !sentToken) {
      return res.status(400).json({ error: "Bad Request" });
    }
    userModel
      .findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
      .then((user) => {
        // console.log(`🚀 ~ file: auth.js:196 ~ .then ~ user:`, user);
        if (!user) {
          // ACTION : User not found
          return res.status(404).json({ error: "Session Expired" });
        }
        // ACTION : User found so hash password and saved in collection and set resetToken and expireToken to undefined
        bcrypt.hash(newPassword, 12).then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.expireToken = undefined;

          user.save().then((savedUser) => {
            return res
              .status(200)
              .json({ message: "Password Update Successfully" });
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
