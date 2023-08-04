const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../model/User");
const postModel = require("../model/Post");
const requireLogin = require("../middlewares/requireLogin");

// POINT : Get User Details along with post belong to user
router.get("/user/:id", (req, res) => {
  try {
    // TOPIC  : Alternative solution using aggregate see MongoDB - Case Study - Case Study 2 
    userModel
      .findOne({ _id: req.params.id })
      .select("-password -_id")
      .then((user) => {
        console.log({ user });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        postModel
          .find({ postedBy: req.params.id })
          .populate("postedBy", "_id name")
          .then((posts) => {
            return res.status(200).json({ user, posts });
          });
      })
      .catch((err) => {
        return res.status(422).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
