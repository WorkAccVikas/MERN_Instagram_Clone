const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../model/User");
const postModel = require("../model/Post");
const requireLogin = require("../middlewares/requireLogin");

// POINT : Get User Details along with post belong to user
router.get("/user/:id", requireLogin, (req, res) => {
  try {
    // TOPIC  : Alternative solution using aggregate see MongoDB - Case Study - Case Study 2
    userModel
      .findOne({ _id: req.params.id })
      .select("-password -_id")
      .then((user) => {
        // console.log({ user });
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

// POINT : follow user
router.put("/follow", requireLogin, (req, res) => {
  try {
    /**ACTION : Let assume, User A login and he/she will follow User B then two operation
     * - (1) : User B add _id of User A in followers
     * - (2) : User A add _id of User B in following
     */
    userModel
      .findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      )
      .then((result) => {
        // console.log(`🚀 ~ file: user.js:51 ~ .then ~ result:`, result);
        userModel
          .findByIdAndUpdate(
            req.user._id,
            {
              $push: { following: req.body.followId },
            },
            { new: true, projection: { password: 0 } }
          )
          .then((result1) => {
            // console.log(`🚀 ~ file: user.js:61 ~ .then ~ result1:`, result1);
            return res.status(201).json(result1);
          })
          .catch((err) => {
            return res.status(422).json({ error: err.message });
          });
      })
      .catch((err) => {
        return res.status(422).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : unfollow user
router.put("/unfollow", requireLogin, (req, res) => {
  try {
    /**ACTION : Let assume, User A login and he/she will follow User B then two operation
     * - (1) : User B add _id of User A in followers
     * - (2) : User A add _id of User B in following
     */
    userModel
      .findByIdAndUpdate(
        req.body.unfollowId,
        {
          $pull: { followers: req.user._id },
        },
        { new: true, projection: { password: 0 } }
      )
      .then((result) => {
        userModel
          .findByIdAndUpdate(
            req.user._id,
            {
              $pull: { following: req.body.unfollowId },
            },
            { new: true }
          )
          .then((result1) => {
            return res.status(201).json(result1);
          })
          .catch((err) => {
            return res.status(422).json({ error: err.message });
          });
      })
      .catch((err) => {
        return res.status(422).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : update user profile picture
router.put("/updatepic", requireLogin, (req, res) => {
  try {
    userModel
      .findByIdAndUpdate(
        req.user._id,
        { $set: { profile_pic: req.body.pic } },
        { new: true }
      )
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(422).json({ error: "pic cannot update" });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : Search users by using email or name
router.post("/searchUsers", async (req, res) => {
  try {
    /** ACTION : Search by email or name case-insensitive and select only _id, name, email */
    const userData = await userModel
      .find({
        $or: [
          { email: { $regex: req.body.query, $options: "i" } },
          { name: { $regex: req.body.query, $options: "i" } },
        ],
      })
      .select("name email");

    return res.status(200).send({ user: userData });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
