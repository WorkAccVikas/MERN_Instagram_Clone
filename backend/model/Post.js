const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    // comments: [
    //   {
    //     text: String,
    //     postedBy: {
    //       type: ObjectId,
    //       ref: "User",
    //     },
    //   },
    // ],

    // LEARN : How to set timestamp in sub-documents
    comments: [
      {
        type: new mongoose.Schema(
          {
            text: String,
            postedBy: {
              type: ObjectId,
              ref: "User",
            },
          },
          { timestamps: true }
        ),
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtual: true } }
);

const Post = mongoose.model("Post", PostSchema, "Post");

module.exports = Post;
