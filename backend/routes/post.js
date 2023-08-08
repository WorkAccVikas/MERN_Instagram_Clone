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
      .populate("comments.postedBy", "_id name")
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

// POINT : Like post
router.put("/like", requireLogin, (req, res) => {
  try {
    postModel
      .findByIdAndUpdate(
        req.body.postId,
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      )
      .populate("comments.postedBy", "_id name")
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        console.log("Error while like post = ", err);
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : Unlike post
router.put("/unlike", requireLogin, (req, res) => {
  try {
    postModel
      .findByIdAndUpdate(
        req.body.postId,
        {
          // LEARN : How to pull specific value from array in mongodb
          $pull: { likes: req.user._id },
        },
        { new: true }
      )
      .populate("comments.postedBy", "_id name")

      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        console.log("Error while unlike post = ", err);
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : Comment post
router.put("/comment", requireLogin, (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    postModel
      .findByIdAndUpdate(
        req.body.postId,
        // LEARN : How to add element or document at begin of array
        {
          $push: {
            comments: {
              $each: [comment],
              $position: 0, // Add the comment to the beginning of the array
            },
          },
        },
        { new: true }
      )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        // console.log("Error while like post = ", err);
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : Delete post of particular user
/** LEARN : How to delete single record by using _id but that particular record belong to that particular user
 * - if yes then delete that record
 * - otherwise show message : "Unable to access this resource"
 */
router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  try {
    postModel
      .findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .then((data) => {
        // console.log({ data });
        // console.log(typeof data.postedBy._id); // * : object type
        if (data.postedBy._id.toString() === req.user._id.toString()) {
          // ACTION : OWNER of this post
          // console.log("Owner");
          postModel
            .deleteOne({ _id: req.params.postId })
            .then((result) => {
              // console.log({ result });
              return res.status(200).json({
                message: "Post deleted successfully",
                _id: data._id,
              });
            })
            .catch((err) => {
              // console.log(err);
              return res.status(500).json({ err: "Internal Error" });
            });
        } else {
          // ACTION : Unauthorized user try to delete post
          // console.log("hacker");
          return res
            .status(401)
            .json({ message: "Unable to access this resource" });
        }
      })
      .catch((err) => {
        // console.log(err);
        return res.status(422).json({ err: err.message });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POINT : For finding all posts of whom he/she follow
router.get("/allsubpost", requireLogin, async (req, res) => {
  try {
    /* ACTION : Find all posts and populate postedBy field and 
    show only _id, name and then sort by latest post created by using createdAt */
    const posts = await postModel
      .find({
        postedBy: req.user.following,
      })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    return res.status(200).json({ posts, totalCount: posts.length });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
