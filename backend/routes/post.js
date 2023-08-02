const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const postModel = require("../model/Post");
const requireLogin = require("../middlewares/requireLogin");

// POINT : For finding all posts of all users
router.get("/allpost", requireLogin, async (req, res) => {
  try {
    /* ACTION : Find all posts and populate postedBy field and 
    show only _id, name and then sort by latest post created by using createdAt */
    const posts = await postModel
      .find({})
      .populate("postedBy", "_id name")
      .sort("-createdAt");
    return res.status(200).json({ posts, totalCount: posts.length });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : Create new post
router.post("/createpost", requireLogin, (req, res) => {
  try {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
      return res.status(422).json({ error: "Please add all required fields" });
    }

    // PROBLEM (1) : How to exclude password field
    // SOLUTION : (1/1) Destructure the user object and exclude the 'password' field
    // const { _id, name, email, createdAt, updatedAt, __v } = req.user;
    // SOLUTION : (1/2) Create a new object without the 'password' field from req.user
    // const postData = Object.assign({}, req.user._doc);
    // delete postData.password;

    const post = new postModel({
      title,
      body,
      photo: pic,
      // NOTE : (1)
      //   postedBy: { _id, name, email, createdAt, updatedAt, __v },
      // NOTE : (2)
      //   postedBy: postData,
      postedBy: req.user,
    });

    post
      .save()
      .then((result) => {
        return res.status(201).json({ post: result });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Internal Error" });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : Find all post as per particular user
router.get("/mypost", requireLogin, async (req, res) => {
  try {
    const { _id } = req.user;

    // ACTION : Latest post at start
    const myPost = await postModel
      .find({ postedBy: _id })
      .populate("postedBy", "_id name")
      .sort("-createdAt");

    return res.status(200).json({ myPost, totalCount: myPost.length });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
